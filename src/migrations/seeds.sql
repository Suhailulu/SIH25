-- Seed demo profiles for testing
-- Replace the example UUIDs with real auth user IDs from your Supabase Auth users when testing.

INSERT INTO profiles (id, full_name, email, phone, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin User', 'admin@example.com', '0000000000', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'Authority Officer', 'officer@example.com', '0000000001', 'authority')
ON CONFLICT (id) DO NOTHING;

-- Important: these IDs are placeholders. To connect these profiles to actual auth users, use the auth user's UUID.
