-- Seed sample messages for local testing
-- Inserts a public passenger message and an internal officer note for the first complaint found.

-- public passenger message
INSERT INTO complaint_messages (complaint_id, sender_id, message, is_internal)
SELECT c.id, c.passenger_id, 'Seeded: passenger initial message', false
FROM complaints c
LIMIT 1;

-- internal officer note (if an authority user exists)
INSERT INTO complaint_messages (complaint_id, sender_id, message, is_internal)
SELECT c.id, p.id, 'Seeded: internal officer note', true
FROM complaints c
JOIN profiles p ON p.role = 'authority'
LIMIT 1;

-- Notes: replace or remove these seeds as needed for your environment.
