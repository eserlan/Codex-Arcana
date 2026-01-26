
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { MarkdownParser, defaultMarkdownParser } from '@tiptap/pm/markdown';
import { JSDOM } from 'jsdom';

// Mock browser environment for TipTap
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.Node = dom.window.Node;
global.Element = dom.window.Element;
global.HTMLElement = dom.window.HTMLElement;

async function testParser() {
    const markdown = "**Captain Alaric Thorne** Every peaceful village needs a watchful eye.";

    console.log("Testing markdown:", markdown);

    const editor = new Editor({
        extensions: [StarterKit],
        content: '',
    });

    const schema = editor.schema;

    const tokens = {
        ...defaultMarkdownParser.tokens,
        bullet_list: { block: "bulletList" },
        ordered_list: { block: "orderedList" },
        list_item: { block: "listItem" },
        code_block: { block: "codeBlock" },
        fence: { block: "codeBlock", attr: (tok) => ({ language: tok.info || null }) },
        em: { mark: "italic" },
        strong: { mark: "bold" },
        s: { mark: "strike" },
    };

    try {
        const parser = new MarkdownParser(
            schema,
            defaultMarkdownParser.tokenizer,
            tokens,
        );

        const doc = parser.parse(markdown);
        console.log("Parse Success!");
        console.log(JSON.stringify(doc.toJSON(), null, 2));
    } catch (e) {
        console.error("Parse Failed:", e);
    } finally {
        editor.destroy();
    }
}

testParser();
