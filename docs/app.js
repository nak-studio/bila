/**
 * Bila - Main Application Entry Point
 * Modular architecture for artwork and writing portfolio
 */

// Import modules
import { initI18n } from './modules/i18n.js';
import { loadData, getFilteredWritings, getFilteredArtworks } from './modules/dataService.js';
import { displayArtworks } from './modules/artworkRenderer.js';
import { displayWritings } from './modules/writingRenderer.js';
import { filterByTopic, clearFilter, updateFilterDisplay } from './modules/filters.js';
import { openDrawer, openWritingDrawer, closeDrawer, changeMainImage, setupDrawer } from './modules/drawer.js';
import { getElement } from './utils/dom.js';
import { DOM_IDS } from './modules/state.js';

/**
 * Set random cover image
 */
function setRandomCoverImage() {
  const coverImages = [
    'https://raw.githubusercontent.com/nakDS/nakds/refs/heads/main/assets/img/randomMatches.jpg',
    'https://raw.githubusercontent.com/nakDS/nakds/refs/heads/main/assets/img/scott-rodgerson-z0MDyylvY1k-unsplash.jpg',
    'https://raw.githubusercontent.com/nakDS/nakds/refs/heads/main/assets/img/kevin-lee-K9cc-19hBKY-unsplash.jpg',
    'https://raw.githubusercontent.com/nakDS/nakds/refs/heads/main/assets/img/randomMatches_142.jpg'
  ];
  
  const randomImage = coverImages[Math.floor(Math.random() * coverImages.length)];
  const cover = document.querySelector('.nk-cover--with-image');
  
  if (cover) {
    cover.style.backgroundImage = `
      linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url(${randomImage})
    `;
  }
}

/**
 * Render all content (artworks and writings)
 */
async function renderContent() {
  try {
    await loadData();
    
    const filteredWritings = getFilteredWritings();
    const filteredArtworks = getFilteredArtworks();
    
    // Clear containers
    const artworksContainer = getElement(DOM_IDS.ARTWORKS);
    const writingsContainer = getElement(DOM_IDS.WRITINGS);
    
    if (artworksContainer) artworksContainer.innerHTML = '';
    if (writingsContainer) writingsContainer.innerHTML = '';
    
    // Render content
    displayArtworks(filteredArtworks);
    displayWritings(filteredWritings);
    
    // Update filter display
    updateFilterDisplay();
    
  } catch (err) {
    console.error('Error loading data:', err);
    // Show user-friendly error message
    const artworksContainer = getElement(DOM_IDS.ARTWORKS);
    const writingsContainer = getElement(DOM_IDS.WRITINGS);
    const errorMsg = '<p>Error loading content. Please refresh the page.</p>';
    if (artworksContainer) artworksContainer.innerHTML = errorMsg;
    if (writingsContainer) writingsContainer.innerHTML = errorMsg;
  }
}

/**
 * Initialize application
 */
async function init() {
  try {
    // Set random cover image
    setRandomCoverImage();
    
    // Initialize i18n system
    await initI18n();
    
    // Load and render initial content
    await renderContent();
    
    // Setup drawer (close button, keyboard shortcuts)
    setupDrawer();
    
    // Listen for language change events
    document.addEventListener('languageChanged', () => {
      renderContent();
    });
    
    // Listen for filter change events
    document.addEventListener('filterChanged', () => {
      renderContent();
    });
    
  } catch (err) {
    console.error('Error during initialization:', err);
  }
}

// Export public API for inline event handlers
window.bilaApp = {
  openDrawer,
  openWritingDrawer,
  closeDrawer,
  changeMainImage,
  filterByTopic,
  clearFilter
};

// Start application
init();
