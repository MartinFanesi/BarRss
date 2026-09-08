/**
 * BarRSS - Background Service Worker (Manifest V3)
 * 
 * - Fetch múltiple paralelo con AbortController y timeout de 8 segundos para evitar cuelgues.
 * - Parseo RSS/Atom con sax-js empaquetado y validación de URLs.
 * - Enriquecimiento con favicons de Google y nombres limpios de medios.
 * - Intercalado equitativo (round-robin) de titulares.
 * - Caché local persistente: 90 segundos de frescura y hasta 7 días de respaldo.
 */

try {
  importScripts('feeds_database.js', 'shared.js', 'vendor/sax.js', 'feed-parser.js');
} catch (e) {
  console.warn('[BarRSS Background] Error importing feeds_database.js:', e);
}

const feedCache = new Map();
const CACHE_TTL_MS = 90 * 1000;
const FETCH_TIMEOUT_MS = 8000; // 8 segundos de timeout por feed
const BADGE_STATE_KEY = 'newsBadgeState';
const MAX_BADGE_LINKS = 5000;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'FETCH_MULTIPLE_RSS') {
    handleFetchMultipleRss(request.feeds, request.forceRefresh, request.markAsSeen === true)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('[BarRSS Service Worker] Error en FETCH_MULTIPLE_RSS:', error);
        sendResponse({
          success: false,
          error: error.message || 'Error al obtener noticias de los feeds.'
        });
      });
    return true;
  }

  if (request.action === 'FETCH_RSS') {
    handleFetchSingleRss(request.url, request.forceRefresh)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('[BarRSS Service Worker] Error en FETCH_RSS:', error);
        sendResponse({
          success: false,
          error: error.message || 'Error al obtener noticias del feed.'
        });
      });
    return true;
  }

  if (request.action === 'CLEAR_CACHE') {
    clearFeedCache().then(() => sendResponse({ success: true })).catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === 'RESET_FACTORY') {
    feedCache.clear();
    const country = request.country || 'Argentina';
    const defaultFeeds = (typeof getDefaultFeedsForCountry === 'function')
      ? getDefaultFeedsForCountry(country)
      : (typeof ALL_PRESET_FEEDS !== 'undefined' ? ALL_PRESET_FEEDS.slice(0, 10) : []);

    const initialSettings = {
      enabled: false,
      adaptiveTheme: false,
      pushPageContent: true,
      autoHideOnScroll: false,
      rssDiscoveryEnabled: true,
      displayMode: 'always',
      position: 'bottom',
      speed: 'normal',
      backgroundColor: '#0f172a',
      backgroundOpacity: 94,
      textColor: '#e2e8f0',
      linkColor: '#38bdf8',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: 13,
      readerOpenMode: 'window',
      refreshIntervalMinutes: 5,
      feeds: defaultFeeds,
      userCountry: country,
      onboardingSeen: true
    };
    BarRSSSettings.set(initialSettings)
      .then(() => markAllNewsAsSeen())
      .then(() => sendResponse({ success: true, settings: initialSettings }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (request.action === 'OPEN_MENU' || request.action === 'OPEN_SIDEPANEL') {
    openSidePanelSafely()
      .then(() => sendResponse({ success: true }))
      .catch(err => {
        console.warn('[BarRSS] Error abriendo sidePanel:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true;
  }

  if (request.action === 'OPEN_READER') {
    markAllNewsAsSeen()
      .then(() => openReaderApp(request.mode))
      .then(() => sendResponse({ success: true }))
      .catch(() => sendResponse({ success: false }));
    return true;
  }

  if (request.action === 'OPEN_SETTINGS') {
    openSettingsWindow();
    sendResponse({ success: true });
    return false;
  }

  if (request.action === 'PING') {
    sendResponse({ success: true, timestamp: Date.now() });
    return false;
  }
});

/* ==========================================================================
   GESTIÓN DE APERTURA DIRECTA DE "EL DIARIO" Y MENÚ CONTEXTUAL
   ========================================================================== */
async function openReaderApp(preferredMode = null) {
  let mode = preferredMode;
  if (!mode) {
    const settings = await chrome.storage.sync.get({ readerOpenMode: 'window' });
    mode = settings.readerOpenMode || 'window';
  }

  const readerUrl = chrome.runtime.getURL('reader.html');

  if (mode === 'window') {
    // Si ya hay una ventana con El Diario abierta, enfocarla
    const allWindows = await chrome.windows.getAll({ populate: true });
    for (const win of allWindows) {
      const foundTab = win.tabs?.find(t => t.url && t.url.startsWith(readerUrl));
      if (foundTab) {
        await chrome.windows.update(win.id, { focused: true });
        await chrome.tabs.update(foundTab.id, { active: true });
        return;
      }
    }

    // Dimensiones óptimas adaptadas al monitor del usuario
    let targetW = 1200;
    let targetH = 720;
    let targetLeft = undefined;
    let targetTop = undefined;

    try {
      const currentWin = await chrome.windows.getLastFocused();
      if (currentWin && currentWin.width && currentWin.height) {
        // 88% del ancho y 84% de la altura para no invadir nunca la barra de tareas
        targetW = Math.min(1240, Math.round(currentWin.width * 0.90));
        targetH = Math.min(740, Math.round(currentWin.height * 0.84));
        if (currentWin.left !== undefined && currentWin.top !== undefined) {
          targetLeft = Math.round(currentWin.left + (currentWin.width - targetW) / 2);
          targetTop = Math.round(currentWin.top + (currentWin.height - targetH) / 2);
        }
      }
    } catch (e) {
      console.warn('[BarRSS] Error determinando ventana activa:', e);
    }

    // Crear ventana de aplicación independiente centrada y accesible
    await chrome.windows.create({
      url: readerUrl,
      type: 'popup',
      width: targetW,
      height: targetH,
      left: targetLeft,
      top: targetTop
    });
  } else {
    // Modo pestaña: si ya existe una pestaña abierta, enfocarla
    const tabs = await chrome.tabs.query({ url: readerUrl + '*' });
    if (tabs.length > 0) {
      await chrome.tabs.update(tabs[0].id, { active: true });
      if (tabs[0].windowId) {
        await chrome.windows.update(tabs[0].windowId, { focused: true });
      }
    } else {
      await chrome.tabs.create({ url: readerUrl });
    }
  }
}

function openSettingsWindow() {
  chrome.windows.create({
    url: chrome.runtime.getURL('popup.html'),
    type: 'popup',
    width: 480,
    height: 650
  });
}

async function openSidePanelSafely() {
  try {
    // 1. Buscar ventanas de tipo 'normal' (el navegador principal con pestañas)
    const normalWindows = await chrome.windows.getAll({ windowTypes: ['normal'] });
    let targetWindow = normalWindows.find(w => w.focused) || normalWindows[0];

    if (!targetWindow) {
      // Si el usuario no tiene ninguna ventana normal abierta, crear una pestaña normal
      const newWin = await chrome.windows.create({
        url: 'chrome://newtab',
        type: 'normal',
        focused: true
      });
      if (chrome.sidePanel && chrome.sidePanel.open) {
        setTimeout(() => {
          chrome.sidePanel.open({ windowId: newWin.id }).catch(() => {});
        }, 300);
      }
      return;
    }

    // 2. Enfocar la ventana del navegador normal
    await chrome.windows.update(targetWindow.id, { focused: true });

    // 3. Abrir el Side Panel en esa ventana normal de forma segura
    if (chrome.sidePanel && chrome.sidePanel.open) {
      await chrome.sidePanel.open({ windowId: targetWindow.id });
    } else {
      await chrome.tabs.create({ url: chrome.runtime.getURL('sidepanel.html'), windowId: targetWindow.id });
    }
  } catch (err) {
    console.warn('[BarRSS] Error abriendo Side Panel de forma segura:', err);
    try {
      await chrome.tabs.create({ url: chrome.runtime.getURL('sidepanel.html') });
    } catch {}
  }
}

function setupContextMenus() {
  if (!chrome.contextMenus) return;
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'barrss_open_reader',
      title: '📰 Abrir El Diario Digital',
      contexts: ['action']
    });
    chrome.contextMenus.create({
      id: 'barrss_open_sidepanel',
      title: '📑 Abrir en Panel Lateral',
      contexts: ['action']
    });
    chrome.contextMenus.create({
      id: 'barrss_open_settings',
      title: '⚙️ Canales y Preferencias',
      contexts: ['action']
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenus();
  restoreNewsBadge();
});

chrome.runtime.onStartup.addListener(() => {
  setupContextMenus();
  restoreNewsBadge();
});

// Clic directo en el icono de la barra de Chrome -> Abre El Diario Digital
chrome.action?.onClicked.addListener(async (tab) => {
  await markAllNewsAsSeen();
  await openReaderApp();
});

// Opciones del clic derecho sobre el icono
chrome.contextMenus?.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'barrss_open_reader') {
    await markAllNewsAsSeen();
    await openReaderApp();
  } else if (info.menuItemId === 'barrss_open_sidepanel') {
    await openSidePanelSafely();
  } else if (info.menuItemId === 'barrss_open_settings') {
    openSettingsWindow();
  }
});

