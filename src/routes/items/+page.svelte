<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { client } from '$lib/client.svelte';
	import { languageTag } from '$lib/paraglide/runtime';

	// Since language specific data is fetched on the server, refresh this page when the language changes
	const items = client.api.items.index.get({ query: { locale: languageTag() } }).then((res) => {
		if (res.status === 200) {
			return { success: true, items: res.data };
		}

		return { success: false, error: res.response.statusText };
	});
</script>

<div class="flex h-full flex-col gap-4">
	<h1 class="h1">Items</h1>
	<p class="text-xl">The following items are loaded into the system:</p>

	<div class="table-wrap p-4">
		<table class="card table caption-bottom preset-tonal">
			<thead>
				<tr>
					<th>Key</th>
					<th>Name</th>
					<th>Class</th>
					<th>Type</th>
					<th>Tier</th>
				</tr>
			</thead>
			<tbody class="hover:[&>tr]:preset-tonal-primary">
				{#await items}
					<tr> </tr>
				{:then itemsResult}
					{#if itemsResult.success}
						{#each itemsResult.items ?? [] as item}
							<tr>
								<td class="truncate">{item.item.id}</td>
								<td>{item.localization_message?.value}</td>
								<td>{item.item.class}</td>
								<td>{item.item.type}</td>
								<td>{item.item.tier}</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="6">{m.loading_failed()}: {itemsResult.error ?? 'Unknown error'}</td>
						</tr>
					{/if}
				{/await}
			</tbody>
			<tfoot>
				<tr class="h-4">
					<td colspan="6"> Total Items: </td>
					<td class="text-center">1</td>
				</tr>
			</tfoot>
		</table>
	</div>
</div>
