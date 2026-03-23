# BookNest Admin Delete/Logout Fix - TODO

## Steps:
1. [ ] Update backend BookController.java: Add check for active borrows before deleteBook. If active borrows exist, return {success: false, message: "Cannot delete book with active borrows..."} HTTP 400.
2. [ ] Update frontend manage-books.ts: Improve deleteBook error handling - log full error (status, message), show specific snackbar errors (e.g., "Book has active borrows"), prevent any unintended logout.
3. [ ] Test: Start backend/frontend, login admin, try delete non-borrowed book (success), borrowed book (error message, no logout), manual logout (works).
4. [ ] [Complete] Remove TODO.md or mark done.

Current progress: Plan approved, starting implementation.

