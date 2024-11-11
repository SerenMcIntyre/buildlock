<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { Nav } from '@skeletonlabs/skeleton-svelte';
	import { Bolt, Bookmark, CircleUserRound, Swords, Wrench } from 'lucide-svelte/icons';
	import Github from '$lib/assets/brand-icons/Github.svelte';
	import LocaleSwitcher from '$lib/components/core/LocaleSwitcher.svelte';
	import * as m from '$lib/paraglide/messages.js';
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<div class="grid h-screen w-full grid-cols-[1fr_auto]">
		<main class="max-h-screen overflow-auto p-20">
			{@render children()}
		</main>
		<Nav.Rail width="w-16" classes="transition-all">
			{#snippet header()}
				<Nav.Tile
					labelExpanded="GitHub"
					href="https://github.com/SerenMcIntyre/buildlock"
					target="_blank"
				>
					<Github classes="w-6 h-6 fill-primary-contrast-500" />
				</Nav.Tile>
			{/snippet}
			{#snippet tiles()}
				<Nav.Tile id="0" label="Build" href="">
					<Bolt class="stroke-surface-300" />
				</Nav.Tile>
				<Nav.Tile id="1" label="Saved" href="#">
					<Bookmark class="stroke-surface-300" />
				</Nav.Tile>
				<Nav.Tile id="2" label={m.items_header()} href="/items">
					<Swords class="stroke-surface-300" />
				</Nav.Tile>
				<Nav.Tile id="3" label={m.admin_header()} href="/admin">
					<Wrench class="stroke-surface-300" />
				</Nav.Tile>
			{/snippet}
			{#snippet footer()}
				<button type="button" class="btn flex w-full justify-start">
					<CircleUserRound class="stroke-surface-300" />
				</button>
				<LocaleSwitcher />
			{/snippet}
		</Nav.Rail>
	</div>
</ParaglideJS>
