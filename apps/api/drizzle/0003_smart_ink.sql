CREATE TABLE "job_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_name" text NOT NULL,
	"status" text NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"duration" text,
	"message" text
);
--> statement-breakpoint
CREATE INDEX "job_log_job_name_idx" ON "job_log" USING btree ("job_name");--> statement-breakpoint
CREATE INDEX "job_log_status_idx" ON "job_log" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_log_started_at_idx" ON "job_log" USING btree ("started_at");