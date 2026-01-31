<script lang="ts">
  import type { TemporalMetadata } from "schema";

  let { 
    value = $bindable(), 
    label = "Chronological Date" 
  } = $props<{ 
    value?: TemporalMetadata, 
    label?: string 
  }>();

  let year = $state<number | undefined>(value?.year);
  let month = $state<number | undefined>(value?.month);
  let day = $state<number | undefined>(value?.day);
  let displayLabel = $state<string | undefined>(value?.label);

  const update = () => {
    if (year === undefined || year === null) {
      value = undefined;
    } else {
      value = {
        year,
        month: month || undefined,
        day: day || undefined,
        label: displayLabel || undefined
      };
    }
  };
</script>

<div class="space-y-2 p-3 bg-zinc-900/30 border border-zinc-800 rounded">
  <div class="flex items-center justify-between">
    <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
    {#if year !== undefined}
      <button 
        onclick={() => { year = undefined; update(); }}
        class="text-[9px] text-red-500 hover:text-red-400 uppercase font-mono"
      >
        Clear
      </button>
    {/if}
  </div>

  <div class="grid grid-cols-3 gap-2">
    <div class="flex flex-col gap-1">
      <span class="text-[8px] text-zinc-600 uppercase">Year</span>
      <input 
        type="number" 
        bind:value={year} 
        oninput={update}
        placeholder="1240"
        class="bg-black border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:border-purple-500 outline-none w-full"
      />
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-[8px] text-zinc-600 uppercase">Month</span>
      <input 
        type="number" 
        min="1" 
        max="12"
        bind:value={month} 
        oninput={update}
        placeholder="1-12"
        class="bg-black border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:border-purple-500 outline-none w-full"
      />
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-[8px] text-zinc-600 uppercase">Day</span>
      <input 
        type="number" 
        min="1" 
        max="31"
        bind:value={day} 
        oninput={update}
        placeholder="1-31"
        class="bg-black border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:border-purple-500 outline-none w-full"
      />
    </div>
  </div>

  <div class="flex flex-col gap-1">
    <span class="text-[8px] text-zinc-600 uppercase">Display Label (Optional)</span>
    <input 
      type="text" 
      bind:value={displayLabel} 
      oninput={update}
      placeholder="e.g. Early 1240 AF"
      class="bg-black border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:border-purple-500 outline-none w-full"
    />
  </div>
</div>