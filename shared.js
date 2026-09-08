/* Shared URL and settings rules for extension pages, worker and content scripts. */
var BarRSS = (() => {
  function httpUrl(value, base) {
    if (typeof value !== 'string' || !value.trim() || value.length > 8192) return '';
    try {
      const url = new URL(String(value || '').trim(), base);
      return /^https?:$/.test(url.protocol) && !url.username && !url.password ? url.href : '';
    } catch { return ''; }
  }
  function normalizeFeedUrl(value) {
    const safe = httpUrl(value);
    if (!safe) return '';
    const url = new URL(safe);
    url.hash = '';
    return url.href;
  }
  function validateFeeds(feeds) {
    if (!Array.isArray(feeds) || feeds.length > 1000) throw new Error('La lista debe contener hasta 1000 canales.');
    const seen = new Set();
    return feeds.map((feed, index) => {
      const url = normalizeFeedUrl(feed?.url);
      if (!url) throw new Error(`URL inválida en el canal ${index + 1}. Usá HTTP o HTTPS.`);
      return { id: String(feed.id || `custom_${index}`), name: String(feed.name || new URL(url).hostname).slice(0, 200),
        url, domain: new URL(url).hostname.replace(/^www\./, ''), category: String(feed.category || 'General').slice(0, 100),
        country: String(feed.country || 'Personalizados').slice(0, 100), lang: String(feed.lang || 'es').slice(0, 10),
        countryFlag: String(feed.countryFlag || '').slice(0, 20), enabled: feed.enabled === true, isCustom: feed.isCustom === true };
    }).filter(feed => !seen.has(feed.url) && seen.add(feed.url));
  }
  return { httpUrl, normalizeFeedUrl, validateFeeds };
})();

var BarRSSSettings = (() => {
  async function get(defaults = {}) {
    const settings = await chrome.storage.sync.get({ userCountry: 'Argentina', ...defaults });
    if (Object.hasOwn(defaults, 'feeds')) {
      const local = await chrome.storage.local.get('feeds');
      if (Array.isArray(local.feeds)) settings.feeds = local.feeds;
      else {
        const legacy = await chrome.storage.sync.get('feeds');
        const feeds = Array.isArray(legacy.feeds) ? legacy.feeds : getDefaultFeedsForCountry(settings.userCountry || 'Argentina');
        settings.feeds = BarRSS.validateFeeds(feeds);
        await chrome.storage.local.set({ feeds: settings.feeds });
      }
    }
    return settings;
  }
  async function set(values) {
    const { feeds, ...preferences } = values;
    const validated = feeds === undefined ? undefined : BarRSS.validateFeeds(feeds);
    if (Object.keys(preferences).length) await chrome.storage.sync.set(preferences);
    if (validated !== undefined) {
      await chrome.storage.local.set({ feeds: validated });
      await chrome.storage.sync.remove('feeds');
    }
  }
  return { get, set };
})();
