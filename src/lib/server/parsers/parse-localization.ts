import fs from 'fs';
import path from 'path';
import type { LocalizationMessage } from '../db/schema';
import { availableLanguageTags } from '$lib/paraglide/runtime';
import * as m from '$lib/paraglide/messages.js';

export const parseLocalization = (directoryPath: string): LocalizationMessage[] => {
	const messages: LocalizationMessage[] = [];

	availableLanguageTags.forEach((languageTag) => {
		const filePath = path.join(
			directoryPath,
			`citadel_gc_${m.localizationFileKey({}, { languageTag })}.txt`
		);

		const fileContent = fs.readFileSync(filePath, 'utf8');
		const lines = fileContent.split('\n');

		lines.forEach((line) => {
			const match = line.match(/"\s*([^"]+)\s*"\s+"\s*([^"]+)\s*"/);
			if (match) {
				const message = {
					language: languageTag,
					key: match[1],
					value: match[2]
				} as LocalizationMessage;
				messages.push(message);
			}
		});
	});

	return messages;
};
