/**
 * BarRSS - EL DIARIO DIGITAL (READER JS)
 * Lector editorial web con paginación estilo periódico,
 * botones para compartir en redes sociales y alternancia de temas.
 */

const DEFAULT_FEEDS = [
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
  }
];

const ITEMS_PER_PAGE = 7; // 1 noticia principal Hero + 6 historias en grilla
let allStories = [];
let filteredStories = [];
let currentPage = 1;
let currentCategory = 'all';
let currentSearch = '';
let activeFeeds = [];

// Elementos del DOM
const elements = {
  currentDateStr: document.getElementById('currentDateStr'),
  autoRefreshWidget: document.getElementById('autoRefreshWidget'),
  refreshTimerCountdown: document.getElementById('refreshTimerCountdown'),
  watchIntervalSelect: document.getElementById('watchIntervalSelect'),
  btnToggleAutoRefresh: document.getElementById('btnToggleAutoRefresh'),
  refreshTimerIcon: document.getElementById('refreshTimerIcon'),
  searchInput: document.getElementById('searchInput'),
  btnClearSearch: document.getElementById('btnClearSearch'),
  btnRefresh: document.getElementById('btnRefresh'),
  btnOpenSettings: document.getElementById('btnOpenSettings'),
  btnThemeMenu: document.getElementById('btnThemeMenu'),
  themeDropdownMenu: document.getElementById('themeDropdownMenu'),
  themeIcon: document.getElementById('themeIcon'),
  themeLabel: document.getElementById('themeLabel'),
  savedCountBadge: document.getElementById('savedCountBadge'),
  catPillSaved: document.getElementById('catPillSaved'),
  mastheadFeedsCount: document.getElementById('mastheadFeedsCount'),
  catPills: document.querySelectorAll('.cat-pill'),
  loadingState: document.getElementById('loadingState'),
  emptyState: document.getElementById('emptyState'),
  emptyTitle: document.getElementById('emptyTitle'),
  emptySubtitle: document.getElementById('emptySubtitle'),
  btnResetFilters: document.getElementById('btnResetFilters'),
  newspaperSheet: document.getElementById('newspaperSheet'),
  heroSection: document.getElementById('heroSection'),
  gridSection: document.getElementById('gridSection'),
  paginationBar: document.getElementById('paginationBar'),
  btnPrevPage: document.getElementById('btnPrevPage'),
  btnNextPage: document.getElementById('btnNextPage'),
  currentPageNum: document.getElementById('currentPageNum'),
  totalPagesNum: document.getElementById('totalPagesNum'),
  pageDotsContainer: document.getElementById('pageDotsContainer'),
  toastNotification: document.getElementById('toastNotification'),

  // Drawer de Configuración
  settingsDrawer: document.getElementById('settingsDrawer'),
  settingsBackdrop: document.getElementById('settingsBackdrop'),
  btnCloseDrawer: document.getElementById('btnCloseDrawer'),
  drawerTabBtns: document.querySelectorAll('.drawer-tab-btn'),
  drawerCountryPills: document.getElementById('drawerCountryPills'),
  drawerFeedSearch: document.getElementById('drawerFeedSearch'),
  drawerFeedsList: document.getElementById('drawerFeedsList'),
  btnSelectAllDrawer: document.getElementById('btnSelectAllDrawer'),
  btnDeselectAllDrawer: document.getElementById('btnDeselectAllDrawer'),

  // Formulario Agregar Canal
  drawerCustomName: document.getElementById('drawerCustomName'),
  drawerCustomUrl: document.getElementById('drawerCustomUrl'),
  drawerCustomCategory: document.getElementById('drawerCustomCategory'),
  btnDrawerAddCustomFeed: document.getElementById('btnDrawerAddCustomFeed'),

  // Preferencias Drawer
  drawerRefreshInterval: document.getElementById('drawerRefreshInterval'),
  btnDrawerOpenSidepanel: document.getElementById('btnDrawerOpenSidepanel'),
  drawerRssDiscoveryToggle: document.getElementById('drawerRssDiscoveryToggle'),
  drawerFloatingBarToggle: document.getElementById('drawerFloatingBarToggle'),

  // Respaldo & OPML
  btnDrawerExportOpml: document.getElementById('btnDrawerExportOpml'),
  drawerImportOpmlInput: document.getElementById('drawerImportOpmlInput'),

  // Mantenimiento
  btnDrawerClearCache: document.getElementById('btnDrawerClearCache'),
  btnDrawerResetFactory: document.getElementById('btnDrawerResetFactory'),
  btnDrawerLaunchTutorial: document.getElementById('btnDrawerLaunchTutorial'),

  // Onboarding Wizard Modal
  onboardingModal: document.getElementById('onboardingModal'),
  onboardingStep1: document.getElementById('onboardingStep1'),
  onboardingStep2: document.getElementById('onboardingStep2'),
  onboardingCountryGrid: document.getElementById('onboardingCountryGrid'),
  btnOnboardingNext1: document.getElementById('btnOnboardingNext1'),
  btnOnboardingBack2: document.getElementById('btnOnboardingBack2'),
  btnOnboardingSkip: document.getElementById('btnOnboardingSkip'),
  btnOnboardingFinishTutorial: document.getElementById('btnOnboardingFinishTutorial'),
  onboardingHomeOption: document.getElementById('onboardingHomeOption'),
  onboardingBarOption: document.getElementById('onboardingBarOption')
};

// 7 Temas, Estilos Editoriales, Tipografías y Disposiciones
const THEMES = {
  light: { 
    icon: '📰', 
    label: 'Modo Papel', 
    font: 'Playfair Display', 
    layout: 'Broadsheet Clásico' 
  },
  dark: { 
    icon: '🌙', 
    label: 'Modo Noche', 
    font: 'Merriweather', 
    layout: 'Revista Nocturna' 
  },
  sepia: { 
    icon: '📜', 
    label: 'Sepia Vintage', 
    font: 'EB Garamond', 
    layout: 'Gaceta Columnar 1890' 
  },
  financial: { 
    icon: '📈', 
    label: 'Financial Salmón', 
    font: 'Newsreader', 
    layout: 'Prensa Financiera' 
  },
  nordic: { 
    icon: '❄️', 
    label: 'Nórdico Minimal', 
    font: 'Space Grotesk', 
    layout: 'Revista Asimétrica' 
  },
  cyberpunk: { 
    icon: '⚡', 
    label: 'Terminal Cyberpunk', 
    font: 'JetBrains Mono', 
    layout: 'HUD Táctico Matrix' 
  },
  midnight: { 
    icon: '✨', 
    label: 'Midnight Elegance', 
    font: 'Cormorant Garamond', 
    layout: 'Magazine de Lujo' 
  }
};

/// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  renderCurrentDate();
  setupEventListeners();
  initAutoRefreshTimer();
  updateSavedCountUI();
  await checkOnboarding();
  await loadNewspaperStories();
});

/* ==========================================================================
   1. GESTIÓN DE 7 ESTILOS EDITORIALES
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('barrss_reader_theme') || 'light';
  applyTheme(savedTheme);

  // Apertura y cierre del menú desplegable de temas
  elements.btnThemeMenu?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!elements.themeDropdownMenu) return;
    const isVisible = elements.themeDropdownMenu.style.display === 'flex';
    elements.themeDropdownMenu.style.display = isVisible ? 'none' : 'flex';
  });

  document.addEventListener('click', () => {
    if (elements.themeDropdownMenu) elements.themeDropdownMenu.style.display = 'none';
  });

  // Selección de temas
  const themeItems = document.querySelectorAll('.theme-menu-item');
  themeItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const selected = item.getAttribute('data-theme');
      applyTheme(selected);
      if (elements.themeDropdownMenu) elements.themeDropdownMenu.style.display = 'none';
      const t = THEMES[selected] || THEMES.light;
      showToast(`🎨 Estilo: ${t.label} (${t.layout} • ${t.font})`);
    });
  });
}

function applyTheme(theme) {
  const themeData = THEMES[theme] || THEMES.light;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('barrss_reader_theme', theme);

  if (elements.themeIcon) elements.themeIcon.textContent = themeData.icon;
  if (elements.themeLabel) elements.themeLabel.textContent = themeData.label;
}

/* ==========================================================================
   2. FECHA EDITORIAL
   ========================================================================== */
function renderCurrentDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  elements.currentDateStr.textContent = now.toLocaleDateString('es-ES', options);
}

/* ==========================================================================
   2.2 GESTIÓN DE NOTICIAS FAVORITAS / GUARDADAS
   ========================================================================== */
