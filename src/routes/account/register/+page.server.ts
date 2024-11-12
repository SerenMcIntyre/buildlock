import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { client } from '$lib/client.svelte';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const email = formData.get('email');

		if (!validateEmail(email)) {
			return fail(400, { message: 'Invalid email' });
		}

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		return await client.api.auth.register.post({ username, password, email }).then((res) => {
			if (res.status === 200) {
				return redirect(302, '/');
			}
			return fail(400, { message: 'Invalid username or password' });
		});
	}
};

function validateEmail(email: unknown): email is string {
	return (
		typeof email === 'string' &&
		email.length > 5 &&
		email.length < 255 &&
		/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)
	);
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-zA-Z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
