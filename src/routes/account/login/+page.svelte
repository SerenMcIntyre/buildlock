<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import * as m from '$lib/paraglide/messages.js';

	let { form }: { form: ActionData } = $props();
</script>

<h1 class="h1">{m.login_header()}</h1>

<form
	method="post"
	action="?/login"
	use:enhance
	class="card-compact card flex flex-col gap-4 p-4 preset-tonal"
>
	<label class="label">
		{m.username()}
		<input name="username" aria-label={m.username()} class="input" />
	</label>
	<label class="label">
		{m.password()}
		<input type="password" name="password" aria-label={m.password()} class="input" />
	</label>
	<button class="btn btn-lg preset-tonal-primary" type="submit">{m.login()}</button>
	<a class="btn btn-lg preset-tonal-secondary" href="/account/register">{m.register()}</a>
</form>
<p style="color: red">{form?.message ?? ''}</p>
