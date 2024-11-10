<script lang="ts">
	import { client } from '$lib/client.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let logs: string[] = $state([]);

	const checkStatus = (pid: number) => {
		client.api.admin
			.checkImportStatus({ pid })
			.get()
			.then((res) => {
				if (res.status === 200) {
					console.log(res.data);
					if (res.error || !res.data) {
						console.log('error');
						return;
					}

					logs = res.data.logs;

					if (res.data.completed) {
						return;
					}
					setTimeout(() => {
						checkStatus(pid);
					}, 1000);
				}
			});
	};

	const clearlogs = () => {
		logs = [];
	};

	const fetchAssets = () => {
		client.api.admin.import.post().then((res) => {
			if (res.status === 200 && res.data) {
				checkStatus(res.data);
			}
		});
	};

	const parseAssets = () => {
		logs = [m.parsing_assets(), '\n', '\n'];
		client.api.admin.parseItems.post().then((res) => {
			logs.push('Code: ' + res.status);
			logs.push('\n');
			if (res.status !== 200) {
				logs.push(res.error?.value ?? 'Unknown error');
			} else {
				logs = logs.concat(res.data?.map((item) => item.key) ?? []);
			}
		});
	};

	const parseLocalization = () => {
		logs = [m.parsing_assets(), '\n', '\n'];
		client.api.admin.parseLocalization.post().then((res) => {
			logs.push('Code: ' + res.status);
			logs.push('\n');
			if (res.status !== 200) {
				logs.push(res.error?.value ?? 'Unknown error');
			} else {
				logs = logs.concat(
					res.data?.map((item) =>
						m.localizationImportMessage({
							key: item.key,
							value: item.value,
							language: item.language
						})
					) ?? []
				);
			}
		});
	};
</script>

<main class="flex w-full flex-col items-center justify-center gap-4">
	<div
		class="card card-hover block h-80 w-10/12 divide-y overflow-auto border-[1px] p-4 border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900"
	>
		<ul>
			{#each logs as log}
				<li class="min-h-4">{log}</li>
			{/each}
		</ul>
	</div>

	<div class="btn-group">
		<button type="button" class="btn btn-lg preset-tonal-secondary" onclick={fetchAssets}>
			{m.fetch_assets()}
		</button>
		<button type="button" class="btn btn-lg preset-tonal-secondary" onclick={parseAssets}>
			{m.parse_items()}
		</button>
		<button type="button" class="btn btn-lg preset-tonal-secondary" onclick={parseLocalization}>
			{m.parse_localization()}
		</button>
		<button type="button" class="btn btn-lg preset-tonal-tertiary" onclick={clearlogs}>
			{m.clear_logs()}
		</button>
	</div>
</main>