function getSavedStories() {
  try {
    const raw = localStorage.getItem('barrss_saved_stories');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function isStorySaved(link) {
  if (!link) return false;
  const saved = getSavedStories();
  return saved.some(s => s.link === link);
}

function toggleSaveStory(story) {
  if (!story || !story.link) return;
  const saved = getSavedStories();
  const index = saved.findIndex(s => s.link === story.link);
  let nowSaved = false;

  if (index >= 0) {
    saved.splice(index, 1);
    nowSaved = false;
  } else {
    saved.unshift({
      id: story.id || `saved_${Date.now()}`,
      title: story.title || '',
      link: story.link || '',
      domain: story.domain || '',
      feedName: story.feedName || story.domain || 'Noticias',
      pubDate: story.pubDate || new Date().toISOString(),
      description: story.description || story.snippet || '',
      imageUrl: story.imageUrl || '',
      category: story.category || 'Favoritos',
      savedAt: Date.now()
    });
    nowSaved = true;
  }

  localStorage.setItem('barrss_saved_stories', JSON.stringify(saved));
  updateSavedCountUI();

  if (currentCategory === 'saved') {
    applyFiltersAndRender();
  } else {
    updateAllStoryBookmarkButtons(story.link, nowSaved);
  }

  showToast(nowSaved ? '⭐ Guardada en Favoritos' : '🗑️ Eliminada de Favoritos');
}

function updateSavedCountUI() {
  const count = getSavedStories().length;
  if (elements.savedCountBadge) {
    elements.savedCountBadge.textContent = count;
  }
}

function updateAllStoryBookmarkButtons(link, isSaved) {
  const buttons = document.querySelectorAll(`.btn-bookmark[data-link="${CSS.escape(link)}"]`);
  buttons.forEach(btn => {
    btn.classList.toggle('saved', isSaved);
    btn.title = isSaved ? 'Quitar de Favoritos' : 'Guardar noticia en Favoritos';
    const star = btn.querySelector('.bookmark-star');
    const text = btn.querySelector('.bookmark-text');
    if (star) star.textContent = isSaved ? '★' : '☆';
    if (text) text.textContent = isSaved ? 'Guardado' : 'Guardar';
  });
}

function renderBookmarkButton(story) {
  if (!story || !story.link) return '';
  const isSaved = isStorySaved(story.link);
  return `
    <button type="button" class="btn-bookmark ${isSaved ? 'saved' : ''}" data-link="${escapeAttr(story.link)}" title="${isSaved ? 'Quitar de Favoritos' : 'Guardar noticia en Favoritos'}">
      <span class="bookmark-star">${isSaved ? '★' : '☆'}</span>
      <span class="bookmark-text">${isSaved ? 'Guardado' : 'Guardar'}</span>
    </button>
  `;
}
const renderBookmarkButtonHtml = renderBookmarkButton;

/* ==========================================================================
   2.5 TEMPORIZADOR Y AUTO-ACTUALIZACIÓN PERSONALIZABLE
   ========================================================================== */
let refreshIntervalMinutes = 5;
let refreshIntervalSeconds = 300;
let remainingSeconds = 300;
let isAutoRefreshActive = localStorage.getItem('barrss_reader_autorefresh') !== 'false';
let countdownInterval = null;

async function initAutoRefreshTimer() {
  try {
    const saved = await chrome.storage.sync.get({ refreshIntervalMinutes: 5 });
    refreshIntervalMinutes = Math.max(1, parseInt(saved.refreshIntervalMinutes, 10) || 5);
    refreshIntervalSeconds = refreshIntervalMinutes * 60;
    remainingSeconds = refreshIntervalSeconds;
    if (elements.watchIntervalSelect) {
      elements.watchIntervalSelect.value = String(refreshIntervalMinutes);
    }
    if (elements.drawerRefreshInterval) {
      elements.drawerRefreshInterval.value = String(refreshIntervalMinutes);
    }
  } catch {}

  updateTimerUI();

  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(handleTimerTick, 1000);
}

function handleTimerTick() {
  if (!isAutoRefreshActive) return;

  remainingSeconds--;
  if (remainingSeconds <= 0) {
    resetAutoRefreshTimer();
    loadNewspaperStories(true);
    showToast('🗞️ El diario se actualizó automáticamente.');
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
  localStorage.setItem('barrss_reader_autorefresh', isAutoRefreshActive ? 'true' : 'false');
  updateTimerUI();
  showToast(isAutoRefreshActive 
    ? `⏱️ Auto-actualización activada (cada ${refreshIntervalMinutes} min).` 
    : '⏸️ Auto-actualización pausada.');
}

async function changeTimerInterval(minutes) {
  refreshIntervalMinutes = Math.max(1, parseInt(minutes, 10) || 5);
  refreshIntervalSeconds = refreshIntervalMinutes * 60;
  remainingSeconds = refreshIntervalSeconds;
  if (elements.watchIntervalSelect) {
    elements.watchIntervalSelect.value = String(refreshIntervalMinutes);
  }
  if (elements.drawerRefreshInterval) {
    elements.drawerRefreshInterval.value = String(refreshIntervalMinutes);
  }
  updateTimerUI();
  await chrome.storage.sync.set({ refreshIntervalMinutes });
  showToast(`⏱️ Frecuencia actualizada: cada ${refreshIntervalMinutes} min.`);
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

/* ==========================================================================
   3. EVENT LISTENERS
   ========================================================================== */
function setupEventListeners() {
  // Widget Reloj de Bolsillo
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

  elements.btnRefresh?.addEventListener('click', () => {
    resetAutoRefreshTimer();
    loadNewspaperStories(true);
  });

  // Botón Abrir Configuración (Slide Drawer)
  elements.btnOpenSettings?.addEventListener('click', () => {
    openSettingsDrawer('feeds');
  });

  // Cerrar Drawer
  elements.btnCloseDrawer?.addEventListener('click', closeSettingsDrawer);
  elements.settingsBackdrop?.addEventListener('click', closeSettingsDrawer);

  // Tabs del Drawer
  elements.drawerTabBtns?.forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      const targetTab = tabBtn.getAttribute('data-dtab');
      switchDrawerTab(targetTab);
    });
  });

  // Acciones Drawer
  elements.btnSelectAllDrawer?.addEventListener('click', () => toggleCountryFeeds(true));
  elements.btnDeselectAllDrawer?.addEventListener('click', () => toggleCountryFeeds(false));

  elements.drawerFeedSearch?.addEventListener('input', (e) => {
    renderDrawerFeedsList(currentDrawerCountry, e.target.value.trim());
  });

  elements.btnDrawerAddCustomFeed?.addEventListener('click', handleDrawerAddCustomFeed);

  elements.drawerRefreshInterval?.addEventListener('change', (e) => {
    changeTimerInterval(e.target.value);
  });

  elements.btnDrawerOpenSidepanel?.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'OPEN_MENU' });
  });

  elements.drawerRssDiscoveryToggle?.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ rssDiscoveryEnabled: e.target.checked });
    showToast(e.target.checked ? '📡 Detector RSS activado' : '🔇 Detector RSS desactivado');
  });

  elements.drawerFloatingBarToggle?.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ enabled: e.target.checked });
    showToast(e.target.checked ? '📻 Barra flotante web activada' : 'Barra flotante desactivada');
  });

  elements.btnDrawerExportOpml?.addEventListener('click', handleExportOpml);
  elements.drawerImportOpmlInput?.addEventListener('change', handleImportOpmlFile);

  elements.btnDrawerClearCache?.addEventListener('click', handleClearCache);
  elements.btnDrawerResetFactory?.addEventListener('click', handleResetFactory);
  elements.btnDrawerLaunchTutorial?.addEventListener('click', launchInteractiveTutorial);

  // Filtro de categorías
  elements.catPills?.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-cat');
      currentPage = 1;
      applyFiltersAndRender();
    });
  });

  // Búsqueda en tiempo real
  elements.searchInput?.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim().toLowerCase();
    if (elements.btnClearSearch) elements.btnClearSearch.style.display = currentSearch ? 'block' : 'none';
    currentPage = 1;
    applyFiltersAndRender();
  });

  elements.btnClearSearch?.addEventListener('click', () => {
    if (elements.searchInput) elements.searchInput.value = '';
    currentSearch = '';
    if (elements.btnClearSearch) elements.btnClearSearch.style.display = 'none';
    currentPage = 1;
    applyFiltersAndRender();
  });

  elements.btnResetFilters?.addEventListener('click', () => {
    if (elements.searchInput) elements.searchInput.value = '';
    currentSearch = '';
    if (elements.btnClearSearch) elements.btnClearSearch.style.display = 'none';
    currentCategory = 'all';
    elements.catPills?.forEach(p => p.classList.toggle('active', p.getAttribute('data-cat') === 'all'));
    currentPage = 1;
    applyFiltersAndRender();
  });

  // Paginación
  elements.btnPrevPage?.addEventListener('click', () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  });

  elements.btnNextPage?.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredStories.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
      changePage(currentPage + 1);
    }
  });

  // Atajos de teclado: Flechas para pasar de hoja
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowLeft' && currentPage > 1) {
      changePage(currentPage - 1);
    } else if (e.key === 'ArrowRight') {
      const totalPages = Math.ceil(filteredStories.length / ITEMS_PER_PAGE);
      if (currentPage < totalPages) {
        changePage(currentPage + 1);
      }
    }
  });
}

/* ==========================================================================
   4. CARGA DE NOTICIAS MEDIANTE EL SERVICE WORKER
   ========================================================================== */
async function loadNewspaperStories(forceRefresh = false) {
  showLoading();

  try {
    const saved = await chrome.storage.sync.get({ feeds: null });
    let configuredFeeds = Array.isArray(saved.feeds) && saved.feeds.length > 0
      ? saved.feeds
      : (typeof getDefaultFeedsForCountry === 'function' ? getDefaultFeedsForCountry('Argentina') : DEFAULT_FEEDS);

    // Auto-corregir URLs desactualizadas
    configuredFeeds = configuredFeeds.map(f => {
      let u = f.url || '';
      if (u.includes('lanacion.com.ar/rss/ultimas-noticias')) u = 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/';
      if (u.includes('clarin.com/rss/ultimomomento')) u = 'https://www.clarin.com/rss/lo-ultimo/';
      if (u.includes('pagina12.com.ar/rss/portada.xml') || u.includes('pagina12.com.ar/rss/')) u = 'https://www.perfil.com/feed';
      return { ...f, url: u };
    });

    let activeFeedsList = configuredFeeds.filter(f => f.enabled);
    if (activeFeedsList.length === 0) {
      activeFeedsList = configuredFeeds.slice(0, 5).map(f => ({ ...f, enabled: true }));
    }

    if (elements.mastheadFeedsCount) {
      elements.mastheadFeedsCount.textContent = `${activeFeedsList.length} CANALES ACTIVOS`;
    }

    const needsFreshImages = allStories.length === 0 || !allStories.some(s => s.imageUrl);
    const shouldForce = forceRefresh || needsFreshImages;

    const response = await chrome.runtime.sendMessage({
      action: 'FETCH_MULTIPLE_RSS',
      feeds: activeFeedsList,
      forceRefresh: shouldForce
    });

    if (!response || !response.success || !response.items || response.items.length === 0) {
      throw new Error(response?.error || 'No se pudieron obtener noticias de los canales.');
    }

    allStories = response.items;
    applyFiltersAndRender();
  } catch (err) {
    console.warn('[BarRSS Diario] Error cargando noticias:', err);
    showEmpty('No se pudieron cargar las noticias', err.message || 'Verificá tu conexión a internet o activá más canales en Configuración.');
  }
}

