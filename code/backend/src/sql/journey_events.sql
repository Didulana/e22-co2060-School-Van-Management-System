CREATE TABLE IF NOT EXISTS journey_events (
    id SERIAL PRIMARY KEY,
    journey_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);