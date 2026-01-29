import { describe, it, expect } from "vitest";
import { EntitySchema, CategorySchema, DEFAULT_CATEGORIES } from "./entity";

describe("Entity Schema Validation", () => {
  it("should validate a correct entity", () => {
    const validEntity = {
      id: "npc-1",
      type: "npc",
      title: "Valid NPC",
      tags: ["test"],
      connections: [{ target: "loc-1", type: "located_in", strength: 1 }],
      content: "Some content",
    };

    const result = EntitySchema.safeParse(validEntity);
    expect(result.success).toBe(true);
  });
});

describe("Category Schema Validation", () => {
  it("should validate default categories", () => {
    DEFAULT_CATEGORIES.forEach((cat) => {
      const result = CategorySchema.safeParse(cat);
      expect(result.success).toBe(true);
    });
  });

  it("should require valid hex color", () => {
    const invalidColor = {
      id: "test",
      label: "Test",
      color: "red", // Not hex
      icon: "icon-[lucide--circle]",
    };
    expect(CategorySchema.safeParse(invalidColor).success).toBe(false);

    const validColor = {
      id: "test",
      label: "Test",
      color: "#ff0000",
      icon: "icon-[lucide--circle]",
    };
    expect(CategorySchema.safeParse(validColor).success).toBe(true);
  });

  it("should allow missing icon and use default", () => {
    const noIcon = {
        id: "test",
        label: "Test",
        color: "#ffffff"
    };
    // Zod object parsing doesn't automatically insert default if the property is missing from the input *object* unless we parse it specially or the input is undefined,
    // BUT Zod's .default() works when the value is undefined.
    // However, if the field is missing in the object passed to safeParse, Zod treats it as undefined if it's optional, but if it has a default, it fills it.

    const result = CategorySchema.safeParse(noIcon);
    expect(result.success).toBe(true);
    if (result.success) {
        expect(result.data.icon).toBe("icon-[lucide--circle]");
    }
  });
});