/* ==========================================================================
   5. FILTRADO Y PAGINACIÓN
   ========================================================================== */
function matchStoryCategory(storyCat, filterCat) {
  if (!filterCat || filterCat === 'all') return true;
  if (!storyCat) return filterCat === 'General';
  const s = storyCat.toLowerCase();
  const f = filterCat.toLowerCase();
  if (s === f) return true;
  if (f === 'general' && (s.includes('general') || s.includes('noticia') || s.includes('portada') || s.includes('último') || s.includes('lo-ultimo'))) return true;
  if (f.includes('política') && s.includes('política')) return true;
  if (f.includes('economía') && (s.includes('economía') || s.includes('finanzas') || s.includes('mercado'))) return true;
  if (f.includes('tecnología') && (s.includes('tecnología') || s.includes('tec') || s.includes('tech'))) return true;
  if (f.includes('deportes') && (s.includes('deporte') || s.includes('esporte'))) return true;
  if (f.includes('cultura') && (s.includes('cultura') || s.includes('espectáculo') || s.includes('show') || s.includes('ilustrada'))) return true;
  if (f.includes('reddit') && (s.includes('reddit') || s.includes('comunidad'))) return true;
  return s.includes(f) || f.includes(s);
}

function applyFiltersAndRender() {
  const sourceList = currentCategory === 'saved' ? getSavedStories() : allStories;

  filteredStories = sourceList.filter(story => {
    // Filtro por categoría
    if (currentCategory !== 'all' && currentCategory !== 'saved') {
      if (!matchStoryCategory(story.category, currentCategory)) return false;
    }

    // Filtro por búsqueda
    if (currentSearch) {
      const titleMatch = story.title && story.title.toLowerCase().includes(currentSearch);
      const descMatch = (story.description || story.snippet) && (story.description || story.snippet).toLowerCase().includes(currentSearch);
      const sourceMatch = (story.feedName || story.domain) && (story.feedName || story.domain).toLowerCase().includes(currentSearch);
      if (!titleMatch && !descMatch && !sourceMatch) return false;
    }

    return true;
  });

  if (filteredStories.length === 0) {
    if (currentCategory === 'saved') {
      showEmpty(
        'Aún no tenés noticias guardadas',
        'Hacé clic en el botón "★ Guardar" de cualquier noticia para conservarla aquí y leerla cuando quieras.'
      );
    } else {
      showEmpty(
        'No hay noticias que coincidan',
        currentSearch ? `No se encontraron resultados para "${currentSearch}".` : 'Probá con otra categoría.'
      );
    }
    return;
  }

  renderCurrentSheet();
}

function changePage(newPage) {
  currentPage = newPage;
  renderCurrentSheet();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentSheet() {
  elements.loadingState.style.display = 'none';
  elements.emptyState.style.display = 'none';
  elements.newspaperSheet.style.display = 'block';

  const totalPages = Math.ceil(filteredStories.length / ITEMS_PER_PAGE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageStories = filteredStories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reiniciar animación de pase de hoja
  elements.newspaperSheet.classList.remove('newspaper-sheet');
  void elements.newspaperSheet.offsetWidth; // trigger reflow
  elements.newspaperSheet.classList.add('newspaper-sheet');

  // Separar noticia Hero (la primera de la hoja) de las secundarias
  const heroStory = pageStories[0];
  const gridStories = pageStories.slice(1);

  renderHeroStory(heroStory);
  renderGridStories(gridStories);
  renderPaginationControls(totalPages);
}

/* ==========================================================================
   6. RENDER DE LA NOTICIA PRINCIPAL (HERO LEAD STORY)
   ========================================================================== */
function renderHeroStory(story) {
  if (!story) {
    elements.heroSection.innerHTML = '';
    return;
  }

  const timeStr = formatPublishDate(story.pubDate);
  const favicon = story.domain
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(story.domain)}&sz=32`
    : 'icons/icon16.png';

  const imageHtml = story.imageUrl
    ? `<div class="hero-image-wrapper">
         <img src="${escapeHtml(story.imageUrl)}" alt="${escapeHtml(story.title)}" referrerpolicy="no-referrer" loading="lazy" onerror="this.parentElement.style.display='none'">
       </div>`
    : `<div class="hero-image-wrapper" style="display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--bg-subtle) 0%, var(--border-color) 100%);">
         <span style="font-size: 64px;">📰</span>
       </div>`;

  elements.heroSection.innerHTML = `
    <article class="hero-story-card">
      ${imageHtml}
      <div class="hero-content">
        <div>
          <div class="story-meta-top">
            <span class="source-badge">
              <img src="${favicon}" alt="">
              ${escapeHtml(story.feedName || 'Noticias')}
            </span>
            <span class="category-tag">${escapeHtml(story.category || 'General')}</span>
            <span class="time-ago">${timeStr}</span>
          </div>

          <h2 class="hero-title">
            <a href="${escapeHtml(story.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(story.title)}</a>
          </h2>

          <p class="hero-excerpt">
            ${escapeHtml(story.description || 'Hacé clic para leer la cobertura completa y los detalles de esta noticia en la fuente oficial.')}
          </p>
        </div>

        <div class="story-footer-actions">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <a href="${escapeHtml(story.link)}" target="_blank" rel="noopener noreferrer" class="btn-read-full">
              <span>Leer noticia completa</span>
              <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zM5 5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2v-6h-2v6H5V7h6V5H5z"/></svg>
            </a>
            ${renderBookmarkButton(story)}
          </div>

          <div class="share-social-group">
            <span class="share-label">Compartir:</span>
            ${renderShareButtons(story.title, story.link)}
          </div>
        </div>
      </div>
    </article>
  `;

  attachShareEventListeners(elements.heroSection);
}

/* ==========================================================================
   7. RENDER DE LA GRILLA DE NOTICIAS EDITORIALES
   ========================================================================== */
function renderGridStories(stories) {
  elements.gridSection.innerHTML = '';

  stories.forEach(story => {
    const timeStr = formatPublishDate(story.pubDate);
    const favicon = story.domain
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(story.domain)}&sz=32`
      : 'icons/icon16.png';

    const card = document.createElement('article');
    card.className = 'story-card';

    const imageHtml = story.imageUrl
      ? `<div class="story-card-image">
           <img src="${escapeHtml(story.imageUrl)}" alt="${escapeHtml(story.title)}" referrerpolicy="no-referrer" loading="lazy" onerror="this.parentElement.className='story-card-image placeholder'; this.parentElement.innerHTML='<span class=\\'placeholder-icon\\'>🗞️</span>'">
         </div>`
      : `<div class="story-card-image placeholder">
           <span class="placeholder-icon">${getCategoryEmoji(story.category)}</span>
         </div>`;

    card.innerHTML = `
      ${imageHtml}
      <div class="story-card-body">
        <div class="story-meta-top">
          <span class="source-badge">
            <img src="${favicon}" alt="">
            ${escapeHtml(story.feedName || 'Noticias')}
          </span>
          <span class="category-tag">${escapeHtml(story.category || 'General')}</span>
          <span class="time-ago">${timeStr}</span>
        </div>

        <h3 class="story-card-title">
          <a href="${escapeHtml(story.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(story.title)}</a>
        </h3>

        <p class="story-card-excerpt">
          ${escapeHtml(story.description || '')}
        </p>

        <div class="story-footer-actions">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <a href="${escapeHtml(story.link)}" target="_blank" rel="noopener noreferrer" class="btn-read-full">
              <span>Leer más ↗</span>
            </a>
            ${renderBookmarkButton(story)}
          </div>

          <div class="share-social-group">
            ${renderShareButtons(story.title, story.link)}
          </div>
        </div>
      </div>
    `;

    elements.gridSection.appendChild(card);
  });

  attachShareEventListeners(elements.gridSection);
}

