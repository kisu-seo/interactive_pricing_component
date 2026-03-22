# Interactive pricing component

## Table of contents

- [Overview](#overview)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
- [Author](#author)

## Overview

### Screenshot

![Project Screenshot](./interactive_pricing_component.png)

### Links

- Solution URL: [Solution URL](https://github.com/kisu-seo/interactive_pricing_component)
- Live Site URL: [Live URL](https://kisu-seo.github.io/interactive_pricing_component/)

## My process

### Built with

- **Semantic HTML5 Markup** — Utilizing semantic tags like `<header>`, `<main>`, `<section>`, and `<ul>`/`<li>` to ensure robust document structure and web accessibility.
- **Web Accessibility (A11y)** — 
  - Applying Tailwind's `sr-only` class to visually hide the native `<input type="checkbox">` for the custom toggle switch, while keeping it fully accessible to screen readers.
  - Adding `aria-hidden="true"` to decorative SVG images (`bg-pattern.svg`, `pattern-circles.svg`, etc.) to prevent redundant announcements by screen tech.
  - Applying `aria-labelledby` to the range slider `<input type="range">` to clearly establish its structural meaning and context.
- **Tailwind CSS (CDN & Custom Config)** — 
  - Extending the default theme directly within a `<script>` tag's `tailwind.config` to seamlessly inject the `Manrope` font and 11 custom color tokens (`soft-cyan`, `strong-cyan`, etc.) without external stylesheets.
  - **CSS Grid & Flexbox**: Utilizing classes like `grid` and `md:grid-cols-2` to implement complex, responsive layout shifts between mobile and desktop purely via CSS, without altering HTML source order.
- **CSS-Only State Toggle Switch (Tailwind 'peer' class)** — 
  - Leveraging Tailwind's `peer` and `peer-checked:after:translate-x-[18px]` utilities to create highly customized UI animations that perfectly mimic checkbox state changes, completely eliminating the need for JavaScript intervention.
- **Custom Range Slider Styling (Native `<input type="range">`)** — 
  - Neutralizing default browser styling via `appearance: none` and applying pure CSS custom designs over the pseudo-elements (`::-webkit-slider-thumb` and `::-moz-range-thumb`).
  - Implementing an animated, dynamically-filled slider track by letting JavaScript inject an active CSS Custom Property (`--track-bg`) bound to a `linear-gradient` rule.
  - Adding an `@media (min-width: 768px)` query to introduce subtle, desktop-exclusive color transitions (`#10D8C4` ➔ `#7AEADF` ➔ `#24AEA1`) on thumb `hover` and `active` interactions.
- **Architecture-Optimized Vanilla JavaScript (ES6+)** — 
  - **IIFE Encapsulation (Immediately Invoked Function Expression)**: Preventing global scope pollution to ensure enterprise-level code maintainability.
  - **Separation of Concerns (SoC)**: Completely decoupling the state store (`PRICING_STEPS`), DOM object caching (`elements`), business calculation logic (`calculatePrice`), and visual rendering pipelines (`updateDOM`).
  - **Defensive JSDoc Comments**: Utilizing `🚨 [Maintenance]` and `🚨 [Intent]` tags to document the *"Why"* behind technical code formulations, rather than just the *"What"*, guiding fellow developers to collaborate securely.



## Author

- Website - [Kisu Seo](https://github.com/kisu-seo)
- Frontend Mentor - [@kisu-seo](https://www.frontendmentor.io/profile/kisu-seo)
