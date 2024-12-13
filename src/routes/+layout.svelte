<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { Nav, ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import { Bolt, Bookmark, LogOut, Swords, Wrench } from 'lucide-svelte/icons';
	import Github from '$lib/assets/brand-icons/Github.svelte';
	import LocaleSwitcher from '$lib/components/core/LocaleSwitcher.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { Snippet } from 'svelte';
	import { type LayoutServerData } from './$types';

	let { children, data }: { children: Snippet<[]>; data: LayoutServerData } = $props();
</script>

<ParaglideJS {i18n}>
	<div class="grid h-screen w-full grid-cols-[1fr_auto]">
		<main class="max-h-screen overflow-auto p-20">
			<ToastProvider>
				{@render children()}
			</ToastProvider>
		</main>

		{#if data.user}
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
					{#if data.user.canAccessAdmin}
						<Nav.Tile id="3" label={m.admin_header()} href="/admin">
							<Wrench class="stroke-surface-300" />
						</Nav.Tile>
					{/if}
				{/snippet}
				{#snippet footer()}
					<Nav.Tile id="4" label={m.logout()} href="/account/logout">
						<LogOut class="stroke-surface-300" />
					</Nav.Tile>
					<LocaleSwitcher />
				{/snippet}
			</Nav.Rail>
		{/if}
	</div>
</ParaglideJS>