/* ==========================================================================
   8. BOTONES DE COMPARTIR EN REDES SOCIALES Y FAVORITOS
   ========================================================================== */
function renderShareButtons(title, link) {
  return `
    <button type="button" class="btn-share-icon twitter" data-action="twitter" data-title="${escapeAttr(title)}" data-link="${escapeAttr(link)}" title="Compartir en 𝕏 (Twitter)">
      <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    </button>
    <button type="button" class="btn-share-icon whatsapp" data-action="whatsapp" data-title="${escapeAttr(title)}" data-link="${escapeAttr(link)}" title="Compartir en WhatsApp">
      <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.25-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.29z"/></svg>
    </button>
    <button type="button" class="btn-share-icon linkedin" data-action="linkedin" data-title="${escapeAttr(title)}" data-link="${escapeAttr(link)}" title="Compartir en LinkedIn">
      <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
    </button>
    <button type="button" class="btn-share-icon telegram" data-action="telegram" data-title="${escapeAttr(title)}" data-link="${escapeAttr(link)}" title="Compartir en Telegram">
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
    </button>
    <button type="button" class="btn-share-icon copy" data-action="copy" data-link="${escapeAttr(link)}" title="Copiar enlace al portapapeles">
      <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
    </button>
  `;
}

function attachShareEventListeners(container) {
  // Compartir en redes
  const shareButtons = container.querySelectorAll('.btn-share-icon');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const action = btn.getAttribute('data-action');
      const title = btn.getAttribute('data-title') || '';
      const link = btn.getAttribute('data-link') || '';

      switch (action) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(link)}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + link)}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(title)}`, '_blank');
          break;
        case 'copy':
          navigator.clipboard.writeText(link).then(() => {
            showToast('¡Enlace copiado al portapapeles!');
          }).catch(() => {
            prompt('Copiá el enlace:', link);
          });
          break;
      }
    });
  });

  // Guardar en Favoritos
  const bookmarkButtons = container.querySelectorAll('.btn-bookmark');
  bookmarkButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const link = btn.getAttribute('data-link');
      const story = allStories.find(s => s.link === link) || getSavedStories().find(s => s.link === link) || { link };
      toggleSaveStory(story);
    });
  });
}

/* ==========================================================================
   9. CONTROLES DE PAGINACIÓN ("HOJAS")
   ========================================================================== */
function renderPaginationControls(totalPages) {
  if (totalPages <= 1) {
    elements.paginationBar.style.display = 'none';
    return;
  }

  elements.paginationBar.style.display = 'block';
  elements.currentPageNum.textContent = currentPage;
  elements.totalPagesNum.textContent = totalPages;

  elements.btnPrevPage.disabled = currentPage <= 1;
  elements.btnNextPage.disabled = currentPage >= totalPages;

  // Dots de páginas
  elements.pageDotsContainer.innerHTML = '';
  const maxDots = 7;
  let start = Math.max(1, currentPage - 3);
  let end = Math.min(totalPages, start + maxDots - 1);
  if (end - start < maxDots - 1) {
    start = Math.max(1, end - maxDots + 1);
  }

  for (let i = start; i <= end; i++) {
    const dotBtn = document.createElement('button');
    dotBtn.className = `page-dot-btn ${i === currentPage ? 'active' : ''}`;
    dotBtn.textContent = i;
    dotBtn.addEventListener('click', () => changePage(i));
    elements.pageDotsContainer.appendChild(dotBtn);
  }
}

/* ==========================================================================
   10. ESTADOS DE INTERFAZ & UTILIDADES
   ========================================================================== */
function showLoading() {
  elements.loadingState.style.display = 'block';
  elements.emptyState.style.display = 'none';
  elements.newspaperSheet.style.display = 'none';
  elements.paginationBar.style.display = 'none';
}

function showEmpty(title, subtitle) {
  elements.loadingState.style.display = 'none';
  elements.newspaperSheet.style.display = 'none';
  elements.paginationBar.style.display = 'none';
  elements.emptyTitle.textContent = title;
  elements.emptySubtitle.textContent = subtitle;
  elements.emptyState.style.display = 'block';
}

function showToast(message) {
  elements.toastNotification.textContent = message;
  elements.toastNotification.classList.add('show');
  setTimeout(() => {
    elements.toastNotification.classList.remove('show');
  }, 2400);
}

function formatPublishDate(dateStr) {
  if (!dateStr) return 'Hoy';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Hoy';

    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 60) return 'Hace un momento';
    if (diffSec < 3600) return `Hace ${Math.floor(diffSec / 60)} min`;
    if (diffSec < 86400) return `Hace ${Math.floor(diffSec / 3600)} h`;

    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  } catch {
    return 'Hoy';
  }
}

function getCategoryEmoji(category) {
  switch (category) {
    case 'Economía y Finanzas': return '📈';
    case 'Tecnología': return '💻';
    case 'Deportes': return '⚽';
    case 'Internacionales': return '🌍';
    case 'Cultura y Espectáculos': return '🎬';
    default: return '📰';
  }
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

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Recargar el diario automáticamente si se modifican los canales desde otra ventana
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.feeds) {
    loadNewspaperStories(true);
  }
});

/* ==========================================================================
   11. ASISTENTE DE PRIMER INICIO (ONBOARDING WIZARD)
   ========================================================================== */
let selectedOnboardingCountry = 'Argentina';

async function checkOnboarding() {
  try {
    const saved = await chrome.storage.sync.get({ onboardingSeen: false, userCountry: 'Argentina' });
    if (!saved.onboardingSeen) {
      showOnboardingWizard(saved.userCountry || 'Argentina');
    }
  } catch (e) {
    console.warn('[BarRSS Onboarding] Error verificando primer inicio:', e);
  }
}

function showOnboardingWizard(initialCountry = 'Argentina') {
  selectedOnboardingCountry = initialCountry;
  if (!elements.onboardingModal) return;

  elements.onboardingModal.style.display = 'flex';
  elements.onboardingStep1.style.display = 'block';
  elements.onboardingStep2.style.display = 'none';

  renderOnboardingCountryGrid();

  const btnCloseOnboarding = document.getElementById('btnCloseOnboarding');
  if (btnCloseOnboarding) {
    btnCloseOnboarding.onclick = async () => {
      await finishOnboarding(false);
    };
  }

  elements.btnOnboardingNext1.onclick = () => {
    elements.onboardingStep1.style.display = 'none';
    elements.onboardingStep2.style.display = 'block';
  };

  elements.btnOnboardingBack2.onclick = () => {
    elements.onboardingStep2.style.display = 'none';
    elements.onboardingStep1.style.display = 'block';
  };

  elements.btnOnboardingSkip.onclick = async () => {
    await finishOnboarding(false);
  };

  elements.btnOnboardingFinishTutorial.onclick = async () => {
    await finishOnboarding(true);
  };
}

function renderOnboardingCountryGrid() {
  if (!elements.onboardingCountryGrid) return;
  elements.onboardingCountryGrid.innerHTML = '';

  const countries = typeof COUNTRY_CATALOG !== 'undefined' ? Object.keys(COUNTRY_CATALOG) : ['Argentina'];

  countries.forEach(cName => {
    const info = COUNTRY_CATALOG[cName] || { flag: '🌐' };
    const card = document.createElement('div');
    card.className = `country-card ${cName === selectedOnboardingCountry ? 'selected' : ''}`;
    card.innerHTML = `
      <span class="country-flag">${info.flag || '🌐'}</span>
      <span class="country-name">${escapeHtml(cName)}</span>
    `;

    card.addEventListener('click', () => {
      elements.onboardingCountryGrid.querySelectorAll('.country-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedOnboardingCountry = cName;
    });

    elements.onboardingCountryGrid.appendChild(card);
  });
}

async function finishOnboarding(launchTutorial = false) {
  const isFloatingBar = !!elements.onboardingBarOption?.checked;

  const defaultFeeds = (typeof getDefaultFeedsForCountry === 'function')
    ? getDefaultFeedsForCountry(selectedOnboardingCountry)
    : (typeof ALL_PRESET_FEEDS !== 'undefined' ? ALL_PRESET_FEEDS.slice(0, 8) : []);

  await chrome.storage.sync.set({
    onboardingSeen: true,
    userCountry: selectedOnboardingCountry,
    feeds: defaultFeeds,
    enabled: isFloatingBar
  });

  if (elements.onboardingModal) {
    elements.onboardingModal.style.display = 'none';
  }

  showToast(`¡Configurado para ${selectedOnboardingCountry}!`);
  await loadNewspaperStories(true);

  if (launchTutorial) {
    setTimeout(launchInteractiveTutorial, 500);
  }
}

/* ==========================================================================
   12. PANEL LATERAL DESLIZABLE DE CONFIGURACIÓN (DRAWER)
   ========================================================================== */
let currentDrawerCountry = 'Argentina';
let drawerFeedsMemory = [];

async function openSettingsDrawer(defaultTab = 'feeds') {
  if (!elements.settingsDrawer || !elements.settingsBackdrop) return;

  elements.settingsBackdrop.classList.add('open');
  elements.settingsDrawer.classList.add('open');
  elements.settingsDrawer.setAttribute('aria-hidden', 'false');

  // Cargar estado actual
  const saved = await chrome.storage.sync.get({
    feeds: (typeof ALL_PRESET_FEEDS !== 'undefined' ? ALL_PRESET_FEEDS.slice(0, 10) : []),
    userCountry: 'Argentina',
    rssDiscoveryEnabled: true,
    enabled: false,
    refreshIntervalMinutes: 5
  });

  drawerFeedsMemory = Array.isArray(saved.feeds) ? [...saved.feeds] : [];
  currentDrawerCountry = saved.userCountry || 'Argentina';

  if (elements.drawerRssDiscoveryToggle) {
    elements.drawerRssDiscoveryToggle.checked = saved.rssDiscoveryEnabled !== false;
  }
  if (elements.drawerFloatingBarToggle) {
    elements.drawerFloatingBarToggle.checked = !!saved.enabled;
  }
  if (elements.drawerRefreshInterval) {
    elements.drawerRefreshInterval.value = String(saved.refreshIntervalMinutes || 5);
  }

  renderDrawerCountryPills();
  renderDrawerFeedsList(currentDrawerCountry);
  switchDrawerTab(defaultTab);
}

function closeSettingsDrawer() {
  if (!elements.settingsDrawer || !elements.settingsBackdrop) return;
  elements.settingsBackdrop.classList.remove('open');
  elements.settingsDrawer.classList.remove('open');
  elements.settingsDrawer.setAttribute('aria-hidden', 'true');
}

function switchDrawerTab(tabName) {
  elements.drawerTabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-dtab') === tabName);
  });

  const panes = elements.settingsDrawer.querySelectorAll('.drawer-tab-pane');
  panes.forEach(pane => {
    pane.classList.toggle('active', pane.id === `pane-${tabName}`);
  });
}

function renderDrawerCountryPills() {
  if (!elements.drawerCountryPills) return;
  elements.drawerCountryPills.innerHTML = '';

  const countries = typeof COUNTRY_CATALOG !== 'undefined' ? Object.keys(COUNTRY_CATALOG) : ['Argentina'];

  // Opción "Personalizados / Reddit"
  const allCountries = [...countries, '🔴 Reddit & Comunidades', 'Personalizados'];

  allCountries.forEach(cName => {
    let flag = '🌐';
    if (COUNTRY_CATALOG && COUNTRY_CATALOG[cName]) flag = COUNTRY_CATALOG[cName].flag || '🌐';
    else if (cName.includes('Reddit')) flag = '🔴';
    else if (cName === 'Personalizados') flag = '⭐';

    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = `country-pill-btn ${cName === currentDrawerCountry ? 'active' : ''}`;
    pill.innerHTML = `<span>${flag}</span> <span>${escapeHtml(cName)}</span>`;

    pill.addEventListener('click', () => {
      elements.drawerCountryPills.querySelectorAll('.country-pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentDrawerCountry = cName;
      renderDrawerFeedsList(cName, elements.drawerFeedSearch?.value.trim());
    });

    elements.drawerCountryPills.appendChild(pill);
  });
}

function renderDrawerFeedsList(countryName, searchTerm = '') {
  if (!elements.drawerFeedsList) return;
  elements.drawerFeedsList.innerHTML = '';

  let listToDisplay = [];

  if (countryName === 'Personalizados') {
    listToDisplay = drawerFeedsMemory.filter(f => f.isCustom || f.category === 'Personalizados');
  } else if (countryName === '🔴 Reddit & Comunidades') {
    const presets = (typeof ALL_PRESET_FEEDS !== 'undefined') ? ALL_PRESET_FEEDS.filter(f => f.category === '🔴 Reddit & Comunidades') : [];
    listToDisplay = mergeMemoryWithPresets(presets);
  } else {
    const presets = (typeof ALL_PRESET_FEEDS !== 'undefined') ? ALL_PRESET_FEEDS.filter(f => f.country === countryName) : [];
    listToDisplay = mergeMemoryWithPresets(presets);
  }

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    listToDisplay = listToDisplay.filter(f => 
      f.name.toLowerCase().includes(q) || 
      (f.category && f.category.toLowerCase().includes(q)) ||
      (f.domain && f.domain.toLowerCase().includes(q))
    );
  }

  if (listToDisplay.length === 0) {
    elements.drawerFeedsList.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 12px;">
        No se encontraron canales para este filtro.
      </div>
    `;
    return;
  }

  // Agrupar por categorías
  const categories = {};
  listToDisplay.forEach(feed => {
    const cat = feed.category || 'General';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(feed);
  });

  Object.keys(categories).forEach(catName => {
    const groupEl = document.createElement('div');
    groupEl.className = 'drawer-category-group';
    groupEl.innerHTML = `<div class="drawer-category-title">${escapeHtml(catName)}</div>`;

    categories[catName].forEach(feed => {
      const isEnabled = drawerFeedsMemory.some(f => normalizeFeedUrl(f.url) === normalizeFeedUrl(feed.url) && f.enabled);
      const faviconUrl = feed.domain 
        ? `https://www.google.com/s2/favicons?domain=${feed.domain}&sz=32`
        : 'icons/icon16.png';

      const itemEl = document.createElement('div');
      itemEl.className = 'drawer-feed-item';
      itemEl.innerHTML = `
        <div class="drawer-feed-left">
          <img src="${faviconUrl}" class="drawer-feed-icon" alt="" onerror="this.src='icons/icon16.png'">
          <div class="drawer-feed-details">
            <span class="drawer-feed-name">${escapeHtml(feed.name)}</span>
            <span class="drawer-feed-sub">${escapeHtml(feed.domain || feed.category)}</span>
          </div>
        </div>
        <label class="drawer-switch">
          <input type="checkbox" class="drawer-feed-checkbox" data-url="${escapeAttr(feed.url)}" ${isEnabled ? 'checked' : ''}>
          <span class="drawer-slider"></span>
        </label>
      `;

      const chk = itemEl.querySelector('.drawer-feed-checkbox');
      chk.addEventListener('change', async () => {
        handleFeedToggle(feed, chk.checked);
      });

      groupEl.appendChild(itemEl);
    });

    elements.drawerFeedsList.appendChild(groupEl);
  });
}

