<script lang="ts">
  import { timelineStore } from "$lib/stores/timeline.svelte";

  const modes = [
    { id: 'vertical', icon: 'icon-[lucide--list]', label: 'Vertical' },
    { id: 'horizontal', icon: 'icon-[lucide--columns-3]', label: 'Horizontal' }
  ];
</script>

<div class="flex bg-black border border-green-900/30 rounded p-1">
  {#each modes as mode}
    <button
      onclick={() => timelineStore.viewMode = mode.id as any}
      class="px-3 py-1.5 flex items-center gap-2 rounded text-[10px] font-bold tracking-widest transition-all
      {timelineStore.viewMode === mode.id 
        ? 'bg-green-900/40 text-green-400' 
        : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/50'}"
      title="Switch to {mode.label} View"
    >
      <span class="{mode.icon} w-3.5 h-3.5"></span>
      <span class="hidden md:inline uppercase">{mode.label}</span>
    </button>
  {/each}
</div>
