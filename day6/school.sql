

PRAGMA foreign_keys = ON;

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL UNIQUE
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id)
);




-- Insert students
INSERT INTO students (student_id, name, email) VALUES
(1, 'Ada', 'ada@example.com'),
(2, 'John', 'john@example.com'),
(3, 'Mary', 'mary@example.com'),
(4, 'Peter', 'peter@example.com');

-- Insert courses
INSERT INTO courses (course_id, course_name) VALUES
(1, 'Mathematics'),
(2, 'English'),
(3, 'Computer Science');

-- Insert enrolments and grades
INSERT INTO enrolments (enrolment_id, student_id, course_id, grade) VALUES
(1, 1, 1, 'A'),
(2, 1, 2, 'B'),
(3, 2, 1, 'B'),
(4, 2, 3, 'A'),
(5, 3, 2, 'A');




-- QUERY 1: All courses taken by one student (Ada)
SELECT s.name, c.course_name, e.grade
FROM students s
JOIN enrolments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE s.name = 'Ada';

-- QUERY 2: All students taking one course (Mathematics)
SELECT s.name, c.course_name
FROM students s
JOIN enrolments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE c.course_name = 'Mathematics';

-- QUERY 3: Number of students per course
SELECT c.course_name, COUNT(e.student_id) AS number_of_students
FROM courses c
LEFT JOIN enrolments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name;

-- QUERY 4: Students who have no enrolments
SELECT s.name
FROM students s
LEFT JOIN enrolments e ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-- QUERY 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 'A'
WHERE enrolment_id = 1;
