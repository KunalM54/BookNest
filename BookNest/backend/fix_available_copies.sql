-- Fix books where available_copies should match total_copies
UPDATE books
SET available_copies = total_copies
WHERE available_copies IS NULL OR available_copies = 0;