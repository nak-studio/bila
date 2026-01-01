// Global state
let currentLang = localStorage.getItem('lang') || 'eu';
let translations = {};

function createEl(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}

// Initialize i18n
async function initI18n() {
  try {
    const res = await fetch('./data/translations.json');
    translations = await res.json();
    updateUILanguage();
    setupLanguageSwitcher();
  } catch (err) {
    console.error('Error loading translations:', err);
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
  const authorEl = document.getElementById('footer-author');
  const designEl = document.getElementById('footer-design');
  const aiEl = document.getElementById('footer-ai');
  const licenseEl = document.getElementById('footer-license');
  
  if (authorEl && translations[currentLang]) {
    const authorLink = '<a href="https://github.com/nabaroa" target="_blank" rel="author">Naiara Abaroa</a>';
    authorEl.innerHTML = t('authorCredit').replace('{author}', authorLink);
  }
  
  if (designEl && translations[currentLang]) {
    const nakdsLink = '<a href="https://github.com/nakDS/nakDS" target="_blank" rel="noopener">nakDS</a>';
    designEl.innerHTML = t('designSystemCredit').replace('{nakds}', nakdsLink);
  }
  
  if (aiEl && translations[currentLang]) {
    const label = t('aiDisclaimerLabel');
    const text = t('aiDisclaimer');
    aiEl.innerHTML = `<strong>${label}</strong> ${text}`;
  }
  
  if (licenseEl && translations[currentLang]) {
    const licenseLink = '<a href="https://creativecommons.org/licenses/by/4.0/deed.eu" target="_blank" rel="license">Creative Commons</a>';
    licenseEl.innerHTML = t('copyright').replace('{license}', licenseLink);
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

// Toggle text preview/full text
function addReadMore(p, fullText) {
  const readMore = document.createElement('span');
  readMore.textContent = ' ' + t('readMore');
  readMore.className = 'read-more';

  readMore.addEventListener('click', () => {
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
    const writingsRes = await fetch('./data/writings.json');
    const writingsData = await writingsRes.json();
    const artworksRes = await fetch('./data/artworks.json');
    const artworksData = await artworksRes.json();

    // Filter by current language or show all if no language field
    const filteredWritings = writingsData.writings.filter(w => 
      !w.language || w.language === currentLang
    );
    const filteredArtworks = artworksData.artworks.filter(a => 
      !a.language || a.language === currentLang
    );

    // Clear containers
    document.getElementById('artworks').innerHTML = '';
    document.getElementById('writings').innerHTML = '';

    displayArtworks(filteredArtworks);
    displayWritings(filteredWritings);

  } catch (err) {
    console.error('Error loading data:', err);
  }
}

// Display Writings
function displayWritings(writings) {
  const container = document.getElementById('writings');
  writings.forEach(w => {
    const div = document.createElement('div');
    div.className = 'item';

    div.appendChild(createEl('h3', w.title));

    if (w.imageGallery && w.imageGallery.length > 0) {
      w.imageGallery.forEach(img => {
        const imageEl = document.createElement('img');
        imageEl.src = img.url;
        imageEl.alt = img.alt || '';
        div.appendChild(imageEl);
      });
    }

    const p = createEl('p', w.text);
    p.className = 'text-preview';
    div.appendChild(p);

    if (w.text.length > 200) addReadMore(p, w.text);

    if (w.topics && w.topics.length > 0) {
      const topicsLabel = createEl('p', t('topicsLabel') + ': ');
      topicsLabel.style.display = 'inline';
      div.appendChild(topicsLabel);
      
      const topicsContainer = document.createElement('div');
      topicsContainer.style.display = 'inline';
      w.topics.forEach((topic, index) => {
        const badge = document.createElement('span');
        badge.className = 'nk-badge';
        badge.textContent = topic;
        topicsContainer.appendChild(badge);
        if (index < w.topics.length - 1) {
          topicsContainer.appendChild(document.createTextNode(' '));
        }
      });
      div.appendChild(topicsContainer);
    }

    container.appendChild(div);
  });
}

// Display Artworks
function displayArtworks(artworks) {
  const container = document.getElementById('artworks');
  artworks.forEach(a => {
    const div = document.createElement('div');
    div.className = 'item';

    div.appendChild(createEl('h3', a.title));

    if (a.images && a.images.length > 0) {
      a.images.forEach(img => {
        const imageEl = document.createElement('img');
        imageEl.src = img.url;
        imageEl.alt = img.alt || '';
        div.appendChild(imageEl);
      });
    }

    if(a.description) {
      const p = createEl('p', a.description);
      p.className = 'text-preview';
      div.appendChild(p);
      if(a.description.length > 200) addReadMore(p, a.description);
    }

    if (a.topics && a.topics.length > 0) {
      const topicsLabel = createEl('p', t('topicsLabel') + ': ');
      topicsLabel.style.display = 'inline';
      div.appendChild(topicsLabel);
      
      const topicsContainer = document.createElement('div');
      topicsContainer.style.display = 'inline';
      a.topics.forEach((topic, index) => {
        const badge = document.createElement('span');
        badge.className = 'nk-badge';
        badge.textContent = topic;
        topicsContainer.appendChild(badge);
        if (index < a.topics.length - 1) {
          topicsContainer.appendChild(document.createTextNode(' '));
        }
      });
      div.appendChild(topicsContainer);
    }

    container.appendChild(div);
  });
}

// Initialize on load
(async function init() {
  await initI18n();
  await loadData();
})();