/**
 * Consulta múltiples feeds en paralelo con timeout individual
 */
async function handleFetchMultipleRss(feeds, forceRefresh = false, markAsSeen = false) {
  if (!Array.isArray(feeds) || feeds.length === 0) {
    throw new Error('No hay feeds activos seleccionados.');
  }

  feeds = BarRSS.validateFeeds(feeds);
  const promises = feeds.map(feed => fetchSingleFeedData(feed, forceRefresh));
  const results = await Promise.allSettled(promises);

  const feedCollections = [];
  let successfulFeeds = 0;
  const feedStatuses = [];

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const feedMeta = feeds[i];

    if (res.status === 'fulfilled') {
      const { items, ...status } = res.value;
      feedStatuses.push({ ...status, url: feedMeta.url, name: feedMeta.name });
      if (items.length) { successfulFeeds++; feedCollections.push(items); }
    } else {
      feedStatuses.push({ url: feedMeta.url, name: feedMeta.name, state: 'error', error: res.reason?.message || 'No disponible', updatedAt: null });
      console.warn(`[BarRSS] Feed no disponible: ${feedMeta.name} (${feedMeta.url})`, res.reason);
    }
  }

  if (feedCollections.length === 0) {
    return { success: false, items: [], feedStatuses, error: 'No hay noticias disponibles. Revisá el estado de los canales.' };
  }

  // Intercalado Round-Robin con DEDUPLICACIÓN INTELIGENTE
  const mixedItems = [];
  const seenLinks = new Set();
  const seenTitles = new Set();
  let hasMore = true;
  let itemIndex = 0;
  const MAX_TOTAL_ITEMS = 80;

  while (hasMore && mixedItems.length < MAX_TOTAL_ITEMS) {
    hasMore = false;
    for (const collection of feedCollections) {
      if (itemIndex < collection.length) {
        const item = collection[itemIndex];
        hasMore = true;

        const normLink = normalizeArticleLink(item.link);
        const normTitle = normalizeArticleTitle(item.title);

        // Prevenir duplicados por enlace o título idéntico
        const isDuplicate = (normLink && seenLinks.has(normLink)) ||
                            (normTitle.length > 12 && seenTitles.has(normTitle));

        if (!isDuplicate) {
          if (normLink) seenLinks.add(normLink);
          if (normTitle.length > 12) seenTitles.add(normTitle);
          mixedItems.push(item);
          if (mixedItems.length >= MAX_TOTAL_ITEMS) break;
        }
      }
    }
    itemIndex++;
  }

  await updateNewsBadge(mixedItems, markAsSeen);

  return {
    success: true,
    feedStatuses,
    totalFeeds: feeds.length,
    activeFeedsCount: successfulFeeds,
    items: mixedItems
  };
}

