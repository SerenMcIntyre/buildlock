import { STEAM_PASSWORD, STEAM_USERNAME } from '$env/static/private';
import * as m from '$lib/paraglide/messages.js';
import { exec, execSync } from 'child_process';
import Elysia, { t } from 'elysia';
import fs from 'fs';
import { parseItems, type ParsedItem } from '../parsers/item-parser';
import parseVDataToJson from '../parsers/parse-vdata';
import { db } from '../db';
import {
	abilityProperty,
	editor,
	item,
	localizationMessage,
	tooltipSectionInfo,
	type LocalizationMessage
} from '../db/schema';
import { parseLocalization } from '../parsers/parse-localization';

const fileBody = t.Object({
	file: t.File()
});

const AdminModel = new Elysia().model({
	'admin.file': fileBody
});

export const admin = new Elysia({ prefix: '/admin' })
	.use(AdminModel)
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
	.post(
		'/parseItems',
		async ({ body, error }) => {
			let workingDir = '';
			try {
				console.debug('allo');
				workingDir = await unzipFile(body.file);
				console.debug(workingDir);
				const itemParseResult = parseItemVdata(workingDir);
				if (itemParseResult.success) {
					itemParseResult.items?.forEach(updateItem);
					return itemParseResult.items;
				}
				return error(404, itemParseResult.error);
			} catch {
				return error(500, m.parse_failed());
			} finally {
				if (workingDir) {
					fs.rmSync(workingDir, { recursive: true });
				}
			}
		},
		{ body: 'admin.file' }
	)
	.post(
		'/parseLocalization',
		async ({ body, error }) => {
			let workingDir = '';
			try {
				workingDir = await unzipFile(body.file);
				if (!fs.existsSync(workingDir + '/localization')) {
					return error(404, m.file_not_found());
				}
				const localizationParseResult = parseLocalization(workingDir + '/localization');
				if (localizationParseResult.length > 0) {
					localizationParseResult.forEach(updateLocalization);
					return localizationParseResult;
				}
				return error(500, m.parse_failed());
			} catch (err) {
				console.error('Failed to parse localization:', err);
				return error(500, m.parse_failed());
			} finally {
				if (workingDir) {
					fs.rmSync(workingDir, { recursive: true });
				}
			}
		},
		{ body: 'admin.file' }
	);

const parseItemVdata = (path: string) => {
	const filePath = path + '/vdata/abilities.vdata';
	const fileExists = fs.existsSync(filePath);
	if (!fileExists) {
		return { success: false, error: m.file_not_found() };
	}

	try {
		const itemJson = parseVDataToJson(filePath);
		const parsedItems = parseItems(itemJson);
		parsedItems.forEach(updateItem);
		return { success: true, items: parsedItems };
	} catch (error) {
		console.error('Failed to parse VDATA:', error);
		return { success: false, error: m.parse_failed() };
	}
};

const updateItem = async (parsedItem: ParsedItem) => {
	const newItem = parsedItem.item;

	await db
		.insert(item)
		.values(newItem)
		.onConflictDoUpdate({
			target: item.id,
			set: {
				description: newItem.description,
				class: newItem.class,
				image: newItem.image,
				type: newItem.type,
				tier: newItem.tier,
				price: newItem.price,
				rarity: newItem.rarity,
				itemClass: newItem.itemClass,
				itemSlotType: newItem.itemSlotType,
				abilityType: newItem.abilityType,
				abilityTargetingLocation: newItem.abilityTargetingLocation,
				abilityActivation: newItem.abilityActivation,
				castAnimGraphParam: newItem.castAnimGraphParam,
				castAnimSequenceName: newItem.castAnimSequenceName,
				selectionNameOverride: newItem.selectionNameOverride,
				previewPathParticle: newItem.previewPathParticle,
				disabled: newItem.disabled,
				updateTime: newItem.updateTime,
				startTrained: newItem.startTrained,
				shopFilters: newItem.shopFilters,
				autoIntrinsicModifiers: newItem.autoIntrinsicModifiers,
				multibase: newItem.multibase,
				cancelAbilityKey: newItem.cancelAbilityKey
			}
		});

	await db
		.insert(abilityProperty)
		.values(parsedItem.abilityProperties)
		.onConflictDoUpdate({
			target: abilityProperty.id,
			set: {
				name: parsedItem.abilityProperties.name,
				value: parsedItem.abilityProperties.value,
				disableValue: parsedItem.abilityProperties.disableValue,
				cssClass: parsedItem.abilityProperties.cssClass,
				canSetTokenOverride: parsedItem.abilityProperties.canSetTokenOverride,
				subclassScaleFunction: parsedItem.abilityProperties.subclassScaleFunction
			}
		});

	parsedItem.tooltipSectionInfo.forEach(async (sectionInfo) => {
		await db
			.insert(tooltipSectionInfo)
			.values(sectionInfo)
			.onConflictDoUpdate({
				target: tooltipSectionInfo.id,
				set: {
					abilitySectionType: sectionInfo.abilitySectionType,
					sectionAttributes: sectionInfo.sectionAttributes
				}
			});
	});

	const itemEditor = parsedItem.editor;
	await db
		.insert(editor)
		.values(itemEditor)
		.onConflictDoUpdate({
			target: editor.id,
			set: {
				folderName: itemEditor.folderName
			}
		});
};

const updateLocalization = async (parsedLocalization: LocalizationMessage) => {
	await db
		.insert(localizationMessage)
		.values(parsedLocalization)
		.onConflictDoUpdate({
			target: [localizationMessage.key, localizationMessage.language],
			set: {
				value: parsedLocalization.value
			}
		});
};

const unzipFile = async (file: File) => {
	const tempDirPath = `temp${Array(16)
		.fill(0)
		.map(() => Math.random().toString(36).charAt(2))
		.join('')}`;
	fs.mkdirSync(tempDirPath, { recursive: true });

	const zipPath = `${tempDirPath}/upload.zip`;
	fs.writeFileSync(zipPath, Buffer.from(await file.arrayBuffer()));

	execSync(`unzip ${zipPath} -d ${tempDirPath}`);
	fs.unlinkSync(zipPath);

	return tempDirPath;
};
