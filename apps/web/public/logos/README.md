# SOLOFTS — Logo Samples

Exploratory variants. The original `../logo.svg` is unchanged and remains the primary mark.

## Brand colors
| Token | Hex |
|---|---|
| Navy (bg) | `#1A1A2E` |
| Coral (primary) | `#FF4D4D` |
| Coral light | `#FF7070` |
| Gold (accent) | `#FFB830` |
| Gold dark (light-bg accent) | `#C8901F` |
| Cream (text) | `#FFF8F0` |

## Variants

| File | Canvas | Intended use |
|---|---|---|
| `logo-01-flat.svg` | 420×200 | Flat version of the primary lockup. No glow filters — renders predictably in email, PDFs, and print. |
| `logo-02-stacked.svg` | 320×320 | Vertical lockup. Square social avatars, profile images, merch. |
| `logo-03-icon.svg` | 256×256 | Mark only, rounded-square. App icon, favicon, PWA manifest. |
| `logo-04-stamp.svg` | 300×300 | Passport-stamp badge. Contributor badges, "verified story" seals, stickers. |
| `logo-05-light.svg` | 420×200 | Light/cream background. Invoices, press kits, docs, light-mode UI. |
| `logo-06-compact.svg` | ~300×72 | Wordmark + small mark, no tagline. Navbars and tight headers. |

## Note on fonts

Text in these files is converted to **vector paths** rather than `<text>` elements.

This matters: an SVG loaded via `<img src>`, as a favicon, or as an OG image cannot access
fonts from your page CSS. With live `<text>`, Bebas Neue silently falls back to a much wider
system font and the wordmark overflows its canvas.

Trade-off: the text is no longer editable as text. To change wording, regenerate rather than
hand-editing. The original `logo.svg` still uses live `<text>` — fine where the page has the
font loaded, but worth outlining if you ever use it as a favicon or share image.

Fonts: Bebas Neue (wordmark), DM Sans (tagline) — both SIL Open Font License.