function mergeMemoryWithPresets(presets) {
  const map = new Map();
  presets.forEach(p => map.set(normalizeFeedUrl(p.url), { ...p, enabled: false }));
  drawerFeedsMemory.forEach(m => {
    const norm = normalizeFeedUrl(m.url);
    if (map.has(norm)) {
      map.set(norm, { ...map.get(norm), ...m });
    } else {
      map.set(norm, m);
    }
  });
  return Array.from(map.values());
}

function normalizeFeedUrl(u) {
  if (!u) return '';
  try {
    const parsed = new URL(u);
    return (parsed.origin + parsed.pathname.replace(/\/+$/, '')).toLowerCase();
  } catch {
    return String(u).toLowerCase().replace(/\/+$/, '').trim();
  }
}

async function handleFeedToggle(feed, isEnabled) {
  const normUrl = normalizeFeedUrl(feed.url);
  const existingIdx = drawerFeedsMemory.findIndex(f => normalizeFeedUrl(f.url) === normUrl);

  if (existingIdx >= 0) {
    drawerFeedsMemory[existingIdx].enabled = isEnabled;
  } else {
    drawerFeedsMemory.push({
      ...feed,
      enabled: isEnabled
    });
  }

  await chrome.storage.sync.set({ feeds: drawerFeedsMemory });
  showToast(isEnabled ? `✓ Canal activado: ${feed.name}` : `Canal desactivado: ${feed.name}`);
}

