CREATE TABLE IF NOT EXISTS student_boarding (
    id SERIAL PRIMARY KEY,
    journey_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    boarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);