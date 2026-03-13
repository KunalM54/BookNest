-- Seed books across categories for realistic report charts
INSERT IGNORE INTO books
  (title, isbn, author, category, image_data, total_copies, available_copies)
VALUES
  ('Clean Code', '9780132350884', 'Robert C. Martin', 'Computer Science', NULL, 8, 8),
  ('Design Patterns', '9780201633610', 'Erich Gamma', 'Computer Science', NULL, 6, 6),
  ('Introduction to Algorithms', '9780262033848', 'Thomas H. Cormen', 'Computer Science', NULL, 10, 10),
  ('The Pragmatic Programmer', '9780201616224', 'Andrew Hunt', 'Computer Science', NULL, 7, 7),
  ('Effective Java', '9780134685991', 'Joshua Bloch', 'Computer Science', NULL, 6, 6),

  ('Data Structures in C', '9780131997469', 'Mark Allen Weiss', 'Information Technology', NULL, 5, 5),
  ('Computer Networks', '9780132126953', 'Andrew S. Tanenbaum', 'Information Technology', NULL, 6, 6),
  ('Database System Concepts', '9780073523323', 'Abraham Silberschatz', 'Information Technology', NULL, 6, 6),
  ('Operating System Concepts', '9781119456339', 'Abraham Silberschatz', 'Information Technology', NULL, 6, 6),

  ('Software Engineering', '9780133943030', 'Ian Sommerville', 'Software Engineering', NULL, 8, 8),
  ('Refactoring', '9780134757599', 'Martin Fowler', 'Software Engineering', NULL, 5, 5),
  ('Domain-Driven Design', '9780321125217', 'Eric Evans', 'Software Engineering', NULL, 4, 4),

  ('Basic Electrical Engineering', '9780070681699', 'V.K. Mehta', 'Electrical Engineering', NULL, 7, 7),
  ('Electrical Machines', '9780071002738', 'I.J. Nagrath', 'Electrical Engineering', NULL, 6, 6),

  ('Strength of Materials', '9780073423333', 'R.K. Bansal', 'Mechanical Engineering', NULL, 6, 6),
  ('Thermodynamics', '9780070159282', 'P.K. Nag', 'Mechanical Engineering', NULL, 5, 5),

  ('Surveying', '9780074598474', 'B.C. Punmia', 'Civil Engineering', NULL, 5, 5),
  ('Concrete Technology', '9788123904017', 'M.S. Shetty', 'Civil Engineering', NULL, 5, 5),

  ('Principles of Management', '9780077090076', 'P.C. Tripathi', 'Business Administration', NULL, 6, 6),
  ('Marketing Management', '9780132102926', 'Philip Kotler', 'Business Administration', NULL, 6, 6),

  ('Financial Accounting', '9780070229602', 'Weygandt', 'Commerce', NULL, 5, 5),
  ('Business Law', '9780074625909', 'Aswathappa', 'Commerce', NULL, 4, 4),

  ('Principles of Economics', '9781305585126', 'N. Gregory Mankiw', 'Economics', NULL, 6, 6),
  ('Microeconomics', '9780393926147', 'Paul Krugman', 'Economics', NULL, 5, 5),

  ('Linear Algebra', '9780321982384', 'David C. Lay', 'Mathematics', NULL, 6, 6),
  ('Calculus', '9781285740621', 'James Stewart', 'Mathematics', NULL, 7, 7),

  ('Concepts of Physics', '9789352607413', 'H.C. Verma', 'Physics', NULL, 6, 6),
  ('University Physics', '9780135159554', 'Young & Freedman', 'Physics', NULL, 6, 6),

  ('Organic Chemistry', '9780073402741', 'Morrison & Boyd', 'Chemistry', NULL, 5, 5),
  ('Physical Chemistry', '9788121900295', 'P. Bahadur', 'Chemistry', NULL, 5, 5);
