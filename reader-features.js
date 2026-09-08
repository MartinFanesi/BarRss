/* Reading state and per-feed diagnostics; rendered with DOM methods. */
let readStories = new Set();
let hideReadStories = false;
let latestFeedStatuses = [];
function loadReadingState() {
  try {
    const stored = JSON.parse(localStorage.getItem('barrss_read_stories') || '[]');
    readStories = new Set(Array.isArray(stored) ? stored.filter(value => typeof value === 'string') : []);
    hideReadStories = localStorage.getItem('barrss_hide_read') === 'true';
  } catch { readStories = new Set(); }
}
function saveReadingState() {
  try {
    localStorage.setItem('barrss_read_stories', JSON.stringify([...readStories].slice(-5000)));
    localStorage.setItem('barrss_hide_read', String(hideReadStories));
    return true;
  } catch { showToast('No se pudo guardar el estado de lectura.'); return false; }
}
function setStoryRead(link, isRead) {
  // Merge updates from other reader windows before writing.
  const hidden = hideReadStories;
  loadReadingState();
  hideReadStories = hidden;
  if (isRead) readStories.add(link);
  else readStories.delete(link);
  saveReadingState();
  applyFiltersAndRender();
}
function renderReadButton(story) {
  const read = readStories.has(story.link);
  return `<button type="button" class="btn-bookmark btn-read-state" data-link="${escapeHtml(story.link)}" aria-pressed="${read}">${read ? '✓ Leída' : 'Marcar leída'}</button>`;
}
function attachReadListeners(container) {
  container.querySelectorAll('.btn-read-state').forEach(button => {
    button.addEventListener('click', () => setStoryRead(button.dataset.link, !readStories.has(button.dataset.link)));
  });
  container.querySelectorAll('a[href]').forEach(anchor => {
    if (!allStories.some(story => story.link === anchor.href) && !getSavedStories().some(story => story.link === anchor.href)) return;
    const mark = event => {
      if (event.type === 'auxclick' && event.button !== 1) return;
      // Let the browser follow the link before re-rendering the list.
      setTimeout(() => setStoryRead(anchor.href, true), 0);
    };
    anchor.addEventListener('click', mark);
    anchor.addEventListener('auxclick', mark);
  });
}
function renderFeedStatus(statuses) {
  latestFeedStatuses = statuses;
  const container = document.getElementById('feedStatusList');
  if (!container) return;
  container.replaceChildren();
  const failures = statuses.filter(s => s.state === 'error' || s.state === 'stale').length;
  document.getElementById('feedStatusSummary').textContent = statuses.length
    ? `Estado de ${statuses.length} canales${failures ? ` · ${failures} con problemas` : ' · actualizados'}` : 'Estado de los canales';
  for (const status of statuses) {
    const row = document.createElement('div');
    row.className = 'feed-status-row';
    const text = document.createElement('span');
    const date = status.updatedAt ? new Date(status.updatedAt).toLocaleString('es-AR') : 'sin actualización';
    const label = status.state === 'stale' ? 'Mostrando copia guardada' : status.state === 'error' ? 'No disponible' : 'Disponible';
    text.textContent = `${status.name} — ${label} · ${date}${status.error ? ' · ' + status.error : ''}`;
    row.append(text);
    if (status.state === 'error' || status.state === 'stale') {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Reintentar';
      button.addEventListener('click', async () => {
        button.disabled = true;
        try {
          const response = await chrome.runtime.sendMessage({ action: 'FETCH_RSS', url: status.url, forceRefresh: true });
          if (!response?.success) throw new Error(response?.error || 'No se pudo actualizar.');
          await loadNewspaperStories(false);
        } catch (error) { showToast(error.message); }
        finally { button.disabled = false; }
      });
      row.append(button);
    }
    container.append(row);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  loadReadingState();
  const toggle = document.getElementById('hideReadStories');
  toggle.checked = hideReadStories;
  toggle.addEventListener('change', () => {
    hideReadStories = toggle.checked;
    saveReadingState();
    currentPage = 1;
    applyFiltersAndRender();
  });
});
window.addEventListener('storage', event => {
  if (event.key === 'barrss_read_stories' || event.key === 'barrss_hide_read') {
    loadReadingState();
    document.getElementById('hideReadStories').checked = hideReadStories;
    applyFiltersAndRender();
  }
  if (event.key === 'barrss_saved_stories') { updateSavedCountUI(); applyFiltersAndRender(); }
});
