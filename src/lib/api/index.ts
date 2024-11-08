import swagger from '@elysiajs/swagger';
import { Elysia, t } from 'elysia';

export const app = new Elysia({ prefix: '/api' })
	.use(swagger({ scalarConfig: { spec: { url: '/api/swagger/json' } } }))
	.get('/health', () => 'ok');

export type App = typeof app;
