/**
 * BarRSS - Background Service Worker (Manifest V3)
 * 
 * - Fetch múltiple paralelo con AbortController y timeout de 8 segundos para evitar cuelgues.
 * - Parseo seguro de feeds RSS 2.0 y Atom 1.0 sin dependencias.
 * - Enriquecimiento con favicons de Google y nombres limpios de medios.
 * - Intercalado equitativo (round-robin) de titulares.
 * - Caché en memoria con TTL de 90 segundos.
 */

try {
  importScripts('feeds_database.js');
} catch (e) {
  console.warn('[BarRSS Background] Error importing feeds_database.js:', e);
}

const feedCache = new Map();
const CACHE_TTL_MS = 90 * 1000;
const FETCH_TIMEOUT_MS = 8000; // 8 segundos de timeout por feed

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'FETCH_MULTIPLE_RSS') {
    handleFetchMultipleRss(request.feeds, request.forceRefresh)
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
    feedCache.clear();
    sendResponse({ success: true });
    return false;
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
    chrome.storage.sync.set(initialSettings)
      .then(() => sendResponse({ success: true, settings: initialSettings }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (request.action === 'OPEN_MENU') {
    if (chrome.sidePanel && chrome.sidePanel.open && sender.tab) {
      chrome.sidePanel.open({ tabId: sender.tab.id })
        .then(() => sendResponse({ success: true }))
        .catch(err => {
          console.warn('[BarRSS] Error abriendo sidePanel desde background:', err);
          chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
          sendResponse({ success: true, fallback: true });
        });
      return true;
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
      sendResponse({ success: true, fallback: true });
      return false;
    }
  }

  if (request.action === 'OPEN_READER') {
    openReaderApp(request.mode)
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

    // Si no, crear ventana de aplicación independiente
    await chrome.windows.create({
      url: readerUrl,
      type: 'popup',
      width: 1280,
      height: 850
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
});

chrome.runtime.onStartup.addListener(() => {
  setupContextMenus();
});

// Clic directo en el icono de la barra de Chrome -> Abre El Diario Digital
chrome.action?.onClicked.addListener(async (tab) => {
  await openReaderApp();
});

// Opciones del clic derecho sobre el icono
chrome.contextMenus?.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'barrss_open_reader') {
    await openReaderApp();
  } else if (info.menuItemId === 'barrss_open_sidepanel') {
    if (chrome.sidePanel && chrome.sidePanel.open && tab?.windowId) {
      chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {
        chrome.tabs.create({ url: chrome.runtime.getURL('sidepanel.html') });
      });
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL('sidepanel.html') });
    }
  } else if (info.menuItemId === 'barrss_open_settings') {
    openSettingsWindow();
  }
});

/**
 * Consulta múltiples feeds en paralelo con timeout individual
 */
