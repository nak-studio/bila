/**
 * Internationalization Module
 * Handles translations and language switching
 */

import { state, DATA_PATHS, DOM_IDS } from './state.js';
import { getElement, escapeHtml } from '../utils/dom.js';

/**
 * Initialize i18n system
 */
export async function initI18n() {
  try {
    const res = await fetch(DATA_PATHS.TRANSLATIONS);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const translations = await res.json();
    state.setTranslations(translations);
    updateUILanguage();
    setupLanguageSwitcher();
  } catch (err) {
    console.error('Error loading translations:', err);
    // Fallback to default language
    state.setTranslations({ [state.getLanguage()]: {} });
  }
}

/**
 * Update UI language
 */
export function updateUILanguage() {
  const currentLang = state.getLanguage();
  document.documentElement.lang = currentLang;
  
  // Update all elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = state.getTranslation(key);
    if (translation !== key) {
      el.textContent = translation;
    }
  });
  
  // Update footer with interpolated templates
  updateFooter();
  
  // Update active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active', 'nk-button--color');
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active', 'nk-button--color');
    }
  });
}

/**
 * Update footer with template interpolation
 */
function updateFooter() {
  const footerElements = {
    author: getElement(DOM_IDS.FOOTER_AUTHOR),
    design: getElement(DOM_IDS.FOOTER_DESIGN),
    ai: getElement(DOM_IDS.FOOTER_AI),
    license: getElement(DOM_IDS.FOOTER_LICENSE)
  };
  
  const translations = state.getTranslations();
  const currentLang = state.getLanguage();
  
  if (!translations[currentLang]) return;
  
  if (footerElements.author) {
    const authorLink = '<a href="https://github.com/nabaroa" target="_blank" rel="author">Naiara Abaroa</a>';
    footerElements.author.innerHTML = t('authorCredit').replace('{author}', authorLink);
  }
  
  if (footerElements.design) {
    const nakdsLink = '<a href="https://github.com/nakDS/nakDS" target="_blank" rel="noopener">nakDS</a>';
    footerElements.design.innerHTML = t('designSystemCredit').replace('{nakds}', nakdsLink);
  }
  
  if (footerElements.ai) {
    const label = t('aiDisclaimerLabel');
    const text = t('aiDisclaimer');
    footerElements.ai.innerHTML = `<strong>${escapeHtml(label)}</strong> ${escapeHtml(text)}`;
  }
  
  if (footerElements.license) {
    const licenseLink = '<a href="https://creativecommons.org/licenses/by/4.0/deed.eu" target="_blank" rel="license">Creative Commons</a>';
    footerElements.license.innerHTML = t('copyright').replace('{license}', licenseLink);
  }
}

/**
 * Setup language switcher buttons
 */
function setupLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      state.setLanguage(btn.dataset.lang);
      updateUILanguage();
      
      // Trigger data reload (will be handled by main app)
      const event = new CustomEvent('languageChanged');
      document.dispatchEvent(event);
    });
  });
}

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @returns {string} Translated text or key if not found
 */
export function t(key) {
  return state.getTranslation(key);
}
