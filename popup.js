/**
 * BarRSS - Popup Controller
 * 
 * Gestiona:
 * - Selección múltiple de canales RSS predeterminados y personalizados.
 * - Modo Camaleón / Adaptativo (mimetizar con el sitio web).
 * - Opciones visuales (colores, opacidad, fuentes, velocidad, empuje de página).
 * - Pestañas de navegación y Tutorial de Bienvenida (Onboarding).
 * - Sincronización en tiempo real vía chrome.tabs.sendMessage.
 */

const DEFAULT_FEEDS = getDefaultFeedsForCountry('Argentina');

const CATEGORY_CONFIG = {
  'Noticias Generales': { icon: '📰', order: 1 },
  'Economía y Finanzas': { icon: '📈', order: 2 },
  'Tecnología': { icon: '💻', order: 3 },
  '🔴 Reddit & Comunidades': { icon: '🔴', order: 4 },
  'Deportes': { icon: '⚽', order: 5 },
  'Internacionales': { icon: '🌍', order: 6 },
  'Cultura y Espectáculos': { icon: '🎬', order: 7 },
  'Personalizados': { icon: '⭐', order: 8 }
};

const DEFAULT_SETTINGS = {
  enabled: false,
  readerOpenMode: 'window',
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
  feeds: DEFAULT_FEEDS,
  language: 'es',
  onboardingSeen: false
};

const I18N = {
  es: {
    powerTitleActive: 'Barra Flotante Activa',
    powerTitleInactive: 'Barra Flotante Desactivada',
    powerDescActive: 'Visible sobre las páginas que navegás',
    powerDescInactive: 'Oculta en todas las páginas web',
    btnTutorial: '❓ Guía',
    btnReader: 'Abrir Diario',
    btnSidepanel: 'Panel Lateral',
    filterAll: 'Todas las categorías',
    channelsHeader: 'Canales',
    activeCountSuffix: 'activos',
    btnAll: 'Todos',
    btnNone: 'Ninguno',
    btnAddFeedTitle: '➕ Agregar Canal RSS Propio',
    btnAddFeedBtn: '+ Añadir Canal',
    namePlaceholder: 'Nombre del sitio (ej: Infobae, The Verge)',
    urlPlaceholder: 'URL del Feed RSS / Atom (ej: https://site.com/rss)',
    savedBadge: '✓ Guardado',
    savingBadge: '⏳ Guardando...',
    importOpmlText: '📥 Importar Canales desde OPML (.opml, .xml)',
    exportOpmlText: '📤 Exportar Canales a OPML (.opml)',
    tabFeeds: '📡 Canales',
    tabBar: '🌊 Barra Flotante',
    tabBackup: '☁️ Nube',
    tabTutorial: '💡 Guía'
  },
  en: {
    powerTitleActive: 'Floating Bar Active',
    powerTitleInactive: 'Floating Bar Disabled',
    powerDescActive: 'Visible across your browsing tabs',
    powerDescInactive: 'Hidden on all web pages',
    btnTutorial: '❓ Guide',
    btnReader: 'Open Newspaper',
    btnSidepanel: 'Side Panel',
    filterAll: 'All Categories',
    channelsHeader: 'Feeds',
    activeCountSuffix: 'active',
    btnAll: 'All',
    btnNone: 'None',
    btnAddFeedTitle: '➕ Add Custom RSS Feed',
    btnAddFeedBtn: '+ Add Feed',
    namePlaceholder: 'Site name (e.g. The Verge, BBC News)',
    urlPlaceholder: 'RSS / Atom Feed URL (e.g. https://site.com/rss)',
    savedBadge: '✓ Saved',
    savingBadge: '⏳ Saving...',
    importOpmlText: '📥 Import Feeds from OPML (.opml, .xml)',
    exportOpmlText: '📤 Export Feeds to OPML (.opml)',
    tabFeeds: '📡 Feeds',
    tabBar: '🌊 Floating Bar',
    tabBackup: '☁️ Cloud',
    tabTutorial: '💡 Guide'
  }
};

const POPULAR_ENGLISH_FEEDS = [
  {
    id: 'en_bbc_news',
    name: 'BBC News',
    category: 'Noticias Generales',
    lang: 'en',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    domain: 'bbc.co.uk',
    enabled: true,
    isCustom: true
  },
  {
    id: 'en_theverge',
    name: 'The Verge',
    category: 'Tecnología',
    lang: 'en',
    url: 'https://www.theverge.com/rss/index.xml',
    domain: 'theverge.com',
    enabled: true,
    isCustom: true
  },
  {
    id: 'en_techcrunch',
    name: 'TechCrunch',
    category: 'Tecnología',
    lang: 'en',
    url: 'https://techcrunch.com/feed/',
    domain: 'techcrunch.com',
    enabled: true,
    isCustom: true
  },
  {
    id: 'en_reuters',
    name: 'Reuters World',
    category: 'Internacionales',
    lang: 'en',
    url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best',
    domain: 'reuters.com',
    enabled: true,
    isCustom: true
  }
];

let currentFeeds = [];

