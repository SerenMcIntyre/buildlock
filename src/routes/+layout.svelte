<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { type App } from '$lib/api';
	import '../app.css';
	import { treaty } from '@elysiajs/eden';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { Nav } from '@skeletonlabs/skeleton-svelte';
	import { Bolt, Bookmark, CircleUserRound, Swords } from 'lucide-svelte/icons';
	import Github from '$lib/assets/brand-icons/Github.svelte';
	let { children } = $props();

	const client = treaty<App>(PUBLIC_BASE_URL);

	$effect(() => {
		client.api.health.get().then((res) => console.log(res.data));
	});

</script>

<ParaglideJS {i18n}>
	<div class="card border-surface-100-900 grid h-screen w-full grid-cols-[1fr_auto] border-[1px]">
		<div class="flex items-center justify-center">
				{@render children()}
		</div>
		<Nav.Rail width="w-16"  classes="transition-all">
			{#snippet header()}
				<Nav.Tile labelExpanded="GitHub" href="https://github.com/SerenMcIntyre/buildlock" target="_blank">
					<Github classes="w-6 h-6 fill-primary-contrast-500" />
				</Nav.Tile>
			{/snippet}
			{#snippet tiles()}
				<Nav.Tile id="0"  label="Build" href="#">
					<Bolt class="stroke-surface-300" />
				</Nav.Tile>
				<Nav.Tile id="1" label="Saved" href="#">
					<Bookmark class="stroke-surface-300" />
				</Nav.Tile>
				<Nav.Tile id="2" label="Items" href="#">
					<Swords class="stroke-surface-300" />
				</Nav.Tile>
				{/snippet}
			{#snippet footer()}
				<button type="button" class="btn w-full flex justify-start">
					<CircleUserRound class="stroke-surface-300" />
				</button>
			{/snippet}
		</Nav.Rail>
	</div>
</ParaglideJS>
