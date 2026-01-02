/**
 * Artwork Renderer Module
 * Handles rendering of artwork items
 */

import { DOM_IDS, TEXT_PREVIEW_LENGTH } from './state.js';
import { getElement, createEl, createMediaElement } from '../utils/dom.js';
import { createTopicBadges } from './filters.js';
import { openDrawer } from './drawer.js';
import { t } from './i18n.js';

/**
 * Display artworks in the container
 * @param {Array} artworks - Array of artwork objects
 */
export function displayArtworks(artworks) {
  const container = getElement(DOM_IDS.ARTWORKS);
  if (!container) return;
  
  container.innerHTML = ''; // Clear container
  
  artworks.forEach(artwork => {
    const item = createArtworkItem(artwork);
    container.appendChild(item);
  });
}

/**
 * Create artwork item element
 * @param {Object} artwork - Artwork object
 * @returns {HTMLElement} Artwork item element
 */
function createArtworkItem(artwork) {
  const div = document.createElement('div');
  div.className = 'item';
  div.style.cursor = 'pointer';
  div.setAttribute('role', 'button');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', `View details of ${artwork.title}`);
  
  // Event handling for opening drawer
  const openArtwork = (e) => {
    // Don't open if clicking on a badge
    if (e.target.classList.contains('nk-badge')) return;
    openDrawer(artwork);
  };
  
  div.onclick = openArtwork;
  div.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openArtwork(e);
    }
  };
  
  // Title
  div.appendChild(createEl('h3', artwork.title));
  
  // Images
  if (artwork.images && artwork.images.length > 0) {
    addImagesToArtwork(div, artwork);
  }
  
  // Description
  if (artwork.description) {
    const p = createEl('p', artwork.description);
    p.className = 'text-preview';
    div.appendChild(p);
    if (artwork.description.length > TEXT_PREVIEW_LENGTH) {
      addReadMore(p, artwork.description);
    }
  }
  
  // Topics
  if (artwork.topics && artwork.topics.length > 0) {
    div.appendChild(createTopicBadges(artwork.topics));
  }
  
  return div;
}

/**
 * Add images to artwork item
 * @param {HTMLElement} container - Container element
 * @param {Object} artwork - Artwork object
 */
function addImagesToArtwork(container, artwork) {
  // Main image (first one)
  const mainImage = createMediaElement(artwork.images[0]);
  mainImage.className = 'nk-card__image';
  mainImage.style.objectFit = 'contain';
  mainImage.style.height = 'auto';
  mainImage.style.maxHeight = '500px';
  container.appendChild(mainImage);
  
  // Additional images as thumbnails
  if (artwork.images.length > 1) {
    const thumbContainer = document.createElement('div');
    thumbContainer.style.display = 'flex';
    thumbContainer.style.gap = 'var(--small)';
    thumbContainer.style.marginTop = 'var(--small)';
    thumbContainer.style.flexWrap = 'wrap';
    
    artwork.images.slice(1).forEach((img, idx) => {
      const thumb = createMediaElement(img);
      thumb.style.width = '80px';
      thumb.style.height = '80px';
      thumb.style.objectFit = 'cover';
      thumb.style.borderRadius = '3px';
      thumb.style.cursor = 'pointer';
      
      // Click on thumbnail opens drawer with that image
      const imageIndex = idx + 1; // +1 because we sliced the first one
      thumb.onclick = (e) => {
        e.stopPropagation();
        openDrawer(artwork, imageIndex);
      };
      
      thumbContainer.appendChild(thumb);
    });
    
    container.appendChild(thumbContainer);
  }
}

/**
 * Add read more/less functionality to text preview
 * @param {HTMLElement} p - Paragraph element
 * @param {string} fullText - Full text content
 */
function addReadMore(p, fullText) {
  const readMore = document.createElement('span');
  readMore.textContent = ' ' + t('readMore');
  readMore.className = 'read-more';

  readMore.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    if (p.classList.contains('text-preview')) {
      p.classList.remove('text-preview');
      readMore.textContent = ' ' + t('showLess');
    } else {
      p.classList.add('text-preview');
      readMore.textContent = ' ' + t('readMore');
    }
  });

  p.appendChild(readMore);
}
