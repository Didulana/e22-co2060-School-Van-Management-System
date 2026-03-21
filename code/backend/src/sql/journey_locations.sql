CREATE TABLE IF NOT EXISTS journey_locations (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL,
    journey_id INTEGER NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_journey_locations_journey
ON journey_locations (journey_id);