// Elementos del DOM
const elements = {
  autoSaveIndicator: document.getElementById('autoSaveIndicator'),
  barEnabled: document.getElementById('barEnabled'),
  masterPowerCard: document.getElementById('masterPowerCard'),
  powerIndicator: document.getElementById('powerIndicator'),
  powerTitle: document.getElementById('powerTitle'),
  powerDesc: document.getElementById('powerDesc'),
  btnOpenTutorial: document.getElementById('btnOpenTutorial'),
  btnCompleteTutorial: document.getElementById('btnCompleteTutorial'),
  feedsListContainer: document.getElementById('feedsListContainer'),
  activeFeedsCount: document.getElementById('activeFeedsCount'),
  feedLanguageSelect: document.getElementById('feedLanguageSelect'),
  categoryFilterSelect: document.getElementById('categoryFilterSelect'),
  btnSelectAllFeeds: document.getElementById('btnSelectAllFeeds'),
  btnDeselectAllFeeds: document.getElementById('btnDeselectAllFeeds'),
  customFeedName: document.getElementById('customFeedName'),
  customFeedUrl: document.getElementById('customFeedUrl'),
  customFeedCategory: document.getElementById('customFeedCategory'),
  btnAddCustomFeed: document.getElementById('btnAddCustomFeed'),
  pushPageContent: document.getElementById('pushPageContent'),
  autoHideOnScroll: document.getElementById('autoHideOnScroll'),
  rssDiscoveryEnabled: document.getElementById('rssDiscoveryEnabled'),
  refreshIntervalSelect: document.getElementById('refreshIntervalSelect'),
  modeAlways: document.getElementById('modeAlways'),
  modeHover: document.getElementById('modeHover'),
  modePill: document.getElementById('modePill'),
  adaptiveTheme: document.getElementById('adaptiveTheme'),
  customColorsContainer: document.getElementById('customColorsContainer'),
  posBottom: document.getElementById('posBottom'),
  posTop: document.getElementById('posTop'),
  speedSelect: document.getElementById('speedSelect'),
  bgColor: document.getElementById('bgColor'),
  bgOpacity: document.getElementById('bgOpacity'),
  opacityVal: document.getElementById('opacityVal'),
  textColor: document.getElementById('textColor'),
  linkColor: document.getElementById('linkColor'),
  fontFamilySelect: document.getElementById('fontFamilySelect'),
  fontSizeRange: document.getElementById('fontSizeRange'),
  fontSizeVal: document.getElementById('fontSizeVal'),
  btnOpenReader: document.getElementById('btnOpenReader'),
  modeWindow: document.getElementById('modeWindow'),
  modeTab: document.getElementById('modeTab'),
  btnOpenSidePanel: document.getElementById('btnOpenSidePanel'),
  btnExportConfig: document.getElementById('btnExportConfig'),
  importConfigFile: document.getElementById('importConfigFile'),
  btnExportOpml: document.getElementById('btnExportOpml'),
  importOpmlFile: document.getElementById('importOpmlFile'),
  languageSelect: document.getElementById('languageSelect'),
  btnCopyConfig: document.getElementById('btnCopyConfig'),
  btnPasteConfig: document.getElementById('btnPasteConfig'),
  btnSave: document.getElementById('btnSave'),
  saveAlert: document.getElementById('saveAlert'),
  saveActionsContainer: document.getElementById('saveActionsContainer'),
  tabs: document.querySelectorAll('.nav-tab'),
  tabContents: document.querySelectorAll('.tab-content')
};

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  await loadSavedSettings();
  setupEventListeners();
});

function setupTabs() {
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTabId = tab.getAttribute('data-tab');
      switchTab(targetTabId);
    });
  });

  elements.btnOpenTutorial.addEventListener('click', () => {
    switchTab('tab-tutorial');
  });

  elements.btnCompleteTutorial.addEventListener('click', async () => {
    await BarRSSSettings.set({ onboardingSeen: true });
    switchTab('tab-feeds');
  });
}

function switchTab(tabId) {
  elements.tabs.forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
  });

  elements.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });

  if (tabId === 'tab-tutorial' || tabId === 'tab-backup') {
    elements.saveActionsContainer.style.display = 'none';
  } else {
    elements.saveActionsContainer.style.display = 'block';
  }
}

async function loadSavedSettings() {
  const saved = await BarRSSSettings.get(DEFAULT_SETTINGS);
  const settings = { ...DEFAULT_SETTINGS, ...saved };
  const readerMode = settings.readerOpenMode || 'window';
  if (readerMode === 'tab' && elements.modeTab) {
    elements.modeTab.checked = true;
  } else if (elements.modeWindow) {
    elements.modeWindow.checked = true;
  }

  updateBarToggleUI(settings.enabled);
  elements.pushPageContent.checked = settings.pushPageContent !== false;
  if (elements.autoHideOnScroll) elements.autoHideOnScroll.checked = !!settings.autoHideOnScroll;
  if (elements.rssDiscoveryEnabled) elements.rssDiscoveryEnabled.checked = settings.rssDiscoveryEnabled !== false;
  if (elements.refreshIntervalSelect) elements.refreshIntervalSelect.value = String(settings.refreshIntervalMinutes || 5);

  const mode = settings.displayMode || 'always';
  if (mode === 'hover' && elements.modeHover) elements.modeHover.checked = true;
  else if (mode === 'pill' && elements.modePill) elements.modePill.checked = true;
  else if (elements.modeAlways) elements.modeAlways.checked = true;

  elements.adaptiveTheme.checked = !!settings.adaptiveTheme;

  updateAdaptiveThemeUI();

  if (settings.position === 'top') {
    elements.posTop.checked = true;
  } else {
    elements.posBottom.checked = true;
  }

  elements.speedSelect.value = settings.speed;
  elements.bgColor.value = settings.backgroundColor;
  elements.bgOpacity.value = settings.backgroundOpacity;
  elements.opacityVal.textContent = `${settings.backgroundOpacity}%`;

  elements.textColor.value = settings.textColor;
  elements.linkColor.value = settings.linkColor;
  elements.fontFamilySelect.value = settings.fontFamily;
  elements.fontSizeRange.value = settings.fontSize;
  elements.fontSizeVal.textContent = `${settings.fontSize}px`;

  currentFeeds = Array.isArray(settings.feeds) ? settings.feeds.map(f => ({ ...f })) : DEFAULT_FEEDS;

  if (elements.languageSelect) {
    elements.languageSelect.value = settings.language || 'es';
    applyTranslations(settings.language || 'es');
  }

  renderFeedsList();

  if (!settings.onboardingSeen) {
    switchTab('tab-tutorial');
  }
}

