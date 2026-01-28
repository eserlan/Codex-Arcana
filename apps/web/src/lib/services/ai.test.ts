import { describe, it, expect, vi, beforeEach } from "vitest";
import { aiService } from "./ai";
import { vault } from "../stores/vault.svelte";
import { searchService } from "./search";

vi.mock("../stores/vault.svelte", () => ({
    vault: {
        entities: {},
        selectedEntityId: null,
        inboundConnections: {},
    },
}));

vi.mock("./search", () => ({
    searchService: {
        search: vi.fn(),
    },
}));

vi.mock("@google/generative-ai", () => ({
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
        getGenerativeModel: vi.fn(),
    })),
}));

describe("AIService Context Retrieval", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Setup entities in the mocked vault
        (vault as any).entities = {
            "woods-id": { id: "woods-id", title: "The Woods", content: "Dark woods.", connections: [] },
            "crone-id": { id: "crone-id", title: "The Crone", content: "Old woman.", connections: [] },
            "guardsman-id": { id: "guardsman-id", title: "The Guardsman", content: "A guard in the woods.", connections: [] },
        };
        (vault as any).selectedEntityId = null;
        (vault as any).inboundConnections = {};
        vi.mocked(searchService.search).mockResolvedValue([]);
    });

    it("should prioritize explicit title matches over active selection", async () => {
        (vault as any).selectedEntityId = "crone-id";
        const { primaryEntityId } = await aiService.retrieveContext("Tell me about The Woods", new Set());
        expect(primaryEntityId).toBe("woods-id");
    });

    it("should prioritize high-confidence search results over active selection", async () => {
        (vault as any).selectedEntityId = "crone-id";
        vi.mocked(searchService.search).mockResolvedValue([
            { id: "woods-id", title: "The Woods", score: 0.9, matchType: "title", path: "" }
        ]);

        // Query doesn't mention the woods directly, so Tier 1 (Explicit Match) fails.
        // Tier 2 (High Confidence Search) should win.
        const { primaryEntityId } = await aiService.retrieveContext("What is in that place?", new Set());
        expect(primaryEntityId).toBe("woods-id");
    });

    it("should stick to previous context for follow-up questions", async () => {
        (vault as any).selectedEntityId = "crone-id";
        // Not an explicit match, no high-confidence search match.
        // Tier 3 (Sticky Follow-up) should win because of "it".
        const { primaryEntityId } = await aiService.retrieveContext("Tell me more about it", new Set(), "woods-id");
        expect(primaryEntityId).toBe("woods-id");
    });

    it("should ignore low-confidence search results and fallback to active selection", async () => {
        (vault as any).selectedEntityId = "crone-id";
        vi.mocked(searchService.search).mockResolvedValue([
            { id: "guardsman-id", title: "The Guardsman", score: 0.4, matchType: "content", path: "" }
        ]);

        // Tier 1 fails, Tier 2 fails (0.4 < 0.6), Tier 3 fails (not a follow-up)
        // Tier 4 (Active View) should win.
        const { primaryEntityId } = await aiService.retrieveContext("Who is there?", new Set());
        expect(primaryEntityId).toBe("crone-id");
    });

    it("should fallback to top search result if no active selection and no other matches", async () => {
        (vault as any).selectedEntityId = null;
        vi.mocked(searchService.search).mockResolvedValue([
            { id: "guardsman-id", title: "The Guardsman", score: 0.4, matchType: "content", path: "" }
        ]);

        const { primaryEntityId } = await aiService.retrieveContext("Who is there?", new Set());
        expect(primaryEntityId).toBe("guardsman-id");
    });

    it("should switch context even with sticky context if a new title is explicitly mentioned", async () => {
        // Tier 1 (Explicit Match) has highest priority.
        const { primaryEntityId } = await aiService.retrieveContext("Tell me about The Crone", new Set(), "woods-id");
        expect(primaryEntityId).toBe("crone-id");
    });

    it("should recognize follow-ups with pronouns", async () => {
        // The internal method isFollowUp is private, but we test it via behavior
        (vault as any).selectedEntityId = "crone-id";
        const { primaryEntityId } = await aiService.retrieveContext("What is his role?", new Set(), "guardsman-id");
        expect(primaryEntityId).toBe("guardsman-id");
    });
});
