<script lang="ts">
  import { notifications } from "$lib/stores/notifications.svelte";
  import { fly } from "svelte/transition";

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return "icon-[lucide--check-circle]";
      case "error": return "icon-[lucide--alert-circle]";
      case "warning": return "icon-[lucide--alert-triangle]";
      default: return "icon-[lucide--info]";
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case "success": return "border-green-500/50 text-green-400 bg-green-950/80";
      case "error": return "border-red-500/50 text-red-400 bg-red-950/80";
      case "warning": return "border-yellow-500/50 text-yellow-400 bg-yellow-950/80";
      default: return "border-blue-500/50 text-blue-400 bg-blue-950/80";
    }
  };
</script>

<div class="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
  {#each notifications.list as note (note.id)}
    <div
      class="flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-sm pointer-events-auto min-w-[300px] max-w-md {getColorClass(note.type)}"
      transition:fly={{ y: 20, duration: 300 }}
      role="alert"
    >
      <span class="{getIcon(note.type)} w-5 h-5 shrink-0"></span>
      <p class="text-sm font-medium flex-1">{note.message}</p>
      <button
        onclick={() => notifications.remove(note.id)}
        class="opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        <span class="icon-[lucide--x] w-4 h-4"></span>
      </button>
    </div>
  {/each}
</div>