function updateAdaptiveThemeUI() {
  if (elements.adaptiveTheme.checked) {
    elements.customColorsContainer.classList.add('disabled-overlay');
  } else {
    elements.customColorsContainer.classList.remove('disabled-overlay');
  }
}

function renderFeedsList() {
  elements.feedsListContainer.innerHTML = '';

  const selectedLang = elements.feedLanguageSelect ? elements.feedLanguageSelect.value : 'es';
  const selectedCat = elements.categoryFilterSelect ? elements.categoryFilterSelect.value : 'all';

  // Filtrar feeds según idioma y categoría seleccionada
  const filteredFeeds = currentFeeds.filter(feed => {
    const matchLang = !feed.lang || feed.lang === selectedLang || feed.isCustom;
    if (!matchLang) return false;

    if (selectedCat === 'all') return true;
    if (selectedCat === 'Personalizados') return !!feed.isCustom;
    return feed.category === selectedCat;
  });

  // Agrupar por categoría
  const groups = new Map();
  filteredFeeds.forEach(feed => {
    const catName = feed.isCustom ? 'Personalizados' : (feed.category || 'Otros');
    if (!groups.has(catName)) {
      groups.set(catName, []);
    }
    groups.get(catName).push(feed);
  });

  // Ordenar categorías según CATEGORY_CONFIG
  const sortedCategories = Array.from(groups.keys()).sort((a, b) => {
    const orderA = CATEGORY_CONFIG[a]?.order || 99;
    const orderB = CATEGORY_CONFIG[b]?.order || 99;
    return orderA - orderB;
  });

  if (sortedCategories.length === 0) {
    elements.feedsListContainer.innerHTML = `
      <div style="text-align: center; padding: 25px 15px; color: var(--text-muted); font-size: 11px;">
        No hay canales disponibles para los filtros seleccionados.
      </div>
    `;
    updateActiveCount();
    return;
  }

  sortedCategories.forEach(catName => {
    const feedsInGroup = groups.get(catName);
    const catMeta = CATEGORY_CONFIG[catName] || { icon: '📁' };
    const enabledInGroup = feedsInGroup.filter(f => f.enabled).length;

    const groupCard = document.createElement('div');
    groupCard.className = 'category-card';

    // Header de la Categoría
    const header = document.createElement('div');
    header.className = 'category-card-header';

    const titleEl = document.createElement('div');
    titleEl.className = 'category-card-title';
    titleEl.innerHTML = `
      <span>${catMeta.icon}</span>
      <span>${escapeHtml(catName)}</span>
      <span class="category-badge" id="badge_cat_${escapeHtml(catName)}">${enabledInGroup}/${feedsInGroup.length}</span>
    `;

    const actionsEl = document.createElement('div');
    actionsEl.className = 'category-card-actions';

    const toggleGroupBtn = document.createElement('button');
    toggleGroupBtn.type = 'button';
    toggleGroupBtn.className = 'category-btn-toggle';
    const allEnabled = enabledInGroup === feedsInGroup.length;
    toggleGroupBtn.textContent = allEnabled ? 'Desactivar' : 'Activar';
    toggleGroupBtn.title = allEnabled ? 'Desactivar todos los de esta categoría' : 'Activar todos los de esta categoría';

    toggleGroupBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newState = enabledInGroup < feedsInGroup.length;
      feedsInGroup.forEach(f => {
        f.enabled = newState;
      });
      renderFeedsList();
      updateActiveCount();
      triggerAutoSave();
    });

    actionsEl.appendChild(toggleGroupBtn);
    header.appendChild(titleEl);
    header.appendChild(actionsEl);
    groupCard.appendChild(header);

    // Cuerpo con cada medio / canal RSS
    const body = document.createElement('div');
    body.className = 'category-card-body';

    feedsInGroup.forEach(feed => {
      const itemEl = document.createElement('div');
      itemEl.className = 'feed-item';

      const leftCol = document.createElement('div');
      leftCol.className = 'feed-item-left';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!feed.enabled;
      checkbox.id = `chk_${feed.id}`;
      checkbox.addEventListener('change', () => {
        feed.enabled = checkbox.checked;
        updateActiveCount();
        const curEnabled = feedsInGroup.filter(f => f.enabled).length;
        const badgeEl = document.getElementById(`badge_cat_${escapeHtml(catName)}`);
        if (badgeEl) badgeEl.textContent = `${curEnabled}/${feedsInGroup.length}`;
        toggleGroupBtn.textContent = curEnabled === feedsInGroup.length ? 'Desactivar' : 'Activar';
        triggerAutoSave();
      });

      const faviconImg = document.createElement('img');
      faviconImg.className = 'feed-favicon';
      faviconImg.alt = '';
      faviconImg.src = feed.domain 
        ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(feed.domain)}&sz=32`
        : 'icons/icon16.png';
      faviconImg.onerror = () => {
        faviconImg.style.display = 'none';
      };

      const meta = document.createElement('label');
      meta.htmlFor = `chk_${feed.id}`;
      meta.className = 'feed-meta';
      meta.style.cursor = 'pointer';
      meta.innerHTML = `
        <span class="feed-name">${escapeHtml(feed.name)}</span>
        <span class="feed-cat">${escapeHtml(feed.domain || feed.category || '')}</span>
      `;

      leftCol.appendChild(checkbox);
      leftCol.appendChild(faviconImg);
      leftCol.appendChild(meta);
      itemEl.appendChild(leftCol);

      const rightActions = document.createElement('div');
      rightActions.className = 'feed-right-actions';

      // Selector para mover a cualquier categoría
      const catSelect = document.createElement('select');
      catSelect.className = 'feed-cat-select';
      catSelect.title = 'Mover este canal a otra categoría';
      const categoriesList = [
        { id: 'Noticias Generales', label: '📰 Noticias' },
        { id: 'Economía y Finanzas', label: '📈 Economía' },
        { id: 'Tecnología', label: '💻 Tecnología' },
        { id: 'Deportes', label: '⚽ Deportes' },
        { id: 'Internacionales', label: '🌍 Internacional' },
        { id: 'Cultura y Espectáculos', label: '🎬 Cultura' },
        { id: 'Personalizados', label: '⭐ Propios' }
      ];
      categoriesList.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.label;
        if (feed.category === c.id) opt.selected = true;
        catSelect.appendChild(opt);
      });
      catSelect.addEventListener('change', (e) => {
        e.stopPropagation();
        feed.category = e.target.value;
        renderFeedsList();
        triggerAutoSave();
        showFeedbackAlert(`Canal movido a ${e.target.value}`);
      });
      rightActions.appendChild(catSelect);

      if (feed.isCustom) {
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'feed-btn-del';
        delBtn.title = 'Eliminar este canal personalizado';
        delBtn.innerHTML = `
          <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        `;
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteCustomFeed(feed.id);
        });
        rightActions.appendChild(delBtn);
      }

      itemEl.appendChild(rightActions);
      body.appendChild(itemEl);
    });

    groupCard.appendChild(body);
    elements.feedsListContainer.appendChild(groupCard);
  });

  updateActiveCount();
}

function updateActiveCount() {
  const activeCount = currentFeeds.filter(f => f.enabled).length;
  elements.activeFeedsCount.textContent = activeCount;
}

function toggleVisibleFeeds(enableState) {
  const selectedLang = elements.feedLanguageSelect ? elements.feedLanguageSelect.value : 'es';
  const selectedCat = elements.categoryFilterSelect ? elements.categoryFilterSelect.value : 'all';

  currentFeeds.forEach(feed => {
    const matchLang = !feed.lang || feed.lang === selectedLang || feed.isCustom;
    if (!matchLang) return;

    if (selectedCat === 'all' || feed.category === selectedCat || (selectedCat === 'Personalizados' && feed.isCustom)) {
      feed.enabled = enableState;
    }
  });

  renderFeedsList();
  updateActiveCount();
  triggerAutoSave();
}

function deleteCustomFeed(feedId) {
  currentFeeds = currentFeeds.filter(f => f.id !== feedId);
  renderFeedsList();
  triggerAutoSave();
}

function setupEventListeners() {
  // Filtros de idioma y categoría
  if (elements.feedLanguageSelect) {
    elements.feedLanguageSelect.addEventListener('change', renderFeedsList);
  }
  if (elements.categoryFilterSelect) {
    elements.categoryFilterSelect.addEventListener('change', renderFeedsList);
  }

  // Acciones en lote (Todos / Ninguno)
  if (elements.btnSelectAllFeeds) {
    elements.btnSelectAllFeeds.addEventListener('click', () => toggleVisibleFeeds(true));
  }
  if (elements.btnDeselectAllFeeds) {
    elements.btnDeselectAllFeeds.addEventListener('click', () => toggleVisibleFeeds(false));
  }

  // Auto-guardado en tiempo real al cambiar modo de presencia
  [elements.modeAlways, elements.modeHover, elements.modePill].forEach(radio => {
    if (radio) radio.addEventListener('change', triggerAutoSave);
  });

  // Auto-guardado al cambiar ubicación (arriba / abajo)
  [elements.posBottom, elements.posTop].forEach(radio => {
    if (radio) radio.addEventListener('change', triggerAutoSave);
  });

  // Auto-guardado al cambiar opciones de comportamiento
  if (elements.pushPageContent) elements.pushPageContent.addEventListener('change', triggerAutoSave);
  if (elements.autoHideOnScroll) elements.autoHideOnScroll.addEventListener('change', triggerAutoSave);
  if (elements.rssDiscoveryEnabled) elements.rssDiscoveryEnabled.addEventListener('change', triggerAutoSave);
  if (elements.refreshIntervalSelect) elements.refreshIntervalSelect.addEventListener('change', triggerAutoSave);

  // Auto-guardado al cambiar velocidad y fuente
  if (elements.speedSelect) elements.speedSelect.addEventListener('change', triggerAutoSave);
  if (elements.fontFamilySelect) elements.fontFamilySelect.addEventListener('change', triggerAutoSave);

  // Mantenimiento
  const btnPopupClearCache = document.getElementById('btnPopupClearCache');
  if (btnPopupClearCache) {
    btnPopupClearCache.addEventListener('click', async () => {
      await chrome.runtime.sendMessage({ action: 'CLEAR_CACHE' });
      alert('🗑️ Caché de noticias liberada con éxito.');
    });
  }

  const btnPopupResetFactory = document.getElementById('btnPopupResetFactory');
  if (btnPopupResetFactory) {
    btnPopupResetFactory.addEventListener('click', async () => {
      if (!confirm('¿Deseas reiniciar la configuración de BarRSS a su estado original?')) return;
      await chrome.runtime.sendMessage({ action: 'RESET_FACTORY', country: 'Argentina' });
      alert('🔄 Configuración restaurada. Abriendo El Diario...');
      chrome.tabs.create({ url: chrome.runtime.getURL('reader.html') });
      window.close();
    });
  }

  // Auto-guardado al cambiar colores
  if (elements.bgColor) elements.bgColor.addEventListener('input', triggerAutoSave);
  if (elements.textColor) elements.textColor.addEventListener('input', triggerAutoSave);
  if (elements.linkColor) elements.linkColor.addEventListener('input', triggerAutoSave);

  elements.bgOpacity.addEventListener('input', (e) => {
    elements.opacityVal.textContent = `${e.target.value}%`;
    triggerAutoSave();
  });

  elements.fontSizeRange.addEventListener('input', (e) => {
    elements.fontSizeVal.textContent = `${e.target.value}px`;
    triggerAutoSave();
  });

  elements.adaptiveTheme.addEventListener('change', () => {
    updateAdaptiveThemeUI();
    triggerAutoSave();
  });

  // Switch maestro ultra visible: activar / desactivar barra en vivo con 1 clic
  if (elements.barEnabled) {
    elements.barEnabled.addEventListener('change', async () => {
      const isEnabled = elements.barEnabled.checked;
      updateBarToggleUI(isEnabled);

      // Guardar inmediatamente en sync
      await BarRSSSettings.set({ enabled: isEnabled });

      // Notificar a todas las pestañas para que aparezca o desaparezca al instante
      await broadcastSettingsToTabs({ enabled: isEnabled });

      if (elements.autoSaveIndicator) {
        elements.autoSaveIndicator.textContent = '✓ Guardado';
      }
      showFeedbackAlert(isEnabled ? '¡Barra flotante activada!' : 'Barra flotante desactivada');
    });
  }

  elements.btnAddCustomFeed.addEventListener('click', addCustomFeed);
  elements.btnSave.addEventListener('click', saveAndApplySettings);

  if (elements.modeWindow) {
    elements.modeWindow.addEventListener('change', () => {
      BarRSSSettings.set({ readerOpenMode: 'window' });
    });
  }

  if (elements.modeTab) {
    elements.modeTab.addEventListener('change', () => {
      BarRSSSettings.set({ readerOpenMode: 'tab' });
    });
  }

  if (elements.btnOpenReader) {
    elements.btnOpenReader.addEventListener('click', async () => {
      const isTabMode = elements.modeTab && elements.modeTab.checked;
      if (isTabMode) {
        await chrome.tabs.create({ url: chrome.runtime.getURL('reader.html') });
      } else {
        const width = Math.min(1320, window.screen.availWidth - 60);
        const height = Math.min(880, window.screen.availHeight - 60);
        const left = Math.max(0, Math.round((window.screen.availWidth - width) / 2));
        const top = Math.max(0, Math.round((window.screen.availHeight - height) / 2));
        await chrome.windows.create({
          url: chrome.runtime.getURL('reader.html'),
          type: 'popup',
          width,
          height,
          left,
          top
        });
      }
      window.close();
    });
  }

  if (elements.btnOpenSidePanel) {
    elements.btnOpenSidePanel.addEventListener('click', async () => {
      try {
        await chrome.runtime.sendMessage({ action: 'OPEN_SIDEPANEL' });
      } catch (err) {
        console.warn('[BarRSS] Error abriendo Panel Lateral:', err);
      }
    });
  }

  // ☁️ Nube y Respaldo de Configuración
  if (elements.btnExportConfig) {
    elements.btnExportConfig.addEventListener('click', exportConfiguration);
  }

  if (elements.importConfigFile) {
    elements.importConfigFile.addEventListener('change', importConfigurationFromFile);
  }

  if (elements.btnCopyConfig) {
    elements.btnCopyConfig.addEventListener('click', copyConfigurationToClipboard);
  }

  if (elements.btnPasteConfig) {
    elements.btnPasteConfig.addEventListener('click', pasteConfigurationFromClipboard);
  }

  // 📡 Exportación e Importación OPML
  if (elements.btnExportOpml) {
    elements.btnExportOpml.addEventListener('click', exportOpml);
  }

  if (elements.importOpmlFile) {
    elements.importOpmlFile.addEventListener('change', importOpmlFromFile);
  }

  // 🌐 Selector de Idioma (Español / English)
  if (elements.languageSelect) {
    elements.languageSelect.addEventListener('change', async (e) => {
      const newLang = e.target.value;
      applyTranslations(newLang);
      await BarRSSSettings.set({ language: newLang });
      await broadcastSettingsToTabs({ language: newLang });
      if (newLang === 'en') {
        promptAddEnglishFeeds();
      }
      triggerAutoSave();
    });
  }
}

async function exportConfiguration() {
  try {
    const saved = await BarRSSSettings.get(DEFAULT_SETTINGS);
    const exportData = {
      app: 'BarRSS',
      version: '1.3.0',
      exportedAt: new Date().toISOString(),
      settings: {
        ...DEFAULT_SETTINGS,
        ...saved,
        feeds: currentFeeds
      }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barrss-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    showFeedbackAlert('¡Archivo de respaldo descargado!');
  } catch (err) {
    alert('Error exportando configuración: ' + err.message);
  }
}

function importConfigurationFromFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      const importedSettings = parsed.settings || parsed;

      if (!importedSettings || typeof importedSettings !== 'object') {
        throw new Error('El archivo no tiene una estructura de configuración válida.');
      }

      await applyImportedSettings(importedSettings);
      showFeedbackAlert('¡Configuración restaurada con éxito!');
    } catch (err) {
      alert('Error al leer el archivo de respaldo: ' + err.message);
    } finally {
      elements.importConfigFile.value = '';
    }
  };
  reader.readAsText(file);
}

async function copyConfigurationToClipboard() {
  try {
    const saved = await BarRSSSettings.get(DEFAULT_SETTINGS);
    const exportData = {
      app: 'BarRSS',
      version: '1.3.0',
      exportedAt: new Date().toISOString(),
      settings: {
        ...DEFAULT_SETTINGS,
        ...saved,
        feeds: currentFeeds
      }
    };
    await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    showFeedbackAlert('¡Código copiado al portapapeles!');
  } catch (err) {
    alert('Error al copiar al portapapeles: ' + err.message);
  }
}

async function pasteConfigurationFromClipboard() {
  let text = '';
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      text = await navigator.clipboard.readText();
    }
  } catch {}

  if (!text || !text.includes('{')) {
    text = prompt('Pegá aquí el código JSON de tu respaldo BarRSS:');
  }

  if (!text) return;

  try {
    const parsed = JSON.parse(text.trim());
    const importedSettings = parsed.settings || parsed;

    if (!importedSettings || typeof importedSettings !== 'object') {
      throw new Error('El código ingresado no es válido.');
    }

    await applyImportedSettings(importedSettings);
    showFeedbackAlert('¡Configuración restaurada desde código!');
  } catch (err) {
    alert('No se pudo restaurar: ' + err.message);
  }
}

async function applyImportedSettings(importedSettings) {
  if (!importedSettings || Array.isArray(importedSettings) || typeof importedSettings !== 'object') throw new Error('Respaldo inválido.');
  const safe = {};
  for (const [key, value] of Object.entries(importedSettings)) {
    if (key === 'feeds') { safe.feeds = BarRSS.validateFeeds(value); continue; }
    if (!Object.hasOwn(DEFAULT_SETTINGS, key) || typeof value !== typeof DEFAULT_SETTINGS[key]) continue;
    if (typeof value === 'string' && (value.length > 200 || /[{};<>]/.test(value))) throw new Error('Preferencia inválida: ' + key);
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('Número inválido: ' + key);
    safe[key] = value;
  }
  if (!Object.keys(safe).length) throw new Error('El respaldo no contiene preferencias reconocidas.');
  await BarRSSSettings.set(safe);
  await loadSavedSettings();
  await broadcastSettingsToTabs(safe);
}

function exportOpml() {
  try {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<opml version="2.0">\n  <head>\n    <title>BarRSS Subscriptions</title>\n    <dateCreated>${new Date().toUTCString()}</dateCreated>\n  </head>\n  <body>\n`;

    const byCategory = {};
    currentFeeds.forEach(feed => {
      const cat = feed.category || 'Personalizados';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(feed);
    });

    for (const [catName, feedsList] of Object.entries(byCategory)) {
      xml += `    <outline text="${escapeXml(catName)}" title="${escapeXml(catName)}">\n`;
      feedsList.forEach(feed => {
        const title = escapeXml(feed.name || 'Canal RSS');
        const xmlUrl = escapeXml(feed.url || '');
        const htmlUrl = escapeXml(feed.domain ? `https://${feed.domain}` : '');
        xml += `      <outline type="rss" text="${title}" title="${title}" xmlUrl="${xmlUrl}" htmlUrl="${htmlUrl}"/>\n`;
      });
      xml += `    </outline>\n`;
    }

    xml += `  </body>\n</opml>`;

    const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barrss_subscriptions_${new Date().toISOString().slice(0, 10)}.opml`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    showFeedbackAlert('¡Canales exportados a archivo OPML!');
  } catch (err) {
    alert('Error exportando OPML: ' + err.message);
  }
}

function importOpmlFromFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const text = event.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');

      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('El archivo OPML/XML contiene errores de sintaxis.');
      }

      const outlines = xmlDoc.querySelectorAll('outline[xmlUrl], outline[url]');
      if (!outlines || outlines.length === 0) {
        throw new Error('No se encontraron canales RSS válidos dentro del archivo OPML.');
      }

      let importedCount = 0;
      outlines.forEach(outline => {
        const url = outline.getAttribute('xmlUrl') || outline.getAttribute('url');
        if (!url || !/^https?:\/\//i.test(url)) return;

        const name = outline.getAttribute('title') || outline.getAttribute('text') || 'Canal Importado';
        let category = 'Personalizados';

        const parentOutline = outline.parentElement?.closest('outline');
        if (parentOutline) {
          category = parentOutline.getAttribute('title') || parentOutline.getAttribute('text') || 'Personalizados';
        }

        let domain = '';
        try {
          domain = new URL(url).hostname.replace(/^www\./i, '');
        } catch {
          domain = '';
        }

        const exists = currentFeeds.some(f => f.url.toLowerCase() === url.toLowerCase());
        if (!exists) {
          currentFeeds.push({
            id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            name: name,
            category: category,
            lang: elements.languageSelect?.value || 'es',
            url: url,
            domain: domain,
            enabled: true,
            isCustom: true
          });
          importedCount++;
        }
      });

      if (importedCount === 0) {
        showFeedbackAlert('Todos los canales del OPML ya estaban en tu lista.');
      } else {
        renderFeedsList();
        triggerAutoSave();
        showFeedbackAlert(`¡Se importaron ${importedCount} canales RSS desde OPML!`);
      }
    } catch (err) {
      alert('Error al importar OPML: ' + err.message);
    } finally {
      if (elements.importOpmlFile) elements.importOpmlFile.value = '';
    }
  };
  reader.readAsText(file);
}

function escapeXml(unsafe) {
  return String(unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function applyTranslations(lang) {
  const t = I18N[lang] || I18N.es;
  const isEn = lang === 'en';

  if (elements.powerTitle) {
    elements.powerTitle.textContent = elements.barEnabled?.checked ? t.powerTitleActive : t.powerTitleInactive;
  }
  if (elements.powerDesc) {
    elements.powerDesc.textContent = elements.barEnabled?.checked ? t.powerDescActive : t.powerDescInactive;
  }

  const btnTut = document.getElementById('btnTutorialLabel');
  if (btnTut) btnTut.textContent = t.btnTutorial;

  const readerBtn = document.querySelector('#btnOpenReader span');
  if (readerBtn) readerBtn.textContent = t.btnReader;

  const sidepanelBtn = document.querySelector('#btnOpenSidePanel span');
  if (sidepanelBtn) sidepanelBtn.textContent = t.btnSidepanel;

  const optAll = document.querySelector('#categoryFilterSelect option[value="all"]');
  if (optAll) optAll.textContent = t.filterAll;

  if (elements.btnSelectAllFeeds) elements.btnSelectAllFeeds.textContent = t.btnAll;
  if (elements.btnDeselectAllFeeds) elements.btnDeselectAllFeeds.textContent = t.btnNone;

  if (elements.customFeedName) elements.customFeedName.placeholder = t.namePlaceholder;
  if (elements.customFeedUrl) elements.customFeedUrl.placeholder = t.urlPlaceholder;
  if (elements.btnAddCustomFeed) elements.btnAddCustomFeed.textContent = t.btnAddFeedBtn;

  const titleOpml = document.getElementById('titleOpmlSection');
  if (titleOpml) titleOpml.textContent = isEn ? '📡 RSS Standard Format (.opml)' : '📡 Formato Estándar RSS (.opml)';

  const labelImportOpml = document.getElementById('labelImportOpml');
  if (labelImportOpml) labelImportOpml.textContent = t.importOpmlText;

  const labelExportOpml = document.getElementById('labelExportOpml');
  if (labelExportOpml) labelExportOpml.textContent = t.exportOpmlText;

  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    const tabId = tab.getAttribute('data-tab');
    if (tabId === 'tab-feeds') tab.textContent = t.tabFeeds;
    else if (tabId === 'tab-bar' || tabId === 'tab-style') tab.textContent = t.tabBar;
    else if (tabId === 'tab-backup') tab.textContent = t.tabBackup;
    else if (tabId === 'tab-tutorial') tab.textContent = t.tabTutorial;
  });
}

function promptAddEnglishFeeds() {
  const hasEnglish = currentFeeds.some(f => f.lang === 'en');
  if (hasEnglish) return;

  const conf = confirm(
    'English Pack Available / Paquete en inglés:\n\n' +
    'Would you like to add popular English news channels (BBC News, The Verge, TechCrunch, Reuters)?\n' +
    '¿Deseás agregar estos canales populares en inglés?'
  );

  if (conf) {
    POPULAR_ENGLISH_FEEDS.forEach(ef => {
      if (!currentFeeds.some(f => f.url === ef.url)) {
        currentFeeds.push({ ...ef });
      }
    });
    renderFeedsList();
    triggerAutoSave();
    showFeedbackAlert('Popular English feeds added!');
  }
}

async function broadcastSettingsToTabs(newSettings) {
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'UPDATE_SETTINGS',
          settings: newSettings
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.warn('[BarRSS] Error notificando pestañas:', err);
  }
}

function showFeedbackAlert(msg) {
  const span = elements.saveAlert.querySelector('span');
  const originalText = span ? span.textContent : '¡Cambios guardados!';
  if (span && msg) span.textContent = msg;

  elements.saveAlert.style.display = 'flex';
  setTimeout(() => {
    elements.saveAlert.style.display = 'none';
    if (span) span.textContent = originalText;
  }, 2500);
}

function addCustomFeed() {
  let name = elements.customFeedName.value.trim();
  let url = elements.customFeedUrl.value.trim();
  let category = elements.customFeedCategory ? elements.customFeedCategory.value : 'Personalizados';

  // 🔴 Detector inteligente de Reddit: soporta 'r/sub', 'reddit.com/r/sub', etc.
  const redditMatch = url.match(/^(?:https?:\/\/(?:www\.)?reddit\.com\/)?r\/([a-zA-Z0-9_+]+)(?:\/(?:top|new|hot))?(?:\/.*)?$/i);
  if (redditMatch) {
    const subName = redditMatch[1];
    if (!url.includes('.rss')) {
      if (url.includes('/top')) {
        url = `https://www.reddit.com/r/${subName}/top/.rss?t=day`;
      } else if (url.includes('/new')) {
        url = `https://www.reddit.com/r/${subName}/new/.rss`;
      } else {
        url = `https://www.reddit.com/r/${subName}/.rss`;
      }
    }
    if (!name) {
      name = `Reddit - r/${subName}`;
    }
    if (category === 'Personalizados' || !category) {
      category = '🔴 Reddit & Comunidades';
    }
  }

  if (!name) {
    alert('Por favor, ingresá un nombre identificador para el canal (ej: Mi Diario o r/argentina).');
    elements.customFeedName.focus();
    return;
  }

  if (!url || !/^https?:\/\/.+/i.test(url)) {
    alert('Por favor, ingresá una URL válida de feed RSS (ej: https://sitio.com/rss) o un atajo de Reddit (ej: r/argentina).');
    elements.customFeedUrl.focus();
    return;
  }

  // 🛡️ DEDUPLICACIÓN: Comprobar si el canal ya existe en la lista
  const normNewUrl = normalizeFeedUrl(url);
  const isDuplicate = currentFeeds.some(f => normalizeFeedUrl(f.url) === normNewUrl);
  if (isDuplicate) {
    alert('⚠️ Este canal RSS ya existe en tu lista. No se permiten canales duplicados.');
    elements.customFeedUrl.focus();
    return;
  }

  let domain = '';
  try {
    domain = new URL(url).hostname.replace(/^www\./i, '');
  } catch {
    domain = '';
  }

  const newFeed = {
    id: `custom_${Date.now()}`,
    name: name,
    category: category,
    lang: elements.feedLanguageSelect ? elements.feedLanguageSelect.value : 'es',
    url: url,
    domain: domain,
    enabled: true,
    isCustom: true
  };

  currentFeeds.push(newFeed);
  elements.customFeedName.value = '';
  elements.customFeedUrl.value = '';

  renderFeedsList();
  elements.feedsListContainer.scrollTop = elements.feedsListContainer.scrollHeight;
  triggerAutoSave();
  showFeedbackAlert(`¡Canal "${name}" agregado!`);
}

