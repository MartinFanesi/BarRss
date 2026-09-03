/**
 * BarRSS - Controlador del Panel Lateral Nativo (Chrome Side Panel)
 * 
 * Permite:
 * - Explorar noticias en el marco nativo de Chrome fuera del DOM de las páginas.
 * - Vista de Lista de tarjetas interactivas o Ticker Vertical continuo.
 * - Búsqueda y filtrado instantáneo por palabra clave.
 * - Activar / Desactivar la barra flotante de las páginas web con un clic.
 */

const DEFAULT_FEEDS = [
  // 🇦🇷 Noticias Generales
  {
    id: 'arg_infobae',
    name: 'Infobae',
    category: 'Noticias Generales',
    lang: 'es',
    url: 'https://www.infobae.com/arc/outboundfeeds/rss/',
    domain: 'infobae.com',
    enabled: true,
    isCustom: false
  },
  {
    id: 'arg_clarin',
    name: 'Clarín',
    category: 'Noticias Generales',
    lang: 'es',
    url: 'https://www.clarin.com/rss/lo-ultimo/',
    domain: 'clarin.com',
    enabled: true,
    isCustom: false
  },
  {
    id: 'arg_lanacion',
    name: 'La Nación',
    category: 'Noticias Generales',
    lang: 'es',
    url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/',
    domain: 'lanacion.com.ar',
    enabled: false,
    isCustom: false
  },
  {
    id: 'arg_perfil',
    name: 'Perfil',
    category: 'Noticias Generales',
    lang: 'es',
    url: 'https://www.perfil.com/feed',
    domain: 'perfil.com',
    enabled: false,
    isCustom: false
  },

  // 📈 Economía y Finanzas
  {
    id: 'eco_cronista',
    name: 'El Cronista',
    category: 'Economía y Finanzas',
    lang: 'es',
    url: 'https://www.cronista.com/arc/outboundfeeds/news/',
    domain: 'cronista.com',
    enabled: true,
    isCustom: false
  },
  {
    id: 'eco_ambito',
    name: 'Ámbito Financiero',
    category: 'Economía y Finanzas',
    lang: 'es',
    url: 'https://www.ambito.com/rss/pages/home.xml',
    domain: 'ambito.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'eco_iprofesional',
    name: 'iProfesional',
    category: 'Economía y Finanzas',
    lang: 'es',
    url: 'https://www.iprofesional.com/rss/home',
    domain: 'iprofesional.com',
    enabled: false,
    isCustom: false
  },

  // 💻 Tecnología
  {
    id: 'tec_xataka',
    name: 'Xataka',
    category: 'Tecnología',
    lang: 'es',
    url: 'https://www.xataka.com/feedburner.xml',
    domain: 'xataka.com',
    enabled: true,
    isCustom: false
  },
  {
    id: 'tec_genbeta',
    name: 'Genbeta',
    category: 'Tecnología',
    lang: 'es',
    url: 'https://feeds.weblogssl.com/genbeta',
    domain: 'genbeta.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'tec_hipertextual',
    name: 'Hipertextual',
    category: 'Tecnología',
    lang: 'es',
    url: 'https://hipertextual.com/feed',
    domain: 'hipertextual.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'tec_muycomputer',
    name: 'MuyComputer',
    category: 'Tecnología',
    lang: 'es',
    url: 'https://www.muycomputer.com/feed/',
    domain: 'muycomputer.com',
    enabled: false,
    isCustom: false
  },

  // ⚽ Deportes
  {
    id: 'dep_ole',
    name: 'Diario Olé',
    category: 'Deportes',
    lang: 'es',
    url: 'https://www.ole.com.ar/rss/lo-ultimo/',
    domain: 'ole.com.ar',
    enabled: false,
    isCustom: false
  },
  {
    id: 'dep_tyc',
    name: 'TyC Sports',
    category: 'Deportes',
    lang: 'es',
    url: 'https://www.tycsports.com/rss/lo-ultimo.xml',
    domain: 'tycsports.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'dep_espn',
    name: 'ESPN Deportes',
    category: 'Deportes',
    lang: 'es',
    url: 'https://www.espn.com.ar/espn/rss/news',
    domain: 'espn.com.ar',
    enabled: false,
    isCustom: false
  },
  {
    id: 'dep_marca',
    name: 'Marca',
    category: 'Deportes',
    lang: 'es',
    url: 'https://e00-marca.uecdn.es/rss/portada.xml',
    domain: 'marca.com',
    enabled: false,
    isCustom: false
  },

  // 🌍 Internacionales
  {
    id: 'int_bbc',
    name: 'BBC Mundo',
    category: 'Internacionales',
    lang: 'es',
    url: 'https://feeds.bbci.co.uk/mundo/rss.xml',
    domain: 'bbc.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'int_elpais',
    name: 'El País',
    category: 'Internacionales',
    lang: 'es',
    url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',
    domain: 'elpais.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'int_dw',
    name: 'DW Español',
    category: 'Internacionales',
    lang: 'es',
    url: 'https://rss.dw.com/rdf/rss-sp-all',
    domain: 'dw.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'int_cnn',
    name: 'CNN en Español',
    category: 'Internacionales',
    lang: 'es',
    url: 'https://cnnespanol.cnn.com/feed/',
    domain: 'cnnespanol.cnn.com',
    enabled: false,
    isCustom: false
  },

  // 🎬 Cultura y Espectáculos
  {
    id: 'cul_teleshow',
    name: 'Infobae Teleshow',
    category: 'Cultura y Espectáculos',
    lang: 'es',
    url: 'https://www.infobae.com/arc/outboundfeeds/rss/?outputType=xml&subCategory=teleshow',
    domain: 'infobae.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'cul_rollingstone',
    name: 'Rolling Stone en Español',
    category: 'Cultura y Espectáculos',
    lang: 'es',
    url: 'https://es.rollingstone.com/feed/',
    domain: 'rollingstone.com',
    enabled: false,
    isCustom: false
  },

  // 🔴 Reddit & Comunidades
  {
    id: 'reddit_argentina',
    name: 'Reddit - r/argentina',
    category: '🔴 Reddit & Comunidades',
    lang: 'es',
    url: 'https://www.reddit.com/r/argentina/.rss',
    domain: 'reddit.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'reddit_technology',
    name: 'Reddit - r/technology',
    category: '🔴 Reddit & Comunidades',
    lang: 'es',
    url: 'https://www.reddit.com/r/technology/.rss',
    domain: 'reddit.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'reddit_gaming',
    name: 'Reddit - r/gaming',
    category: '🔴 Reddit & Comunidades',
    lang: 'es',
    url: 'https://www.reddit.com/r/gaming/.rss',
    domain: 'reddit.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'reddit_science',
    name: 'Reddit - r/science',
    category: '🔴 Reddit & Comunidades',
    lang: 'es',
    url: 'https://www.reddit.com/r/science/.rss',
    domain: 'reddit.com',
    enabled: false,
    isCustom: false
  },
  {
    id: 'reddit_programming',
    name: 'Reddit - r/programming',
    category: '🔴 Reddit & Comunidades',
    lang: 'es',
    url: 'https://www.reddit.com/r/programming/.rss',
    domain: 'reddit.com',
    enabled: false,
    isCustom: false
  }
];

