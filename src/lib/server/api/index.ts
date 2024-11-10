import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { admin } from './admin';

export const app = new Elysia({ prefix: '/api' })
	.use(swagger({ scalarConfig: { spec: { url: '/api/swagger/json' } } }))
	.use(admin)
	.get('/health', () => 'ok');

export type App = typeof app;
