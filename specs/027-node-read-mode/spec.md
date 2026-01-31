# Feature Specification: Node Read Mode

**Feature Branch**: `027-node-read-mode`
**GitHub Issue**: [issue #49](https://github.com/eserlan/Codex-Cryptica/issues/49)
**Created**: 2026-01-31
**Status**: Draft
**Input**: User description: "Read mode of the node - let's have a modal version of the detail pane with all the info easy readable with a cutnpaste option of the content. Also with the connection linking so we can easily navigate between nodes"

## User Scenarios & Testing

### User Story 1 - View Node in Read Mode (Priority: P1)

As a user, I want to view the details of a node in a focused, read-only modal so that I can consume the information without the distractions of the editing interface.

**Why this priority**: Core functionality of the feature.

**Independent Test**: Can be fully tested by selecting a node and triggering the read mode; the modal should appear with correct content.

**Acceptance Scenarios**:

1. **Given** a selected node in the graph or list, **When** I trigger the "Read Mode" action, **Then** a modal opens displaying the node's title, full content, and metadata.
2. **Given** the read mode modal is open, **When** I click the close button or click outside the modal, **Then** the modal closes and returns me to the previous view.

### User Story 2 - Navigate Connected Nodes (Priority: P1)

As a user, I want to see and click on links to connected nodes within the read mode modal so that I can traverse the knowledge graph seamlessly.

**Why this priority**: Essential for the "navigation" aspect of the request.

**Independent Test**: Create two connected nodes. Open one in read mode. Click the connection link. Verify the second node is displayed.

**Acceptance Scenarios**:

1. **Given** a node with outgoing or incoming connections, **When** I view it in Read Mode, **Then** I see a list of these connected nodes.
2. **Given** a list of connected nodes in the modal, **When** I click on one of them, **Then** the modal updates to display the details of the clicked node.

### User Story 3 - Copy Node Content (Priority: P2)

As a user, I want to easily copy the text content of the node so that I can paste it into other applications or documents.

**Why this priority**: Explicitly requested "cutnpaste option".

**Independent Test**: Open a node with formatted text (bold, lists), click copy, paste into a rich text editor (e.g., Word, Google Docs), verify formatting is preserved.

**Acceptance Scenarios**:

1. **Given** a node is open in Read Mode, **When** I click the "Copy Content" button, **Then** the node's content is copied to my system clipboard.
2. **Given** the content is copied, **When** I paste it into a rich text editor, **Then** the formatting (bold, italics, lists) is preserved.

### Edge Cases

- **Node with no content**: Modal should display a "No content available" message in italicized gray text.
- **Node with no connections**: The connections section should be hidden or show "No connections".
- **Large Content**: Modal body should be scrollable while keeping header/actions accessible.
- **Markdown Rendering**: Ensure markdown in the node body is rendered properly (bold, italics, etc.) for readability, not raw text (unless raw view is toggled, but "easy readable" implies rendered).

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a UI trigger (e.g., button, context menu, keyboard shortcut) to open a node in "Read Mode".
- **FR-002**: System MUST display a modal overlay that covers a significant portion of the screen but maintains context of the application background.
- **FR-003**: The modal MUST display the Node Title, Node Body (rendered Markdown), and associated Metadata (tags, etc.).
- **FR-004**: The modal MUST display a list of connected nodes (both incoming and outgoing relationships).
- **FR-005**: Clicking a connected node in the list MUST navigate the modal to that node's details without closing the modal.
- **FR-006**: System MUST provide a "Copy" button that places the content on the clipboard in multiple formats (plain text/Markdown and rich text/HTML) to ensure formatting is preserved when pasting.
- **FR-007**: The modal MUST have a prominent "Close" button located in the top-right corner.
- **FR-008**: The modal content area MUST be scrollable for long content.

### Key Entities

- **Node**: The primary data object containing Title, Body, Tags, and ID.
- **Connection**: Represents the relationship between two Nodes (Source ID, Target ID).

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can access the content of any node in Read Mode within 2 clicks/interactions.
- **SC-002**: Navigation between linked nodes inside the modal takes less than 1 second to render the new node.
- **SC-003**: The "Copy" function successfully places the node's text content into the clipboard 100% of the time.
- **SC-004**: Users report the "Read Mode" is easier to read than the standard edit pane (qualitative validation).