<script lang="ts">
    import { helpStore } from "$stores/help.svelte";
    import { fly } from "svelte/transition";
    import { marked } from "marked";
    import DOMPurify from "isomorphic-dompurify";
    import type { GuideStep } from "$lib/config/help-content";

    let { step, hasAnchor, isLast, current, total } = $props<{
        step: GuideStep;
        hasAnchor: boolean;
        isLast: boolean;
        current: number;
        total: number;
    }>();

    const parseContent = (content: string) => {
        try {
            return DOMPurify.sanitize(marked.parse(content) as string);
        } catch (e) {
            console.error("Failed to parse guide content", e);
            return content;
        }
    };
</script>

<div
    class="fixed z-[82] w-72 md:w-96 bg-[#0c0c0c] border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)] rounded-lg flex flex-col overflow-hidden font-mono transition-all duration-300"
    class:anchored={hasAnchor}
    class:centered={!hasAnchor}
    transition:fly={{ y: 10, duration: 300 }}
>
    <!-- Header -->
    <div class="px-4 py-3 border-b border-green-900/30 flex justify-between items-center bg-green-900/5">
        <span class="text-[10px] text-green-500 font-bold tracking-[0.2em] uppercase">
            Guide {current} of {total}
        </span>
        <button 
            onclick={() => helpStore.skipTour()}
            class="text-green-900 hover:text-green-500 transition-colors"
            title="Skip Tour"
            aria-label="Skip Tour"
        >
            <span class="icon-[lucide--x] w-4 h-4"></span>
        </button>
    </div>

    <!-- Content -->
    <div class="p-5">
        <h3 class="text-green-400 text-sm font-bold mb-2 uppercase tracking-wider">{step.title}</h3>
        <div class="text-green-100/80 text-xs leading-relaxed prose prose-invert prose-p:my-1 prose-strong:text-green-400 prose-code:text-green-300">
            {@html parseContent(step.content)}
        </div>
    </div>

    <!-- Footer -->
    <div class="px-4 py-3 bg-black/40 flex justify-between gap-3 border-t border-green-900/20">
        <button 
            onclick={() => helpStore.skipTour()}
            class="text-[10px] text-green-900 hover:text-green-700 uppercase font-bold tracking-widest transition-colors"
            aria-label="Dismiss tour"
        >
            Dismiss
        </button>
        
        <div class="flex gap-2">
            {#if current > 1}
                <button 
                    onclick={() => helpStore.prevStep()}
                    class="px-3 py-1 border border-green-900/50 text-green-500 hover:bg-green-900/20 text-[10px] uppercase font-bold transition-all"
                    aria-label="Go to previous step"
                >
                    Back
                </button>
            {/if}
            <button 
                onclick={() => helpStore.nextStep()}
                class="px-4 py-1 bg-green-600 hover:bg-green-500 text-black text-[10px] uppercase font-bold transition-all shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                aria-label={isLast ? "Finish tour" : "Go to next step"}
            >
                {isLast ? "Finish" : "Next"}
            </button>
        </div>
    </div>

    <!-- Decorative Corner -->
    <div class="absolute -top-px -left-px w-2 h-2 border-t border-l border-green-500"></div>
    <div class="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-green-500"></div>
</div>

<style>
    /* Default Centered Position (No Anchor) */
    .centered {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    /* Anchored Position */
    .anchored {
        position-anchor: --tour-target;
        
        /* Initial Position: Bottom Center */
        top: anchor(bottom);
        left: anchor(center);
        translate: -50% 16px; /* 16px padding */
        
        /* Auto-flip Strategies */
        position-try-options: flip-block, flip-inline;
    }
</style>