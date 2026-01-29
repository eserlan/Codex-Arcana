import { DEFAULT_CATEGORIES, type Category } from "schema";
import { getDB } from "../utils/idb";
import { notifications } from "./notifications.svelte";

class CategoryStore {
  list = $state<Category[]>(DEFAULT_CATEGORIES);
  isLoaded = $state(false);

  async init() {
    if (this.isLoaded) return;

    try {
      const db = await getDB();
      const stored = await db.get("settings", "categories");
      if (stored && Array.isArray(stored)) {
        this.list = stored;
      }
    } catch (e) {
      console.error("Failed to load categories", e);
      notifications.error("Failed to load categories");
    } finally {
      this.isLoaded = true;
    }
  }

  async save(): Promise<void> {
    try {
      const db = await getDB();
      await db.put("settings", $state.snapshot(this.list), "categories");
    } catch (e) {
      console.error("Failed to save categories", e);
      throw e; // Bubble up error
    }
  }

  async addCategory(category: Category) {
    const previousList = [...this.list];
    this.list.push(category);
    try {
      await this.save();
      notifications.success("Category added");
    } catch {
      this.list = previousList;
      notifications.error("Failed to add category");
    }
  }

  async updateCategory(id: string, updates: Partial<Category>) {
    const index = this.list.findIndex((c) => c.id === id);
    if (index !== -1) {
      const previousList = [...this.list];
      this.list[index] = { ...this.list[index], ...updates };
      try {
        await this.save();
      } catch {
        this.list = previousList;
        notifications.error("Failed to update category");
      }
    }
  }

  async removeCategory(id: string) {
    const previousList = [...this.list];
    this.list = this.list.filter((c) => c.id !== id);
    try {
      await this.save();
      notifications.success("Category removed");
    } catch {
      this.list = previousList;
      notifications.error("Failed to remove category");
    }
  }

  async resetToDefaults() {
    const previousList = [...this.list];
    this.list = [...DEFAULT_CATEGORIES];
    try {
      await this.save();
      notifications.success("Categories reset to defaults");
    } catch {
      this.list = previousList;
      notifications.error("Failed to reset categories");
    }
  }

  getCategory(id: string): Category | undefined {
    return this.list.find((c) => c.id === id);
  }

  getColor(id: string): string {
    return this.getCategory(id)?.color || "#15803d"; // Fallback to Scifi Green
  }
}

export const categories = new CategoryStore();
