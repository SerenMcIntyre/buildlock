import { Elysia } from 'elysia';
import { db } from '../db';
import { item, localizationMessage } from '../db/schema';
import { eq } from 'drizzle-orm';

export const items = new Elysia({ prefix: '/items' }).get('/', async ({ query }) => {
	const languageTag = query.locale ?? 'en';
	const items = await db
		.select()
		.from(item)
		.leftJoin(localizationMessage, eq(item.id, localizationMessage.key))
		.where(eq(localizationMessage.language, languageTag))
		.orderBy(item.id);

	return items;
});
