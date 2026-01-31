# Tasks: Node Read Mode

**Branch**: `027-node-read-mode`
**GitHub Issue**: [issue #49](https://github.com/eserlan/Codex-Cryptica/issues/49)
**Spec**: [spec.md](./spec.md)

## Phase 1: Setup

- [x] T001 Create `apps/web/src/lib/stores/ui.svelte.ts` with `readModeNodeId` state and toggle actions
- [x] T002 Update `apps/web/src/routes/+layout.svelte` to mount `NodeReadModal` (placeholder)

## Phase 2: Foundational

- [x] T003 Create `apps/web/src/lib/components/modals/NodeReadModal.svelte` basic shell
- [x] T004 [P] Update `apps/web/src/lib/components/EntityDetailPanel.svelte` to add "Read Mode" button triggering `ui` store

## Phase 3: User Story 1 - View Node in Read Mode

**Goal**: Users can open a focused modal displaying node content.
**Independent Test**: Click "Read Mode" button -> Modal opens with title/content.

- [x] T005 [US1] Implement `NodeReadModal.svelte` rendering logic using `marked` and `DOMPurify` for title and content
- [x] T006 [US1] Implement metadata display (tags, lore) in `NodeReadModal.svelte`
- [x] T007 [P] [US1] Implement close functionality (X button, Esc key, backdrop click) in `NodeReadModal.svelte`

## Phase 4: User Story 2 - Navigate Connected Nodes

**Goal**: Users can navigate the graph from within the modal.
**Independent Test**: Click a connected node link -> Content updates to new node.

- [x] T008 [US2] Update `NodeReadModal.svelte` to fetch connected nodes from `vault.entities` (outgoing) and `vault.inboundConnections` (incoming)
- [x] T009 [US2] Render "Connections" section with clickable links in `NodeReadModal.svelte`, displaying "No linked entities" if empty
- [x] T010 [US2] Implement navigation logic (update `ui.readModeNodeId` on click)

## Phase 5: User Story 3 - Copy Node Content

**Goal**: Users can copy rich text content.
**Independent Test**: Click Copy -> Paste in Google Docs -> Formatting preserved.

- [x] T011 [US3] Implement `copyToClipboard` function in `NodeReadModal.svelte` using `navigator.clipboard.write` with `text/html` and `text/plain`
- [x] T012 [P] [US3] Add "Copy" button to `NodeReadModal.svelte` header with visual feedback (check icon)

## Phase 6: Polish & Verification

- [x] T013 Create E2E test `apps/web/tests/node-read-mode.spec.ts` covering open, navigate, and copy flows
- [x] T014 Verify Markdown rendering style matches application theme (dark/light mode)
- [x] T015 Verify scroll behavior for long content within the modal

## Dependencies

- **US1** requires `UIStore` (Phase 1)
- **US2** requires **US1** (Modal must exist)
- **US3** requires **US1** (Modal must exist)

## Parallel Execution

- T004 (Trigger Button) and T003 (Modal Shell) can be built in parallel.
- T007 (Close Logic) and T005/T006 (Content Rendering) are independent.
- T012 (Copy Button UI) can be built before T011 (Copy Logic).
