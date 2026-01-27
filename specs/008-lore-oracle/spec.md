# Lore Oracle: Local AI Assistant

## Background
Users with large vaults need a way to query their lore naturally ("Who is the king?", "What happened in the year 2300?") without manually searching keywords. The "Lore Oracle" will be a chat interface powered by a local LLM running entirely in the browser via WebGPU.

## Objectives
1.  **Local-First AI**: Run a sophisticated LLM (e.g., Llama-3-8B-Quantized) directly in the browser using `WebLLM` or `Transformers.js`. Zero data exfiltration.
2.  **RAG (Retrieval-Augmented Generation)**: Use the existing `FlexSearch` index to retrieve relevant note context and feed it to the LLM for accurate answers.
3.  **Chat UI**: A floating chat panel to interact with the Oracle.

## Constraints
-   **Hardware**: Requires WebGPU support (modern browser + GPU).
-   **Download Size**: Model weights (~2-4GB) must be cached locally after first load.
-   **Privacy**: STRICTLY no external API calls (OpenAI, Anthropic, etc.).

## Implementation Plan

### 1. AI Core (Service)
*   Integrate `@mlc-ai/web-llm`.
*   Create `AIService` to manage model loading, inference, and context window.
*   Implement `RAGService` to glue `SearchService` results into the LLM prompt.

### 2. UI Components
*   `OracleChat.svelte`: A collapsible chat window.
*   `ModelLoader.svelte`: Progress bar/status for the initial model download.

## User Story
As a DM, I want to ask "Who hates the Red Faction?" and have the AI check my notes on "Red Faction" and "Rivals" to give me a summarized answer, so I don't have to open 5 different files.
