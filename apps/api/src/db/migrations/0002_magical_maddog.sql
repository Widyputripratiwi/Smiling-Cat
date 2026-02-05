DROP TABLE "consultations" CASCADE;--> statement-breakpoint
DROP TABLE "messages" CASCADE;--> statement-breakpoint
ALTER TABLE "health_scans" ADD COLUMN "detected_areas" json;--> statement-breakpoint
ALTER TABLE "health_scans" ADD COLUMN "image_width" real;--> statement-breakpoint
ALTER TABLE "health_scans" ADD COLUMN "image_height" real;--> statement-breakpoint
DROP TYPE "public"."consultation_status";--> statement-breakpoint
DROP TYPE "public"."sender_type";