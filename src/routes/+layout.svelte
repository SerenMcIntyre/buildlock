<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { type App } from '$lib/api';
	import '../app.css';
	import { treaty } from '@elysiajs/eden';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	let { children } = $props();

	const client = treaty<App>(PUBLIC_BASE_URL);

	$effect(() => {
		client.api.health.get().then((res) => console.log(res.data));
	});
</script>

<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
