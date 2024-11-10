import { pgTable, text, integer, timestamp, boolean, primaryKey } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const item = pgTable('item', {
	id: text('id').primaryKey(),
	class: text('class').notNull(),
	description: text('description').notNull(),
	image: text('image').notNull(),
	type: text('type').notNull(),
	tier: text('tier').notNull(),
	price: integer('price').notNull(),
	rarity: text('rarity').notNull(),
	itemClass: text('item_class').notNull(),
	itemSlotType: text('item_slot_type').notNull(),
	abilityType: text('ability_type').notNull(),
	abilityTargetingLocation: text('ability_targeting_location').notNull(),
	abilityActivation: text('ability_activation').notNull(),
	castAnimGraphParam: text('cast_anim_graph_param').notNull(),
	castAnimSequenceName: text('cast_anim_sequence_name').notNull(),
	selectionNameOverride: text('selection_name_override').notNull(),
	previewPathParticle: text('preview_path_particle').notNull(),
	disabled: boolean('disabled').notNull(),
	updateTime: integer('update_time').notNull(),
	startTrained: boolean('start_trained').notNull(),
	shopFilters: text('shop_filters').notNull(),
	autoIntrinsicModifiers: text('auto_intrinsic_modifiers').notNull(),
	multibase: text('multibase').notNull(),
	cancelAbilityKey: text('cancel_ability_key').notNull(),
	bitsPostCastEnabledStateMask: text('bits_post_cast_enabled_state_mask').notNull()
});

export const abilityProperty = pgTable('ability_property', {
	id: text('id').primaryKey(),
	itemId: text('item_id')
		.notNull()
		.references(() => item.id),
	name: text('name').notNull(),
	value: text('value').notNull(),
	disableValue: text('disable_value').notNull(),
	cssClass: text('css_class').notNull(),
	canSetTokenOverride: boolean('can_set_token_override').notNull(),
	subclassScaleFunction: text('subclass_scale_function').notNull()
});

export const scaleFunction = pgTable('scale_function', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	subclassName: text('subclass_name').notNull()
});

export const spline = pgTable('spline', {
	id: text('id').primaryKey(),
	spline: text('spline').notNull(),
	tangents: text('tangents').notNull(),
	domainMins: text('domain_mins').notNull(),
	domainMaxs: text('domain_maxs').notNull()
});

export const splinePoint = pgTable('spline_point', {
	id: text('id').primaryKey(),
	x: text('x').notNull(),
	y: text('y').notNull(),
	slopeIncoming: text('slope_incoming').notNull(),
	slopeOutgoing: text('slope_outgoing').notNull()
});

export const tangent = pgTable('tangent', {
	id: text('id').primaryKey(),
	incomingTangent: text('incoming_tangent').notNull(),
	outgoingTangent: text('outgoing_tangent').notNull()
});

export const tooltipSectionInfo = pgTable('tooltip_section_info', {
	id: text('id').primaryKey(),
	itemId: text('item_id'),
	abilitySectionType: text('ability_section_type').notNull(),
	sectionAttributes: text('section_attributes').notNull()
});

export const sectionAttribute = pgTable('section_attribute', {
	id: text('id').primaryKey(),
	abilityProperties: text('ability_properties').notNull()
});

export const autoIntrinsicModifier = pgTable('auto_intrinsic_modifier', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	subclassName: text('subclass_name').notNull()
});

export const editor = pgTable('editor', {
	id: text('id').primaryKey(),
	itemId: text('item_id')
		.notNull()
		.references(() => item.id),
	folderName: text('folder_name').notNull()
});

export const localizationMessage = pgTable(
	'localization_message',
	{
		language: text('language').notNull(),
		key: text('key').notNull(),
		value: text('value').notNull()
	},
	(table) => {
		return { pk: primaryKey({ columns: [table.language, table.key] }) };
	}
);

export type Item = typeof item.$inferSelect;

export type AbilityProperty = typeof abilityProperty.$inferSelect;

export type ScaleFunction = typeof scaleFunction.$inferSelect;

export type Spline = typeof spline.$inferSelect;

export type SplinePoint = typeof splinePoint.$inferSelect;

export type Tangent = typeof tangent.$inferSelect;

export type TooltipSectionInfo = typeof tooltipSectionInfo.$inferSelect;

export type SectionAttribute = typeof sectionAttribute.$inferSelect;

export type AutoIntrinsicModifier = typeof autoIntrinsicModifier.$inferSelect;

export type Editor = typeof editor.$inferSelect;

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type LocalizationMessage = typeof localizationMessage.$inferSelect;
