<script>
	import "../app.css";
	import VaultControls from "$lib/components/VaultControls.svelte";
	import { vault } from "$lib/stores/vault.svelte";
	import { onMount } from "svelte";

	let { children } = $props();

	onMount(() => {
		vault.init();
	});
</script>

<div class="app-layout min-h-screen bg-black flex flex-col">
	<header
		class="px-6 py-4 bg-[#0c0c0c] border-b border-green-900/30 flex justify-between items-center sticky top-0 z-10"
	>
		<h1
			class="text-xl font-bold text-gray-100 font-mono tracking-wide flex items-center gap-3"
		>
			<span class="text-green-500">📚</span>
			<span>Codex Arcana</span>
		</h1>
		<VaultControls />
	</header>

	<main class="flex-1 relative">
		{@render children()}
	</main>
</div>
