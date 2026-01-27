# Tasks: Lore Oracle

- [ ] **Infrastructure: Dependencies** <!-- id: 1 -->
    - [ ] Install `@mlc-ai/web-llm` in `apps/web`. <!-- id: 1.1 -->
    - [ ] Update `vite.config.ts` if needed for worker/wasm compatibility. <!-- id: 1.2 -->

- [ ] **Core: AI Service** <!-- id: 2 -->
    - [ ] Create `apps/web/src/lib/services/ai.ts` to manage WebLLM engine initialization and chat completions. <!-- id: 2.1 -->
    - [ ] Implement `apps/web/src/lib/stores/oracle.svelte.ts` for reactive state (messages, isLoading, modelProgress). <!-- id: 2.2 -->

- [ ] **Core: RAG Integration** <!-- id: 3 -->
    - [ ] Implement `augmentPrompt(query: string)` function in `ai.ts` that calls `searchService` and retrieves note content. <!-- id: 3.1 -->

- [ ] **UI: Oracle Interface** <!-- id: 4 -->
    - [ ] Create `apps/web/src/lib/components/oracle/OracleWindow.svelte` (floating panel). <!-- id: 4.1 -->
    - [ ] Create `apps/web/src/lib/components/oracle/ChatMessage.svelte`. <!-- id: 4.2 -->
    - [ ] Integrate `OracleWindow` into `+layout.svelte` or `+page.svelte`. <!-- id: 4.3 -->

- [ ] **Quality Assurance** <!-- id: 5 -->
    - [ ] **Offline Functionality Verification**: Ensure model loads from cache after first run without network. <!-- id: 5.1 -->
    - [ ] Verify `npm run lint` passes. <!-- id: 5.2 -->