async function handleFetchMultipleRss(feeds, forceRefresh = false) {
  if (!Array.isArray(feeds) || feeds.length === 0) {
    throw new Error('No hay feeds activos seleccionados.');
  }

  const promises = feeds.map(feed => fetchSingleFeedData(feed, forceRefresh));
  const results = await Promise.allSettled(promises);

  const feedCollections = [];
  let successfulFeeds = 0;

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const feedMeta = feeds[i];

    if (res.status === 'fulfilled' && res.value && res.value.length > 0) {
      successfulFeeds++;
      feedCollections.push(res.value);
    } else {
      console.warn(`[BarRSS] Feed no disponible: ${feedMeta.name} (${feedMeta.url})`, res.reason);
    }
  }

  if (feedCollections.length === 0) {
    throw new Error('No se pudo conectar con los canales seleccionados. Verificá tu conexión a internet.');
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

  return {
    success: true,
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
    return (u.origin + u.pathname.replace(/\/+$/, '') + (cleanSearch ? '?' + cleanSearch : '')).toLowerCase();
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
  if (!rawUrl) return '';
  let u = rawUrl.trim();
  if (u.includes('lanacion.com.ar/rss/ultimas-noticias') || u.includes('lanacion.com.ar/rss/politica') || u.includes('lanacion.com.ar/rss/economia')) {
    return 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/';
  }
  if (u.includes('clarin.com/rss/ultimomomento')) {
    return 'https://www.clarin.com/rss/lo-ultimo/';
  }
  if (u.includes('pagina12.com.ar/rss/portada.xml') || u.includes('pagina12.com.ar/rss/')) {
    return 'https://www.perfil.com/feed';
  }
  return u;
}

/**
 * Petición con AbortController para prevenir cuelgues
 */
async function fetchSingleFeedData(feed, forceRefresh) {
  const url = getCanonicalFeedUrl(feed.url);
  const now = Date.now();

  if (!forceRefresh && feedCache.has(url)) {
    const cached = feedCache.get(url);
    if (now - cached.timestamp < CACHE_TTL_MS && cached.items?.length > 0 && cached.items[0].description !== undefined) {
      return cached.items;
    }
  }

  const controller = new AbortController();
  const timeoutTimer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
      },
      signal: controller.signal,
      cache: 'no-cache'
    });

    clearTimeout(timeoutTimer);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xmlText = await response.text();
    const rawItems = parseFeedXml(xmlText);

    let domain = feed.domain || '';
    if (!domain) {
      try {
        domain = new URL(url).hostname.replace(/^www\./i, '');
      } catch {
        domain = '';
      }
    }

    const faviconUrl = domain 
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`
      : '';

    const enrichedItems = rawItems.map(item => ({
      title: item.title,
      link: item.link,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      pubDate: item.pubDate || '',
      category: feed.category || 'General',
      feedId: feed.id,
      feedName: feed.name || domain || 'Noticias',
      domain: domain,
      faviconUrl: faviconUrl
    }));

    feedCache.set(url, {
      timestamp: now,
      items: enrichedItems
    });

    return enrichedItems;
  } catch (err) {
    clearTimeout(timeoutTimer);
    throw err;
  }
}

async function handleFetchSingleRss(url, forceRefresh = false) {
  let domain = '';
  try {
    domain = new URL(url).hostname.replace(/^www\./i, '');
  } catch {}

  const items = await fetchSingleFeedData({
    id: 'single',
    name: domain || 'RSS',
    url: url,
    domain: domain
  }, forceRefresh);

  return { success: true, items };
}

function parseFeedXml(xml) {
  const results = [];
  if (!xml) return results;

  const isAtom = /<entry[\s>]/i.test(xml) && !/<item[\s>]/i.test(xml);
  const entryRegex = isAtom ? /<entry[\s\S]*?<\/entry>/gi : /<item[\s\S]*?<\/item>/gi;

  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[0];

    let title = '';
    const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      title = cleanXmlText(titleMatch[1]);
    }

    let link = '';
    if (isAtom) {
      const atomAltLink = block.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i);
      const atomHrefLink = block.match(/<link[^>]*href=["']([^"']+)["']/i);
      const atomTextLink = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);

      if (atomAltLink) link = atomAltLink[1].trim();
      else if (atomHrefLink) link = atomHrefLink[1].trim();
      else if (atomTextLink) link = cleanXmlText(atomTextLink[1]);
    } else {
      const rssLinkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
      if (rssLinkMatch) {
        link = cleanXmlText(rssLinkMatch[1]);
      } else {
        const guidMatch = block.match(/<guid[^>]*isPermaLink=["']true["'][^>]*>([\s\S]*?)<\/guid>/i);
        if (guidMatch) link = cleanXmlText(guidMatch[1]);
      }
    }

    // Imagen: enclosure, media:content, media:thumbnail, etc.
    let imageUrl = '';
    const enclosureImg = block.match(/<enclosure[^>]+url=["'](https?:\/\/[^"'>]+)["']/i);
    if (enclosureImg) {
      imageUrl = enclosureImg[1];
    }
    if (!imageUrl) {
      const mediaImg = block.match(/<media:(?:content|thumbnail)[^>]+url=["'](https?:\/\/[^"'>]+)["']/i);
      if (mediaImg) {
        imageUrl = mediaImg[1];
      }
    }
    if (!imageUrl) {
      const itunesImg = block.match(/<itunes:image[^>]+href=["'](https?:\/\/[^"'>]+)["']/i);
      if (itunesImg) {
        imageUrl = itunesImg[1];
      }
    }
    if (!imageUrl) {
      const imgTag = block.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i);
      if (imgTag) {
        imageUrl = imgTag[1];
      }
    }
    // Búsqueda profunda en contenido HTML escapado (como en Reddit / Atom)
    if (!imageUrl) {
      const decodedBlock = decodeHtmlEntities(block);
      const deepImgTag = decodedBlock.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i);
      if (deepImgTag) {
        const candidate = deepImgTag[1];
        if (!candidate.includes('pixel.gif') && !candidate.includes('icon.png') && !candidate.includes('redditstatic.com/icon')) {
          imageUrl = candidate;
        }
      }
    }

    if (imageUrl) {
      imageUrl = decodeHtmlEntities(imageUrl).trim();
    }

    // Descripción / Resumen
    let description = '';
    const descMatch = block.match(/<(?:description|summary|content:encoded|content)[^>]*>([\s\S]*?)<\/(?:description|summary|content:encoded|content)>/i);
    if (descMatch) {
      description = cleanXmlText(descMatch[1]);
      if (description.length > 260) {
        description = description.substring(0, 257) + '...';
      }
    }

    // Fecha de publicación
    let pubDate = '';
    const dateMatch = block.match(/<(?:pubDate|published|updated|dc:date)[^>]*>([\s\S]*?)<\/(?:pubDate|published|updated|dc:date)>/i);
    if (dateMatch) {
      pubDate = cleanXmlText(dateMatch[1]);
    }

    if (title && link) {
      results.push({
        title,
        link,
        description,
        imageUrl,
        pubDate
      });
    }

    if (results.length >= 30) break;
  }

  return results;
}

function cleanXmlText(text) {
  if (!text) return '';
  let str = text;
  str = str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1');
  // Limpieza de firmas y enlaces residuales de Reddit
  str = str.replace(/submitted by\s+<a[^>]*>.*?<\/a>/gi, '');
  str = str.replace(/\[<a[^>]*>link<\/a>\]\s*\[<a[^>]*>comments<\/a>\]/gi, '');
  str = str.replace(/<\/?[^>]+(>|$)/g, ' ');
  str = decodeHtmlEntities(str);
  str = str.replace(/\b(submitted by|\[link\]|\[comments\])\b/gi, '');
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
    try { return String.fromCharCode(parseInt(dec, 10)); } catch { return ''; }
  });

  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    try { return String.fromCharCode(parseInt(hex, 16)); } catch { return ''; }
  });

  return decoded;
}
