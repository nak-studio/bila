/**
 * Global State Management
 * Centralizes application state
 */

// Constants
export const DOM_IDS = {
  ARTWORKS: 'artworks',
  WRITINGS: 'writings',
  DRAWER: 'artwork-drawer',
  DIMMER: 'drawer-dimmer',
  DRAWER_CONTENT: 'drawer-content',
  CLOSE_DRAWER: 'close-drawer',
  FILTER_BAR: 'filter-bar',
  FILTER_DISPLAY: 'filter-display',
  FOOTER_AUTHOR: 'footer-author',
  FOOTER_DESIGN: 'footer-design',
  FOOTER_AI: 'footer-ai',
  FOOTER_LICENSE: 'footer-license'
};

export const DATA_PATHS = {
  TRANSLATIONS: './data/translations.json',
  WRITINGS: './data/writings.json',
  ARTWORKS: './data/artworks.json'
};

export const TEXT_PREVIEW_LENGTH = 200;
export const DEFAULT_LANG = 'eu';

// Application State
class AppState {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || DEFAULT_LANG;
    this.translations = {};
    this.allWritings = [];
    this.allArtworks = [];
    this.currentFilter = null;
    this.currentArtwork = null;
  }

  // Language
  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
  }

  getLanguage() {
    return this.currentLang;
  }

  // Translations
  setTranslations(translations) {
    this.translations = translations;
  }

  getTranslations() {
    return this.translations;
  }

  getTranslation(key) {
    return this.translations[this.currentLang]?.[key] || key;
  }

  // Data
  setWritings(writings) {
    this.allWritings = writings;
  }

  getWritings() {
    return this.allWritings;
  }

  setArtworks(artworks) {
    this.allArtworks = artworks;
  }

  getArtworks() {
    return this.allArtworks;
  }

  // Filter
  setFilter(filter) {
    this.currentFilter = filter;
  }

  getFilter() {
    return this.currentFilter;
  }

  clearFilter() {
    this.currentFilter = null;
  }

  // Current Artwork (for drawer)
  setCurrentArtwork(artwork) {
    this.currentArtwork = artwork;
  }

  getCurrentArtwork() {
    return this.currentArtwork;
  }

  // Get filtered data
  getFilteredWritings() {
    if (!this.currentFilter) return this.allWritings;
    return this.allWritings.filter(w => w.topics && w.topics.includes(this.currentFilter));
  }

  getFilteredArtworks() {
    if (!this.currentFilter) return this.allArtworks;
    return this.allArtworks.filter(a => a.topics && a.topics.includes(this.currentFilter));
  }
}

// Export singleton instance
export const state = new AppState();
