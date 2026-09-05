-- Lulu Smart Travel schema (PostgreSQL)

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  email text UNIQUE,
  phone text,
  role text DEFAULT 'passenger',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- complaints
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number text UNIQUE,
  passenger_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  category text,
  subcategory text,
  priority text DEFAULT 'LOW',
  description text,

  transport_type text,
  operator_name text,
  service_number text,
  route text,
  boarding_point text,
  destination text,

  journey_date date,
  journey_time time,
  incident_date date,
  incident_time time,

  current_status text DEFAULT 'Submitted',
  assigned_officer_id uuid,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- sequence + trigger for complaint_number generation
CREATE SEQUENCE IF NOT EXISTS complaint_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_complaint_number() RETURNS trigger AS $$
BEGIN
  IF NEW.complaint_number IS NULL THEN
    NEW.complaint_number := concat('TJ-', date_part('year', NEW.created_at)::int, '-', lpad(nextval('complaint_number_seq')::text, 6, '0'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS complaints_generate_number ON complaints;
CREATE TRIGGER complaints_generate_number
BEFORE INSERT ON complaints
FOR EACH ROW
EXECUTE FUNCTION generate_complaint_number();

-- tickets
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  ticket_number text,
  booking_reference text,
  seat_number text,
  ticket_file_path text,
  verification_status text DEFAULT 'not_verified',
  created_at timestamptz DEFAULT now()
);

-- evidence
CREATE TABLE IF NOT EXISTS evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  evidence_type text,
  file_path text,
  file_name text,
  mime_type text,
  file_size bigint,
  description text,
  uploaded_by uuid,
  created_at timestamptz DEFAULT now()
);

-- witnesses
CREATE TABLE IF NOT EXISTS witnesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  name text,
  contact text,
  statement text,
  created_at timestamptz DEFAULT now()
);

-- complaint_status_history
CREATE TABLE IF NOT EXISTS complaint_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  previous_status text,
  new_status text,
  updated_by uuid,
  note text,
  created_at timestamptz DEFAULT now()
);

-- complaint_messages
CREATE TABLE IF NOT EXISTS complaint_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  sender_id uuid,
  message text,
  is_internal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- authority_actions
CREATE TABLE IF NOT EXISTS authority_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  officer_id uuid,
  action_type text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title text,
  message text,
  is_read boolean DEFAULT false,
  related_complaint_id uuid,
  created_at timestamptz DEFAULT now()
);

-- feedback
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  passenger_id uuid,
  resolution_status text,
  rating smallint,
  comments text,
  created_at timestamptz DEFAULT now()
);

-- audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  complaint_id uuid,
  action text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- recurring_issue_alerts
CREATE TABLE IF NOT EXISTS recurring_issue_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text,
  operator_name text,
  route text,
  service_number text,
  complaint_count integer,
  period_start date,
  period_end date,
  status text,
  created_at timestamptz DEFAULT now()
);
