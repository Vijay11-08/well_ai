# Architecture Document: NeuroNiv

## 1. Frontend Architecture
The NeuroNiv landing page follows a classic, lightweight frontend stack optimized for speed, maintainability, and ease of deployment.

### 1.1 Core Stack
- **HTML5:** Semantic markup structure for accessibility and SEO.
- **CSS3 (Vanilla):** Custom styling, variables for theme tokens (colors, fonts), keyframe animations, and hardware-accelerated transitions.
- **JavaScript (Vanilla JS):** Lightweight DOM manipulation, Intersection Observer API for scroll animations, and custom cursor tracking. No heavy frontend frameworks (like React or Vue) are used for the initial landing page to ensure maximum performance and minimal overhead.
- **Bootstrap 5 (CDN):** Utilized primarily for its robust 12-column flexbox grid system and fundamental layout utilities.

### 1.2 File Structure
```
d:\NeuroNiv\
├── index.html        # Main landing page
├── css/
│   └── style.css     # Custom styles, animations, variables
├── js/
│   └── main.js       # Interaction logic
└── docs/             # (or root) Documentation files
```

## 2. Animation & Interactive Architecture
- **CSS Animations:** Used for continuous effects (e.g., logo marquee, glowing pulses, hover transitions).
- **Intersection Observers (JS):** Used to trigger fade-in and slide-up animations only when elements enter the viewport, improving performance.
- **Custom Cursor:** Implemented via a fixed-position DOM element updated via `requestAnimationFrame` for buttery-smooth movement, replacing the default system cursor on desktop viewports.

## 3. Future Scalability (Phase 2+)
If the platform expands beyond a landing page:
- The static HTML can be migrated into a static site generator (e.g., Astro, Next.js, or Nuxt) for component reusability.
- A Headless CMS (e.g., Sanity, Strapi) can be integrated to manage case studies and blog content.
