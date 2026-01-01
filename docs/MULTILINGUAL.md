# Sistema Multilingüe / Multilingual System

## Ezaugarriak / Features

- **Euskera** (eu) - Hizkuntza lehenetsia / Default language
- **Ingelesa** (en) - Bigarren hizkuntza / Secondary language

## Nola funtzionatzen du / How it works

### 1. Interfazearen Itzulpenak / UI Translations

Itzulpen guztiak gordetzen dira: `docs/data/translations.json`
All translations are stored in: `docs/data/translations.json`

```json
{
  "eu": {
    "siteTitle": "Bila",
    "writings": "Hitzak",
    ...
  },
  "en": {
    "siteTitle": "Bila",
    "writings": "Writings",
    ...
  }
}
```

### 2. Edukien Itzulpenak / Content Translations

Eduki bakoitzak (writings, artworks) **`language`** eremua izan behar du:
Each content item (writings, artworks) must have a **`language`** field:

```json
{
  "id": "writing-003-eu",
  "title": "Poliki-poliki margotzen",
  "language": "eu",
  ...
}
```

### 3. HTML Etiketak / HTML Tags

Itzuli nahi diren elementuek **`data-i18n`** atributua erabiliko dute:
Elements that need translation use the **`data-i18n`** attribute:

```html
<h2 data-i18n="writings">Hitzak</h2>
```

### 4. JavaScript API

#### Hizkuntza aldatzea / Changing language

```javascript
currentLang = 'en'; // or 'eu'
localStorage.setItem('lang', currentLang);
updateUILanguage();
loadData();
```

#### Itzulpenak eskuratzea / Getting translations

```javascript
t('readMore') // Returns "Irakurri gehiago" or "Read more"
```

## Eduki berriak gehitzea / Adding New Content

### Euskeraz / In Basque

```json
{
  "id": "unique-id-eu",
  "title": "Titulua euskeraz",
  "text": "Testua euskeraz...",
  "language": "eu",
  ...
}
```

### Ingelesez / In English

```json
{
  "id": "unique-id-en",
  "title": "Title in English",
  "text": "Text in English...",
  "language": "en",
  ...
}
```

## Itzulpen berriak gehitzea / Adding New Translations

`docs/data/translations.json` fitxategian, gako berriak gehitu:
In the `docs/data/translations.json` file, add new keys:

```json
{
  "eu": {
    "newKey": "Balio berria euskeraz"
  },
  "en": {
    "newKey": "New value in English"
  }
}
```

Eta erabili HTML-n / And use in HTML:

```html
<span data-i18n="newKey">Balio berria euskeraz</span>
```

## Hirugarren hizkuntza bat gehitzea / Adding a Third Language

1. Gehitu hizkuntza berria `translations.json`-en
   Add the new language to `translations.json`

2. Gehitu botoi bat HTML-n
   Add a button in the HTML

3. Sortu edukiak hizkuntza berriarekin
   Create content with the new language

```html
<button class="nk-button lang-btn" data-lang="es">ES</button>
```

## Oharrak / Notes

- Hizkuntza preferentzia **localStorage**-n gordetzen da
  Language preference is saved in **localStorage**

- Euskera da lehenetsitako hizkuntza
  Basque is the default language

- Edukia automatikoki filtratzen da aukeratutako hizkuntzaren arabera
  Content is automatically filtered by selected language
