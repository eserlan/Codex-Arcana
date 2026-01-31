<script lang="ts">
  import { graph } from "$lib/stores/graph.svelte";
  import type { Era } from "schema";
  import { sanitizeId } from "$lib/utils/markdown";

  let newEraName = $state("");
  let newEraStart = $state<number>(0);
  let newEraEnd = $state<number | undefined>();
  let newEraColor = $state("#60a5fa");

  const handleAdd = async () => {
    if (!newEraName.trim()) return;
    
    const newEra: Era = {
      id: sanitizeId(newEraName),
      name: newEraName,
      start_year: newEraStart,
      end_year: newEraEnd,
      color: newEraColor
    };

    await graph.addEra(newEra);
    newEraName = "";
    newEraStart = 0;
    newEraEnd = undefined;
  };
</script>

<div class="space-y-6">
  <div class="p-4 bg-purple-900/5 border border-purple-900/20 rounded-lg">
    <h4 class="text-[10px] font-bold text-purple-500 uppercase tracking-[0.2em] mb-4">Define World Eras</h4>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
      <div class="md:col-span-2">
        <label class="block text-[8px] text-purple-900 uppercase mb-1">Era Name</label>
        <input 
          type="text" 
          bind:value={newEraName}
          placeholder="e.g. The Age of Myth"
          class="w-full bg-black border border-purple-900/30 rounded px-3 py-1.5 text-xs text-purple-100 outline-none focus:border-purple-500 transition-all font-mono"
        />
      </div>
      <div>
        <label class="block text-[8px] text-purple-900 uppercase mb-1">Start Year</label>
        <input 
          type="number" 
          bind:value={newEraStart}
          class="w-full bg-black border border-purple-900/30 rounded px-3 py-1.5 text-xs text-purple-100 outline-none focus:border-purple-500 transition-all font-mono"
        />
      </div>
      <div>
        <label class="block text-[8px] text-purple-900 uppercase mb-1">End Year (Opt)</label>
        <input 
          type="number" 
          bind:value={newEraEnd}
          placeholder="Present"
          class="w-full bg-black border border-purple-900/30 rounded px-3 py-1.5 text-xs text-purple-100 outline-none focus:border-purple-500 transition-all font-mono"
        />
      </div>
    </div>

    <div class="mt-4 flex items-center gap-4">
      <div class="flex items-center gap-2">
        <label class="text-[8px] text-purple-900 uppercase">Color</label>
        <input type="color" bind:value={newEraColor} class="w-6 h-6 bg-transparent border-none cursor-pointer" />
      </div>
      <button 
        onclick={handleAdd}
        disabled={!newEraName.trim()}
        class="flex-1 py-2 bg-purple-900/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-black transition-all text-[10px] font-bold tracking-widest uppercase disabled:opacity-30"
      >
        Initialize Era
      </button>
    </div>
  </div>

  <div class="space-y-2">
    {#each graph.eras as era}
      <div class="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800 rounded group transition-all hover:border-purple-500/30">
        <div class="flex items-center gap-3">
          <div class="w-1 h-8 rounded-full" style:background-color={era.color}></div>
          <div class="flex flex-col">
            <span class="text-xs font-bold text-gray-200">{era.name}</span>
            <span class="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">
              {era.start_year} → {era.end_year ?? 'Present'}
            </span>
          </div>
        </div>
        <button 
          onclick={() => graph.removeEra(era.id)}
          class="text-red-900 hover:text-red-500 transition-colors p-2"
          title="Delete Era"
        >
          <span class="icon-[lucide--trash-2] w-4 h-4"></span>
        </button>
      </div>
    {/each}
  </div>
</div>
