Security guidance — TransitJustice

1) Row Level Security (RLS)

- Review `src/migrations/policies.sql` before applying. It contains example policies for profiles, complaints, evidence, messages, and other tables.
- Important: do not grant role assignment permissions from the public client. Role changes (e.g., to `authority` or `admin`) must be made via a trusted admin UI or directly in the database by an admin.
- Test policies in a staging Supabase project before applying to production.

2) Storage and evidence files

- Create a Supabase Storage bucket named `evidence` and set it to private (not public).
- Use signed URLs for serving evidence files to authenticated users. Signed URLs should be short-lived.
- Do not rely solely on frontend checks to protect file access; enforce access via RLS policies and private buckets.

3) Creating authority/admin users for testing

- A seed file is provided: `src/migrations/seeds.sql`. It inserts example `profiles` rows for demonstration only.
- Replace placeholder UUIDs in `seeds.sql` with real auth user IDs from your Supabase Auth users before running.
- Ensure the `profiles.id` matches the `auth.users.id` so `auth.uid()` will match rows in RLS policies.

4) Key operational notes

- Audit logs: enable and monitor `audit_logs` for sensitive actions (assignments, status changes, role changes).
- Internal notes are stored as `complaint_messages` with `is_internal = true`. RLS prevents passengers from selecting internal messages.
- Keep backups of your policy SQL and test migration rollbacks in staging.

If you want, I can:
- Generate a SQL script to create an authority test user tied to an existing auth user ID (provide the auth UID), or
- Walk through applying the migrations and policies to a Supabase project.
