<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import * as m from '$lib/paraglide/messages.js';

	let { form }: { form: ActionData } = $props();
</script>

<h1 class="h1">{m.register_header()}</h1>

<form
	method="post"
	action="?/register"
	use:enhance
	class="card-compact card flex flex-col gap-4 p-4 preset-tonal"
>
	<label class="label">
		{m.email()}
		<input type="email" name="email" aria-label={m.email()} class="input" />
	</label>
	<label class="label">
		{m.username()}
		<input name="username" aria-label={m.username()} class="input" />
	</label>
	<label class="label">
		{m.password()}
		<input type="password" name="password" aria-label={m.password()} class="input" />
	</label>
	<button class="btn btn-lg preset-tonal-secondary">{m.register()}</button>
	<p class="p-4 text-xl font-bold text-red-500">{form?.message ?? ''}</p>
</form>
