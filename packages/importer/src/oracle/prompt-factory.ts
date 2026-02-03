export const EXTRACTION_PROMPT = `
You are an expert Codex Archivist. Your task is to analyze the provided text and extract distinct semantic entities (Characters, Locations, Items, Lore, Factions).

For each identified entity:
1.  **Title**: A concise, unique name.
2.  **Type**: One of [Character, Location, Item, Lore, Faction].
3.  **Chronicle**: A short (1-2 paragraph) Markdown summary of the entity. This should be suitable for a quick overview.
4.  **Lore**: Detailed background information, history, secrets, or complex data. This is the "deep dive" content.
5.  **Frontmatter**: Generate YAML properties relevant to the type (e.g., "race", "gender", "alignment" for Character; "region", "climate" for Location).
6.  **Image**: Scan the text for any absolute URLs starting with http or https that point to images (ending in .png, .jpg, .jpeg, .webp). These are common in campaign exports (e.g., Alchemy, Midjourney, CDN links). Include the most relevant one as "imageUrl". Avoid relative paths or local asset references.
7.  **Connections**: Identify names of OTHER entities mentioned in the text. Provide a descriptive label for the relationship if possible (e.g., "enemy of", "home of", "grandmother of").

Output the result as a STRICT JSON Array of objects. Do not include markdown code fences around the JSON.
Schema:
[
  {
    "title": "string",
    "type": "string",
    "chronicle": "markdown string",
    "lore": "markdown string",
    "frontmatter": { "key": "value" },
    "imageUrl": "string",
    "detectedLinks": [
      { "target": "Entity Name", "label": "description of relationship" }
    ]
  }
]
`;