function normalizeArticleLink(link) {
  if (!link) return '';
  try {
    const u = new URL(link);
    const searchParams = new URLSearchParams(u.search);
    const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'fbclid', 'gclid', 'rss'];
    trackingKeys.forEach(k => searchParams.delete(k));
    const cleanSearch = searchParams.toString();
    return u.origin + u.pathname + (cleanSearch ? '?' + cleanSearch : '');
  } catch {
    return String(link).toLowerCase().replace(/\/+$/, '').trim();
  }
}

function normalizeArticleTitle(title) {
  if (!title) return '';
  return String(title)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos para comparar
    .replace(/[^\w\s\d]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCanonicalFeedUrl(rawUrl) {
  const safe = BarRSS.httpUrl(rawUrl);
  if (!safe) throw new Error('La URL del canal debe usar HTTP o HTTPS.');
  const url = new URL(safe);
  const host = url.hostname.replace(/^www\./, '');
  const migrations = {
    'lanacion.com.ar/rss/ultimas-noticias': 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/',
    'clarin.com/rss/ultimomomento': 'https://www.clarin.com/rss/lo-ultimo/',
    'pagina12.com.ar/rss/portada.xml': 'https://www.pagina12.com.ar/rss/portada'
  };
  return migrations[host + url.pathname.replace(/\/$/, '')] || safe;
}

const pendingFeeds = new Map();
const MAX_FEED_BYTES = 2 * 1024 * 1024;
const MAX_CACHED_FEEDS = 60;
const STALE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
let cacheEpoch = 0;
let activeRequests = 0;
const requestQueue = [];

function badgeTextForCount(count) {
  if (count <= 0) return '';
  if (count > 99) return '99+';
  return String(count);
}

async function renderNewsBadge(unreadLinks) {
  if (!chrome.action?.setBadgeText) return;
  const count = unreadLinks.length;
  await chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
  await chrome.action.setBadgeText({ text: badgeTextForCount(count) });
  if (chrome.action.setTitle) {
    await chrome.action.setTitle({
      title: count ? `BarRSS — ${count} ${count === 1 ? 'noticia nueva' : 'noticias nuevas'}` : 'BarRSS - Abrir El Diario Digital'
    });
  }
}

async function restoreNewsBadge() {
  const { [BADGE_STATE_KEY]: state } = await chrome.storage.local.get(BADGE_STATE_KEY);
  await renderNewsBadge(Array.isArray(state?.unreadLinks) ? state.unreadLinks : []);
}

async function updateNewsBadge(items, markAsSeen = false) {
  const articleLinks = [...new Set(items.map(item => normalizeArticleLink(item.link)).filter(Boolean))];
  if (!articleLinks.length) return;

  const { [BADGE_STATE_KEY]: savedState } = await chrome.storage.local.get(BADGE_STATE_KEY);
  const knownLinks = new Set(Array.isArray(savedState?.knownLinks) ? savedState.knownLinks : []);
  const unreadLinks = new Set(Array.isArray(savedState?.unreadLinks) ? savedState.unreadLinks : []);

  // La primera carga establece una base para no marcar toda una edición como nueva.
  const hasHistory = savedState && Array.isArray(savedState.knownLinks);
  if (hasHistory && !markAsSeen) {
    articleLinks.filter(link => !knownLinks.has(link)).forEach(link => unreadLinks.add(link));
  }
  articleLinks.forEach(link => knownLinks.add(link));

  if (markAsSeen) unreadLinks.clear();

  const state = {
    knownLinks: [...knownLinks].slice(-MAX_BADGE_LINKS),
    unreadLinks: [...unreadLinks].slice(-MAX_BADGE_LINKS)
  };
  await chrome.storage.local.set({ [BADGE_STATE_KEY]: state });
  await renderNewsBadge(state.unreadLinks);
}

async function markAllNewsAsSeen() {
  const { [BADGE_STATE_KEY]: savedState } = await chrome.storage.local.get(BADGE_STATE_KEY);
  const state = {
    knownLinks: Array.isArray(savedState?.knownLinks) ? savedState.knownLinks.slice(-MAX_BADGE_LINKS) : [],
    unreadLinks: []
  };
  await chrome.storage.local.set({ [BADGE_STATE_KEY]: state });
  await renderNewsBadge(state.unreadLinks);
}
async function withFetchSlot(task) {
  if (activeRequests >= 6) await new Promise(resolve => requestQueue.push(resolve));
  else activeRequests++;
  try { return await task(); }
  finally {
    const next = requestQueue.shift();
    if (next) next();
    else activeRequests--;
  }
}
let cacheWrites = Promise.resolve();
async function clearFeedCache() {
  cacheEpoch++;
  feedCache.clear();
  await cacheWrites;
  const stored = await chrome.storage.local.get(null);
  await chrome.storage.local.remove(Object.keys(stored).filter(key => key.startsWith('rssCache:')));
}
function persistFeedCache(url, entry, epoch) {
  cacheWrites = cacheWrites.catch(() => {}).then(async () => {
    if (epoch !== cacheEpoch) return;
    const stored = await chrome.storage.local.get(null);
    const keys = Object.keys(stored).filter(key => key.startsWith('rssCache:') && key !== 'rssCache:' + url)
      .sort((a, b) => stored[b].timestamp - stored[a].timestamp);
    if (keys.length >= MAX_CACHED_FEEDS) await chrome.storage.local.remove(keys.slice(MAX_CACHED_FEEDS - 1));
    await chrome.storage.local.set({ ['rssCache:' + url]: entry });
  }).catch(error => console.warn('[BarRSS] No se pudo guardar la caché:', error));
  return cacheWrites;
}
async function readFeedBody(response) {
  if (Number(response.headers.get('content-length')) > MAX_FEED_BYTES) throw new Error('El feed supera los 2 MB.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let size = 0, text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FEED_BYTES) throw new Error('El feed supera los 2 MB.');
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally { await reader.cancel().catch(() => {}); }
}
async function fetchRawFeed(url, forceRefresh) {
  let cached = feedCache.get(url);
  if (!cached) cached = (await chrome.storage.local.get('rssCache:' + url))['rssCache:' + url];
  if (cached && Date.now() - cached.timestamp > STALE_TTL_MS) cached = null;
  if (!forceRefresh && cached?.items?.length && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { items: cached.items, updatedAt: cached.timestamp, state: 'cached', error: '' };
  }
  if (pendingFeeds.has(url)) return pendingFeeds.get(url);
  const epoch = cacheEpoch;
  const pending = withFetchSlot(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-cache',
        headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const xml = await readFeedBody(response);
      const items = parseFeedXml(xml, response.url || url);
      if (!items.length) throw new Error('El canal no contiene artículos válidos.');
      const timestamp = Date.now();
      if (epoch === cacheEpoch) {
        feedCache.set(url, { items, timestamp });
        if (feedCache.size > MAX_CACHED_FEEDS) feedCache.delete(feedCache.keys().next().value);
        await persistFeedCache(url, { items, timestamp }, epoch);
      }
      return { items, updatedAt: timestamp, state: 'ok', error: '' };
    } catch (error) {
      const message = error.name === 'AbortError' ? 'El canal tardó más de 8 segundos.' : error.message;
      if (cached?.items?.length) return { items: cached.items, updatedAt: cached.timestamp, state: 'stale', error: message };
      throw new Error(message);
    } finally { clearTimeout(timer); }
  });
  pendingFeeds.set(url, pending);
  try { return await pending; }
  finally { if (pendingFeeds.get(url) === pending) pendingFeeds.delete(url); }
}
async function fetchSingleFeedData(feed, forceRefresh = false) {
  const url = getCanonicalFeedUrl(feed.url);
  const result = await fetchRawFeed(url, forceRefresh);
  const domain = new URL(url).hostname.replace(/^www\./, '');
  return { ...result, items: result.items.map(item => ({ ...item,
    category: item.category || feed.category || 'General', feedId: feed.id,
    feedName: feed.name || domain, domain,
    faviconUrl: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`
  })) };
}
async function handleFetchSingleRss(url, forceRefresh = false) {
  const result = await fetchSingleFeedData({ id: 'single', url }, forceRefresh);
  return { success: true, ...result };
}

function cleanXmlText(text) {
  if (!text) return '';
  let str = text;
  str = str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1');
  // 1. Decodificar entidades HTML iniciales (&lt; -> <, etc.)
  str = decodeHtmlEntities(str);
  // 2. Eliminar comentarios HTML (ej: <!-- SC_OFF -->)
  str = str.replace(/<!--[\s\S]*?-->/g, ' ');
  // 3. Eliminar firmas de reddit y enlaces residuales
  str = str.replace(/submitted by\s+<a[^>]*>.*?<\/a>/gi, ' ');
  str = str.replace(/\[<a[^>]*>(?:link|comments)<\/a>\]/gi, ' ');
  str = str.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ');
  str = str.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ');
  // 4. Eliminar todas las etiquetas HTML residuales
  str = str.replace(/<\/?[a-z0-9_\-]+[^>]*>/gi, ' ');
  // 5. Segunda pasada de entidades HTML
  str = decodeHtmlEntities(str);
  // 6. Eliminar etiquetas o fragmentos rotos como <...
  str = str.replace(/<[^>]*>?/g, ' ');
  str = str.replace(/\b(submitted by|\[link\]|\[comments\])\b/gi, ' ');
  return str.replace(/\s+/g, ' ').trim();
}

function decodeHtmlEntities(str) {
  if (!str) return '';
  const entities = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
    '&#34;': '"', '&apos;': "'", '&#39;': "'", '&nbsp;': ' ',
    '&iexcl;': '¡', '&iquest;': '¿', '&ndash;': '–', '&mdash;': '—',
    '&hellip;': '…', '&lsquo;': '‘', '&rsquo;': '’', '&ldquo;': '“',
    '&rdquo;': '”', '&laquo;': '«', '&raquo;': '»'
  };

  let decoded = str.replace(/&(?:amp|lt|gt|quot|apos|nbsp|iexcl|iquest|ndash|mdash|hellip|lsquo|rsquo|ldquo|rdquo|laquo|raquo|#34|#39);/gi, m => entities[m.toLowerCase()] || m);

  decoded = decoded.replace(/&#(\d+);/g, (_, dec) => {
    try { return String.fromCodePoint(parseInt(dec, 10)); } catch { return ''; }
  });

  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    try { return String.fromCodePoint(parseInt(hex, 16)); } catch { return ''; }
  });

  return decoded;
}