let refreshIntervalMinutes = 5;
let refreshIntervalSeconds = 300;
let remainingSeconds = 300;
let autoRefreshTimerInterval = null;
let isAutoRefreshActive = true;

let allNewsItems = [];
let currentFilteredItems = [];
let activeFeeds = [];
let currentSettings = null;
let currentView = 'list'; // 'list' | 'ticker'

// Referencias DOM
const elements = {
  btnRefresh: document.getElementById('btnRefresh'),
  btnOpenReader: document.getElementById('btnOpenReader'),
  autoRefreshWidget: document.getElementById('autoRefreshWidget'),
  refreshTimerCountdown: document.getElementById('refreshTimerCountdown'),
  watchIntervalSelect: document.getElementById('watchIntervalSelect'),
  btnToggleAutoRefresh: document.getElementById('btnToggleAutoRefresh'),
  refreshTimerIcon: document.getElementById('refreshTimerIcon'),
  webBarEnabled: document.getElementById('webBarEnabled'),
  searchInput: document.getElementById('searchInput'),
  metaInfoText: document.getElementById('metaInfoText'),
  btnViewList: document.getElementById('btnViewList'),
  btnViewTicker: document.getElementById('btnViewTicker'),
  newsListContainer: document.getElementById('newsListContainer'),
  newsTickerContainer: document.getElementById('newsTickerContainer'),
  tickerVerticalTrack: document.getElementById('tickerVerticalTrack'),
  btnCloseSidepanel: document.getElementById('btnCloseSidepanel')
};

document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await initAutoRefreshTimer();
  await loadSettingsAndNews();
});

/* ==========================================================================
   AUTO-ACTUALIZACIÓN PERSONALIZABLE
   ========================================================================== */
async function initAutoRefreshTimer() {
  const savedState = localStorage.getItem('barrss_sidepanel_autorefresh');
  if (savedState !== null) {
    isAutoRefreshActive = savedState === 'true';
  }

  try {
    const saved = await chrome.storage.sync.get({ refreshIntervalMinutes: 5 });
    refreshIntervalMinutes = Math.max(1, parseInt(saved.refreshIntervalMinutes, 10) || 5);
    refreshIntervalSeconds = refreshIntervalMinutes * 60;
    remainingSeconds = refreshIntervalSeconds;
    if (elements.watchIntervalSelect) {
      elements.watchIntervalSelect.value = String(refreshIntervalMinutes);
    }
  } catch {
    remainingSeconds = refreshIntervalSeconds;
  }

  updateTimerUI();

  if (autoRefreshTimerInterval) clearInterval(autoRefreshTimerInterval);
  autoRefreshTimerInterval = setInterval(tickTimer, 1000);
}

