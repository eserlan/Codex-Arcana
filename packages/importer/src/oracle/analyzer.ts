import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult, DiscoveredEntity, OracleAnalyzerEngine, AnalysisOptions } from '../types';
import { EXTRACTION_PROMPT } from './prompt-factory';

const CHUNK_SIZE = 50000;
const OVERLAP_SIZE = 2000;

export class OracleAnalyzer implements OracleAnalyzerEngine {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyze(text: string, options?: AnalysisOptions): Promise<AnalysisResult> {
    if (text.length <= CHUNK_SIZE) {
      return this.processChunk(text);
    }

    // Chunking Logic
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      let end = start + CHUNK_SIZE;
      if (end < text.length) {
        // Try to find a paragraph break to split cleanly
        const lastNewline = text.lastIndexOf('\n', end);
        if (lastNewline > start + CHUNK_SIZE / 2) {
          end = lastNewline;
        }
      }
      chunks.push(text.slice(start, end));
      start = end - OVERLAP_SIZE; // Overlap for context continuity
    }

    console.log(`[OracleAnalyzer] Split text into ${chunks.length} chunks.`);

    // Process all chunks
    const allEntities: DiscoveredEntity[] = [];
    let processed = 0;
    
    for (const chunk of chunks) {
      processed++;
      console.log(`[OracleAnalyzer] Processing chunk ${processed}/${chunks.length}...`);
      if (options?.onProgress) {
        options.onProgress(processed, chunks.length);
      }
      const result = await this.processChunk(chunk);
      allEntities.push(...result.entities);
    }

    return this.mergeDuplicates(allEntities);
  }

  private async processChunk(text: string): Promise<AnalysisResult> {
    const prompt = `${EXTRACTION_PROMPT}\n\nInput Text:\n${text}`;

    // Attempt models in order of strength/preference, aligned with app configuration
    const models = [
      'gemini-3-flash-preview', // Advanced Tier
      'gemini-2.5-flash-lite',  // Lite Tier
    ];

    for (const modelName of models) {
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();

        // Robust JSON extraction: look for the first '[' and last ']'
        const startIdx = rawText.indexOf('[');
        const endIdx = rawText.lastIndexOf(']');

        if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
          throw new Error('No valid JSON array found in Oracle response');
        }

        const jsonStr = rawText.substring(startIdx, endIdx + 1).trim();
        const parsed = JSON.parse(jsonStr);

        const entities: DiscoveredEntity[] = parsed.map((item: any) => ({
          id: crypto.randomUUID(),
          suggestedTitle: item.title,
          suggestedType: item.type,
          content: item.content || '',
          frontmatter: {
            ...item.frontmatter,
            // Prioritize explicit image URL from AI or input
            image: item.imageURL || item.imageUrl || item.frontmatter?.image
          },
          confidence: 1, // Placeholder
          suggestedFilename: this.slugify(item.title),
          detectedLinks: item.detectedLinks || []
        }));

        return { entities };

      } catch (error) {
        console.warn(`Oracle Analysis failed with model ${modelName}:`, error);
        // Continue to next model
      }
    }

    console.error('Oracle Analysis failed with all available models.');
    return { entities: [] };
  }

  private mergeDuplicates(entities: DiscoveredEntity[]): AnalysisResult {
    const map = new Map<string, DiscoveredEntity>();

    for (const entity of entities) {
      const key = entity.suggestedTitle.toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, entity);
      } else {
        const existing = map.get(key)!;
        // Merge Content
        existing.content += `\n\n${entity.content}`;
        // Merge Links
        const mergedLinks = new Set([...existing.detectedLinks, ...entity.detectedLinks]);
        existing.detectedLinks = Array.from(mergedLinks);
      }
    }

    return { entities: Array.from(map.values()) };
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-')   // Replace multiple - with single -
      + '.md';
  }
}