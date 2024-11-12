import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { admin } from './admin';
import { items } from './items';
import { auth } from './auth';

export const app = new Elysia({ prefix: '/api' })
	.use(swagger({ scalarConfig: { spec: { url: '/api/swagger/json' } } }))
	.use(admin)
	.use(items)
	.use(auth)
	.get('/health', () => 'ok');

export type App = typeof app;
