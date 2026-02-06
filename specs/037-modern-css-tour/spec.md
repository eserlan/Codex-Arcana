# Spec: Modern CSS Tour Overlay (037)

## 1. Overview
This feature modernizes the "Tour/Guide" system (`TourOverlay.svelte`, `GuideTooltip.svelte`) by replacing JavaScript-heavy positioning logic with **Native CSS Anchor Positioning (Baseline 2026)**. This improves performance, reduces code complexity, and leverages the browser's native layout engine for smooth updates.

## 2. Problem Statement
The current implementation relies on:
- `getBoundingClientRect()` calls on every scroll/resize event.
- `window.addEventListener('scroll', ...)` causing main-thread traffic.
- Complex JavaScript math to calculate tooltip positions and handle viewport collisions.
- Manual `clip-path` calculations for the spotlight mask.

## 3. Proposed Solution
Refactor the components to use the `modern-css-2026` skill set:
1. **CSS Anchor Positioning**: Use `anchor-name` on the target element and `position-anchor` on the tooltip/mask.
2. **CSS `position-try`**: Use native fallback strategies (`flip-block`, `flip-inline`) instead of manual collision detection.
3. **4-Div Anchored Mask**: Replace the complex `clip-path` calculation with a strategy using 4 anchored helper divs (Top, Bottom, Left, Right) to create a click-blocking "hole" around the target. This eliminates the need for `getBoundingClientRect`.

## 4. Technical Details

### 4.1 Target Identification
Instead of reading `rect` in JS, we will programmatically assign a unique `anchor-name` to the active target element.

```javascript
// TourOverlay.svelte (logic)
$effect(() => {
  const el = document.querySelector(step.targetSelector);
  if (el) {
    el.style.anchorName = '--tour-target';
  }
  return () => {
    if (el) el.style.anchorName = '';
  };
});
```

### 4.2 GuideTooltip.svelte
Remove all positioning props (`top`, `left`, `transform`) and use CSS:

```css
.tooltip {
  position: fixed;
  position-anchor: --tour-target;
  
  /* Default: Bottom Center */
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 16px; /* Center horizontally + margin */

  /* Auto-flip if out of bounds */
  position-try-options: flip-block, flip-inline;
}
```

### 4.3 Spotlight Mask
The spotlight visual can also be an anchored element:

```css
.spotlight {
  position: fixed;
  position-anchor: --tour-target;
  top: anchor(top);
  left: anchor(left);
  width: anchor-size(width);
  height: anchor-size(height);
  box-shadow: 0 0 0 9999px rgba(0,0,0,0.6); /* The overlay */
  pointer-events: none; /* Let clicks pass through to target */
  z-index: 80;
}
```
*Note: This creates a visual overlay. To block clicks on non-target areas, we might need a backdrop. A full-screen backdrop with `pointer-events: auto` underneath the spotlight (which is `z-index` higher) might work, but the spotlight itself is transparent.*

**Strategy for Clicks:**
- Layer 1 (Backdrop): Fixed, full screen, `rgba(0,0,0,0)`, blocks clicks. `z-index: 79`.
- Layer 2 (Spotlight): Anchored to target, `box-shadow` (visual dark overlay), `pointer-events: none`. `z-index: 80`.
- Layer 3 (Tooltip): Anchored to target. `z-index: 82`.

Wait, `box-shadow` on the spotlight element will go *over* Layer 1. The "hole" is the spotlight element itself. Since it has `pointer-events: none`, clicks go through the hole... to Layer 1 (Backdrop)? No, Layer 1 is *under* Layer 2.

If Layer 1 blocks clicks, then clicks through the "hole" (Layer 2) hit Layer 1 and stop. We want clicks to hit the *target* (Layer 0).
So Layer 1 must *not* cover the target.
This implies the "Spotlight" element itself must handle the click blocking? No, elements are rectangles.

**Revised Spotlight Strategy:**
Keep the `clip-path` for the *interaction mask* if strictly necessary, BUT simplifying it.
OR:
Use the `overlay` property if available? No.
Actually, for now, let's strictly modernize the **Tooltip Positioning** as the primary goal. The Mask logic can remain JS-based if CSS alone cannot achieve "click hole" reliably without `clip-path`.
However, we can simplify the `rect` fetching. If the mask needs `rect`, we still need `getBoundingClientRect`?
Yes, `clip-path` needs coordinates. `anchor()` cannot be used inside `clip-path`.
**Compromise:**
- **Tooltip**: Fully CSS Anchored (Major win).
- **Mask**: Keep JS `getBoundingClientRect` logic for now, OR switch to a "4-div" approach (top/bottom/left/right overlays) anchored to the sides of the target?
    - Top Overlay: `bottom: anchor(top)`
    - Bottom Overlay: `top: anchor(bottom)`
    - Left Overlay: `right: anchor(left)`, `top: anchor(top)`, `bottom: anchor(bottom)`
    - Right Overlay: `left: anchor(right)`, ...
    - This allows full click blocking around the target using 4 anchored divs! **This is the Modern CSS way to make a hole.**

## 5. Security & Constraints
- Ensure `anchor-name` is scoped or unique enough to avoid collisions (use `--tour-active-target`).
- Browser Support: Assumes Baseline 2026 (Chrome 125+, etc.).

## 6. Testing
- Verify tooltip follows target on scroll/resize.
- Verify "flip" behavior when target is near edges.
- Verify clicks pass through the spotlight to the target.
