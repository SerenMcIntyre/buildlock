import { describe, it, expect } from 'vitest';
import { parseItems } from './item-parser';
import parseVDataToJson from './parse-vdata';

describe('parseItems', () => {
	it('should parse items', () => {
		const filePath = './src/lib/server/parsers/example-item.vdata';
		const json = parseVDataToJson(filePath);

		const parsedItems = parseItems(json);

		expect(parsedItems).toMatchSnapshot();
	});
});
