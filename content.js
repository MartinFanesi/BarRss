/**
 * BarRSS - Content Script con Shadow DOM, Modo Adaptativo & Control de Offset
 * 
 * - Cierre de barra robusto: sincroniza estado global, limpia el DOM y ofrece opción Deshacer.
 * - Preservación de transform originales de las páginas web (evita romper Infobae, X.com, etc.).
 * - Velocidad calibrada con requestAnimationFrame para precisión exacta en píxeles.
 * - Desplazamiento inteligente de headers y navbars fijos.
 */

(function () {
  if (window !== window.top) return;
  if (document.getElementById('barrss-root-host')) return;

  // Protección de privacidad: no inyectar en plataformas de correo o autenticación
  const SENSITIVE_DOMAINS = [
    'mail.google.com',
    'outlook.live.com',
    'outlook.office.com',
    'outlook.office365.com',
    'mail.yahoo.com',
    'accounts.google.com',
    'login.live.com'
  ];
  if (SENSITIVE_DOMAINS.some(d => window.location.hostname === d || window.location.hostname.endsWith('.' + d))) {
    return;
  }

  const DEFAULT_FEEDS = getDefaultFeedsForCountry('Argentina');

  const DEFAULT_SETTINGS = {
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
    feeds: DEFAULT_FEEDS,
    language: 'es'
  };

  const BAR_HEIGHT = 38;
  const PAGE_OFFSET_STYLE_ID = 'barrss-page-offset-style';

  let currentSettings = { ...DEFAULT_SETTINGS };
  let shadowRoot = null;
  let hostElement = null;
  let barContainerEl = null;
  let restorePillEl = null;
  let channelsPopoverEl = null;
  let isPopoverOpen = false;
  let isPausedManually = false;
  let isMinimized = false;
  let isMouseOverBar = false;
  let currentNewsItems = [];
  let themeObserver = null;
  let fixedElementsObserver = null;

  function hexToRgba(hex, opacity) {
    let cleanHex = hex.replace('#', '').trim();
    if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
    const r = parseInt(cleanHex.substring(0, 2), 16) || 15;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 23;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 42;
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(100, opacity)) / 100})`;
  }

  /**
   * Duración pausada calculada con precisión
   */
  function calculateAnimationDuration(itemCount) {
    const track = shadowRoot ? shadowRoot.getElementById('barrss-track') : null;
    const count = Math.max(itemCount || 10, 5);

    if (track && track.scrollWidth > 100) {
      const singleTrackWidth = track.scrollWidth / 2;
      let pxPerSec = 50; // normal
      if (currentSettings.speed === 'slow') pxPerSec = 28; // súper pausado
      if (currentSettings.speed === 'fast') pxPerSec = 75; // moderado
      return Math.max(Math.round(singleTrackWidth / pxPerSec), 35);
    }

    let secPerItem = 10;
    if (currentSettings.speed === 'slow') secPerItem = 16;
    if (currentSettings.speed === 'fast') secPerItem = 6.5;

    return Math.max(Math.round(count * secPerItem), 35);
  }

  function parseColorToRgb(str) {
    if (!str || typeof str !== 'string') return null;
    const clean = str.trim();

    if (clean === 'transparent' || clean === 'rgba(0, 0, 0, 0)') {
      return { r: 0, g: 0, b: 0, a: 0, luminance: 0, isTransparent: true };
    }

    const rgbMatch = clean.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
      const isTransparent = a === 0;
      const luminance = ((r * 299) + (g * 587) + (b * 114)) / 1000 / 255;
      return { r, g, b, a, luminance, isTransparent };
    }

    if (clean.startsWith('#')) {
      let hex = clean.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      if (hex.length >= 6) {
        const r = parseInt(hex.substring(0, 2), 16) || 0;
        const g = parseInt(hex.substring(2, 4), 16) || 0;
        const b = parseInt(hex.substring(4, 6), 16) || 0;
        const luminance = ((r * 299) + (g * 587) + (b * 114)) / 1000 / 255;
        return { r, g, b, a: 1, luminance, isTransparent: false };
      }
    }

    return null;
  }

  function detectSiteTheme() {
    let detectedBg = null;

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      const content = metaTheme.getAttribute('content');
      if (content) detectedBg = parseColorToRgb(content);
    }

    if (!detectedBg || detectedBg.isTransparent) {
      const candidates = [
        document.querySelector('header'),
        document.querySelector('nav'),
        document.body,
        document.documentElement
      ];

      for (const el of candidates) {
        if (!el) continue;
        const bg = window.getComputedStyle(el).backgroundColor;
        const parsed = parseColorToRgb(bg);
        if (parsed && !parsed.isTransparent) {
          detectedBg = parsed;
          break;
        }
      }
    }

    let isDark = false;
    if (!detectedBg || detectedBg.isTransparent) {
      const bodyColor = window.getComputedStyle(document.body || document.documentElement).color;
      const textRgb = parseColorToRgb(bodyColor);
      if (textRgb && !textRgb.isTransparent) {
        isDark = textRgb.luminance > 0.5;
      } else {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } else {
      isDark = detectedBg.luminance < 0.5;
    }

    if (isDark) {
      return {
        isDark: true,
        bgColor: detectedBg && !detectedBg.isTransparent
          ? `rgba(${Math.max(12, detectedBg.r - 8)}, ${Math.max(18, detectedBg.g - 8)}, ${Math.max(28, detectedBg.b - 8)}, 0.95)`
          : 'rgba(15, 23, 42, 0.95)',
        textColor: '#f8fafc',
        linkColor: '#38bdf8',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        itemBadgeBg: 'rgba(255, 255, 255, 0.12)'
      };
    } else {
      return {
        isDark: false,
        bgColor: detectedBg && !detectedBg.isTransparent
          ? `rgba(${Math.min(255, detectedBg.r + 5)}, ${Math.min(255, detectedBg.g + 5)}, ${Math.min(255, detectedBg.b + 5)}, 0.96)`
          : 'rgba(255, 255, 255, 0.96)',
        textColor: '#0f172a',
        linkColor: '#0284c7',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        itemBadgeBg: 'rgba(0, 0, 0, 0.08)'
      };
    }
  }

  /**
   * Empuja la web sin romper estilos originales
   */
  function updatePageOffset(enable) {
    let styleEl = document.getElementById(PAGE_OFFSET_STYLE_ID);

    const shouldOffset = enable && 
                         currentSettings.enabled && 
                         currentSettings.pushPageContent && 
                         !isMinimized &&
                         currentSettings.displayMode !== 'hover' &&
                         currentSettings.displayMode !== 'pill';

    if (!shouldOffset) {
      if (styleEl) styleEl.remove();
      restoreFixedElements();
      if (fixedElementsObserver) {
        fixedElementsObserver.disconnect();
        fixedElementsObserver = null;
      }
      return;
    }

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = PAGE_OFFSET_STYLE_ID;
      (document.head || document.documentElement).appendChild(styleEl);
    }

    const isTop = currentSettings.position === 'top';

    if (isTop) {
      styleEl.textContent = `
        html {
          margin-top: ${BAR_HEIGHT}px !important;
          transition: margin-top 0.2s ease !important;
        }
        body {
          position: relative !important;
        }
        /* Compatibilidad con SPAs como Reddit */
        shreddit-app, [id="main-content"], main {
          margin-top: ${BAR_HEIGHT}px !important;
        }
      `;
    } else {
      styleEl.textContent = `
        html {
          margin-bottom: ${BAR_HEIGHT}px !important;
          transition: margin-bottom 0.2s ease !important;
        }
        body {
          position: relative !important;
        }
        /* Eleva barras inferiores de Twitter/X y Reddit de forma nativa sin romper React */
        [data-testid="BottomBar"], [data-testid="DMDrawer"], shreddit-async-loader {
          bottom: ${BAR_HEIGHT}px !important;
        }
        shreddit-app, [id="main-content"], main {
          margin-bottom: ${BAR_HEIGHT}px !important;
        }
      `;
    }

    shiftFixedElements();
    setupFixedElementsObserver();
  }

  /**
   * Desplaza elementos fijos pegados al top o al bottom,
   * con exclusiones estrictas para contenedores y SPAs complejas como X.com (Twitter).
   */
  function shiftFixedElements() {
    if (!currentSettings.pushPageContent || isMinimized || !hostElement) return;

    const isBottom = currentSettings.position === 'bottom';
    const shiftY = isBottom ? -BAR_HEIGHT : BAR_HEIGHT;

    // Solo selectores de elementos de navegación o botones flotantes individuales
    const selectors = [
      'header', 'nav', '[role="banner"]',
      'reddit-header-large', 'shreddit-header',
      '[class*="navbar" i]', '[class*="sticky" i]',
      'button[aria-label*="top" i]', 'button[title*="top" i]', '[class*="back-to-top" i]'
    ];

    const candidateSet = new Set(document.querySelectorAll(selectors.join(',')));

    // Si está en el fondo, buscar botones flotantes pequeños (chat widgets, FABs)
    if (isBottom) {
      document.querySelectorAll('[aria-label*="chat" i], [class*="fab" i], [class*="floating" i]').forEach(el => candidateSet.add(el));
    }

    candidateSet.forEach(el => {
      if (el.closest('#barrss-root-host')) return;

      // NUNCA alterar contenedores de página, columnas o raíces de SPAs (Twitter/X, React, Next.js)
      if (el.id === 'react-root' || el.id === 'app' || el.id === '__next' || el.tagName === 'MAIN') return;
      if (el.getAttribute('data-testid')?.includes('primaryColumn')) return;

      const style = window.getComputedStyle(el);
      const isFixedOrSticky = style.position === 'fixed' || style.position === 'sticky';
      if (!isFixedOrSticky) return;

      const rect = el.getBoundingClientRect();
      if (rect.height <= 0) return;

      // NUNCA alterar elementos anchos/altos que son columnas o wrappers
      if (rect.width > 420 && rect.height > 80) return;

      let shouldShift = false;

      if (isBottom) {
        const distFromBottom = window.innerHeight - rect.bottom;
        const hasBottomStyle = parseInt(style.bottom, 10) <= 45;
        if ((distFromBottom <= 45 || hasBottomStyle) && rect.height < 150) {
          shouldShift = true;
        }
      } else {
        if (rect.top <= 15 && rect.height < 150) {
          shouldShift = true;
        }
      }

      if (shouldShift) {
        if (el.dataset.barrssOrigTransform === undefined) {
          el.dataset.barrssOrigTransform = el.style.transform || '';
        }
        el.classList.add('barrss-shifted-element');

        const baseTransform = el.dataset.barrssOrigTransform.replace(/translateY\([^)]+\)/g, '').trim();
        const newTransform = baseTransform ? `${baseTransform} translateY(${shiftY}px)` : `translateY(${shiftY}px)`;
        el.style.setProperty('transform', newTransform, 'important');
        el.style.setProperty('transition', 'transform 0.2s ease', 'important');
      }
    });
  }

  /**
   * Restaura transform original de cada elemento sin alterar nada más
   */
  function restoreFixedElements() {
    document.querySelectorAll('.barrss-shifted-element').forEach(el => {
      if (el.dataset.barrssOrigTransform !== undefined) {
        if (el.dataset.barrssOrigTransform) {
          el.style.transform = el.dataset.barrssOrigTransform;
        } else {
          el.style.removeProperty('transform');
        }
        delete el.dataset.barrssOrigTransform;
      } else {
        el.style.removeProperty('transform');
      }
      el.style.removeProperty('transition');
      el.classList.remove('barrss-shifted-element');
    });
  }

  function setupFixedElementsObserver() {
    if (fixedElementsObserver) return;

    let debounceTimer = null;
    fixedElementsObserver = new MutationObserver(() => {
      if (currentSettings.pushPageContent && !isMinimized && hostElement) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          shiftFixedElements();
        }, 150);
      }
    });

    fixedElementsObserver.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });

    window.addEventListener('resize', () => {
      if (currentSettings.pushPageContent && !isMinimized && hostElement) {
        shiftFixedElements();
      }
    }, { passive: true });
  }

  function setupThemeObserver() {
    if (themeObserver) themeObserver.disconnect();
    if (!currentSettings.adaptiveTheme) return;

    themeObserver = new MutationObserver(() => {
      if (currentSettings.adaptiveTheme && hostElement && shadowRoot) {
        applyCustomStyles();
      }
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style']
    });

    if (document.body) {
      themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class', 'data-theme', 'style']
      });
    }
  }

  async function init() {
    try {
      const saved = await BarRSSSettings.get(DEFAULT_SETTINGS);
      currentSettings = { ...DEFAULT_SETTINGS, ...saved };

      if (!Array.isArray(currentSettings.feeds)) {
        currentSettings.feeds = DEFAULT_FEEDS;
      }

      // 📡 El testigo de autodescubrimiento RSS se activa SIEMPRE en cualquier web compatible
      if (currentSettings.rssDiscoveryEnabled !== false) {
        setTimeout(checkPageForRssFeeds, 1000);
        // Soporte para SPAs / cambios de ruta dinámicos (Reddit, YouTube, etc.)
        window.addEventListener('popstate', () => setTimeout(checkPageForRssFeeds, 1200));
      }

      // Si la barra flotante está desactivada, no creamos la marquesina
      if (!currentSettings.enabled) {
        updatePageOffset(false);
        return;
      }

      createBar();
      loadActiveFeedsNews();
      setupThemeObserver();
      setupScrollListener();
      setupHoverPeekListener();
    } catch (err) {
      console.warn('[BarRSS] Error al inicializar:', err);
    }
  }

  function createBar() {
    const existing = document.getElementById('barrss-root-host');
    if (existing) {
      existing.remove();
    }

    hostElement = document.createElement('div');
    hostElement.id = 'barrss-root-host';
    const modeClass = currentSettings.displayMode === 'hover' ? 'barrss-mode-hover' : '';
    hostElement.className = `barrss-pos-${currentSettings.position} ${modeClass}`.trim();

    shadowRoot = hostElement.attachShadow({ mode: 'open' });
    shadowRoot.addEventListener('error', event => {
      if (event.target.tagName !== 'IMG') return;
      event.target.hidden = true;
      const fallback = event.target.nextElementSibling;
      if (fallback?.classList.contains('barrss-rss-fallback')) fallback.style.display = 'inline-flex';
    }, true);

    const styleTag = document.createElement('style');
    styleTag.id = 'barrss-dynamic-styles';
    styleTag.textContent = getShadowStyles();
    shadowRoot.appendChild(styleTag);

    // Trigger de borde para modo hover
    const edgeTrigger = document.createElement('div');
    edgeTrigger.id = 'barrss-edge-trigger';
    edgeTrigger.className = 'barrss-edge-trigger';
    shadowRoot.appendChild(edgeTrigger);

    barContainerEl = document.createElement('div');
    const barContainer = barContainerEl;
    barContainer.id = 'barrss-container';
    barContainer.className = 'barrss-container';

    edgeTrigger.addEventListener('mouseenter', () => {
      if (currentSettings.displayMode === 'hover') {
        barContainer.classList.add('barrss-peek-visible');
      }
    });

    barContainer.addEventListener('mouseenter', () => {
      isMouseOverBar = true;
      if (currentSettings.displayMode === 'hover') {
        barContainer.classList.add('barrss-peek-visible');
      }
    });

    barContainer.addEventListener('mouseleave', () => {
      isMouseOverBar = false;
      if (currentSettings.displayMode === 'hover') {
        setTimeout(() => {
          if (!isMouseOverBar) {
            barContainer.classList.remove('barrss-peek-visible');
          }
        }, 350);
      }
    });

    // Badge
    const badge = document.createElement('div');
    badge.className = 'barrss-badge';
    badge.id = 'barrss-badge';
    badge.title = 'Hacé clic para ver y activar/desactivar canales';
    badge.innerHTML = `
      <svg viewBox="0 0 24 24">
        <circle cx="6.18" cy="17.82" r="2.18"/>
        <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.46-4.44-9.9-9.9-9.9z"/>
      </svg>
      <span id="barrss-badge-text">NOTICIAS</span>
      <svg class="barrss-badge-arrow" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
    `;
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChannelsPopover();
    });
    barContainer.appendChild(badge);

    // Viewport
    const viewport = document.createElement('div');
    viewport.className = 'barrss-viewport';
    viewport.id = 'barrss-viewport';

    const track = document.createElement('div');
    track.className = 'barrss-track';
    track.id = 'barrss-track';
    track.innerHTML = `
      <div class="barrss-status">
        <span class="barrss-spinner"></span>
        <span>Cargando noticias de tus canales RSS...</span>
      </div>
    `;
    viewport.appendChild(track);
    barContainer.appendChild(viewport);

    // Controles
    const controls = document.createElement('div');
    controls.className = 'barrss-controls';

    // Botón Pausa
    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'barrss-btn';
    pauseBtn.id = 'barrss-btn-pause';
    pauseBtn.title = 'Pausar / Reanudar marquesina';
    pauseBtn.innerHTML = `
      <svg id="barrss-icon-pause" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      <svg id="barrss-icon-play" viewBox="0 0 24 24" style="display: none;"><path d="M8 5v14l11-7z"/></svg>
    `;
    pauseBtn.addEventListener('click', togglePause);
    controls.appendChild(pauseBtn);

    // Botón Recargar
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'barrss-btn';
    refreshBtn.id = 'barrss-btn-refresh';
    refreshBtn.title = 'Actualizar noticias';
    refreshBtn.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
    `;
    refreshBtn.addEventListener('click', () => loadActiveFeedsNews(true));
    controls.appendChild(refreshBtn);

    // Botón Cambiar Posición (Arriba / Abajo) con 1 Clic
    const flipPosBtn = document.createElement('button');
    flipPosBtn.className = 'barrss-btn';
    flipPosBtn.id = 'barrss-btn-flip-pos';
    flipPosBtn.title = 'Cambiar posición (Arriba / Abajo) con 1 clic';
    flipPosBtn.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/></svg>
    `;
    flipPosBtn.addEventListener('click', togglePositionQuickly);
    controls.appendChild(flipPosBtn);

    // Botón Modo Diario (Lector Web estilo periódico)
    const readerBtn = document.createElement('button');
    readerBtn.className = 'barrss-btn barrss-btn-reader';
    readerBtn.id = 'barrss-btn-reader';
    readerBtn.title = 'Abrir Modo Diario (Lector web editorial estilo periódico)';
    readerBtn.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
    `;
    readerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chrome.runtime.sendMessage({ action: 'OPEN_READER' });
    });
    controls.appendChild(readerBtn);

    // Botón Menú / Configuración de BarRSS
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'barrss-btn';
    settingsBtn.id = 'barrss-btn-menu';
    settingsBtn.title = 'Abrir menú de configuración y panel de BarRSS';
    settingsBtn.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
    `;
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chrome.runtime.sendMessage({ action: 'OPEN_MENU' });
    });
    controls.appendChild(settingsBtn);

    // Botón Minimizar
    const minimizeBtn = document.createElement('button');
    minimizeBtn.className = 'barrss-btn';
    minimizeBtn.id = 'barrss-btn-min';
    minimizeBtn.title = 'Minimizar a píldora en la esquina';
    minimizeBtn.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>
    `;
    minimizeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMinimize(e);
    });
    controls.appendChild(minimizeBtn);

    // Botón Cerrar (✕)
    const closeBtn = document.createElement('button');
    closeBtn.className = 'barrss-btn barrss-btn-close';
    closeBtn.id = 'barrss-btn-close';
    closeBtn.title = 'Cerrar y desactivar barra de noticias';
    closeBtn.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    `;
    closeBtn.addEventListener('click', closeBarPermanently);
    controls.appendChild(closeBtn);

    barContainer.appendChild(controls);
    shadowRoot.appendChild(barContainer);

    // Píldora para restaurar
    restorePillEl = document.createElement('button');
    const restorePill = restorePillEl;
    restorePill.id = 'barrss-restore-pill';
    restorePill.className = 'barrss-minimized-toggle';
    restorePill.title = 'Restaurar la barra de noticias BarRSS';
    restorePill.innerHTML = `
      <svg viewBox="0 0 24 24">
        <circle cx="6.18" cy="17.82" r="2.18"/>
        <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.46-4.44-9.9-9.9-9.9z"/>
      </svg>
      <span>Mostrar BarRSS</span>
    `;
    restorePill.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMinimize(e);
    });
    shadowRoot.appendChild(restorePill);

    (document.documentElement || document.body).appendChild(hostElement);

    // Cerrar el popover al hacer clic fuera o presionar Escape
    document.addEventListener('click', (e) => {
      if (isPopoverOpen && !hostElement?.contains(e.target)) {
        hideChannelsPopover();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isPopoverOpen) {
        hideChannelsPopover();
      }
    });

    shadowRoot.addEventListener('click', (e) => {
      if (isPopoverOpen && channelsPopoverEl && !channelsPopoverEl.contains(e.target) && !badge.contains(e.target)) {
        hideChannelsPopover();
      }
    });

    updatePageOffset(true);
    applyCustomStyles();
  }

  /**
   * Cierra y desactiva la barra de forma limpia y sincronizada
   */
  async function closeBarPermanently(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    hideChannelsPopover();
    updatePageOffset(false);

    if (hostElement) {
      hostElement.remove();
      hostElement = null;
      shadowRoot = null;
      barContainerEl = null;
      restorePillEl = null;
      channelsPopoverEl = null;
      isPopoverOpen = false;
    }

    const domHost = document.getElementById('barrss-root-host');
    if (domHost) domHost.remove();

    if (themeObserver) themeObserver.disconnect();
    if (fixedElementsObserver) fixedElementsObserver.disconnect();

    currentSettings.enabled = false;
    isMinimized = false;

    // Actualizar configuración global
    try {
      await BarRSSSettings.set({ enabled: false });
      showUndoToast();
    } catch (err) {
      console.warn('[BarRSS] Error al guardar estado desactivado:', err);
    }
  }

  /**
   * Notificación flotante con opción Deshacer
   */
  function showUndoToast() {
    const existingToast = document.getElementById('barrss-undo-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'barrss-undo-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #0f172a;
      color: #f8fafc;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.15);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 12px;
      animation: barrssFadeIn 0.2s ease;
    `;

    toast.innerHTML = `
      <span>BarRSS desactivada.</span>
      <button id="barrss-btn-undo" style="background:#f97316; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-weight:700; cursor:pointer; font-size:11px;">
        Deshacer
      </button>
    `;

    document.body.appendChild(toast);

    const undoBtn = document.getElementById('barrss-btn-undo');
    if (undoBtn) {
      undoBtn.addEventListener('click', async () => {
        toast.remove();
        await BarRSSSettings.set({ enabled: true });
        init();
      });
    }

    setTimeout(() => {
      if (toast && toast.parentNode) toast.remove();
    }, 4000);
  }

  async function loadActiveFeedsNews(forceRefresh = false) {
    if (!shadowRoot) return;

    const track = shadowRoot.getElementById('barrss-track');
    const badgeText = shadowRoot.getElementById('barrss-badge-text');

    const activeFeeds = (currentSettings.feeds || []).filter(f => f.enabled);

    if (activeFeeds.length === 0) {
      if (track) {
        track.style.animationName = 'none';
        track.innerHTML = `
          <div class="barrss-status" style="color: #fca5a5;">
            <span>⚠️ No tenés ningún canal RSS seleccionado. Abrí el menú de BarRSS para activar feeds.</span>
          </div>
        `;
      }
      return;
    }

    if (badgeText) {
      badgeText.textContent = activeFeeds.length === 1 
        ? activeFeeds[0].name.toUpperCase() 
        : `${activeFeeds.length} CANALES`;
    }

    if (track) {
      track.style.animationName = 'none';
      track.innerHTML = `
        <div class="barrss-status">
          <span class="barrss-spinner"></span>
          <span>Actualizando noticias (${activeFeeds.length} canales)...</span>
        </div>
      `;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'FETCH_MULTIPLE_RSS',
        feeds: activeFeeds,
        forceRefresh: forceRefresh
      });

      if (!response || !response.success || !response.items || response.items.length === 0) {
        throw new Error(response?.error || 'No se recibieron titulares de los canales seleccionados.');
      }

      currentNewsItems = response.items;
      renderNewsItems(currentNewsItems);
    } catch (error) {
      console.warn('[BarRSS] Error cargando noticias:', error);
      if (track) {
        track.style.animationName = 'none';
        track.innerHTML = `
          <div class="barrss-status" style="color: #f87171;">
            <span>⚠️ ${escapeHtml(error.message || 'Error al conectar con los canales')}</span>
            <button class="barrss-btn" id="barrss-retry-btn" style="width:auto; padding:2px 8px; font-size:11px; background:rgba(255,255,255,0.15);">
              Reintentar
            </button>
          </div>
        `;
        const retryBtn = shadowRoot.getElementById('barrss-retry-btn');
        if (retryBtn) retryBtn.addEventListener('click', () => loadActiveFeedsNews(true));
      }
    }
  }

  function renderNewsItems(items) {
    if (!shadowRoot) return;
    const track = shadowRoot.getElementById('barrss-track');
    if (!track) return;

    const groupHtml = items.map(item => `
      <div class="barrss-item">
        <span class="barrss-source-badge">
          ${item.faviconUrl ? `
            <img 
              src="${escapeHtml(item.faviconUrl)}" 
              class="barrss-favicon" 
              alt=""
              loading="lazy"
            />
          ` : ''}
          <span class="barrss-rss-fallback" style="${item.faviconUrl ? 'display: none;' : 'display: inline-flex;'}">
            <svg viewBox="0 0 24 24"><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.46-4.44-9.9-9.9-9.9z"/></svg>
          </span>
          <span class="barrss-source-name">${escapeHtml(item.feedName)}</span>
        </span>

        <a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="barrss-link">
          ${escapeHtml(item.title)}
        </a>

        <span class="barrss-separator">●</span>
      </div>
    `).join('');

    track.innerHTML = `
      <div class="barrss-group">${groupHtml}</div>
      <div class="barrss-group">${groupHtml}</div>
    `;

    // Medición exacta después de la renderización del DOM
    requestAnimationFrame(() => {
      const duration = calculateAnimationDuration(items.length);
      track.style.animationDuration = `${duration}s`;
      track.style.animationName = 'barrss-ticker-scroll';
      track.style.animationPlayState = isPausedManually ? 'paused' : 'running';
    });
  }

  function togglePause() {
    isPausedManually = !isPausedManually;
    if (!shadowRoot) return;

    const track = shadowRoot.getElementById('barrss-track');
    const iconPause = shadowRoot.getElementById('barrss-icon-pause');
    const iconPlay = shadowRoot.getElementById('barrss-icon-play');

    if (track) track.style.animationPlayState = isPausedManually ? 'paused' : 'running';
    if (iconPause && iconPlay) {
      iconPause.style.display = isPausedManually ? 'none' : 'block';
      iconPlay.style.display = isPausedManually ? 'block' : 'none';
    }
  }

  async function togglePositionQuickly(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newPos = currentSettings.position === 'top' ? 'bottom' : 'top';
    currentSettings.position = newPos;

    if (hostElement) {
      hostElement.classList.remove('barrss-pos-top', 'barrss-pos-bottom');
      hostElement.classList.add(`barrss-pos-${newPos}`);
    }

    updatePageOffset(true);
    await BarRSSSettings.set({ position: newPos });
  }

  function setupScrollListener() {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (!currentSettings.autoHideOnScroll || isMinimized || !barContainerEl) return;
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 60) {
        barContainerEl.classList.add('barrss-scroll-hidden');
      } else if (currentY < lastY) {
        barContainerEl.classList.remove('barrss-scroll-hidden');
      }
      lastY = currentY;
    }, { passive: true });
  }

  function setupHoverPeekListener() {
    window.addEventListener('mousemove', (e) => {
      if (currentSettings.displayMode !== 'hover' || isMinimized || !barContainerEl) return;
      const isBottom = currentSettings.position === 'bottom';
      const distFromEdge = isBottom ? (window.innerHeight - e.clientY) : e.clientY;
      if (distFromEdge <= 28) {
        barContainerEl.classList.add('barrss-peek-visible');
      } else if (distFromEdge > 55 && !isMouseOverBar) {
        barContainerEl.classList.remove('barrss-peek-visible');
      }
    }, { passive: true });
  }

  function checkPageForRssFeeds() {
    if (currentSettings.rssDiscoveryEnabled === false) return;
    const hostname = window.location.hostname;
    if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return;

    if (sessionStorage.getItem(`barrss_dismissed_${hostname}`)) return;

    let feedUrl = '';
    let siteName = '';

    // 1. Detección nativa para Reddit (/r/sub)
    if (hostname.includes('reddit.com')) {
      const subMatch = window.location.pathname.match(/^\/r\/([a-zA-Z0-9_+]+)/i);
      if (subMatch) {
        feedUrl = `https://www.reddit.com/r/${subMatch[1]}/.rss`;
        siteName = `Reddit - r/${subMatch[1]}`;
      }
    }

    // 2. Detección por etiquetas <link> estándar (RSS / Atom / XML / JSON)
    if (!feedUrl) {
      const rssLink = document.querySelector(
        'link[type="application/rss+xml"], link[type="application/atom+xml"], link[type="application/xml"], link[rel="alternate"][type*="xml"], link[rel="alternate"][type*="rss"], link[rel="alternate"][type*="atom"], link[type="text/xml"]'
      );
      if (rssLink) {
        const href = rssLink.getAttribute('href');
        if (href) {
          try {
            feedUrl = new URL(href, window.location.href).href;
            const rawTitle = rssLink.getAttribute('title') || document.title || hostname;
            siteName = rawTitle.split(/[-|–—]/)[0].trim() || hostname;
          } catch {}
        }
      }
    }

    // 3. Detección por enlaces visibles o botones de feed
    if (!feedUrl) {
      const aFeed = document.querySelector('a[href$="/feed"], a[href$="/rss"], a[href$="/feed.xml"], a[href$="/rss.xml"], a[href$="/atom.xml"], a[href*="rss.xml"], a[href*="feed.xml"]');
      if (aFeed) {
        const href = aFeed.getAttribute('href');
        if (href) {
          try {
            feedUrl = new URL(href, window.location.href).href;
            siteName = document.title.split(/[-|–—]/)[0].trim() || hostname;
          } catch {}
        }
      }
    }

    if (!feedUrl) return;

    // Verificar si el canal ya está en la lista guardada del usuario
    const cleanNew = feedUrl.toLowerCase().replace(/\/+$/, '');
    const alreadyAdded = (currentSettings.feeds || []).some(f => {
      if (!f || !f.url) return false;
      return f.url.toLowerCase().replace(/\/+$/, '') === cleanNew;
    });

    if (alreadyAdded) return;

    if (!siteName) {
      siteName = document.title.split(/[-|–—]/)[0].trim() || hostname;
    }

    showRssDiscoveryToast(feedUrl, siteName, hostname);
  }

  function showRssDiscoveryToast(feedUrl, siteName, hostname) {
    let discoveryHost = document.getElementById('barrss-discovery-host');
    if (!discoveryHost) {
      discoveryHost = document.createElement('div');
      discoveryHost.id = 'barrss-discovery-host';
      (document.body || document.documentElement).appendChild(discoveryHost);
    }

    let discoveryShadow = discoveryHost.shadowRoot;
    if (!discoveryShadow) {
      discoveryShadow = discoveryHost.attachShadow({ mode: 'open' });
    }

    const styleId = 'barrss-discovery-styles';
    let styleTag = discoveryShadow.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      styleTag.textContent = getDiscoveryStyles();
      discoveryShadow.appendChild(styleTag);
    }

    let container = discoveryShadow.getElementById('barrss-rss-discovery-wrapper');
    if (!container) {
      container = document.createElement('div');
      container.id = 'barrss-rss-discovery-wrapper';
      container.className = 'barrss-rss-discovery-wrapper';
      discoveryShadow.appendChild(container);
    }

    container.innerHTML = `
      <!-- 1. Testigo / Botón discreto flotante (No invasivo) -->
      <div class="barrss-rss-witness" id="barrss-rss-witness" title="Canal RSS detectado en este sitio. Hacé clic para agregarlo a BarRSS">
        <span class="barrss-witness-pulse"></span>
        <span class="barrss-witness-icon">📡</span>
        <span class="barrss-witness-text">RSS disponible</span>
        <button type="button" class="barrss-witness-close" id="barrss-witness-btn-close" title="Descartar">✕</button>
      </div>

      <!-- 2. Cartel Detallado (Se abre SOLO al hacer clic en el testigo) -->
      <div class="barrss-rss-card" id="barrss-rss-card" style="display: none;">
        <div class="barrss-toast-header">
          <div class="barrss-toast-title">
            <span>📡</span>
            <strong>Canal RSS Detectado</strong>
          </div>
          <button type="button" class="barrss-toast-close" id="barrss-toast-btn-close" title="Cerrar">✕</button>
        </div>
        <div class="barrss-toast-body">
          ¿Querés agregar <strong>"${escapeHtml(siteName)}"</strong> a tus canales de BarRSS?
          <div style="margin-top: 8px;">
            <label style="display: block; font-size: 10px; color: #94a3b8; margin-bottom: 4px;">📂 Guardar en categoría:</label>
            <select id="barrss-toast-select-cat" style="width: 100%; padding: 6px 8px; font-size: 11px; background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px; color: #f8fafc; cursor: pointer; outline: none;">
              <option value="Noticias Generales">📰 Noticias Generales</option>
              <option value="Economía y Finanzas">📈 Economía y Finanzas</option>
              <option value="Tecnología">💻 Tecnología</option>
              <option value="🔴 Reddit & Comunidades">🔴 Reddit & Comunidades</option>
              <option value="Deportes">⚽ Deportes</option>
              <option value="Internacionales">🌍 Internacionales</option>
              <option value="Cultura y Espectáculos">🎬 Cultura y Espectáculos</option>
              <option value="Personalizados" selected>⭐ Canales Propios / Otros</option>
            </select>
          </div>
        </div>
        <div class="barrss-toast-actions">
          <button type="button" class="barrss-toast-btn-add" id="barrss-toast-btn-add">
            + Agregar a BarRSS
          </button>
          <button type="button" class="barrss-toast-btn-dismiss" id="barrss-toast-btn-dismiss">
            No en este sitio
          </button>
          <button type="button" class="barrss-toast-btn-mute" id="barrss-toast-btn-mute">
            Desactivar avisos de RSS
          </button>
        </div>
      </div>
    `;

    const witness = container.querySelector('#barrss-rss-witness');
    const card = container.querySelector('#barrss-rss-card');
    const witnessClose = container.querySelector('#barrss-witness-btn-close');

    // Clic en el testigo: oculta el testigo y abre el cartel detallado
    witness?.addEventListener('click', (e) => {
      if (e.target === witnessClose || witnessClose?.contains(e.target)) return;
      witness.style.display = 'none';
      card.style.display = 'block';
    });

    // Clic en la cruz del testigo: descarta para esta sesión
    witnessClose?.addEventListener('click', (e) => {
      e.stopPropagation();
      sessionStorage.setItem(`barrss_dismissed_${hostname}`, 'true');
      container.remove();
    });

    // Cerrar el cartel detallado (✕)
    card.querySelector('#barrss-toast-btn-close')?.addEventListener('click', () => {
      container.remove();
    });

    // Botón Agregar
    card.querySelector('#barrss-toast-btn-add')?.addEventListener('click', async () => {
      const selectedCat = card.querySelector('#barrss-toast-select-cat')?.value || 'Personalizados';
      const newFeed = {
        id: `custom_${Date.now()}`,
        name: siteName,
        category: selectedCat,
        lang: 'es',
        url: feedUrl,
        domain: hostname.replace(/^www\./i, ''),
        enabled: true,
        isCustom: true
      };

      if (!Array.isArray(currentSettings.feeds)) {
        currentSettings.feeds = [];
      }
      currentSettings.feeds.push(newFeed);
      await BarRSSSettings.set({ feeds: currentSettings.feeds });

      const body = card.querySelector('.barrss-toast-body');
      if (body) body.innerHTML = '✅ <strong>¡Canal agregado con éxito a BarRSS!</strong>';
      const actions = card.querySelector('.barrss-toast-actions');
      if (actions) actions.style.display = 'none';

      if (typeof loadActiveFeedsNews === 'function') {
        loadActiveFeedsNews(true);
      }

      setTimeout(() => {
        container.remove();
      }, 2200);
    });

    // Botón No en este sitio
    card.querySelector('#barrss-toast-btn-dismiss')?.addEventListener('click', () => {
      sessionStorage.setItem(`barrss_dismissed_${hostname}`, 'true');
      container.remove();
    });

    // Botón Desactivar avisos
    card.querySelector('#barrss-toast-btn-mute')?.addEventListener('click', async () => {
      currentSettings.rssDiscoveryEnabled = false;
      await BarRSSSettings.set({ rssDiscoveryEnabled: false });
      container.remove();
    });
  }

  function getDiscoveryStyles() {
    return `
      .barrss-rss-discovery-wrapper {
        position: fixed !important;
        right: 18px !important;
        bottom: 24px !important;
        z-index: 2147483647 !important;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        pointer-events: auto !important;
      }

      .barrss-rss-witness {
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 6px 12px !important;
        background: rgba(15, 23, 42, 0.96) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border: 1.5px solid #f97316 !important;
        border-radius: 24px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 14px rgba(249, 115, 22, 0.4) !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        color: #f8fafc !important;
        cursor: pointer !important;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        animation: barrssWitnessFadeIn 0.35s ease !important;
      }

      .barrss-rss-witness:hover {
        transform: translateY(-2px) scale(1.03) !important;
        background: #1e293b !important;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.6), 0 0 20px rgba(249, 115, 22, 0.6) !important;
      }

      .barrss-witness-pulse {
        width: 8px !important;
        height: 8px !important;
        border-radius: 50% !important;
        background-color: #22c55e !important;
        box-shadow: 0 0 8px #22c55e !important;
        display: inline-block !important;
        animation: barrssPulse 2s infinite !important;
      }

      @keyframes barrssPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.85); }
      }

      @keyframes barrssWitnessFadeIn {
        from { opacity: 0; transform: translateY(12px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .barrss-witness-icon {
        font-size: 13px !important;
      }

      .barrss-witness-text {
        font-size: 11px !important;
        letter-spacing: 0.2px !important;
        color: #ffffff !important;
      }

      .barrss-witness-close {
        all: unset !important;
        cursor: pointer !important;
        color: #94a3b8 !important;
        font-size: 11px !important;
        padding: 0 2px 0 6px !important;
        margin-left: 2px !important;
        border-left: 1px solid rgba(255, 255, 255, 0.2) !important;
        transition: color 0.15s !important;
      }

      .barrss-witness-close:hover {
        color: #ef4444 !important;
      }

      .barrss-rss-card {
        width: 310px !important;
        background: rgba(15, 23, 42, 0.98) !important;
        backdrop-filter: blur(16px) !important;
        border: 1.5px solid #f97316 !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(249, 115, 22, 0.3) !important;
        padding: 12px 14px !important;
        color: #f8fafc !important;
        animation: barrssWitnessFadeIn 0.25s ease !important;
      }

      .barrss-toast-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        margin-bottom: 8px !important;
        padding-bottom: 6px !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      }

      .barrss-toast-title {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        color: #fb923c !important;
      }

      .barrss-toast-close {
        all: unset !important;
        cursor: pointer !important;
        color: #94a3b8 !important;
        font-size: 12px !important;
        padding: 2px 4px !important;
      }

      .barrss-toast-close:hover {
        color: #ffffff !important;
      }

      .barrss-toast-body {
        font-size: 11px !important;
        line-height: 1.45 !important;
        color: #cbd5e1 !important;
        margin-bottom: 10px !important;
      }

      .barrss-toast-actions {
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
      }

      .barrss-toast-btn-add {
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
        color: #ffffff !important;
        border: none !important;
        padding: 7px 12px !important;
        border-radius: 6px !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        transition: all 0.2s !important;
      }

      .barrss-toast-btn-add:hover {
        background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%) !important;
      }

      .barrss-toast-btn-dismiss, .barrss-toast-btn-mute {
        background: rgba(255, 255, 255, 0.06) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        color: #94a3b8 !important;
        padding: 5px 8px !important;
        border-radius: 5px !important;
        font-size: 10px !important;
        cursor: pointer !important;
        transition: all 0.15s !important;
      }

      .barrss-toast-btn-dismiss:hover, .barrss-toast-btn-mute:hover {
        background: rgba(255, 255, 255, 0.12) !important;
        color: #ffffff !important;
      }
    `;
  }

  function toggleMinimize(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    isMinimized = !isMinimized;
    if (!shadowRoot || !hostElement) return;

    const container = barContainerEl || shadowRoot.querySelector('#barrss-container');
    const restorePill = restorePillEl || shadowRoot.querySelector('#barrss-restore-pill');

    if (isMinimized) {
      if (container) {
        container.classList.add('barrss-hidden');
        container.style.setProperty('display', 'none', 'important');
        container.style.setProperty('visibility', 'hidden', 'important');
        container.style.setProperty('height', '0px', 'important');
        container.setAttribute('hidden', '');
      }
      if (restorePill) {
        restorePill.classList.remove('barrss-hidden');
        restorePill.style.setProperty('display', 'inline-flex', 'important');
        restorePill.style.setProperty('visibility', 'visible', 'important');
        restorePill.removeAttribute('hidden');
      }
      hideChannelsPopover();
      hostElement.classList.add('barrss-host-minimized');
      updatePageOffset(false);
    } else {
      if (container) {
        container.classList.remove('barrss-hidden');
        container.style.setProperty('display', 'flex', 'important');
        container.style.setProperty('visibility', 'visible', 'important');
        container.style.removeProperty('height');
        container.removeAttribute('hidden');
      }
      if (restorePill) {
        restorePill.classList.add('barrss-hidden');
        restorePill.style.setProperty('display', 'none', 'important');
        restorePill.style.setProperty('visibility', 'hidden', 'important');
        restorePill.setAttribute('hidden', '');
      }
      hostElement.classList.remove('barrss-host-minimized');
      updatePageOffset(true);
    }
  }

  function toggleChannelsPopover() {
    if (isPopoverOpen) {
      hideChannelsPopover();
    } else {
      showChannelsPopover();
    }
  }

  function hideChannelsPopover() {
    isPopoverOpen = false;
    if (channelsPopoverEl) {
      channelsPopoverEl.classList.remove('barrss-popover-visible');
    }
    const badgeArrow = shadowRoot?.querySelector('.barrss-badge-arrow');
    if (badgeArrow) badgeArrow.style.transform = 'rotate(0deg)';
  }

  function showChannelsPopover() {
    if (!shadowRoot || !hostElement) return;

    if (!channelsPopoverEl) {
      channelsPopoverEl = document.createElement('div');
      channelsPopoverEl.className = 'barrss-channels-popover';
      channelsPopoverEl.id = 'barrss-channels-popover';
      shadowRoot.appendChild(channelsPopoverEl);
    }

    renderChannelsPopoverContent();
    channelsPopoverEl.classList.add('barrss-popover-visible');
    isPopoverOpen = true;

    const badgeArrow = shadowRoot?.querySelector('.barrss-badge-arrow');
    if (badgeArrow) badgeArrow.style.transform = 'rotate(180deg)';
  }

  function renderChannelsPopoverContent() {
    if (!channelsPopoverEl) return;

    const feeds = currentSettings.feeds || [];
    const activeCount = feeds.filter(f => f.enabled).length;

    channelsPopoverEl.innerHTML = `
      <div class="barrss-popover-header">
        <div class="barrss-popover-title">
          <svg viewBox="0 0 24 24"><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.46-4.44-9.9-9.9-9.9z"/></svg>
          <span>Canales de Noticias</span>
          <span class="barrss-popover-badge" id="barrss-popover-counter">${activeCount}/${feeds.length}</span>
        </div>
        <button type="button" class="barrss-popover-btn-close" id="barrss-popover-btn-close" title="Cerrar">✕</button>
      </div>
      <div class="barrss-popover-body" id="barrss-popover-list"></div>
      <div class="barrss-popover-footer">
        <div>Tildá los canales que querés ver en la barra</div>
        <button type="button" class="barrss-popover-btn-reader" id="barrss-btn-open-reader" title="Abrir El Diario BarRSS en pantalla completa">
          📰 Abrir Diario Web Completo
        </button>
      </div>
    `;

    const closeBtn = channelsPopoverEl.querySelector('#barrss-popover-btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideChannelsPopover();
      });
    }

    const readerBtn = channelsPopoverEl.querySelector('#barrss-btn-open-reader');
    if (readerBtn) {
      readerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chrome.runtime.sendMessage({ action: 'OPEN_READER' });
        hideChannelsPopover();
      });
    }

    const listEl = channelsPopoverEl.querySelector('#barrss-popover-list');
    if (!listEl) return;

    feeds.forEach(feed => {
      const itemEl = document.createElement('div');
      itemEl.className = 'barrss-popover-item';

      const left = document.createElement('div');
      left.className = 'barrss-popover-item-left';

      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.className = 'barrss-popover-checkbox';
      chk.checked = !!feed.enabled;
      chk.id = `barrss_chk_${feed.id}`;

      chk.addEventListener('change', async (e) => {
        e.stopPropagation();
        feed.enabled = chk.checked;

        // Actualizar contador del popover
        const curActive = feeds.filter(f => f.enabled).length;
        const counterEl = channelsPopoverEl.querySelector('#barrss-popover-counter');
        if (counterEl) counterEl.textContent = `${curActive}/${feeds.length}`;

        // Actualizar texto del badge en la barra
        const isEn = currentSettings.language === 'en';
        const badgeText = shadowRoot.getElementById('barrss-badge-text');
        if (badgeText) {
          badgeText.textContent = curActive === 1 
            ? (feeds.find(f => f.enabled)?.name || (isEn ? 'NEWS' : 'NOTICIAS')).toUpperCase()
            : `${curActive} ${isEn ? 'FEEDS' : 'CANALES'}`;
        }

        // Guardar en storage para persistencia
        try {
          await BarRSSSettings.set({ feeds: currentSettings.feeds });
        } catch (err) {
          console.warn('[BarRSS] Error guardando estado de canales:', err);
        }

        // Recargar titulares en la marquesina
        loadActiveFeedsNews(true);
      });

      const faviconImg = document.createElement('img');
      faviconImg.className = 'barrss-popover-favicon';
      faviconImg.alt = '';
      faviconImg.src = feed.domain 
        ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(feed.domain)}&sz=32`
        : '';
      faviconImg.onerror = () => { faviconImg.style.display = 'none'; };

      const meta = document.createElement('label');
      meta.htmlFor = `barrss_chk_${feed.id}`;
      meta.className = 'barrss-popover-meta';
      meta.innerHTML = `
        <span class="barrss-popover-name">${escapeHtml(feed.name)}</span>
        <span class="barrss-popover-cat">${escapeHtml(feed.category || 'RSS')}</span>
      `;

      left.appendChild(chk);
      if (feed.domain) left.appendChild(faviconImg);
      left.appendChild(meta);
      itemEl.appendChild(left);
      listEl.appendChild(itemEl);
    });
  }

  function applyCustomStyles() {
    if (!hostElement || !shadowRoot) return;

    const hoverClass = currentSettings.displayMode === 'hover' ? ' barrss-mode-hover' : '';
    const minClass = isMinimized ? ' barrss-host-minimized' : '';
    hostElement.className = `barrss-pos-${currentSettings.position}${hoverClass}${minClass}`;

    const dynamicStyle = shadowRoot.getElementById('barrss-dynamic-styles');
    if (dynamicStyle) {
      dynamicStyle.textContent = getShadowStyles();
    }

    const track = shadowRoot.getElementById('barrss-track');
    if (track && currentNewsItems.length > 0) {
      requestAnimationFrame(() => {
        track.style.animationDuration = `${calculateAnimationDuration(currentNewsItems.length)}s`;
      });
    }

    updatePageOffset(!isMinimized);
  }

  function getShadowStyles() {
    let bgColor = hexToRgba(currentSettings.backgroundColor, currentSettings.backgroundOpacity);
    let textColor = currentSettings.textColor;
    let linkColor = currentSettings.linkColor;
    let borderColor = 'rgba(255, 255, 255, 0.15)';
    let itemBadgeBg = 'rgba(255, 255, 255, 0.12)';

    if (currentSettings.adaptiveTheme) {
      const adaptive = detectSiteTheme();
      bgColor = adaptive.bgColor;
      textColor = adaptive.textColor;
      linkColor = adaptive.linkColor;
      borderColor = adaptive.borderColor;
      itemBadgeBg = adaptive.itemBadgeBg;
    }

    return `
      :host {
        all: initial !important;
        display: block !important;
        position: fixed !important;
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        box-sizing: border-box !important;
        z-index: 2147483647 !important;
        direction: ltr !important;
        unicode-bidi: isolate !important;
        font-family: ${currentSettings.fontFamily} !important;
        font-size: ${currentSettings.fontSize}px !important;
        user-select: none;
        pointer-events: none !important;
        -webkit-font-smoothing: antialiased;
      }

      :host(.barrss-pos-top) {
        top: 0 !important;
        bottom: auto !important;
      }

      :host(.barrss-pos-bottom) {
        bottom: 0 !important;
        top: auto !important;
      }

      :host(.barrss-host-minimized) {
        width: auto !important;
        max-width: none !important;
        height: auto !important;
        left: auto !important;
        right: 18px !important;
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
        pointer-events: none !important;
      }

      :host(.barrss-host-minimized) .barrss-container {
        display: none !important;
      }

      :host(.barrss-host-minimized) .barrss-minimized-toggle {
        display: inline-flex !important;
        pointer-events: auto !important;
      }

      .barrss-container {
        all: unset;
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        height: ${BAR_HEIGHT}px !important;
        min-height: ${BAR_HEIGHT}px !important;
        box-sizing: border-box !important;
        padding: 0 10px !important;
        gap: 10px !important;
        background-color: ${bgColor} !important;
        color: ${textColor} !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35) !important;
        overflow: hidden !important;
        pointer-events: auto !important;
        border-style: solid !important;
        border-width: 0 !important;
        transition: background-color 0.3s ease, color 0.3s ease, transform 0.25s ease, opacity 0.25s ease !important;
      }

      :host(.barrss-pos-bottom) .barrss-container.barrss-scroll-hidden {
        transform: translateY(100%) !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      :host(.barrss-pos-top) .barrss-container.barrss-scroll-hidden {
        transform: translateY(-100%) !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* TRIGGER DE BORDE PARA MODO HOVER */
      .barrss-edge-trigger {
        display: none !important;
      }

      :host(.barrss-mode-hover) .barrss-edge-trigger {
        display: block !important;
        position: fixed !important;
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        height: 22px !important;
        z-index: 2147483646 !important;
        pointer-events: auto !important;
        background: transparent !important;
      }

      :host(.barrss-mode-hover.barrss-pos-bottom) .barrss-edge-trigger {
        bottom: 0 !important;
        top: auto !important;
      }

      :host(.barrss-mode-hover.barrss-pos-top) .barrss-edge-trigger {
        top: 0 !important;
        bottom: auto !important;
      }

      /* Hover directo sobre el trigger revela la barra inmediatamente por CSS */
      :host(.barrss-mode-hover) .barrss-edge-trigger:hover ~ .barrss-container {
        transform: translateY(0) !important;
        opacity: 1 !important;
        box-shadow: 0 0 28px rgba(0, 0, 0, 0.7) !important;
      }

      /* MODO HOVER (Al borde / Peek inteligente) */
      :host(.barrss-mode-hover.barrss-pos-bottom) .barrss-container {
        transform: translateY(calc(100% - 4px)) !important;
        opacity: 0.85 !important;
        box-shadow: 0 -2px 10px rgba(249, 115, 22, 0.5) !important;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, box-shadow 0.2s ease !important;
      }

      :host(.barrss-mode-hover.barrss-pos-bottom) .barrss-container:hover,
      :host(.barrss-mode-hover.barrss-pos-bottom) .barrss-container.barrss-peek-visible {
        transform: translateY(0) !important;
        opacity: 1 !important;
        box-shadow: 0 -6px 28px rgba(0, 0, 0, 0.7) !important;
      }

      :host(.barrss-mode-hover.barrss-pos-top) .barrss-container {
        transform: translateY(calc(-100% + 4px)) !important;
        opacity: 0.85 !important;
        box-shadow: 0 2px 10px rgba(249, 115, 22, 0.5) !important;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, box-shadow 0.2s ease !important;
      }

      :host(.barrss-mode-hover.barrss-pos-top) .barrss-container:hover,
      :host(.barrss-mode-hover.barrss-pos-top) .barrss-container.barrss-peek-visible {
        transform: translateY(0) !important;
        opacity: 1 !important;
        box-shadow: 0 6px 28px rgba(0, 0, 0, 0.7) !important;
      }

      :host(.barrss-pos-top) .barrss-container {
        border-bottom-width: 1px !important;
        border-bottom-color: ${borderColor} !important;
      }

      :host(.barrss-pos-bottom) .barrss-container {
        border-top-width: 1px !important;
        border-top-color: ${borderColor} !important;
      }

      .barrss-badge {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 3px 10px !important;
        border-radius: 6px !important;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
        color: #ffffff !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        letter-spacing: 0.5px !important;
        text-transform: uppercase !important;
        white-space: nowrap !important;
        box-shadow: 0 2px 6px rgba(234, 88, 12, 0.4) !important;
        flex-shrink: 0 !important;
        cursor: pointer !important;
        user-select: none !important;
        transition: transform 0.15s ease, filter 0.15s ease !important;
      }

      .barrss-badge:hover {
        transform: scale(1.04) !important;
        filter: brightness(1.1) !important;
      }

      .barrss-badge svg {
        width: 12px !important;
        height: 12px !important;
        fill: currentColor !important;
      }

      .barrss-badge-arrow {
        width: 10px !important;
        height: 10px !important;
        fill: currentColor !important;
        transition: transform 0.2s ease !important;
      }

      .barrss-viewport {
        all: unset;
        flex: 1 1 auto !important;
        overflow: hidden !important;
        position: relative !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        mask-image: linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%) !important;
        -webkit-mask-image: linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%) !important;
      }

      .barrss-track {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        white-space: nowrap !important;
        will-change: transform !important;
        animation-name: barrss-ticker-scroll !important;
        animation-timing-function: linear !important;
        animation-iteration-count: infinite !important;
      }

      .barrss-viewport:hover .barrss-track,
      .barrss-track:hover {
        animation-play-state: paused !important;
      }

      .barrss-group {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        flex-shrink: 0 !important;
      }

      .barrss-item {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        padding: 0 16px !important;
        line-height: 1.2 !important;
        white-space: nowrap !important;
        gap: 8px !important;
      }

      .barrss-source-badge {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        gap: 5px !important;
        background: ${itemBadgeBg} !important;
        padding: 2px 7px !important;
        border-radius: 4px !important;
        font-size: 10px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.3px !important;
        color: ${textColor} !important;
        flex-shrink: 0 !important;
      }

      .barrss-favicon {
        all: unset;
        width: 14px !important;
        height: 14px !important;
        border-radius: 2px !important;
        object-fit: contain !important;
        display: inline-block !important;
      }

      .barrss-rss-fallback {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 14px !important;
        height: 14px !important;
        color: #f97316 !important;
      }

      .barrss-rss-fallback svg {
        width: 12px !important;
        height: 12px !important;
        fill: currentColor !important;
      }

      .barrss-source-name {
        all: unset;
        display: inline !important;
      }

      .barrss-link {
        all: unset;
        display: inline !important;
        cursor: pointer !important;
        color: ${linkColor} !important;
        transition: opacity 0.2s ease, text-decoration 0.2s ease !important;
        outline: none !important;
        font-weight: 500 !important;
      }

      .barrss-link:hover {
        text-decoration: underline !important;
        opacity: 0.85 !important;
      }

      .barrss-separator {
        all: unset;
        display: inline-block !important;
        margin-left: 10px !important;
        opacity: 0.35 !important;
        font-size: 8px !important;
        vertical-align: middle !important;
      }

      .barrss-status {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        font-size: 12px !important;
        padding: 0 16px !important;
        color: ${textColor} !important;
        opacity: 0.85 !important;
      }

      .barrss-spinner {
        all: unset;
        width: 14px !important;
        height: 14px !important;
        border: 2px solid rgba(128, 128, 128, 0.3) !important;
        border-top-color: currentColor !important;
        border-radius: 50% !important;
        animation: barrss-spin 0.8s linear infinite !important;
        display: inline-block !important;
      }

      .barrss-controls {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        gap: 4px !important;
        flex-shrink: 0 !important;
        padding-left: 6px !important;
      }

      .barrss-btn {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 26px !important;
        height: 26px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        opacity: 0.75 !important;
        transition: all 0.2s ease !important;
        background: transparent !important;
        color: ${textColor} !important;
      }

      .barrss-btn:hover {
        opacity: 1 !important;
        background: rgba(128, 128, 128, 0.2) !important;
      }

      .barrss-btn svg {
        width: 14px !important;
        height: 14px !important;
        fill: currentColor !important;
      }

      .barrss-btn-reader:hover {
        background: rgba(249, 115, 22, 0.25) !important;
        color: #f97316 !important;
      }

      .barrss-btn-reader:hover svg {
        fill: #f97316 !important;
      }

      .barrss-btn-close:hover {
        background: rgba(239, 68, 68, 0.25) !important;
        color: #ef4444 !important;
      }

      .barrss-btn-close:hover svg {
        fill: #ef4444 !important;
      }

      .barrss-minimized-toggle {
        all: unset;
        display: none;
        align-items: center !important;
        gap: 8px !important;
        position: fixed !important;
        right: 18px !important;
        padding: 7px 15px !important;
        border-radius: 24px !important;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
        color: #ffffff !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        letter-spacing: 0.4px !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45) !important;
        z-index: 2147483647 !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease !important;
      }

      .barrss-minimized-toggle:hover {
        transform: scale(1.06) translateY(-1px) !important;
        box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5) !important;
      }

      .barrss-minimized-toggle svg {
        width: 14px !important;
        height: 14px !important;
        fill: #ffffff !important;
      }

      :host(.barrss-pos-top) .barrss-minimized-toggle {
        top: 14px !important;
      }

      :host(.barrss-pos-bottom) .barrss-minimized-toggle {
        bottom: 14px !important;
      }

      .barrss-container.barrss-hidden,
      :host(.barrss-host-minimized) .barrss-container,
      .barrss-container[hidden] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        min-height: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
      }

      .barrss-minimized-toggle.barrss-hidden,
      .barrss-minimized-toggle[hidden] {
        display: none !important;
        visibility: hidden !important;
      }

      /* Popover de Canales Flotante */
      .barrss-channels-popover {
        all: unset;
        display: none;
        flex-direction: column !important;
        position: fixed !important;
        left: 10px !important;
        width: 300px !important;
        max-width: 90vw !important;
        max-height: 380px !important;
        background: rgba(15, 23, 42, 0.96) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        border-radius: 10px !important;
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(249, 115, 22, 0.2) !important;
        z-index: 2147483647 !important;
        color: #f8fafc !important;
        font-family: system-ui, -apple-system, sans-serif !important;
        pointer-events: auto !important;
        overflow: hidden !important;
        animation: barrss-popover-fade 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }

      .barrss-channels-popover.barrss-popover-visible {
        display: flex !important;
      }

      :host(.barrss-pos-bottom) .barrss-channels-popover {
        bottom: 46px !important;
        top: auto !important;
      }

      :host(.barrss-pos-top) .barrss-channels-popover {
        top: 46px !important;
        bottom: auto !important;
      }

      @keyframes barrss-popover-fade {
        from {
          opacity: 0;
          transform: translateY(6px) scale(0.97);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .barrss-popover-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 10px 12px !important;
        background: rgba(30, 41, 59, 0.8) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
      }

      .barrss-popover-title {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        color: #f1f5f9 !important;
      }

      .barrss-popover-title svg {
        width: 14px !important;
        height: 14px !important;
        fill: #f97316 !important;
      }

      .barrss-popover-badge {
        font-size: 10px !important;
        font-weight: 700 !important;
        padding: 2px 7px !important;
        border-radius: 12px !important;
        background: rgba(249, 115, 22, 0.2) !important;
        color: #fb923c !important;
        margin-left: 4px !important;
      }

      .barrss-popover-btn-close {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 20px !important;
        height: 20px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        color: #94a3b8 !important;
        transition: all 0.15s !important;
      }

      .barrss-popover-btn-close:hover {
        background: rgba(239, 68, 68, 0.2) !important;
        color: #ef4444 !important;
      }

      .barrss-popover-body {
        display: flex !important;
        flex-direction: column !important;
        gap: 5px !important;
        padding: 8px 8px 16px 8px !important;
        overflow-y: auto !important;
        max-height: 250px !important;
      }

      .barrss-popover-body::-webkit-scrollbar {
        width: 5px !important;
      }
      .barrss-popover-body::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2) !important;
        border-radius: 4px !important;
      }

      .barrss-popover-item {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 6px 8px !important;
        border-radius: 6px !important;
        background: rgba(30, 41, 59, 0.5) !important;
        border: 1px solid rgba(255, 255, 255, 0.04) !important;
        transition: background 0.15s !important;
      }

      .barrss-popover-item:last-child {
        margin-bottom: 8px !important;
      }

      .barrss-popover-item:hover {
        background: rgba(56, 189, 248, 0.12) !important;
      }

      .barrss-popover-item-left {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        flex: 1 1 auto !important;
        overflow: hidden !important;
      }

      .barrss-popover-checkbox {
        accent-color: #f97316 !important;
        width: 14px !important;
        height: 14px !important;
        cursor: pointer !important;
        flex-shrink: 0 !important;
      }

      .barrss-popover-favicon {
        width: 14px !important;
        height: 14px !important;
        border-radius: 3px !important;
        flex-shrink: 0 !important;
      }

      .barrss-popover-meta {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        overflow: hidden !important;
        cursor: pointer !important;
        flex: 1 1 auto !important;
      }

      .barrss-popover-name {
        font-size: 11px !important;
        font-weight: 600 !important;
        color: #f8fafc !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }

      .barrss-popover-cat {
        font-size: 9px !important;
        color: #94a3b8 !important;
        background: rgba(255, 255, 255, 0.08) !important;
        padding: 1px 5px !important;
        border-radius: 4px !important;
        white-space: nowrap !important;
      }

      .barrss-popover-footer {
        padding: 8px 10px !important;
        background: rgba(15, 23, 42, 0.9) !important;
        border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
        font-size: 10px !important;
        color: #94a3b8 !important;
        text-align: center !important;
      }

      .barrss-popover-btn-reader {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin-top: 6px !important;
        padding: 5px 10px !important;
        border-radius: 5px !important;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
        color: #ffffff !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        width: 100% !important;
        box-sizing: border-box !important;
        transition: filter 0.15s ease, transform 0.15s ease !important;
      }

      .barrss-popover-btn-reader:hover {
        filter: brightness(1.1) !important;
        transform: translateY(-1px) !important;
      }

      /* Testigo Discreto de Autodescubrimiento RSS (No invasivo) */
      .barrss-rss-witness {
        position: fixed !important;
        right: 18px !important;
        bottom: 50px !important;
        z-index: 2147483647 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 7px !important;
        padding: 5px 10px 5px 12px !important;
        background: rgba(15, 23, 42, 0.94) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border: 1px solid rgba(249, 115, 22, 0.45) !important;
        border-radius: 20px !important;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4), 0 0 10px rgba(249, 115, 22, 0.2) !important;
        font-family: system-ui, -apple-system, sans-serif !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        color: #f8fafc !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        transition: all 0.2s ease !important;
        animation: barrssWitnessFadeIn 0.3s ease !important;
      }

      :host(.barrss-pos-top) .barrss-rss-witness {
        bottom: auto !important;
        top: 50px !important;
      }

      .barrss-rss-witness:hover {
        transform: translateY(-2px) scale(1.02) !important;
        background: rgba(30, 41, 59, 0.98) !important;
        border-color: #f97316 !important;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5), 0 0 16px rgba(249, 115, 22, 0.35) !important;
      }

      .barrss-witness-pulse {
        width: 6px !important;
        height: 6px !important;
        border-radius: 50% !important;
        background-color: #22c55e !important;
        box-shadow: 0 0 8px #22c55e !important;
        display: inline-block !important;
        animation: barrssPulse 2s infinite !important;
      }

      .barrss-witness-icon {
        font-size: 11px !important;
      }

      .barrss-witness-text {
        font-size: 11px !important;
        letter-spacing: 0.2px !important;
      }

      .barrss-witness-close {
        all: unset !important;
        cursor: pointer !important;
        color: #94a3b8 !important;
        font-size: 10px !important;
        padding: 0 2px 0 4px !important;
        margin-left: 2px !important;
        border-left: 1px solid rgba(255, 255, 255, 0.15) !important;
      }

      .barrss-witness-close:hover {
        color: #ef4444 !important;
      }

      @keyframes barrssPulse {
        0% { transform: scale(0.95); opacity: 0.8; }
        50% { transform: scale(1.25); opacity: 1; box-shadow: 0 0 10px #22c55e; }
        100% { transform: scale(0.95); opacity: 0.8; }
      }

      @keyframes barrssWitnessFadeIn {
        from { opacity: 0; transform: translateY(8px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      /* Cartel Detallado (Se abre SOLO al hacer clic en el testigo) */
      .barrss-rss-card {
        position: fixed !important;
        right: 18px !important;
        bottom: 50px !important;
        z-index: 2147483647 !important;
        background: rgba(15, 23, 42, 0.98) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        border: 1px solid rgba(249, 115, 22, 0.45) !important;
        border-radius: 12px !important;
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(249, 115, 22, 0.2) !important;
        padding: 14px 16px !important;
        width: 310px !important;
        box-sizing: border-box !important;
        font-family: system-ui, -apple-system, sans-serif !important;
        color: #f8fafc !important;
        pointer-events: auto !important;
        animation: barrssWitnessFadeIn 0.25s ease !important;
      }

      :host(.barrss-pos-top) .barrss-rss-card {
        bottom: auto !important;
        top: 50px !important;
      }

      .barrss-toast-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        margin-bottom: 6px !important;
      }

      .barrss-toast-title {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        font-size: 12px !important;
        color: #f97316 !important;
      }

      .barrss-toast-close {
        all: unset !important;
        cursor: pointer !important;
        color: #94a3b8 !important;
        font-size: 12px !important;
        padding: 2px 4px !important;
      }
      .barrss-toast-close:hover {
        color: #ffffff !important;
      }

      .barrss-toast-body {
        font-size: 11px !important;
        line-height: 1.4 !important;
        color: #cbd5e1 !important;
        margin-bottom: 10px !important;
      }

      .barrss-toast-actions {
        display: flex !important;
        flex-direction: column !important;
        gap: 5px !important;
      }

      .barrss-toast-btn-add {
        all: unset !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 6px 10px !important;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
        color: #ffffff !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        border-radius: 5px !important;
        cursor: pointer !important;
        text-align: center !important;
        transition: filter 0.15s ease !important;
      }
      .barrss-toast-btn-add:hover {
        filter: brightness(1.1) !important;
      }

      .barrss-toast-btn-dismiss, .barrss-toast-btn-mute {
        all: unset !important;
        font-size: 10px !important;
        color: #94a3b8 !important;
        cursor: pointer !important;
        text-align: center !important;
        padding: 2px 0 !important;
      }
      .barrss-toast-btn-dismiss:hover, .barrss-toast-btn-mute:hover {
        color: #e2e8f0 !important;
        text-decoration: underline !important;
      }

      @keyframes barrss-ticker-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      @keyframes barrss-spin {
        to { transform: rotate(360deg); }
      }
    `;
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

  // Manejador centralizado para actualizar configuración y estado de la barra
  function handleSettingsUpdate(newSettings) {
    const prevFeedsJson = JSON.stringify(currentSettings.feeds);
    const prevAdaptive = currentSettings.adaptiveTheme;
    const prevEnabled = currentSettings.enabled;

    currentSettings = { ...currentSettings, ...newSettings };

    if (currentSettings.enabled) {
      isMinimized = false;
      const hostInDom = document.getElementById('barrss-root-host');
      if (!hostElement || !hostInDom) {
        createBar();
      } else {
        if (barContainerEl) {
          barContainerEl.classList.remove('barrss-hidden');
          barContainerEl.style.setProperty('display', 'flex', 'important');
          barContainerEl.style.setProperty('visibility', 'visible', 'important');
          barContainerEl.style.removeProperty('height');
          barContainerEl.removeAttribute('hidden');
        }
        if (restorePillEl) {
          restorePillEl.classList.add('barrss-hidden');
          restorePillEl.style.setProperty('display', 'none', 'important');
          restorePillEl.setAttribute('hidden', '');
        }
        hostElement.classList.remove('barrss-host-minimized');
      }

      if (hostElement) {
        hostElement.classList.remove('barrss-pos-top', 'barrss-pos-bottom', 'barrss-mode-hover');
        hostElement.classList.add(`barrss-pos-${currentSettings.position}`);
        if (currentSettings.displayMode === 'hover') {
          hostElement.classList.add('barrss-mode-hover');
        }
      }

      if (currentSettings.displayMode === 'pill') {
        toggleMinimize();
      }

      updatePageOffset(true);
      applyCustomStyles();

      if (!prevEnabled || prevFeedsJson !== JSON.stringify(currentSettings.feeds)) {
        loadActiveFeedsNews(true);
      }
      if (prevAdaptive !== currentSettings.adaptiveTheme) {
        setupThemeObserver();
      }
    } else {
      updatePageOffset(false);
      if (themeObserver) themeObserver.disconnect();
      if (fixedElementsObserver) fixedElementsObserver.disconnect();
      if (hostElement) {
        hostElement.remove();
        hostElement = null;
        shadowRoot = null;
        barContainerEl = null;
        restorePillEl = null;
        channelsPopoverEl = null;
        isPopoverOpen = false;
      }
      const domHost = document.getElementById('barrss-root-host');
      if (domHost) domHost.remove();
    }
  }

  // Listener para mensajes directos de pestañas/popup/sidepanel
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'UPDATE_SETTINGS' && request.settings) {
      handleSettingsUpdate(request.settings);
      sendResponse({ success: true });
    }
  });

  // Listener nativo de almacenamiento: sincronización instantánea y omnidireccional
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if ((areaName === 'sync' && !changes.feeds) || (areaName === 'local' && changes.feeds)) {
      const updated = {};
      for (const [key, change] of Object.entries(changes)) {
        updated[key] = change.newValue;
      }
      handleSettingsUpdate(updated);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
