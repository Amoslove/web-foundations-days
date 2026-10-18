
# School Database Design

## Tables

The `students` table stores each student's ID, name and email address. Each student has a unique ID, and the email address must be unique.

The `courses` table stores the available courses. Each course has a unique ID and a course name.

The `enrolments` table connects students to courses. It stores the student ID, course ID and grade. Foreign keys connect each enrolment to an existing student and course. A student cannot enrol in the same course twice.

## Relationships

The relationship between students and enrolments is one-to-many because one student can have many enrolment records. The relationship between courses and enrolments is also one-to-many because one course can have many students enrolled in it.

Students and courses have a many-to-many relationship because each student can take several courses, and each course can have several students. The enrolments table is needed as a join table to connect these two tables and store each student's grade for a particular course.

## Index

I would add an index on `enrolments(course_id)` to help the database find enrolments for a particular course faster, especially when listing students on a course or counting students per course.

## SQL or NoSQL?

I would choose SQL for this school database because the information has clear relationships between students, courses and enrolments. SQL supports primary keys, foreign keys and unique constraints to maintain data accuracy. It also makes it easy to join tables, count enrolments and update grades. SQLite is suitable for this small school system.
