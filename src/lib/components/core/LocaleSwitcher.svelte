<script lang="ts">
	import { Combobox } from '@skeletonlabs/skeleton-svelte';
	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	interface ComboxData {
		label: string;
		value: string;
	}

	const comboboxData: ComboxData[] = availableLanguageTags.map((languageTag) => {
		return {
			label: m.flag({}, { languageTag }),
			value: languageTag
		};
	});

	let selectedLocale = $state([languageTag()]);

	$effect(() => {
		const locale = selectedLocale[0];
		if (locale === languageTag()) {
			return;
		}
		const localePath = locale === 'en' ? '' : `${locale}/`;
		const pathSegments = $page.url.pathname.split('/');
		const isLocalePath = comboboxData.map((d) => d.value).includes(pathSegments[1]);
		if (isLocalePath) {
			goto(`/${localePath}${pathSegments.slice(2).join('/')}`);
		} else {
			goto(`/${localePath}${pathSegments.slice(1).join('/')}`);
		}
	});
</script>

<Combobox
	data={comboboxData}
	bind:value={selectedLocale}
	placeholder="Select..."
	openOnClick
	inputGroupButton="hidden"
	inputGroupInput="w-full text-center cursor-pointer caret-transparent"
	optionClasses="px-2 justify-center"
	inputGroupClasses="mx-1  cursor-pointer"
></Combobox>