async function toggleCountryFeeds(enableAll) {
  const checkboxes = elements.drawerFeedsList.querySelectorAll('.drawer-feed-checkbox');
  checkboxes.forEach(chk => {
    if (chk.checked !== enableAll) {
      chk.checked = enableAll;
      chk.dispatchEvent(new Event('change'));
    }
  });
  showToast(enableAll ? '✓ Todos los canales activados' : 'Canales desactivados');
}

/* ==========================================================================
   13. AGREGAR CANAL PERSONALIZADO / REDDIT
   ========================================================================== */
async function handleDrawerAddCustomFeed() {
  let name = elements.drawerCustomName?.value.trim() || '';
  let url = elements.drawerCustomUrl?.value.trim() || '';
  let category = elements.drawerCustomCategory?.value || 'Personalizados';

  // Detección Reddit r/subreddit
  const redditMatch = url.match(/^(?:https?:\/\/(?:www\.)?reddit\.com\/)?r\/([a-zA-Z0-9_+]+)/i);
  if (redditMatch) {
    const subName = redditMatch[1];
    if (!url.includes('.rss')) {
      url = `https://www.reddit.com/r/${subName}/.rss`;
    }
    if (!name) name = `Reddit - r/${subName}`;
    category = '🔴 Reddit & Comunidades';
  }

  if (!name) {
    alert('Por favor ingresá un nombre identificador para el canal.');
    elements.drawerCustomName?.focus();
    return;
  }

  if (!url || !/^https?:\/\/.+/i.test(url)) {
    alert('Por favor ingresá una URL válida (ej: https://sitio.com/rss) o atajo de Reddit (ej: r/argentina).');
    elements.drawerCustomUrl?.focus();
    return;
  }

  let domain = '';
  try {
    domain = new URL(url).hostname.replace(/^www\./i, '');
  } catch {}

  const newFeed = {
    id: `custom_${Date.now()}`,
    name,
    category,
    country: 'Personalizados',
    countryFlag: '⭐',
    lang: 'es',
    url,
    domain,
    enabled: true,
    isCustom: true
  };

  const norm = normalizeFeedUrl(url);
  const exists = drawerFeedsMemory.some(f => normalizeFeedUrl(f.url) === norm);
  if (exists) {
    alert('Este canal ya está en tu lista de BarRSS.');
    return;
  }

  drawerFeedsMemory.push(newFeed);
  await chrome.storage.sync.set({ feeds: drawerFeedsMemory });

  if (elements.drawerCustomName) elements.drawerCustomName.value = '';
  if (elements.drawerCustomUrl) elements.drawerCustomUrl.value = '';

  showToast(`¡Canal "${name}" agregado con éxito!`);
  renderDrawerFeedsList(currentDrawerCountry);
  switchDrawerTab('feeds');
}

