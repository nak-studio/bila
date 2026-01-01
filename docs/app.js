// Constants
const DOM_IDS = {
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

const DATA_PATHS = {
  TRANSLATIONS: './data/translations.json',
  WRITINGS: './data/writings.json',
  ARTWORKS: './data/artworks.json'
};

const TEXT_PREVIEW_LENGTH = 200;
const DEFAULT_LANG = 'eu';

// Global state
let currentLang = localStorage.getItem('lang') || DEFAULT_LANG;
let translations = {};
let allWritings = [];
let allArtworks = [];
let currentFilter = null;

// Utility: Get element by ID with validation
function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with id "${id}" not found`);
  }
  return element;
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function createEl(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}

// Initialize i18n
async function initI18n() {
  try {
    const res = await fetch(DATA_PATHS.TRANSLATIONS);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    translations = await res.json();
    updateUILanguage();
    setupLanguageSwitcher();
  } catch (err) {
    console.error('Error loading translations:', err);
    // Fallback to default language
    translations = { [DEFAULT_LANG]: {} };
  }
}

// Update UI language
function updateUILanguage() {
  document.documentElement.lang = currentLang;
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
  
  // Update footer with interpolated templates
  updateFooter();
  
  // Update active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active', 'nk-button--color');
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active', 'nk-button--color');
    }
  });
}

// Update footer with template interpolation
function updateFooter() {
  const footerElements = {
    author: getElement(DOM_IDS.FOOTER_AUTHOR),
    design: getElement(DOM_IDS.FOOTER_DESIGN),
    ai: getElement(DOM_IDS.FOOTER_AI),
    license: getElement(DOM_IDS.FOOTER_LICENSE)
  };
  
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

// Setup language switcher
function setupLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      localStorage.setItem('lang', currentLang);
      updateUILanguage();
      // Reload content with new language
      loadData();
    });
  });
}

// Get translation
function t(key) {
  return translations[currentLang]?.[key] || key;
}

// Open drawer with artwork details
function openDrawer(artwork) {
  const drawer = getElement(DOM_IDS.DRAWER);
  const dimmer = getElement(DOM_IDS.DIMMER);
  const content = getElement(DOM_IDS.DRAWER_CONTENT);
  
  if (!drawer || !dimmer || !content) return;
  
  // Build drawer content safely
  const parts = [];
  
  parts.push(`<h2 class="nk-heading--2">${escapeHtml(artwork.title)}</h2>`);
  
  if (artwork.images && artwork.images.length > 0) {
    artwork.images.forEach(img => {
      if (img.mediaType === 'video') {
        parts.push(`<video src="${escapeHtml(img.url)}" controls loop muted playsinline style="width: 100%; margin-bottom: var(--medium);" aria-label="${escapeHtml(img.alt || '')}"></video>`);
      } else {
        parts.push(`<img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt || '')}" style="width: 100%; margin-bottom: var(--medium);" loading="lazy">`);
      }
    });
  }
  
  if (artwork.description) {
    parts.push(`<p>${escapeHtml(artwork.description)}</p>`);
  }
  
  if (artwork.medium && artwork.medium.length > 0) {
    parts.push(`<p><strong>${escapeHtml(t('medium'))}</strong> ${escapeHtml(artwork.medium.join(', '))}</p>`);
  }
  
  if (artwork.dimensions) {
    const dim = artwork.dimensions;
    parts.push(`<p><strong>${escapeHtml(t('dimensions'))}</strong> ${dim.width} × ${dim.height} ${escapeHtml(dim.unit)}</p>`);
  }
  
  if (artwork.price) {
    parts.push(`<p><strong>${escapeHtml(t('price'))}</strong> ${artwork.price.amount} ${escapeHtml(artwork.price.currency)}</p>`);
  }
  
  if (artwork.status) {
    const statusText = t(artwork.status) || artwork.status;
    parts.push(`<p><strong>Status:</strong> ${escapeHtml(statusText)}</p>`);
  }
  
  if (artwork.topics && artwork.topics.length > 0) {
    const badges = artwork.topics.map(topic => 
      `<span class="nk-badge" style="cursor: pointer;" onclick="closeDrawer(); filterByTopic('${escapeHtml(topic)}')">${escapeHtml(topic)}</span>`
    ).join(' ');
    parts.push(`<div style="margin-top: var(--small);">${badges}</div>`);
  }
  
  content.innerHTML = parts.join('');
  drawer.classList.add('nk-is-open');
  dimmer.classList.add('nk-is-open');
  
  // Close on dimmer click
  dimmer.onclick = closeDrawer;
}

// Close drawer
function closeDrawer() {
  const drawer = getElement(DOM_IDS.DRAWER);
  const dimmer = getElement(DOM_IDS.DIMMER);
  
  if (drawer) drawer.classList.remove('nk-is-open');
  if (dimmer) dimmer.classList.remove('nk-is-open');
}

// Toggle text preview/full text
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

