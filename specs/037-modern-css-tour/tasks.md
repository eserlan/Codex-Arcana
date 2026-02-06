# Tasks: Modern CSS Tour Overlay (037)

- [ ] **Prepare Environment**: Ensure `apps/web` builds and tests pass. <!-- id: 0 -->
- [ ] **Refactor Tooltip Logic**: <!-- id: 1 -->
    - [ ] Modify `TourOverlay.svelte` to inject `anchor-name: --tour-target` on the target element.
    - [ ] Update `GuideTooltip.svelte` to use `position-anchor: --tour-target` and remove JS math.
- [ ] **Refactor Mask Logic**: <!-- id: 2 -->
    - [ ] Implement the "4-Div Anchored Overlay" strategy in `TourOverlay.svelte`.
    - [ ] Remove `window.addEventListener` for scroll/resize.
    - [ ] Remove `targetRect` state and `$derived` mask style.
- [ ] **Verify & Polish**: <!-- id: 3 -->
    - [ ] Test tooltip interaction and flipping.
    - [ ] Ensure click-through to target works.
    - [ ] Run lint and build checks.