function tickTimer() {
  if (!isAutoRefreshActive) return;

  remainingSeconds--;
  if (remainingSeconds <= 0) {
    resetAutoRefreshTimer();
    loadNews(true);
    return;
  }
  updateTimerUI();
}

function resetAutoRefreshTimer() {
  remainingSeconds = refreshIntervalSeconds;
  updateTimerUI();
}

function toggleAutoRefresh() {
  isAutoRefreshActive = !isAutoRefreshActive;
  localStorage.setItem('barrss_sidepanel_autorefresh', isAutoRefreshActive ? 'true' : 'false');
  updateTimerUI();
}

async function changeTimerInterval(minutes) {
  refreshIntervalMinutes = Math.max(1, parseInt(minutes, 10) || 5);
  refreshIntervalSeconds = refreshIntervalMinutes * 60;
  remainingSeconds = refreshIntervalSeconds;
  if (elements.watchIntervalSelect) {
    elements.watchIntervalSelect.value = String(refreshIntervalMinutes);
  }
  updateTimerUI();
  await chrome.storage.sync.set({ refreshIntervalMinutes });
}

function updateTimerUI() {
  if (!elements.refreshTimerCountdown) return;

  if (!isAutoRefreshActive) {
    elements.autoRefreshWidget?.classList.add('paused');
    elements.refreshTimerCountdown.textContent = 'Pausa';
    if (elements.btnToggleAutoRefresh) {
      elements.btnToggleAutoRefresh.textContent = '▶️';
      elements.btnToggleAutoRefresh.title = 'Reanudar auto-actualización';
    }
  } else {
    elements.autoRefreshWidget?.classList.remove('paused');
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    elements.refreshTimerCountdown.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (elements.btnToggleAutoRefresh) {
      elements.btnToggleAutoRefresh.textContent = '⏸️';
      elements.btnToggleAutoRefresh.title = 'Pausar auto-actualización';
    }
  }
}

function setupEventListeners() {
  // Widget de auto-refresco
  elements.autoRefreshWidget?.addEventListener('click', (e) => {
    if (e.target === elements.watchIntervalSelect || elements.watchIntervalSelect?.contains(e.target)) return;
    if (e.target === elements.btnToggleAutoRefresh || elements.btnToggleAutoRefresh?.contains(e.target)) return;
    toggleAutoRefresh();
  });

  elements.btnToggleAutoRefresh?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAutoRefresh();
  });

  elements.watchIntervalSelect?.addEventListener('change', (e) => {
    e.stopPropagation();
    changeTimerInterval(elements.watchIntervalSelect.value);
  });

  // Botón para abrir el Diario Web
  if (elements.btnOpenReader) {
    elements.btnOpenReader.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('reader.html') });
    });
  }

  // Botón para cerrar el panel lateral
  if (elements.btnCloseSidepanel) {
    elements.btnCloseSidepanel.addEventListener('click', () => {
      window.close();
    });
  }

  // Cambio de vista (Lista / Ticker)
  elements.btnViewList?.addEventListener('click', () => switchView('list'));
  elements.btnViewTicker?.addEventListener('click', () => switchView('ticker'));

  // Búsqueda en tiempo real
  elements.searchInput?.addEventListener('input', handleSearch);

  // Botón refrescar manual
  elements.btnRefresh?.addEventListener('click', () => {
    resetAutoRefreshTimer();
    loadNews(true);
  });

  // Toggle de la barra flotante sobre páginas web
  elements.webBarEnabled?.addEventListener('change', async () => {
    if (!currentSettings) return;
    currentSettings.enabled = elements.webBarEnabled.checked;
    await chrome.storage.sync.set({ enabled: currentSettings.enabled });

    // Notificar a todas las pestañas
    try {
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (tab.id && tab.url && !tab.url.startsWith('chrome://')) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'UPDATE_SETTINGS',
            settings: { enabled: currentSettings.enabled }
          }).catch(() => {});
        }
      }
    } catch {}
  });
}

function switchView(view) {
  currentView = view;
  elements.btnViewList.classList.toggle('active', view === 'list');
  elements.btnViewTicker.classList.toggle('active', view === 'ticker');

  if (view === 'list') {
    elements.newsListContainer.style.display = 'flex';
    elements.newsTickerContainer.classList.remove('active');
  } else {
    elements.newsListContainer.style.display = 'none';
    elements.newsTickerContainer.classList.add('active');
    renderVerticalTicker(currentFilteredItems);
  }
}

