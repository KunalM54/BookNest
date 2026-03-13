-- Backfill action_date for existing approved/rejected requests (best-effort)
UPDATE borrows
SET action_date = request_date
WHERE action_date IS NULL
  AND status IN ('APPROVED', 'REJECTED');
