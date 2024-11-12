import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { client } from '$lib/client.svelte';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsernameOrEmail(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		return await client.api.auth.login.post({ username, password }).then(async (res) => {
			if (res.status === 200) {
				const sessionToken = auth.generateSessionToken();
				const session = await auth.createSession(sessionToken, res.data.userId);
				auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
				return redirect(302, '/');
			}
			return fail(400, { message: 'Invalid username or password' });
		});
	}
};

function validateUsernameOrEmail(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		(/^[a-zA-Z0-9_-]+$/.test(username) ||
			/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/.test(username))
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
