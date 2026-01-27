import { aiService } from "../services/ai";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

class OracleStore {
  messages = $state<ChatMessage[]>([]);
  isOpen = $state(false);
  isLoading = $state(false);
  progress = $state<string | null>(null);
  
  async init() {
    this.isLoading = true;
    this.progress = "Initializing AI...";
    try {
      await aiService.init((report) => {
        this.progress = report.text;
      });
      this.progress = null;
    } catch (err) {
      this.progress = "Failed to load model.";
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  async ask(query: string) {
    if (!query.trim()) return;

    this.messages = [...this.messages, { role: "user", content: query }];
    this.isLoading = true;

    // Placeholder for streaming response
    const assistantMsgIndex = this.messages.length;
    this.messages = [...this.messages, { role: "assistant", content: "" }];

    try {
      if (!aiService["engine"]) {
          await this.init();
      }

      await aiService.generateResponse(query, (partial) => {
        // Update the last message
        const newHistory = [...this.messages];
        newHistory[assistantMsgIndex] = { role: "assistant", content: partial };
        this.messages = newHistory;
      });
    } catch {
      this.messages = [...this.messages, { role: "system", content: "Error generating response." }];
    } finally {
      this.isLoading = false;
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}

export const oracle = new OracleStore();
