import { exec, execSync } from 'child_process';
import { STEAM_USERNAME, STEAM_PASSWORD } from '$env/static/private';
import * as m from '$lib/paraglide/messages.js';
import Elysia from 'elysia';

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
	});
