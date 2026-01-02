/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

/**
 * Get element by ID with validation
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null if not found
 */
export function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with id "${id}" not found`);
  }
  return element;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Create element with text content
 * @param {string} tag - HTML tag name
 * @param {string} text - Text content
 * @returns {HTMLElement} Created element
 */
export function createEl(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}

/**
 * Create media element (image or video)
 * @param {Object} media - Media object with url, mediaType, alt
 * @returns {HTMLElement} Image or video element
 */
export function createMediaElement(media) {
  if (media.mediaType === 'video') {
    const videoEl = document.createElement('video');
    videoEl.src = media.url;
    videoEl.controls = true;
    videoEl.loop = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.style.width = '100%';
    videoEl.loading = 'lazy';
    if (media.alt) {
      videoEl.setAttribute('aria-label', media.alt);
    }
    return videoEl;
  } else {
    const imageEl = document.createElement('img');
    imageEl.src = media.url;
    imageEl.alt = media.alt || '';
    imageEl.loading = 'lazy';
    return imageEl;
  }
}
