import { describe, it, expect, vi, beforeEach } from "vitest";
import { categories } from "./categories.svelte";
import { DEFAULT_CATEGORIES } from "schema";

// Mock IndexedDB
vi.mock("../utils/idb", () => ({
  getDB: vi.fn().mockResolvedValue({
    get: vi.fn(),
    put: vi.fn(),
  }),
}));

describe("CategoryStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    categories.list = [...DEFAULT_CATEGORIES];
    categories.isLoaded = false;
  });

  it("should initialize with default categories", () => {
    expect(categories.list).toEqual(DEFAULT_CATEGORIES);
  });

  it("should add a new category", async () => {
    const newCat = { id: "test", label: "Test", color: "#ffffff", icon: "lucide:star" };
    await categories.addCategory(newCat);
    expect(categories.list).toContainEqual(newCat);
  });

  it("should update an existing category", async () => {
    await categories.updateCategory("npc", { label: "Modified NPC", color: "#000000" });
    const updated = categories.getCategory("npc");
    expect(updated?.label).toBe("Modified NPC");
    expect(updated?.color).toBe("#000000");
  });

  it("should remove a category", async () => {
    await categories.removeCategory("npc");
    expect(categories.getCategory("npc")).toBeUndefined();
  });

  it("should reset to defaults", async () => {
    await categories.removeCategory("npc");
    await categories.resetToDefaults();
    expect(categories.list).toEqual(DEFAULT_CATEGORIES);
  });

  it("should return fallback color for unknown category", () => {
    expect(categories.getColor("non-existent")).toBe("#15803d");
  });
});
