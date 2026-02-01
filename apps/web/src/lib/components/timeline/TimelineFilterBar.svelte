<script lang="ts">
  import { timelineStore } from "$lib/stores/timeline.svelte";
  import { categories } from "$lib/stores/categories.svelte";

  let startYear = $state<number | null>(null);
  let endYear = $state<number | null>(null);

  const applyRange = () => {
    timelineStore.filterYearStart = startYear;
    timelineStore.filterYearEnd = endYear;
  };

  const clearFilters = () => {
    timelineStore.filterType = null;
    startYear = null;
    endYear = null;
    applyRange();
  };
</script>

<div class="flex flex-wrap items-center gap-4 text-[10px] font-mono">
  <!-- Type Filter -->
  <div class="flex items-center gap-2">
    <span class="text-zinc-600 uppercase tracking-widest">Filter:</span>
    <select 
      bind:value={timelineStore.filterType}
      class="bg-black border border-green-900/30 rounded px-2 py-1 text-zinc-300 outline-none focus:border-green-500 transition-colors"
    >
      <option value={null}>ALL TYPES</option>
      {#each categories.list as cat}
        <option value={cat.id}>{cat.label.toUpperCase()}</option>
      {/each}
    </select>
  </div>

  <!-- Date Range -->
  <div class="flex items-center gap-2">
    <span class="text-zinc-600 uppercase tracking-widest">Years:</span>
    <input 
      type="number" 
      bind:value={startYear}
      onchange={applyRange}
      placeholder="Start"
      class="w-16 bg-black border border-green-900/30 rounded px-2 py-1 text-zinc-300 outline-none focus:border-green-500 transition-colors"
    />
    <span class="text-zinc-800">→</span>
    <input 
      type="number" 
      bind:value={endYear}
      onchange={applyRange}
      placeholder="End"
      class="w-16 bg-black border border-green-900/30 rounded px-2 py-1 text-zinc-300 outline-none focus:border-green-500 transition-colors"
    />
  </div>

  <!-- Undated Toggle -->
  <label class="flex items-center gap-2 cursor-pointer group">
    <input 
      type="checkbox" 
      bind:checked={timelineStore.includeUndated}
      class="sr-only"
    />
    <div class="w-8 h-4 bg-zinc-900 border border-zinc-800 rounded-full relative transition-colors {timelineStore.includeUndated ? 'bg-green-900/40 border-green-500/50' : ''}">
      <div class="absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-zinc-700 transition-all {timelineStore.includeUndated ? 'translate-x-4 bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : ''}"></div>
    </div>
    <span class="uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">Undated</span>
  </label>

  <!-- Clear -->
  {#if timelineStore.filterType || startYear !== null || endYear !== null || timelineStore.includeUndated}
    <button 
      onclick={clearFilters}
      class="text-red-900 hover:text-red-500 uppercase tracking-widest transition-colors font-bold"
    >
      Clear All
    </button>
  {/if}
</div>