async function loadSettingsAndNews() {
  const saved = await chrome.storage.sync.get({
    enabled: false,
    feeds: DEFAULT_FEEDS
  });
  currentSettings = saved;

  if (elements.webBarEnabled) {
    elements.webBarEnabled.checked = !!saved.enabled;
  }
  activeFeeds = (saved.feeds || []).filter(f => f.enabled);

  await loadNews(false);
}

async function loadNews(forceRefresh = false) {
  if (activeFeeds.length === 0) {
    elements.metaInfoText.textContent = 'Sin canales activos';
    elements.newsListContainer.innerHTML = `
      <div class="status-box">
        <p style="color: #f87171;">⚠️ No tenés ningún canal RSS seleccionado.</p>
        <p style="font-size: 11px;">Abrí el menú de BarRSS para activar feeds.</p>
      </div>
    `;
    return;
  }

  elements.metaInfoText.textContent = `Actualizando (${activeFeeds.length} canales)...`;
  elements.newsListContainer.innerHTML = `
    <div class="status-box">
      <div class="spinner"></div>
      <p>Descargando titulares...</p>
    </div>
  `;

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'FETCH_MULTIPLE_RSS',
      feeds: activeFeeds,
      forceRefresh: forceRefresh
    });

    if (!response || !response.success || !response.items || response.items.length === 0) {
      throw new Error(response?.error || 'No se recibieron noticias.');
    }

    allNewsItems = response.items;
    currentFilteredItems = [...allNewsItems];

    elements.metaInfoText.textContent = `${allNewsItems.length} noticias de ${activeFeeds.length} medios`;
    renderCurrentView();
  } catch (error) {
    elements.metaInfoText.textContent = 'Error al actualizar';
    elements.newsListContainer.innerHTML = `
      <div class="status-box">
        <p style="color: #f87171;">⚠️ ${escapeHtml(error.message)}</p>
        <button class="btn-icon" id="btnRetry" style="width: auto; padding: 4px 12px; margin-top: 8px;">
          Reintentar
        </button>
      </div>
    `;
    const retryBtn = document.getElementById('btnRetry');
    if (retryBtn) retryBtn.addEventListener('click', () => loadNews(true));
  }
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    currentFilteredItems = [...allNewsItems];
  } else {
    currentFilteredItems = allNewsItems.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.feedName.toLowerCase().includes(query)
    );
  }

  elements.metaInfoText.textContent = `${currentFilteredItems.length} de ${allNewsItems.length} noticias`;
  renderCurrentView();
}

function renderCurrentView() {
  if (currentView === 'list') {
    renderNewsCards(currentFilteredItems);
  } else {
    renderVerticalTicker(currentFilteredItems);
  }
}

function renderNewsCards(items) {
  if (items.length === 0) {
    elements.newsListContainer.innerHTML = `
      <div class="status-box">
        <p>No se encontraron noticias con ese criterio de búsqueda.</p>
      </div>
    `;
    return;
  }

  elements.newsListContainer.innerHTML = items.map(item => `
    <a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="news-card">
      <div class="news-card-header">
        <span class="news-badge">
          ${item.faviconUrl ? `<img src="${escapeHtml(item.faviconUrl)}" class="news-favicon" alt="" onerror="this.style.display='none';" />` : ''}
          <span>${escapeHtml(item.feedName)}</span>
        </span>
      </div>
      <p class="news-title">${escapeHtml(item.title)}</p>
    </a>
  `).join('');
}

function renderVerticalTicker(items) {
  if (items.length === 0) return;

  const cardsHtml = items.map(item => `
    <a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="news-card">
      <div class="news-card-header">
        <span class="news-badge">
          ${item.faviconUrl ? `<img src="${escapeHtml(item.faviconUrl)}" class="news-favicon" alt="" onerror="this.style.display='none';" />` : ''}
          <span>${escapeHtml(item.feedName)}</span>
        </span>
      </div>
      <p class="news-title">${escapeHtml(item.title)}</p>
    </a>
  `).join('');

  // Duplicar para loop continuo vertical
  elements.tickerVerticalTrack.innerHTML = cardsHtml + cardsHtml;
  const duration = Math.max(items.length * 4, 30);
  elements.tickerVerticalTrack.style.animationDuration = `${duration}s`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Sincronización en vivo si se desactiva la barra web o se modifican los feeds
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync') {
    if (changes.enabled !== undefined && elements.webBarEnabled) {
      elements.webBarEnabled.checked = !!changes.enabled.newValue;
    }
    if (changes.feeds !== undefined) {
      activeFeeds = (changes.feeds.newValue || []).filter(f => f.enabled);
      loadNews(false);
    }
  }
});

