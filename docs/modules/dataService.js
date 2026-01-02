/**
 * Data Service Module
 * Handles loading and filtering of JSON data
 */

import { state, DATA_PATHS } from './state.js';

/**
 * Load all data from JSON files
 */
export async function loadData() {
  try {
    const [writingsRes, artworksRes] = await Promise.all([
      fetch(DATA_PATHS.WRITINGS),
      fetch(DATA_PATHS.ARTWORKS)
    ]);
    
    if (!writingsRes.ok || !artworksRes.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const [writingsData, artworksData] = await Promise.all([
      writingsRes.json(),
      artworksRes.json()
    ]);

    const currentLang = state.getLanguage();

    // Filter by current language or show all if no language field
    const writings = (writingsData.writings || []).filter(w => 
      !w.language || w.language === currentLang
    );
    const artworks = (artworksData.artworks || []).filter(a => 
      !a.language || a.language === currentLang
    );

    state.setWritings(writings);
    state.setArtworks(artworks);

    return { writings, artworks };

  } catch (err) {
    console.error('Error loading data:', err);
    throw err;
  }
}

/**
 * Get filtered writings
 * @returns {Array} Filtered writings array
 */
export function getFilteredWritings() {
  return state.getFilteredWritings();
}

/**
 * Get filtered artworks
 * @returns {Array} Filtered artworks array
 */
export function getFilteredArtworks() {
  return state.getFilteredArtworks();
}
