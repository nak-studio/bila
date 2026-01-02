/**
 * Drawer Module
 * Handles artwork detail drawer/modal
 */

import { state, DOM_IDS } from './state.js';
import { getElement, escapeHtml } from '../utils/dom.js';
import { t } from './i18n.js';
import { filterByTopic } from './filters.js';

/**
 * Get badge color class based on topic name
 * @param {string} topic - Topic name
 * @returns {string} nakDS background color class
 */
function getBadgeColorClass(topic) {
  // Hash function to get consistent color for same topic
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Array of nakDS color classes (vivid colors only)
  const colors = [
    'nk-bg--c',         // Cyan
    'nk-bg--m',         // Magenta
    'nk-bg--y',         // Yellow
    'nk-bg--c-lighter'  // Light Pink/Rose
  ];
  
  // Get consistent color index
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Open drawer with artwork details
 * @param {Object} artwork - Artwork object
 * @param {number} startIndex - Starting image index
 */
export function openDrawer(artwork, startIndex = 0) {
  const drawer = getElement(DOM_IDS.DRAWER);
  const dimmer = getElement(DOM_IDS.DIMMER);
  const content = getElement(DOM_IDS.DRAWER_CONTENT);
  
  if (!drawer || !dimmer || !content) return;
  
  // Store artwork for thumbnail interaction
  state.setCurrentArtwork(artwork);
  
  // Build drawer content
  content.innerHTML = buildDrawerContent(artwork, startIndex);
  
  // Show drawer
  drawer.classList.add('nk-is-open');
  dimmer.classList.add('nk-is-open');
  
  // Close on dimmer click
  dimmer.onclick = closeDrawer;
}

/**
 * Close drawer
 */
export function closeDrawer() {
  const drawer = getElement(DOM_IDS.DRAWER);
  const dimmer = getElement(DOM_IDS.DIMMER);
  
  if (drawer) drawer.classList.remove('nk-is-open');
  if (dimmer) dimmer.classList.remove('nk-is-open');
}

/**
 * Change main image in drawer
 * @param {number} index - Image index
 */
export function changeMainImage(index) {
  const artwork = state.getCurrentArtwork();
  if (!artwork || !artwork.images || !artwork.images[index]) return;
  
  const container = document.getElementById('main-image-container');
  if (!container) return;
  
  const img = artwork.images[index];
  
  // Update main image
  if (img.mediaType === 'video') {
    container.innerHTML = `<video src="${escapeHtml(img.url)}" controls loop muted playsinline style="width: 100%; max-height: 600px; object-fit: contain;" aria-label="${escapeHtml(img.alt || '')}"></video>`;
  } else {
    container.innerHTML = `<img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt || '')}" style="width: 100%; max-height: 600px; object-fit: contain;" loading="lazy" class="nk-card__image--full">`;
  }
  
  // Update thumbnail borders
  const thumbnails = document.querySelectorAll('[data-index]');
  thumbnails.forEach(thumb => {
    const thumbIndex = parseInt(thumb.getAttribute('data-index'));
    if (thumbIndex === index) {
      thumb.style.border = '3px solid var(--color)';
    } else {
      thumb.style.border = '3px solid transparent';
    }
  });
}

/**
 * Build drawer content HTML
 * @param {Object} artwork - Artwork object
 * @param {number} startIndex - Starting image index
 * @returns {string} HTML string
 */
function buildDrawerContent(artwork, startIndex) {
  const parts = [];
  
  // Title
  parts.push(`<h2 class="nk-heading--2">${escapeHtml(artwork.title)}</h2>`);
  
  // Images
  if (artwork.images && artwork.images.length > 0) {
    parts.push(buildImageGallery(artwork.images, startIndex));
  }
  
  // Description
  if (artwork.description) {
    parts.push(`<p>${escapeHtml(artwork.description)}</p>`);
  }
  
  // Medium
  if (artwork.medium && artwork.medium.length > 0) {
    parts.push(`<p><strong>${escapeHtml(t('medium'))}</strong> ${escapeHtml(artwork.medium.join(', '))}</p>`);
  }
  
  // Dimensions
  if (artwork.dimensions) {
    const dim = artwork.dimensions;
    parts.push(`<p><strong>${escapeHtml(t('dimensions'))}</strong> ${dim.width} × ${dim.height} ${escapeHtml(dim.unit)}</p>`);
  }
  
  // Price
  if (artwork.price) {
    parts.push(`<p><strong>${escapeHtml(t('price'))}</strong> ${artwork.price.amount} ${escapeHtml(artwork.price.currency)}</p>`);
  }
  
  // Status
  if (artwork.status) {
    const statusText = t(artwork.status) || artwork.status;
    parts.push(`<p><strong>Status:</strong> ${escapeHtml(statusText)}</p>`);
  }
  
  // Topics
  if (artwork.topics && artwork.topics.length > 0) {
    const badges = artwork.topics.map(topic => {
      const colorClass = getBadgeColorClass(topic);
      return `<span class="nk-badge ${colorClass}" style="cursor: pointer;" onclick="window.bilaApp.closeDrawer(); window.bilaApp.filterByTopic('${escapeHtml(topic)}')">${escapeHtml(topic)}</span>`;
    }).join(' ');
    parts.push(`<div style="margin-top: var(--small);">${badges}</div>`);
  }
  
  return parts.join('');
}

/**
 * Build image gallery HTML
 * @param {Array} images - Array of image objects
 * @param {number} startIndex - Starting image index
 * @returns {string} HTML string
 */
function buildImageGallery(images, startIndex) {
  const parts = [];
  
  // Main image container
  parts.push(`<div id="main-image-container" style="margin-bottom: var(--medium);">`);
  const mainImg = images[startIndex];
  if (mainImg.mediaType === 'video') {
    parts.push(`<video src="${escapeHtml(mainImg.url)}" controls loop muted playsinline style="width: 100%; max-height: 600px; object-fit: contain;" aria-label="${escapeHtml(mainImg.alt || '')}"></video>`);
  } else {
    parts.push(`<img src="${escapeHtml(mainImg.url)}" alt="${escapeHtml(mainImg.alt || '')}" style="width: 100%; min-height: 800px; object-fit: contain;" loading="lazy" class="nk-card__image--full">`);
  }
  parts.push(`</div>`);
  
  // Thumbnails
  if (images.length > 1) {
    parts.push(`<div style="display: flex; gap: var(--small); margin-bottom: var(--medium); flex-wrap: wrap;">`);
    images.forEach((img, index) => {
      const isActive = index === startIndex ? 'border: 3px solid var(--color);' : 'border: 3px solid transparent;';
      if (img.mediaType === 'video') {
        parts.push(`<video src="${escapeHtml(img.url)}" muted playsinline style="width: 100px; height: 100px; object-fit: cover; border-radius: 3px; cursor: pointer; ${isActive}" onclick="window.bilaApp.changeMainImage(${index})" data-index="${index}"></video>`);
      } else {
        parts.push(`<img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt || '')}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 3px; cursor: pointer; ${isActive}" loading="lazy" onclick="window.bilaApp.changeMainImage(${index})" data-index="${index}">`);
      }
    });
    parts.push(`</div>`);
  }
  
  return parts.join('');
}

/**
 * Setup drawer event listeners
 */
export function setupDrawer() {
  // Close button
  const closeBtn = getElement(DOM_IDS.CLOSE_DRAWER);
  if (closeBtn) {
    closeBtn.onclick = closeDrawer;
  }
  
  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });
}
