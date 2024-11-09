import { describe, it, expect } from 'vitest';
import parseVDataToJson from './parse-vdata';

describe('parseVDataToJson', () => {
	it('should parse an example vdata file to json', () => {
		const filePath = './src/lib/server/parsers/example-item.vdata';
		const parsedData = parseVDataToJson(filePath);
		expect(parsedData).toMatchSnapshot();
	});
});
