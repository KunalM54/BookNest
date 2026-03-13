-- Add extra books to make category chart more realistic
INSERT IGNORE INTO books
  (title, isbn, author, category, image_data, total_copies, available_copies)
VALUES
  ('Algorithms Unlocked', '9780262528801', 'Thomas H. Cormen', 'Computer Science', NULL, 5, 5),
  ('Clean Architecture', '9780134494166', 'Robert C. Martin', 'Computer Science', NULL, 5, 5),
  ('Head First Design Patterns', '9780596007126', 'Eric Freeman', 'Computer Science', NULL, 5, 5),
  ('Code Complete', '9780735619678', 'Steve McConnell', 'Computer Science', NULL, 5, 5),
  ('Working Effectively with Legacy Code', '9780131177055', 'Michael Feathers', 'Computer Science', NULL, 5, 5),
  ('The Art of Computer Programming', '9780201896831', 'Donald Knuth', 'Computer Science', NULL, 4, 4),
  ('Structure and Interpretation of Computer Programs', '9780262510875', 'Harold Abelson', 'Computer Science', NULL, 4, 4),
  ('Programming Pearls', '9780201657883', 'Jon Bentley', 'Computer Science', NULL, 4, 4),
  ('Introduction to the Theory of Computation', '9781133187790', 'Michael Sipser', 'Computer Science', NULL, 4, 4),
  ('Compilers: Principles, Techniques, and Tools', '9780321486813', 'Aho, Lam, Sethi, Ullman', 'Computer Science', NULL, 4, 4),

  ('Database Systems: The Complete Book', '9780131873254', 'Hector Garcia-Molina', 'Information Technology', NULL, 4, 4),
  ('Modern Operating Systems', '9780133591620', 'Andrew S. Tanenbaum', 'Information Technology', NULL, 4, 4),
  ('Data Communications and Networking', '9780073376225', 'Behrouz Forouzan', 'Information Technology', NULL, 4, 4),
  ('Computer Organization', '9780124077263', 'David A. Patterson', 'Information Technology', NULL, 4, 4),
  ('Information Security', '9781118873465', 'Mark Stamp', 'Information Technology', NULL, 4, 4),

  ('Software Architecture in Practice', '9780321815736', 'Len Bass', 'Software Engineering', NULL, 4, 4),
  ('Continuous Delivery', '9780321601919', 'Jez Humble', 'Software Engineering', NULL, 4, 4),
  ('Release It!', '9781680502398', 'Michael Nygard', 'Software Engineering', NULL, 4, 4),

  ('Engineering Mechanics', '9780070702082', 'S.S. Bhavikatti', 'Mechanical Engineering', NULL, 4, 4),
  ('Fluid Mechanics', '9780070702815', 'S.K. Som', 'Mechanical Engineering', NULL, 4, 4),

  ('Structural Analysis', '9780070149009', 'R.C. Hibbeler', 'Civil Engineering', NULL, 4, 4),
  ('Soil Mechanics', '9788120353221', 'B.C. Punmia', 'Civil Engineering', NULL, 4, 4),

  ('Principles of Marketing', '9780134166333', 'Philip Kotler', 'Business Administration', NULL, 4, 4),
  ('Strategic Management', '9780134167163', 'Fred R. David', 'Business Administration', NULL, 4, 4),

  ('Cost Accounting', '9780070137185', 'M.N. Arora', 'Commerce', NULL, 4, 4),
  ('Business Statistics', '9780071073431', 'S.C. Gupta', 'Commerce', NULL, 4, 4);
