function createEl(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}

// Toggle text preview/full text
function addReadMore(p, fullText) {
  const readMore = document.createElement('span');
  readMore.textContent = ' Read more';
  readMore.className = 'read-more';

  readMore.addEventListener('click', () => {
    if (p.classList.contains('text-preview')) {
      p.classList.remove('text-preview');
      readMore.textContent = ' Show less';
    } else {
      p.classList.add('text-preview');
      readMore.textContent = ' Read more';
    }
  });

  p.appendChild(readMore);
}

// Load JSON
async function loadData() {
  try {
    const writingsRes = await fetch('./docs/data/writings.json');
    const writingsData = await writingsRes.json();
    const artworksRes = await fetch('./docs/data/artworks.json');
    const artworksData = await artworksRes.json();

    displayWritings(writingsData.writings);
    displayArtworks(artworksData.artworks);

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

    const p = createEl('p', w.text);
    p.className = 'text-preview';
    div.appendChild(p);

    if (w.text.length > 200) addReadMore(p, w.text);

    if (w.topics && w.topics.length > 0) {
      div.appendChild(createEl('p', 'Topics: ' + w.topics.join(', ')));
    }

    if (w.imageGallery) {
      w.imageGallery.forEach(img => {
        const imageEl = document.createElement('img');
        imageEl.src = img.url;
        imageEl.alt = img.alt || '';
        div.appendChild(imageEl);
      });
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
    if(a.description) {
      const p = createEl('p', a.description);
      p.className = 'text-preview';
      div.appendChild(p);
      if(a.description.length > 200) addReadMore(p, a.description);
    }

    if (a.images) {
      a.images.forEach(img => {
        const imageEl = document.createElement('img');
        imageEl.src = img.url;
        imageEl.alt = img.alt || '';
        div.appendChild(imageEl);
      });
    }

    container.appendChild(div);
  });
}

loadData();
