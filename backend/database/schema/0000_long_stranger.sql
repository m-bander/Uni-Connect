CREATE TYPE "public"."roles" AS ENUM('student', 'professor/ta', 'system_admin', 'class_representative', 'course_head');--> statement-breakpoint
CREATE TYPE "public"."years" AS ENUM('1', '2', '3', '4', '5');--> statement-breakpoint
CREATE TYPE "public"."notification_sources" AS ENUM('calendar_event', 'announcement');--> statement-breakpoint
CREATE TYPE "public"."event_sources" AS ENUM('quiz', 'exam', 'poll', 'project', 'assignment', 'lab_exam');--> statement-breakpoint
CREATE TYPE "public"."material_categories" AS ENUM('lecture', 'sheet', 'quiz', 'assignment', 'tutorial', 'textbook');--> statement-breakpoint
CREATE TYPE "public"."assignment_types" AS ENUM('announcement', 'poll');--> statement-breakpoint
CREATE TABLE "refreshTokens" (
	"userId" uuid NOT NULL,
	"token" varchar PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"parent_name" varchar(255) NOT NULL,
	"grandparent_name" varchar(255),
	"family_name" varchar(255),
	"image_url" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"isApproved" boolean DEFAULT true NOT NULL,
	"role" "roles" NOT NULL,
	"code" varchar(255),
	"year" "years"
);
--> statement-breakpoint
CREATE TABLE "group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sender_id" uuid NOT NULL,
	"group_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"code" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"year" "years" NOT NULL,
	"image_url" text,
	"group_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teaches" (
	"courseCode" varchar(255) NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "teaches_courseCode_userId_pk" PRIMARY KEY("courseCode","userId")
);
--> statement-breakpoint
CREATE TABLE "blacklist" (
	"courseCode" varchar(255) NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "blacklist_courseCode_userId_pk" PRIMARY KEY("courseCode","userId")
);
--> statement-breakpoint
CREATE TABLE "enrolledIn" (
	"courseCode" varchar(255) NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "enrolledIn_courseCode_userId_pk" PRIMARY KEY("courseCode","userId")
);
--> statement-breakpoint
CREATE TABLE "manages" (
	"courseCode" varchar(255) NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "manages_courseCode_userId_pk" PRIMARY KEY("courseCode","userId")
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"source" "notification_sources" NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "received_notifications" (
	"notification_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"marked_as_read" boolean DEFAULT false NOT NULL,
	CONSTRAINT "received_notifications_notification_id_user_id_pk" PRIMARY KEY("notification_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"notes" text,
	"type" "event_sources" NOT NULL,
	"deadline_at" timestamp with time zone NOT NULL,
	"course_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"content" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"announcer_id" uuid NOT NULL,
	"type" "assignment_types" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classes_announcements" (
	"announcement_id" uuid NOT NULL,
	"class" "years" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses_announcements" (
	"announcement_id" uuid NOT NULL,
	"course_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll-item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"announcement_id" uuid,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vote" (
	"voter_id" uuid NOT NULL,
	"poll_item_id" uuid NOT NULL,
	CONSTRAINT "vote_poll_item_id_voter_id_pk" PRIMARY KEY("poll_item_id","voter_id")
);
--> statement-breakpoint
CREATE TABLE "assignment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" varchar(255) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"deadline_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assigner_id" uuid,
	"max_grade" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" varchar(255) NOT NULL,
	"key" text NOT NULL,
	"size" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assignments_files" (
	"assignment_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	CONSTRAINT "assignments_files_assignment_id_file_id_pk" PRIMARY KEY("assignment_id","file_id")
);
--> statement-breakpoint
CREATE TABLE "material" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" "material_categories" NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"uploader_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	"course_code" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grade" double precision,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"is_turned_in" boolean DEFAULT false NOT NULL,
	"feedback" text,
	"turned_in_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "submissions_files" (
	"file_id" uuid NOT NULL,
	"submission_id" uuid NOT NULL,
	CONSTRAINT "submissions_files_submission_id_file_id_pk" PRIMARY KEY("submission_id","file_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"userId" uuid NOT NULL,
	"sessionDate" date NOT NULL,
	"sessionDuration" integer NOT NULL,
	CONSTRAINT "sessions_userId_sessionDate_pk" PRIMARY KEY("userId","sessionDate")
);
--> statement-breakpoint
ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teaches" ADD CONSTRAINT "teaches_courseCode_courses_code_fk" FOREIGN KEY ("courseCode") REFERENCES "public"."courses"("code") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "teaches" ADD CONSTRAINT "teaches_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "blacklist" ADD CONSTRAINT "blacklist_courseCode_courses_code_fk" FOREIGN KEY ("courseCode") REFERENCES "public"."courses"("code") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "blacklist" ADD CONSTRAINT "blacklist_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "enrolledIn" ADD CONSTRAINT "enrolledIn_courseCode_courses_code_fk" FOREIGN KEY ("courseCode") REFERENCES "public"."courses"("code") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "enrolledIn" ADD CONSTRAINT "enrolledIn_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "manages" ADD CONSTRAINT "manages_courseCode_courses_code_fk" FOREIGN KEY ("courseCode") REFERENCES "public"."courses"("code") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "manages" ADD CONSTRAINT "manages_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "received_notifications" ADD CONSTRAINT "received_notifications_notification_id_notification_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "received_notifications" ADD CONSTRAINT "received_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_course_id_courses_code_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("code") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_announcer_id_users_id_fk" FOREIGN KEY ("announcer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "classes_announcements" ADD CONSTRAINT "classes_announcements_announcement_id_announcement_id_fk" FOREIGN KEY ("announcement_id") REFERENCES "public"."announcement"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "courses_announcements" ADD CONSTRAINT "courses_announcements_announcement_id_announcement_id_fk" FOREIGN KEY ("announcement_id") REFERENCES "public"."announcement"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "courses_announcements" ADD CONSTRAINT "courses_announcements_course_id_courses_code_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("code") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "poll-item" ADD CONSTRAINT "poll-item_announcement_id_announcement_id_fk" FOREIGN KEY ("announcement_id") REFERENCES "public"."announcement"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_voter_id_users_id_fk" FOREIGN KEY ("voter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_poll_item_id_poll-item_id_fk" FOREIGN KEY ("poll_item_id") REFERENCES "public"."poll-item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_course_id_courses_code_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("code") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_assigner_id_users_id_fk" FOREIGN KEY ("assigner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "assignments_files" ADD CONSTRAINT "assignments_files_assignment_id_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignment"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "assignments_files" ADD CONSTRAINT "assignments_files_file_id_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "material" ADD CONSTRAINT "material_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material" ADD CONSTRAINT "material_file_id_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material" ADD CONSTRAINT "material_course_code_courses_code_fk" FOREIGN KEY ("course_code") REFERENCES "public"."courses"("code") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_assignment_id_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignment"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "submissions_files" ADD CONSTRAINT "submissions_files_file_id_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "submissions_files" ADD CONSTRAINT "submissions_files_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;