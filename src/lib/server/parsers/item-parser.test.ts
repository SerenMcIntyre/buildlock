import { describe, it, expect } from 'vitest';
import { parseItems } from './item-parser';

describe('parseItems', () => {
	it('should parse items', () => {
		const filePath = './src/lib/server/parsers/example-item.vdata';
		const parsedItems = parseItems(filePath);
		console.debug(parsedItems);
		expect(parsedItems).toBeTruthy();
	});
});
