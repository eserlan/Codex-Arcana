<script lang="ts">
    import { helpStore } from "$stores/help.svelte";
    import { fade } from "svelte/transition";
    import GuideTooltip from "./GuideTooltip.svelte";

    let hasAnchor = $state(false);
    const ANCHOR_NAME = "--tour-target";

    // Manage Anchor Name Assignment
    $effect(() => {
        const step = helpStore.currentStep;
        
        // Clean up previous anchor if any (though likely overwritten or element gone)
        // Actually, we should probably find the *previous* element and remove it?
        // But since we only have one active step, we can just ensure we set it on the new one.
        // To be safe, we can query for any element with this anchor name and clear it?
        // Or just rely on the fact that only one element effectively uses it at a time.
        // Better: Keep track of the element we modified.
        
        let activeEl: HTMLElement | null = null;

        if (step && step.targetSelector !== "body") {
            const el = document.querySelector(step.targetSelector) as HTMLElement;
            if (el) {
                const rect = el.getBoundingClientRect();
                const vw = window.innerWidth;
                const vh = window.innerHeight;

                // If target is massive (like the canvas), treat it like "body"
                if (rect.width > vw * 0.8 && rect.height > vh * 0.8) {
                    hasAnchor = false;
                } else {
                    // Assign Anchor Name
                    el.style.setProperty("anchor-name", ANCHOR_NAME);
                    hasAnchor = true;
                    activeEl = el;
                    
                    // Ensure visibility
                    el.scrollIntoView({ behavior: "auto", block: "center" });
                }
            } else {
                hasAnchor = false;
            }
        } else {
            hasAnchor = false;
        }

        return () => {
            if (activeEl) {
                activeEl.style.removeProperty("anchor-name");
            }
            hasAnchor = false;
        };
    });

    const handleKeydown = (e: KeyboardEvent) => {
        if (!helpStore.activeTour) return;

        if (e.key === "Escape") {
            helpStore.skipTour();
        } else if (e.key === "ArrowRight") {
            helpStore.nextStep();
        } else if (e.key === "ArrowLeft") {
            helpStore.prevStep();
        }
    };

    const isDisabled = $derived.by(() => {
        if (typeof window === "undefined") return false;
        return (window as any).DISABLE_ONBOARDING;
    });

    const isE2E = $derived(typeof navigator !== 'undefined' && navigator.webdriver);
    const duration = $derived(isE2E ? 0 : 300);
</script>

<svelte:window onkeydown={handleKeydown} />

{#if helpStore.activeTour && !isDisabled}
    <!-- 4-Div Anchored Mask -->
    {#if hasAnchor}
        <!-- Padding around target -->
        {@const padding = "8px"}
        
        <!-- Top Mask -->
        <div 
            class="fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-[2px] z-[80] transition-all"
            style="bottom: calc(anchor({ANCHOR_NAME} top) - {padding}); transition-duration: {duration}ms;"
            transition:fade={{ duration }}
            role="presentation"
        ></div>

        <!-- Bottom Mask -->
        <div 
            class="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-[2px] z-[80] transition-all"
            style="top: calc(anchor({ANCHOR_NAME} bottom) + {padding}); transition-duration: {duration}ms;"
            transition:fade={{ duration }}
            role="presentation"
        ></div>

        <!-- Left Mask -->
        <div 
            class="fixed left-0 bg-black/60 backdrop-blur-[2px] z-[80] transition-all"
            style="
                top: calc(anchor({ANCHOR_NAME} top) - {padding}); 
                bottom: calc(anchor({ANCHOR_NAME} bottom) + {padding}); 
                right: calc(anchor({ANCHOR_NAME} left) - {padding});
                transition-duration: {duration}ms;
            "
            transition:fade={{ duration }}
            role="presentation"
        ></div>

        <!-- Right Mask -->
        <div 
            class="fixed right-0 bg-black/60 backdrop-blur-[2px] z-[80] transition-all"
            style="
                top: calc(anchor({ANCHOR_NAME} top) - {padding}); 
                bottom: calc(anchor({ANCHOR_NAME} bottom) + {padding}); 
                left: calc(anchor({ANCHOR_NAME} right) + {padding});
                transition-duration: {duration}ms;
            "
            transition:fade={{ duration }}
            role="presentation"
        ></div>
    {/if}

    {#if helpStore.currentStep}
        <GuideTooltip
            step={helpStore.currentStep}
            {hasAnchor}
            isLast={helpStore.activeTour.currentStepIndex === helpStore.activeTour.steps.length - 1}
            current={helpStore.activeTour.currentStepIndex + 1}
            total={helpStore.activeTour.steps.length}
        />
    {/if}
{/if}