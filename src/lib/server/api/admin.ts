import { STEAM_PASSWORD, STEAM_USERNAME } from '$env/static/private';
import * as m from '$lib/paraglide/messages.js';
import { exec, execSync } from 'child_process';
import Elysia from 'elysia';
import fs from 'fs';
import { parseItems } from '../parsers/item-parser';
import parseVDataToJson from '../parsers/parse-vdata';

export const admin = new Elysia({ prefix: '/admin' })
	.post('/import', () => {
		const command = `STEAM_USERNAME=${STEAM_USERNAME} STEAM_PASSWORD=${STEAM_PASSWORD} ./import/import.sh > ./import/import_log.txt 2>&1`;
		const childProcess = exec(command);

		return childProcess.pid;
	})
	.get('/checkImportStatus/:pid', ({ params }) => {
		const pid = parseInt(params.pid, 10);
		try {
			const result = execSync(`ps -p ${pid}`);
			const isRunning = result.toString().includes(pid.toString());
			const logs = execSync(`cat ./import/import_log.txt`).toString().split('\n');
			return isRunning ? { completed: false, logs } : { completed: true, logs };
		} catch {
			const logs = execSync(`cat ./import/import_log.txt`).toString().split('\n');
			return { completed: true, logs: logs.concat(m.process_terminated()) };
		}
	})
	.post('/parse', ({ error }) => {
		const itemParseResult = parseItemVdata();
		if (itemParseResult.success) {
			return itemParseResult;
		}
		return error(500, itemParseResult.error);
	});

const parseItemVdata = () => {
	const filePath = './import/run/vdata/abilities.vdata';
	const fileExists = fs.existsSync(filePath);
	if (!fileExists) {
		return { success: false, error: m.file_not_found() };
	}

	try {
		const itemJson = parseVDataToJson(filePath);
		const parsedItems = parseItems(itemJson);
		return { success: true, items: parsedItems };
	} catch (error) {
		console.error('Failed to parse VDATA:', error);
		return { success: false, error: m.parse_failed() };
	}
};
