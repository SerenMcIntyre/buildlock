import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const allowAnynmousPaths = ['/account'];
	if (allowAnynmousPaths.some((path) => event.url.pathname.includes(path))) {
		return;
	}

	if (!event.locals.user) {
		return redirect(302, '/account/login');
	}
	return { user: event.locals.user };
};
