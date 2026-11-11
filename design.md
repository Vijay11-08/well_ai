# Design System: NeuroNiv

## 1. Typography
- **Primary Font (Headings):** `Inter` or `Plus Jakarta Sans`. Weights: 600, 700, 800.
- **Secondary Font (Body):** `Inter`. Weights: 400, 500.
- **Accent Font (Handwritten elements):** `Caveat`. Used for specific emphasize text within headings.

## 2. Color Palette
- **Backgrounds:**
  - Base Dark: `#0c0420`
  - Mid Dark (Gradients): `#1d1235`
  - Light Accent Backgrounds: `#ffffff` (for inverted buttons)
- **Accents:**
  - Primary Pink: `#e879f9`
  - Brand Purple: `#8b5cf6`
  - Deep Magenta: `#4A0046`
- **Text:**
  - Primary: `#ffffff`
  - Secondary: `rgba(255, 255, 255, 0.7)`
  - Tertiary: `rgba(255, 255, 255, 0.5)`

## 3. UI Components
- **Buttons:**
  - Primary: White background, black text, slight scale up on hover.
  - Secondary/Outline: Transparent background, white border, white text. Transitions to solid white on hover.
  - Both should have `border-radius: 9999px` (pill shape).
- **Cards (Glassmorphism):**
  - Background: Semi-transparent white (`rgba(255, 255, 255, 0.05)`) or deep purple (`rgba(74, 0, 70, 0.45)`).
  - Border: 1px solid `rgba(255, 255, 255, 0.1)`.
  - Backdrop Filter: `blur(12px)`.
  - Hover State: Slight Y-axis translation up (`-4px`) and increased box-shadow.

## 4. Animations
- **Custom Cursor:** A small, brand-colored SVG or dot that smoothly follows the mouse pointer.
- **Scroll Reveals:** Elements should fade in (`opacity: 0` to `1`) and translate up (`transform: translateY(40px)` to `0`) as they enter the viewport.
- **Marquee:** Infinite horizontal translation for partner logos.
