<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { type Editor } from "@tiptap/core";
    
    let { editor } = $props<{ editor: Editor | null }>();
    
    let element: HTMLDivElement;

    // Active states
    let isBold = $derived(editor?.isActive('bold') ?? false);
    let isItalic = $derived(editor?.isActive('italic') ?? false);
    let isLink = $derived(editor?.isActive('link') ?? false);

    const setLink = () => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    onMount(() => {
        // Just keeping the element alive
    });

    onDestroy(() => {
        // Cleanup if needed
    });
</script>

<!-- The element bound here must be passed to BubbleMenu extension -->
<div 
    bind:this={element}
    class="bubble-menu flex gap-1 p-1 bg-[#0a0a0a] border border-green-900/50 rounded shadow-xl"
    data-testid="bubble-menu"
>
    <button
        onclick={() => editor?.chain().focus().toggleBold().run()}
        class="menu-btn {isBold ? 'active' : ''}"
        aria-label="Bold"
    >
        <span class="icon-[lucide--bold] w-4 h-4"></span>
    </button>
    <button
        onclick={() => editor?.chain().focus().toggleItalic().run()}
        class="menu-btn {isItalic ? 'active' : ''}"
        aria-label="Italic"
    >
        <span class="icon-[lucide--italic] w-4 h-4"></span>
    </button>
    <button
        onclick={setLink}
        class="menu-btn {isLink ? 'active' : ''}"
        aria-label="Link"
    >
        <span class="icon-[lucide--link] w-4 h-4"></span>
    </button>
</div>

<style>
    .bubble-menu {
        visibility: hidden; /* Controlled by Tiptap */
        opacity: 0;
        transition: opacity 0.2s;
    }

    /* Tiptap will manage visibility via Tippy.js, but requires the element to be in DOM */
    
    .menu-btn {
        @apply p-1.5 rounded text-green-700 hover:text-green-400 hover:bg-green-900/20 transition-all flex items-center justify-center;
    }
    
    .menu-btn.active {
        @apply text-green-400 bg-green-900/40;
    }
</style>
