import { PUBLIC_BASE_URL } from '$env/static/public';
import type { App } from '$lib/api';
import { treaty } from '@elysiajs/eden';

export const client = $state(treaty<App>(PUBLIC_BASE_URL));
