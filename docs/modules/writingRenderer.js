/**
 * Writing Renderer Module
 * Handles rendering of writing items
 */

import { DOM_IDS, TEXT_PREVIEW_LENGTH } from './state.js';
import { getElement, createEl, createMediaElement } from '../utils/dom.js';
import { createTopicBadges } from './filters.js';
import { t } from './i18n.js';

/**
 * Display writings in the container
 * @param {Array} writings - Array of writing objects
 */
export function displayWritings(writings) {
  const container = getElement(DOM_IDS.WRITINGS);
  if (!container) return;
  
  container.innerHTML = ''; // Clear container
  
  writings.forEach(writing => {
    const item = createWritingItem(writing);
    container.appendChild(item);
  });
}

/**
 * Create writing item element
 * @param {Object} writing - Writing object
 * @returns {HTMLElement} Writing item element
 */
function createWritingItem(writing) {
  const div = document.createElement('div');
  div.className = 'item';
  
  // Title
  div.appendChild(createEl('h3', writing.title));
  
  // Images
  if (writing.imageGallery && writing.imageGallery.length > 0) {
    writing.imageGallery.forEach(img => {
      div.appendChild(createMediaElement(img));
    });
  }
  
  // Text
  const p = createEl('p', writing.text);
  p.className = 'text-preview';
  div.appendChild(p);
  
  if (writing.text.length > TEXT_PREVIEW_LENGTH) {
    addReadMore(p, writing.text);
  }
  
  // Topics
  if (writing.topics && writing.topics.length > 0) {
    div.appendChild(createTopicBadges(writing.topics));
  }
  
  return div;
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
