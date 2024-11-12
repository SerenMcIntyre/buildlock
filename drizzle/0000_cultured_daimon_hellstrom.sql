CREATE TABLE IF NOT EXISTS "ability_property" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"disable_value" text NOT NULL,
	"css_class" text NOT NULL,
	"can_set_token_override" boolean NOT NULL,
	"subclass_scale_function" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auto_intrinsic_modifier" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subclass_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "editor" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"folder_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"id" text PRIMARY KEY NOT NULL,
	"class" text NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"type" text NOT NULL,
	"tier" text NOT NULL,
	"price" integer NOT NULL,
	"rarity" text NOT NULL,
	"item_class" text NOT NULL,
	"item_slot_type" text NOT NULL,
	"ability_type" text NOT NULL,
	"ability_targeting_location" text NOT NULL,
	"ability_activation" text NOT NULL,
	"cast_anim_graph_param" text NOT NULL,
	"cast_anim_sequence_name" text NOT NULL,
	"selection_name_override" text NOT NULL,
	"preview_path_particle" text NOT NULL,
	"disabled" boolean NOT NULL,
	"update_time" integer NOT NULL,
	"start_trained" boolean NOT NULL,
	"shop_filters" text NOT NULL,
	"auto_intrinsic_modifiers" text NOT NULL,
	"multibase" text NOT NULL,
	"cancel_ability_key" text NOT NULL,
	"bits_post_cast_enabled_state_mask" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "localization_message" (
	"language" text NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "localization_message_language_key_pk" PRIMARY KEY("language","key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scale_function" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subclass_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "section_attribute" (
	"id" text PRIMARY KEY NOT NULL,
	"ability_properties" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spline" (
	"id" text PRIMARY KEY NOT NULL,
	"spline" text NOT NULL,
	"tangents" text NOT NULL,
	"domain_mins" text NOT NULL,
	"domain_maxs" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spline_point" (
	"id" text PRIMARY KEY NOT NULL,
	"x" text NOT NULL,
	"y" text NOT NULL,
	"slope_incoming" text NOT NULL,
	"slope_outgoing" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tangent" (
	"id" text PRIMARY KEY NOT NULL,
	"incoming_tangent" text NOT NULL,
	"outgoing_tangent" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tooltip_section_info" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text,
	"ability_section_type" text NOT NULL,
	"section_attributes" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ability_property" ADD CONSTRAINT "ability_property_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "editor" ADD CONSTRAINT "editor_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
