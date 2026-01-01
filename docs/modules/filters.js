/**
 * Filters Module
 * Handles topic filtering UI and logic
 */

import { state, DOM_IDS } from './state.js';
import { getElement, escapeHtml } from '../utils/dom.js';
import { t } from './i18n.js';

/**
 * Filter content by topic
 * @param {string} topic - Topic to filter by
 */
export function filterByTopic(topic) {
  state.setFilter(topic);
  
  // Dispatch event for main app to reload data
  const event = new CustomEvent('filterChanged');
  document.dispatchEvent(event);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Clear current filter
 */
export function clearFilter() {
  state.clearFilter();
  
  // Dispatch event for main app to reload data
  const event = new CustomEvent('filterChanged');
  document.dispatchEvent(event);
}

/**
 * Update filter display UI
 */
export function updateFilterDisplay() {
  const filterBar = getElement(DOM_IDS.FILTER_BAR);
  const filterDisplay = getElement(DOM_IDS.FILTER_DISPLAY);
  
  if (!filterBar || !filterDisplay) return;
  
  const currentFilter = state.getFilter();
  
  if (currentFilter) {
    filterBar.style.display = 'block';
    
    const filterText = t('filterLabel') || '✨ Exploring';
    const clearText = t('clearFilter') || '✕ Clear';
    filterDisplay.innerHTML = `
      <span style="margin-right: var(--small);">${escapeHtml(filterText)}: <strong>${escapeHtml(currentFilter)}</strong></span>
      <button class="nk-button" onclick="window.bilaApp.clearFilter()">${escapeHtml(clearText)}</button>
    `;
  } else {
    filterBar.style.display = 'none';
  }
}

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
 * Create topic badges component
 * @param {Array} topics - Array of topic strings
 * @returns {HTMLElement} Container with topic badges
 */
export function createTopicBadges(topics) {
  const container = document.createElement('div');
  container.style.marginTop = 'var(--small)';
  
  topics.forEach((topic, index) => {
    const badge = document.createElement('span');
    badge.className = `nk-badge ${getBadgeColorClass(topic)}`;
    badge.textContent = topic;
    badge.style.cursor = 'pointer';
    badge.onclick = (e) => {
      e.stopPropagation();
      filterByTopic(topic);
    };
    container.appendChild(badge);
    
    if (index < topics.length - 1) {
      container.appendChild(document.createTextNode(' '));
    }
  });
  
  return container;
}
