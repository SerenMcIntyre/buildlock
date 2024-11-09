import fs from 'fs';

const parseVDataToJson = (filePath: string) => {
	const vdataContent = fs.readFileSync(filePath, 'utf8');

	// Remove comments and clean up whitespace
	let cleanContent = vdataContent
		// .replace(/\/\/.*$/gm, '')
		.replace(/\s*=\s*/g, ': ')
		.replace(/subclass:/g, '')
		.replace(/resource_name:/g, '')
		.replace(/panorama:/g, '')
		.replace(/soundevent:/g, '')
		.replace(/file:\/\//g, '')
		.trim();

	// Add commas between properties but not after { characters
	cleanContent = cleanContent.replace(/\n\s*(\w+)\s*:/g, ',\n$1:');
	// Remove commas after opening curly braces
	cleanContent = cleanContent.replace(/(\{)\s*,/g, '$1');

	// Convert VDATA syntax to valid JSON syntax
	const jsonString = cleanContent
		// Remove trailing commas
		.replace(/,(\s*[}\]])/g, '$1')
		// Ensure property names are quoted
		.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');

	try {
		return JSON.parse(jsonString);
	} catch (error) {
		console.error('Failed to parse VDATA:', error);
		return null;
	}
};

export default parseVDataToJson;