// Load JSON
async function loadData() {
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

    // Filter by current language or show all if no language field
    allWritings = (writingsData.writings || []).filter(w => 
      !w.language || w.language === currentLang
    );
    allArtworks = (artworksData.artworks || []).filter(a => 
      !a.language || a.language === currentLang
    );

    // Apply filter if exists
    const filteredWritings = currentFilter
      ? allWritings.filter(w => w.topics && w.topics.includes(currentFilter))
      : allWritings;
    const filteredArtworks = currentFilter
      ? allArtworks.filter(a => a.topics && a.topics.includes(currentFilter))
      : allArtworks;

    // Clear containers
    const artworksContainer = getElement(DOM_IDS.ARTWORKS);
    const writingsContainer = getElement(DOM_IDS.WRITINGS);
    
    if (artworksContainer) artworksContainer.innerHTML = '';
    if (writingsContainer) writingsContainer.innerHTML = '';

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

// Filter by topic
function filterByTopic(topic) {
  currentFilter = topic;
  loadData();
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Clear filter
function clearFilter() {
  currentFilter = null;
  loadData();
}

// Update filter display
function updateFilterDisplay() {
  const filterBar = getElement(DOM_IDS.FILTER_BAR);
  const filterDisplay = getElement(DOM_IDS.FILTER_DISPLAY);
  
  if (!filterBar || !filterDisplay) return;
  
  if (currentFilter) {
    filterBar.style.display = 'block';
    
    const filterText = t('filterLabel') || '✨ Exploring';
    const clearText = t('clearFilter') || '✕ Clear';
    filterDisplay.innerHTML = `
      <span style="margin-right: var(--small);">${escapeHtml(filterText)}: <strong>${escapeHtml(currentFilter)}</strong></span>
      <button class="nk-button" onclick="clearFilter()">${escapeHtml(clearText)}</button>
    `;
  } else {
    filterBar.style.display = 'none';
  }
}

// Helper: Create topic badges
function createTopicBadges(topics) {
  const container = document.createElement('div');
  container.style.marginTop = 'var(--small)';
  
  topics.forEach((topic, index) => {
    const badge = document.createElement('span');
    badge.className = 'nk-badge';
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

// Helper: Create image element
function createImageElement(img) {
  const imageEl = document.createElement('img');
  imageEl.src = img.url;
  imageEl.alt = img.alt || '';
  imageEl.loading = 'lazy'; // Lazy loading for performance
  return imageEl;
}

// Helper: Create media element (image or video)
function createMediaElement(media) {
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
    return createImageElement(media);
  }
}

// Display Writings
function displayWritings(writings) {
  const container = getElement(DOM_IDS.WRITINGS);
  if (!container) return;
  
  writings.forEach(w => {
    const div = document.createElement('div');
    div.className = 'item';

    div.appendChild(createEl('h3', w.title));

    if (w.imageGallery && w.imageGallery.length > 0) {
      w.imageGallery.forEach(img => {
        div.appendChild(createMediaElement(img));
      });
    }

    const p = createEl('p', w.text);
    p.className = 'text-preview';
    div.appendChild(p);

    if (w.text.length > TEXT_PREVIEW_LENGTH) {
      addReadMore(p, w.text);
    }

    if (w.topics && w.topics.length > 0) {
      div.appendChild(createTopicBadges(w.topics));
    }

    container.appendChild(div);
  });
}

// Display Artworks
function displayArtworks(artworks) {
  const container = getElement(DOM_IDS.ARTWORKS);
  if (!container) return;
  
  artworks.forEach(a => {
    const div = document.createElement('div');
    div.className = 'item';
    div.style.cursor = 'pointer';
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', `View details of ${a.title}`);
    
    // Better event handling
    const openArtwork = (e) => {
      // Don't open if clicking on a badge
      if (e.target.classList.contains('nk-badge')) return;
      openDrawer(a);
    };
    div.onclick = openArtwork;
    div.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openArtwork(e);
      }
    };

    div.appendChild(createEl('h3', a.title));

    if (a.images && a.images.length > 0) {
      a.images.forEach(img => {
        div.appendChild(createMediaElement(img));
      });
    }

    if (a.description) {
      const p = createEl('p', a.description);
      p.className = 'text-preview';
      div.appendChild(p);
      if (a.description.length > TEXT_PREVIEW_LENGTH) {
        addReadMore(p, a.description);
      }
    }

    if (a.topics && a.topics.length > 0) {
      div.appendChild(createTopicBadges(a.topics));
    }

    container.appendChild(div);
  });
}

// Initialize on load
(async function init() {
  try {
    await initI18n();
    await loadData();
    
    // Setup close drawer button
    const closeBtn = getElement(DOM_IDS.CLOSE_DRAWER);
    if (closeBtn) {
      closeBtn.onclick = closeDrawer;
    }
    
    // Setup keyboard shortcut to close drawer (Escape key)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    });
  } catch (err) {
    console.error('Error during initialization:', err);
  }
})();
