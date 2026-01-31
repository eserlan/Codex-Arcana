# Implementation Plan: Node Read Mode

**Branch**: `027-node-read-mode` | **Date**: 2026-01-31 | **Spec**: [link](./spec.md)
**Input**: Feature specification from `/specs/027-node-read-mode/spec.md`

## Summary

Implement a distraction-free "Read Mode" modal for entities, triggered from the detail panel. This feature includes a new global UI store to manage modal state, a modal component rendering markdown content using `marked`, and navigation support for interconnected nodes.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+ + Svelte 5 (Runes)
**Primary Dependencies**: `marked` (Markdown rendering), `isomorphic-dompurify` (Sanitization)
**Storage**: N/A (Transient UI state)
**Testing**: Playwright (E2E)
**Target Platform**: Web (PWA)
**Project Type**: Web application
**Performance Goals**: <100ms modal open time
**Constraints**: Must work offline (local-first)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Local-First Sovereignty**: No external data required.
- [x] **Relational-First Navigation**: Modal includes navigation links.
- [x] **Sub-100ms Performance**: Using lightweight `marked` parser.
- [x] **Atomic Worldbuilding**: Modularity preserved via `NodeReadModal` component.
- [x] **System-Agnostic Core**: No game-specific logic.
- [x] **Pure Functional Core**: Parsing logic is pure.
- [x] **Verifiable Reality**: E2E tests planned.
- [x] **Test-First PWA Integrity**: Offline compatible.

## Project Structure

### Documentation (this feature)

```text
specs/027-node-read-mode/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
apps/
  web/
    src/
      lib/
        components/
          modals/
            NodeReadModal.svelte  # [NEW] Read-only modal component
          EntityDetailPanel.svelte # [UPDATE] Add trigger button
        stores/
          ui.svelte.ts            # [NEW] Global UI state store
      routes/
        +layout.svelte            # [UPDATE] Mount modal globally
```

**Structure Decision**: A new `ui.svelte.ts` store is introduced to manage global UI states (like modals) that don't fit into `vault` (data) or `graph` (visualization). This prevents circular dependencies and separates concerns.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| :--- | :--- | :--- |
| New Store | Need centralized control for global modals | Passing props through +layout is cumbersome and less reactive |