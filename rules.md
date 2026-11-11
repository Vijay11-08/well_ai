# Coding & Design Rules: NeuroNiv

## 1. HTML Guidelines
- **Semantic Tags:** Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`) to improve structure and SEO.
- **Bootstrap Integration:** Use Bootstrap classes for structural grid layouts (e.g., `.container`, `.row`, `.col-md-6`) and standard spacing utilities if needed, but avoid overriding core design aesthetics with Bootstrap's default UI components.
- **Accessibility:** Ensure all interactive elements have appropriate `aria-labels` and images have `alt` tags.

## 2. CSS Guidelines
- **Variables First:** Define all colors, fonts, and common sizing as CSS variables (Custom Properties) at the `:root` level.
- **Hardware Acceleration:** For animations involving position or size, prefer `transform` and `opacity` over animating `top`/`left` or `width`/`height`.
- **Naming Convention:** For custom CSS beyond Bootstrap, use a simplified BEM (Block Element Modifier) approach to prevent style leakage (e.g., `.card-glow`, `.card-glow__title`).
- **Media Queries:** Follow mobile-first design principles. Define base styles for mobile, then use `@media (min-width: ...)` to scale up.

## 3. JavaScript Guidelines
- **Vanilla JS:** Avoid jQuery or heavy libraries. Use modern ES6+ syntax (const/let, arrow functions, template literals).
- **Performance:** Use `requestAnimationFrame` for continuous visual updates (like the custom cursor) instead of `setInterval` or raw `scroll`/`mousemove` event listeners without throttling.
- **Modularity:** Group related functionalities (e.g., Cursor Manager, Scroll Animation Manager) within closures or classes to avoid polluting the global namespace.

## 4. Design Guidelines
- **Color Palette:**
  - Backgrounds: Deep space/navy gradients (`#0c0420` to `#1d1235`).
  - Accents: Pink/Magenta (`#e879f9`) and Purple for glows and underlines.
  - Text: White (`#ffffff`) for primary, dimmed white (`rgba(255, 255, 255, 0.7)`) for secondary.
- **Typography:**
  - Headings: Inter or bold geometric sans-serif.
  - Body: Plus Jakarta Sans or similar clean sans-serif.
  - Handwriting Accents: Caveat or a similar cursive font for special emphasis.
- **Glassmorphism:** Use semi-transparent backgrounds with `backdrop-filter: blur(...)` and subtle white/pink borders for cards and navbars.
