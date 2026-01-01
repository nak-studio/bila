- Bila euskeraz ixango da eta inglesera itzulitta egongo da.
- Irudiz eta letrak osaturiko lana ixango da.
- Idatzijjak json bidez gordeko doraz, meta datuakin etorkixun baten bilaketa sistema bat erabili ahal ixateko.
- Try not to use budlers by default to avoid getting obsolete

## nakDS hobekuntzak / nakDS improvements needed

**Botoi aldaerak kolorezko funtsetan / Button variants for colored backgrounds:**

nakDS-ek ez du botoi aldaera egokia kolorezko funtsetan (`.nk-bg--m`, `.nk-bg--c`, etab.) erabiltzeko. Gaur egun:
nakDS doesn't have proper button variants for use on colored backgrounds (`.nk-bg--m`, `.nk-bg--c`, etc.). Currently:

- `.nk-button` → magenta border + text over magenta background = invisible
- `.nk-button--color` → magenta background + white text = doesn't contrast enough for active state

**Proposatutako irtenbidea / Proposed solution:**

Gehitu `.nk-button--inverse` edo `.nk-button--outline-light` aldaera:
Add a `.nk-button--inverse` or `.nk-button--outline-light` variant:

```css
.nk-button--inverse {
  background: transparent;
  border-color: var(--color--k-10);
  color: var(--color--k-10);
}

.nk-button--inverse:hover,
.nk-button--inverse.active {
  background: var(--color--k-10);
  color: var(--color);
}
```

Horrela, style.css fitxategian estilo pertsonalizatuak ez lirateke behar izango.
This way, custom styles in style.css wouldn't be needed.

nakDS-ek ez du botoi aldaera egokia kolorezko funtsetan (`.nk-bg--m`, `.nk-bg--c`, etab.) erabiltzeko. Gaur egun:
nakDS doesn't have proper button variants for use on colored backgrounds (`.nk-bg--m`, `.nk-bg--c`, etc.). Currently:

- `.nk-button` → magenta border + text over magenta background = invisible
- `.nk-button--color` → magenta background + white text = doesn't contrast enough for active state

**Proposatutako irtenbidea / Proposed solution:**

Gehitu `.nk-button--inverse` edo `.nk-button--outline-light` aldaera:
Add a `.nk-button--inverse` or `.nk-button--outline-light` variant:

```css
.nk-button--inverse {
  background: transparent;
  border-color: var(--color--k-10);
  color: var(--color--k-10);
}

.nk-button--inverse:hover,
.nk-button--inverse.active {
  background: var(--color--k-10);
  color: var(--color);
}
```

Horrela, style.css fitxategian estilo pertsonalizatuak ez lirateke behar izango.
This way, custom styles in style.css wouldn't be needed.



nak.studio/
├── content/
│   ├── writings.json
│   ├── artworks.json
│   ├── topics.json        (shared themes)
│   └── exhibitions.json  (future)
├── images/
│   ├── artworks/
│   └── writings/