function normalizeFeedUrl(u) { return BarRSS.normalizeFeedUrl(u); }

let autoSaveDebounceTimer = null;

function triggerAutoSave() {
  if (elements.autoSaveIndicator) {
    elements.autoSaveIndicator.textContent = '⏳ Guardando...';
    elements.autoSaveIndicator.classList.add('saving');
  }
  clearTimeout(autoSaveDebounceTimer);
  autoSaveDebounceTimer = setTimeout(() => {
    saveAndApplySettings(true);
  }, 180);
}

async function saveAndApplySettings(isAutoSave = false) {
  const selectedPosition = document.querySelector('input[name="barPosition"]:checked')?.value || 'bottom';
  const selectedDisplayMode = document.querySelector('input[name="displayMode"]:checked')?.value || 'always';

  const newSettings = {
    enabled: elements.barEnabled.checked,
    adaptiveTheme: elements.adaptiveTheme.checked,
    pushPageContent: elements.pushPageContent.checked,
    autoHideOnScroll: elements.autoHideOnScroll ? elements.autoHideOnScroll.checked : false,
    rssDiscoveryEnabled: elements.rssDiscoveryEnabled ? elements.rssDiscoveryEnabled.checked : true,
    displayMode: selectedDisplayMode,
    position: selectedPosition,
    speed: elements.speedSelect.value,
    backgroundColor: elements.bgColor.value,
    backgroundOpacity: parseInt(elements.bgOpacity.value, 10),
    textColor: elements.textColor.value,
    linkColor: elements.linkColor.value,
    fontFamily: elements.fontFamilySelect.value,
    fontSize: parseInt(elements.fontSizeRange.value, 10),
    readerOpenMode: elements.modeTab && elements.modeTab.checked ? 'tab' : 'window',
    refreshIntervalMinutes: elements.refreshIntervalSelect ? parseInt(elements.refreshIntervalSelect.value, 10) : 5,
    feeds: currentFeeds,
    onboardingSeen: true
  };

  // 1. Guardar en chrome.storage.sync
  await BarRSSSettings.set(newSettings);

  // 2. Transmitir en tiempo real a las pestañas
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'UPDATE_SETTINGS',
          settings: newSettings
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.warn('[BarRSS] Error transmitiendo ajustes:', err);
  }

  if (elements.autoSaveIndicator) {
    elements.autoSaveIndicator.textContent = '✓ Guardado';
    elements.autoSaveIndicator.classList.remove('saving');
  }

  if (!isAutoSave) {
    showFeedbackAlert('¡Configuración guardada y aplicada!');
  }
}

function updateBarToggleUI(isEnabled) {
  if (elements.barEnabled) {
    elements.barEnabled.checked = !!isEnabled;
  }
  if (elements.masterPowerCard) {
    elements.masterPowerCard.classList.toggle('active-card', !!isEnabled);
  }
  if (elements.powerIndicator) {
    elements.powerIndicator.textContent = isEnabled ? '🟢' : '⚪';
  }
  if (elements.powerTitle) {
    elements.powerTitle.textContent = isEnabled ? 'Barra Flotante Activa' : 'Barra Flotante Desactivada';
  }
  if (elements.powerDesc) {
    elements.powerDesc.textContent = isEnabled ? 'Visible sobre las páginas que navegás' : 'Oculta en todas las páginas web';
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

// Sincronización en vivo si se desactiva la barra desde otra pestaña o desde el botón cerrar
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.enabled !== undefined) {
    updateBarToggleUI(changes.enabled.newValue);
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.feeds) {
    currentFeeds = changes.feeds.newValue || [];
    renderFeedsList();
  }
});
