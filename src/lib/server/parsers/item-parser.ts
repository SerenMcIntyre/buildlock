import type { AbilityProperty, Editor, Item, TooltipSectionInfo } from '../db/schema';

export interface ParsedItem {
	key: string;
	item: Item;
	editor: Editor;
	abilityProperties: AbilityProperty;
	tooltipSectionInfo: TooltipSectionInfo[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseItem = (key: string, itemData: any): ParsedItem => {
	const item = {
		id: key,
		class: itemData._class || '',
		description: '', // You might need to derive this from somewhere in itemData
		image: itemData.m_strAbilityImage || '',
		type: itemData.m_eAbilityType || '',
		tier: itemData.m_iItemTier || '',
		price: 0, // If this exists in the data
		rarity: '', // If this exists in the data
		itemClass: itemData._class || '',
		itemSlotType: itemData.m_eItemSlotType || '',
		abilityType: itemData.m_eAbilityType || '',
		abilityTargetingLocation: itemData.m_eAbilityTargetingLocation || '',
		abilityActivation: itemData.m_eAbilityActivation || '',
		castAnimGraphParam: itemData.m_strCastAnimGraphParam || '',
		castAnimSequenceName: itemData.m_strCastAnimSequenceName || '',
		selectionNameOverride: itemData.m_strSelectionNameOverride || '',
		previewPathParticle: itemData.m_PreviewPathParticle?.value || '',
		disabled: itemData.m_bDisabled || false,
		updateTime: itemData.m_iUpdateTime || 0,
		startTrained: itemData.m_bStartTrained || false,
		shopFilters: itemData.m_eShopFilters || '',
		autoIntrinsicModifiers: JSON.stringify(itemData.m_AutoIntrinsicModifiers || []),
		multibase: JSON.stringify(itemData._multibase || []),
		cancelAbilityKey: itemData.m_strCancelAbilityKey || '',
		bitsPostCastEnabledStateMask: itemData.m_bitsPostCastEnabledStateMask || ''
	} as Item;

	const abilityProperties = {
		id: key,
		itemId: item.id,
		name: itemData.m_mapAbilityProperties?.AbilityCastRange?.m_strValue || '',
		value: itemData.m_mapAbilityProperties?.AbilityCastRange?.m_strValue || '',
		disableValue: itemData.m_mapAbilityProperties?.AbilityCastRange?.m_strDisableValue || '',
		cssClass: itemData.m_mapAbilityProperties?.AbilityCastRange?.m_strCSSClass || '',
		canSetTokenOverride:
			itemData.m_mapAbilityProperties?.AbilityCastRange?.m_bCanSetTokenOverride || false,
		subclassScaleFunction: JSON.stringify(
			itemData.m_mapAbilityProperties?.AbilityCastRange?.m_subclassScaleFunction || {}
		)
	} as AbilityProperty;

	const tooltipSectionInfo: TooltipSectionInfo[] =
		itemData.m_vecTooltipSectionInfo?.length > 0
			? itemData.m_vecTooltipSectionInfo?.map((sectionInfo: any, index: number) => {
					return {
						id: `${key}_${index}`,
						itemId: item.id,
						abilitySectionType: sectionInfo.m_eAbilitySectionType || '',
						sectionAttributes: JSON.stringify(sectionInfo.m_vecSectionAttributes || [])
					} as TooltipSectionInfo;
				})
			: [];

	const editor = {
		id: key,
		itemId: item.id,
		folderName: itemData._editor?.folder_name || ''
	} as Editor;

	return {
		key,
		item,
		editor,
		abilityProperties,
		tooltipSectionInfo
	};
};

export const parseItems = (json: Record<string, unknown>) => {
	return Object.keys(json).map((key) => {
		const parsed = parseItem(key, json[key]);
		return parsed;
	});
};
