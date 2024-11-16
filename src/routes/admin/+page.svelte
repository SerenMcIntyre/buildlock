<script lang="ts">
	import { client } from '$lib/client.svelte';
	import { highlight } from '$lib/highlihters.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { FileUpload, type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { CircleX, Download, ImagePlus, Paperclip } from 'lucide-svelte';
	import { getContext } from 'svelte';

	let logs: string[] = $state([]);
	const toast: ToastContext = getContext('toast');

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
			} else {
				toast.create({
					type: 'error',
					title: m.parse_failed()
				});
			}
		});
	};

	const uploadAssets = (target: 'assets' | 'localization', details: { files: File[] }) => {
		if (details.files.length <= 0) {
			toast.create({
				type: 'error',
				title: m.file_not_found()
			});
			return;
		}
		const file = details.files[0];
		if (target === 'assets') {
			parseAssets(file);
		} else {
			parseLocalization(file);
		}
	};

	const parseAssets = (zip: File) => {
		logs = [m.parsing_assets(), '\n', '\n'];
		client.api.admin.parseItems.post({ file: zip }).then((res) => {
			logs.push('Code: ' + res.status);
			logs.push('\n');
			if (res.status !== 200) {
				logs.push(res.error?.value ?? 'Unknown error');
			} else {
				logs = logs.concat(res.data?.map((item) => item.key) ?? []);
			}
		});
	};

	const parseLocalization = (zip: File) => {
		logs = [m.parsing_assets(), '\n', '\n'];
		client.api.admin.parseLocalization.post({ file: zip }).then((res) => {
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

<h1 class="h1">{m.admin_header()}</h1>
<div class="flex flex-col gap-4">
	<p>{m.script_instructions()}</p>
	<code class="bg-[#2e3440ff] p-4">{@html highlight(m.script_cmd())}</code>
	<p>{m.script_instructions_2()}</p>
	<a
		href="import_game_assets.sh"
		download="import_game_assets.sh"
		class="btn btn-lg preset-tonal-secondary"
	>
		<Download />
		{m.download_script()}
	</a>

	<section id="uploads" class="flex gap-4">
		<FileUpload
			name="vdata-upload"
			accept="application/zip"
			maxFiles={1}
			label={m.upload_vdata_label()}
			subtext={m.upload_vdata_subtext()}
			onFileAccept={(e) => uploadAssets('assets', e)}
			classes="w-full"
		>
			{#snippet iconInterface()}<ImagePlus class="size-8" />{/snippet}
			{#snippet iconFile()}<Paperclip class="size-4" />{/snippet}
			{#snippet iconFileRemove()}<CircleX class="size-4" />{/snippet}
		</FileUpload>

		<FileUpload
			name="localization-upload"
			accept="application/zip"
			maxFiles={1}
			label={m.upload_localization_label()}
			subtext={m.upload_localization_subtext()}
			onFileAccept={(e) => uploadAssets('localization', e)}
			classes="w-full"
		>
			{#snippet iconInterface()}<ImagePlus class="size-8" />{/snippet}
			{#snippet iconFile()}<Paperclip class="size-4" />{/snippet}
			{#snippet iconFileRemove()}<CircleX class="size-4" />{/snippet}
		</FileUpload>
	</section>
	<div
		class="card card-hover block h-96 w-full divide-y overflow-auto border-[1px] p-4 border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900"
	>
		<ul>
			{#each logs as log}
				<li class="min-h-4">{log}</li>
			{/each}
		</ul>
	</div>

	<button type="button" class="btn btn-lg preset-tonal-tertiary" onclick={clearlogs}>
		{m.clear_logs()}
	</button>
</div>
