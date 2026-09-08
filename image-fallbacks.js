// Capture also covers images inserted later; no inline JavaScript (MV3 CSP).
document.addEventListener('error', event => {
  const img = event.target;
  if (img.tagName !== 'IMG') return;
  if (img.classList.contains('drawer-feed-icon') && !img.dataset.fallback) {
    img.dataset.fallback = 'true';
    img.src = chrome.runtime.getURL('icons/icon16.png');
  } else {
    img.hidden = true;
    const wrapper = img.closest('.story-card-image, .hero-image-wrapper');
    if (wrapper) {
      wrapper.classList.add('placeholder');
      wrapper.setAttribute('aria-label', 'Imagen no disponible');
      if (!wrapper.querySelector('.image-unavailable-label')) {
        const label = document.createElement('span');
        label.className = 'image-unavailable-label';
        label.textContent = 'Imagen no disponible';
        wrapper.append(label);
      }
    }
  }
}, true);
