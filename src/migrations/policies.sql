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
