-- Create trigger to insert notifications when new evidence is added

CREATE OR REPLACE FUNCTION notify_on_evidence_insert() RETURNS trigger AS $$
DECLARE
  c_row RECORD;
  title text;
  message text;
BEGIN
  SELECT complaint_number, passenger_id, assigned_officer_id INTO c_row FROM complaints WHERE id = NEW.complaint_id;
  title := 'New evidence uploaded';
  message := 'New evidence uploaded for ' || coalesce(c_row.complaint_number, 'a complaint');

  -- Notify passenger (if different from uploader)
  IF c_row.passenger_id IS NOT NULL AND c_row.passenger_id <> NEW.uploaded_by THEN
    INSERT INTO notifications(user_id, title, message, related_complaint_id, created_at)
    VALUES (c_row.passenger_id, title, message, NEW.complaint_id, now());
  END IF;

  -- Notify assigned officer (if present and different from uploader)
  IF c_row.assigned_officer_id IS NOT NULL AND c_row.assigned_officer_id <> NEW.uploaded_by THEN
    INSERT INTO notifications(user_id, title, message, related_complaint_id, created_at)
    VALUES (c_row.assigned_officer_id, title, message, NEW.complaint_id, now());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS evidence_notify_trigger ON evidence;
CREATE TRIGGER evidence_notify_trigger
AFTER INSERT ON evidence
FOR EACH ROW
EXECUTE FUNCTION notify_on_evidence_insert();
