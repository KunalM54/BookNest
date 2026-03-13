-- Backfill missing borrow status values to PENDING
UPDATE borrows
SET status = 'PENDING'
WHERE status IS NULL;
