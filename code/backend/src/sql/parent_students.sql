CREATE TABLE IF NOT EXISTS parent_students (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    relationship_type VARCHAR(50),
    UNIQUE (parent_id, student_id)
);