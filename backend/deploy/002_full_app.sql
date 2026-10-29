ALTER TABLE courses ADD COLUMN IF NOT EXISTS department varchar(255) NOT NULL DEFAULT 'General Studies';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS description text;
CREATE TABLE IF NOT EXISTS hosted_upload (
 file_id uuid PRIMARY KEY REFERENCES file(id) ON DELETE CASCADE,
 owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 token uuid NOT NULL, bytes integer NOT NULL, content text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app_migration (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
