# Plan: Lore Oracle

## Overview
Integrate `WebLLM` to provide offline, private, in-browser AI chat capabilities that utilize the vault's content as context.

## Architecture

### 1. The Brain (`AIService`)
- **Library**: `@mlc-ai/web-llm`
- **Model**: `Llama-3-8B-Instruct-q4f32_1` (or a smaller variant if performance requires, like `Phi-3`).
- **Storage**: Model weights cached in browser Cache API by the library.

### 2. The Retrieval (`RAG`)
- **Query**: User input -> `SearchService.search(query)`.
- **Context**: Top 3-5 results from search are read from `VaultStore` (content).
- **Prompt Engineering**:
  ```text
  System: You are the Lore Oracle. Answer based ONLY on the provided context.
  Context: {file_content_1} ... {file_content_n}
  Question: {user_query}
  ```

## Dependencies
- `@mlc-ai/web-llm`

## Proposed Changes

### Frontend (`apps/web`)
- **`src/lib/services/ai.ts`**: Wrapper for WebLLM engine.
- **`src/lib/components/oracle/OracleWindow.svelte`**: Chat interface.
- **`src/lib/stores/oracle.svelte.ts`**: Store for chat history and loading state.

## Risks
- **Browser Compatibility**: WebGPU is not universal yet (though widely available in Chrome/Edge). We must handle "unsupported" states gracefully.
- **Memory Usage**: LLMs use significant RAM/VRAM. We must ensure we unload the model when not in use or warn the user.
