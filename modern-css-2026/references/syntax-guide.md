# Modern CSS 2026 Syntax Guide

This guide details syntax for Baseline 2026 CSS features. Use these instead of JavaScript libraries.

## 1. Conditional Logic (`if()`)

Inline conditionals for property values. Eliminates the need for many utility classes.

**Syntax:** `property: if(<condition>, <true-value>, <false-value>);`

**Examples:**
```css
/* Responsive/Theme logic without media query blocks */
.card {
  /* Dark mode toggle */
  color: if(media(prefers-color-scheme: dark), #fff, #000);
  
  /* Size toggle via custom property */
  padding: if(style(--size: large), 2rem, 1rem);
  
  /* Feature support fallback */
  display: if(supports(display: grid), grid, flex);
}
```

## 2. CSS Anchor Positioning

Position elements relative to other elements without DOM nesting or JS calculations (replaces Popper.js/Floating UI).

**Concept:**
1.  **Anchor Name:** Give the reference element an `anchor-name`.
2.  **Position Anchor:** Link the floating element to that name.
3.  **Position Functions:** Use `anchor()` to map sides.

**Syntax:**
```css
/* The Trigger/Target */
.trigger-btn {
  anchor-name: --my-menu;
}

/* The Popup/Tooltip */
.popover {
  position: absolute; /* or fixed */
  position-anchor: --my-menu;
  
  /* "Top of popover attaches to Bottom of anchor" */
  top: anchor(bottom); 
  
  /* "Left of popover aligns with Left of anchor" */
  left: anchor(left);
  
  /* Fallback strategies (flip if no space) */
  position-try-options: flip-block, flip-inline;
}
```

## 3. Scroll-Driven Animations

Bind animation timelines to scroll containers or element visibility (replaces GSAP ScrollTrigger/IntersectionObserver).

**Syntax:** `animation-timeline: scroll(<scroller> <axis>);` or `view(<axis>);`

**Examples:**
```css
/* Reading Progress Bar (Scroll linked) */
.progress-bar {
  animation: grow-width auto linear;
  /* 'root' = viewport, 'block' = vertical */
  animation-timeline: scroll(root block);
}

@keyframes grow-width {
  from { width: 0%; }
  to { width: 100%; }
}

/* Element Fade-in (View/Intersection linked) */
.fade-in-on-scroll {
  animation: fade-in linear both;
  /* Animation runs while element is crossing the viewport */
  animation-timeline: view(block);
  animation-range: entry 25% cover 50%;
}
```

## 4. Style Queries (`@container style(...)`)

Apply styles to children based on the *computed style* of a parent container (not just dimensions).

**Syntax:**
```css
/* Parent must be a container */
.card {
  container-name: card;
  --theme: dark; 
}

/* Query variable values */
@container card style(--theme: dark) {
  .card-title { color: white; }
  .card-btn { background: blue; }
}

/* Query standard properties (if supported by browser) */
@container style(background-color: black) {
  .text { color: white; }
}
```

## 5. Type-Safe Variables (`@property`)

Register custom properties to enable transitions/animations on variables (e.g., animating gradients).

**Syntax:**
```css
@property --gradient-stop {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}

.button {
  background: linear-gradient(to right, white, var(--gradient-stop));
  transition: --gradient-stop 0.3s;
}

.button:hover {
  --gradient-stop: blue; /* This will transition smoothly! */
}
```