/* ==========================================================================
   14. EXPORTAR / IMPORTAR OPML
   ========================================================================== */
function handleExportOpml() {
  const activeOnly = drawerFeedsMemory.filter(f => f.enabled);
  const listToExport = activeOnly.length > 0 ? activeOnly : drawerFeedsMemory;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<opml version="2.0">\n  <head>\n    <title>BarRSS Canales Exportados</title>\n    <dateCreated>${new Date().toISOString()}</dateCreated>\n  </head>\n  <body>\n    <outline text="BarRSS Feeds">\n`;

  listToExport.forEach(f => {
    xml += `      <outline type="rss" text="${escapeAttr(f.name)}" title="${escapeAttr(f.name)}" xmlUrl="${escapeAttr(f.url)}" htmlUrl="https://${escapeAttr(f.domain || '')}" category="${escapeAttr(f.category || 'General')}" />\n`;
  });

  xml += `    </outline>\n  </body>\n</opml>`;

  const blob = new Blob([xml], { type: 'text/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `barrss_canales_${new Date().toISOString().slice(0, 10)}.opml`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Archivo OPML exportado');
}

function handleImportOpmlFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const text = event.target.result;
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/xml');
      const outlines = doc.querySelectorAll('outline[xmlUrl], outline[type="rss"], outline[type="atom"]');

      let importedCount = 0;
      outlines.forEach(o => {
        const feedUrl = o.getAttribute('xmlUrl') || o.getAttribute('url');
        const feedName = o.getAttribute('title') || o.getAttribute('text') || 'Canal Importado';
        const category = o.getAttribute('category') || 'Personalizados';

        if (feedUrl && /^https?:\/\//i.test(feedUrl)) {
          const norm = normalizeFeedUrl(feedUrl);
          if (!drawerFeedsMemory.some(f => normalizeFeedUrl(f.url) === norm)) {
            let domain = '';
            try { domain = new URL(feedUrl).hostname.replace(/^www\./i, ''); } catch {}
            drawerFeedsMemory.push({
              id: `imported_${Date.now()}_${importedCount}`,
              name: feedName,
              category,
              country: 'Personalizados',
              countryFlag: '⭐',
              lang: 'es',
              url: feedUrl,
              domain,
              enabled: true,
              isCustom: true
            });
            importedCount++;
          }
        }
      });

      await chrome.storage.sync.set({ feeds: drawerFeedsMemory });
      showToast(`📤 ¡${importedCount} canales importados con éxito!`);
      renderDrawerFeedsList(currentDrawerCountry);
      switchDrawerTab('feeds');
    } catch (err) {
      alert('Error leyendo archivo OPML: ' + err.message);
    }
  };
  reader.readAsText(file);
}

/* ==========================================================================
   15. MANTENIMIENTO: BORRAR CACHÉ & REINICIO DE FÁBRICA
   ========================================================================== */
async function handleClearCache() {
  await chrome.runtime.sendMessage({ action: 'CLEAR_CACHE' });
  localStorage.removeItem('barrss_saved_stories_cache');
  showToast('🗑️ Memoria caché de noticias liberada con éxito.');
  closeSettingsDrawer();
  loadNewspaperStories(true);
}

async function handleResetFactory() {
  if (!confirm('¿Estás seguro de que querés reiniciar BarRSS y volver a seleccionar tu país? Se restaurarán los canales iniciales.')) {
    return;
  }

  closeSettingsDrawer();
  await chrome.storage.sync.clear();
  showOnboardingWizard('Argentina');
}

/* ==========================================================================
   16. TUTORIAL INTERACTIVO
   ========================================================================== */
function launchInteractiveTutorial() {
  closeSettingsDrawer();
  showToast('🚀 Iniciando recorrido guiado de El Diario BarRSS...');

  const steps = [
    { el: elements.currentDateStr, title: '📅 Fecha y Edición', text: 'Aquí tenés la edición de hoy sincronizada en vivo.' },
    { el: elements.searchInput, title: '🔍 Búsqueda Rápida', text: 'Buscá titulares o palabras clave en tiempo real.' },
    { el: elements.autoRefreshWidget, title: '⏱️ Reloj de Bolsillo', text: 'Indica la próxima auto-actualización. Hacé clic para pausar o cambiar minutos.' },
    { el: elements.btnThemeMenu, title: '🎨 7 Estilos Editoriales', text: 'Cambiá la estética entre Papel Prensa, Noche, Sepia, Salmón, Cyberpunk, etc.' },
    { el: elements.btnOpenSettings, title: '⚙️ Configuración', text: 'Elegí tu país, agregá subreddits y personalizá todos tus canales RSS.' }
  ];

  let currentStep = 0;
  function showNextStep() {
    if (currentStep >= steps.length) {
      showToast('🎉 ¡Listo! Ya conocés todas las funciones de tu Diario.');
      return;
    }

    const s = steps[currentStep];
    if (s.el) {
      s.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      s.el.style.outline = '3px solid #f59e0b';
      s.el.style.outlineOffset = '4px';
      showToast(`${s.title}: ${s.text}`);

      setTimeout(() => {
        if (s.el) s.el.style.outline = '';
        currentStep++;
        showNextStep();
      }, 3500);
    } else {
      currentStep++;
      showNextStep();
    }
  }

  showNextStep();
}
