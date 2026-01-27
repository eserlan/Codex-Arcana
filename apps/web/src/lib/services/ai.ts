import { CreateMLCEngine, type MLCEngine, type InitProgressCallback } from "@mlc-ai/web-llm";
import { searchService } from "./search";
import { vault } from "../stores/vault.svelte";

const SELECTED_MODEL = "Llama-3-8B-Instruct-q4f32_1-MLC";

export class AIService {
  private engine: MLCEngine | null = null;
  private initializationPromise: Promise<void> | null = null;

  async init(onProgress?: InitProgressCallback) {
    if (this.engine) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        this.engine = await CreateMLCEngine(
          SELECTED_MODEL,
          { initProgressCallback: onProgress }
        );
      } catch (err) {
        console.error("Failed to init WebLLM", err);
        throw err;
      }
    })();

    return this.initializationPromise;
  }

  async generateResponse(query: string, onUpdate: (partial: string) => void) {
    if (!this.engine) throw new Error("AI Engine not initialized");

    const context = await this.retrieveContext(query);
    const systemPrompt = `You are the Lore Oracle, an expert on the user's personal world. 
    Answer the question based ONLY on the provided context. 
    If the answer is not in the context, say "I cannot find that in your records."
    
    Context:
    ${context}
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: query }
    ];

    const chunks = await this.engine.chat.completions.create({
      messages: messages as any,
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of chunks) {
      const delta = chunk.choices[0]?.delta.content || "";
      fullResponse += delta;
      onUpdate(fullResponse);
    }

    return fullResponse;
  }

  private async retrieveContext(query: string): Promise<string> {
    // Search for relevant files
    const results = await searchService.search(query, { limit: 3 });
    
    // Fetch content from VaultStore
    const contents = results.map(result => {
        const entity = vault.entities[result.id];
        if (!entity) return "";
        return `
        --- File: ${entity.title} ---
        ${entity.content}
        `;
    });

    return contents.join("\n\n");
  }
}

export const aiService = new AIService();
