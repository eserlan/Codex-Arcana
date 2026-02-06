# CSS Migration Guide: From JS to Native 2026

Prioritize native CSS solutions for performance and maintainability.

| Legacy Solution (Avoid) | Native CSS 2026 Solution (Prefer) | Why? |
| :--- | :--- | :--- |
| **JS Tooltips / Popovers**<br>`Popper.js`, `Floating UI`, `Tippy.js`<br>Manual `getBoundingClientRect()` | **CSS Anchor Positioning**<br>`anchor-name`, `position-anchor`<br>`top: anchor(bottom)` | Zero layout thrashing, works cross-frame, declarative updates. |
| **Scroll Listeners**<br>`window.addEventListener('scroll')`<br>`GSAP ScrollTrigger`<br>Parallax JS libs | **Scroll-Driven Animations**<br>`animation-timeline: scroll()`<br>`animation-timeline: view()` | Runs on compositor thread (main thread independent), smoother 60fps+. |
| **Intersection Observers**<br>`IntersectionObserver` for fade-ins | **View Timelines**<br>`animation-timeline: view()`<br>`animation-range: entry cover` | Declarative visibility animations without JS observers. |
| **JS Conditionals for Styles**<br>`if (isDark) style.color = ...`<br>Dynamic class toggling for simple values | **CSS `if()` Function**<br>`color: if(style(--mode: dark), ...)`<br>`padding: if(media(width < 500px), ...)` | Keeps styling logic in CSS, reduces JS state management overhead. |
| **Animating Gradients via JS**<br>Canvas hacks or heavy frame loops | **`@property` (Houdini)**<br>Register property with `syntax: '<color>'`<br>Transition standard CSS vars | Hardware accelerated variable transitions. |
| **Container Queries via JS**<br>`ResizeObserver` | **`@container` Queries**<br>Query parent dimensions or styles | Robust component-level responsiveness. |
