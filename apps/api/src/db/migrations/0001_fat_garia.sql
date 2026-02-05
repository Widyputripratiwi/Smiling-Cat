ALTER TYPE "public"."sender_type" ADD VALUE 'ai';--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "health_scans" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "health_scans" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "health_scans" ALTER COLUMN "pet_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "scan_symptoms" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "scan_symptoms" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "scan_symptoms" ALTER COLUMN "scan_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vaccinations" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vaccinations" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "vaccinations" ALTER COLUMN "pet_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "consultations" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "consultations" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "consultations" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "consultations" ALTER COLUMN "pet_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "consultations" ALTER COLUMN "scan_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "consultation_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "sender_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "weight_logs" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "weight_logs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "weight_logs" ALTER COLUMN "pet_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "lifestyle" text;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "conditions" text;