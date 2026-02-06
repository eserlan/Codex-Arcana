# Plan: Modern CSS Tour Overlay (037)

## Phase 1: Preparation & Setup
- [ ] Create reproduction/test case to verify current behavior (scroll positioning, resize).
- [ ] Verify `modern-css-2026` skill is active and understood.

## Phase 2: Tooltip Modernization
- [ ] Refactor `TourOverlay.svelte` to assign `style="anchor-name: --tour-target"` to the active target element.
- [ ] Refactor `GuideTooltip.svelte`:
    - [ ] Remove JS position calculations (`targetRect` dependency).
    - [ ] Implement CSS Anchor Positioning (`position-anchor`, `top: anchor(...)`).
    - [ ] Add `position-try-options` for auto-flipping.

## Phase 3: Spotlight/Mask Modernization
- [ ] Replace JS `clip-path` calculation with the "4-Div Anchored Overlay" technique.
    - [ ] Create 4 helper divs in `TourOverlay` (`.mask-top`, `.mask-bottom`, `.mask-left`, `.mask-right`).
    - [ ] Anchor them to the target's edges to cover the rest of the screen.
    - [ ] Remove `getBoundingClientRect` and `window` listeners entirely.

## Phase 4: Cleanup & Verification
- [ ] Remove unused code (old mask logic, `targetRect` state).
- [ ] Test on mobile/desktop viewports.
- [ ] Verify accessibility (screen readers still see content?).
