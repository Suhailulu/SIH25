-- Example Supabase RLS policies (adapt to your organization)

-- Enable RLS
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS evidence ENABLE ROW LEVEL SECURITY;

-- profiles: users can manage their own profile
CREATE POLICY "profiles_self"
  ON profiles
  FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- complaints: passengers can insert complaints where passenger_id = auth.uid(); they can select their own complaints
CREATE POLICY "complaints_passenger_access"
  ON complaints
  FOR SELECT USING (passenger_id = auth.uid());

CREATE POLICY "complaints_passenger_insert"
  ON complaints
  FOR INSERT WITH CHECK (passenger_id = auth.uid());

-- evidence: only owner passenger or authorized roles can access
CREATE POLICY "evidence_passenger_access"
  ON evidence
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM complaints WHERE complaints.id = evidence.complaint_id AND complaints.passenger_id = auth.uid())
  );

-- complaint_messages: passengers can see public messages (is_internal = false) for their complaints
CREATE POLICY "messages_passenger_public"
  ON complaint_messages
  FOR SELECT USING (
    (is_internal = false) AND EXISTS (SELECT 1 FROM complaints WHERE complaints.id = complaint_messages.complaint_id AND complaints.passenger_id = auth.uid())
  );

-- Admins and authority officers will require separate policies scoped to roles; manage via RLS using profiles.role
-- Example: allow admins full access (replace 'admin' with your role identifier)
CREATE POLICY "admin_full_access_profiles"
  ON profiles
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin'));

CREATE POLICY "admin_full_access_complaints"
  ON complaints
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin'));

-- Authority officers: allow read and update access within authority scope
CREATE POLICY "authority_read_complaints"
  ON complaints
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'authority'));

CREATE POLICY "authority_update_complaints"
  ON complaints
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'authority'));

-- allow authority to insert authority_actions and internal messages
ALTER TABLE IF EXISTS authority_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authority_actions_officer_insert"
  ON authority_actions
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'authority'));

ALTER TABLE IF EXISTS complaint_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_authority_internal"
  ON complaint_messages
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'authority'));

-- Note: Adjust and test these policies in your Supabase project carefully.

-- IMPORTANT SECURITY NOTES:
-- 1) Do NOT allow users to set their own `role` to 'admin' from the client.
--    The frontend should always upsert profiles with role='passenger' for new signups.
--    Role changes must be performed by administrators through a trusted admin UI or the Supabase dashboard.
-- 2) Storage buckets for evidence MUST be private. Use signed URLs to provide temporary access to files.
-- 3) Review and tighten authority scoping (e.g., operator/regional ownership) as needed for your deployment.

-- Additional table-level policies: enable RLS on commonly sensitive tables
ALTER TABLE IF EXISTS tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS witnesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS complaint_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS authority_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS recurring_issue_alerts ENABLE ROW LEVEL SECURITY;

-- profiles: allow users to manage their own profile (select/insert/update/delete limited to own id)
CREATE POLICY "profiles_self_select"
  ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_self_insert"
  ON profiles
  FOR INSERT WITH CHECK (id = auth.uid() AND role = 'passenger');

CREATE POLICY "profiles_self_update"
  ON profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Admins: full access to manage profiles and system data
CREATE POLICY "admin_full_access_all"
  ON profiles
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin'));

-- complaints: passengers can select/insert their own complaints; can update limited fields only via backend or authority
CREATE POLICY "complaints_passenger_select"
  ON complaints
  FOR SELECT USING (passenger_id = auth.uid());

CREATE POLICY "complaints_passenger_insert"
  ON complaints
  FOR INSERT WITH CHECK (passenger_id = auth.uid());

-- passengers should not be allowed to set priority or status manually on insert from client; enforce via backend RPCs if needed.

-- authority: allow users with role 'authority' to select and update complaints
CREATE POLICY "complaints_authority_select"
  ON complaints
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'authority'));

CREATE POLICY "complaints_authority_update"
  ON complaints
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'authority'));

-- evidence: passengers can see evidence for their own complaints; authority can see evidence
CREATE POLICY "evidence_passenger_or_authority"
  ON evidence
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM complaints WHERE complaints.id = evidence.complaint_id AND complaints.passenger_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'authority')
  );

-- complaint_messages: passengers can see public messages for their complaints; authority can insert internal messages
CREATE POLICY "messages_passenger_public"
  ON complaint_messages
  FOR SELECT USING (
    (is_internal = false) AND EXISTS (SELECT 1 FROM complaints WHERE complaints.id = complaint_messages.complaint_id AND complaints.passenger_id = auth.uid())
  );

CREATE POLICY "messages_authority_insert"
  ON complaint_messages
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'authority'));

-- passengers may insert public (non-internal) messages for their own complaints
CREATE POLICY "messages_passenger_insert_public"
  ON complaint_messages
  FOR INSERT WITH CHECK (
    is_internal = false
    AND EXISTS (SELECT 1 FROM complaints WHERE complaints.id = complaint_messages.complaint_id AND complaints.passenger_id = auth.uid())
  );

-- allow authority officers to select messages for complaints assigned to them; admins can see all
CREATE POLICY "messages_authority_select"
  ON complaint_messages
  FOR SELECT USING (
    (
      EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'authority')
      AND EXISTS (SELECT 1 FROM complaints WHERE complaints.id = complaint_messages.complaint_id AND complaints.assigned_officer_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin')
  );

-- authority_actions: only authority or admin may insert actions
CREATE POLICY "authority_actions_insert"
  ON authority_actions
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND (p2.role = 'authority' OR p2.role = 'admin')));

-- notifications: users can only see their own notifications
CREATE POLICY "notifications_own"
  ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_by_system"
  ON notifications
  FOR INSERT WITH CHECK (user_id IS NOT NULL);

-- audit_logs: only admins can view
CREATE POLICY "audit_logs_admin"
  ON audit_logs
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin'));

