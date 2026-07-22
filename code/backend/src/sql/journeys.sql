CREATE TABLE IF NOT EXISTS journeys (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL,
    route_id INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pickup_started'
        CHECK (status IN ('pickup_started', 'heading_to_school', 'arrived_at_school', 'return_started', 'completed')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    CONSTRAINT fk_journeys_driver
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_journeys_route
        FOREIGN KEY (route_id)
        REFERENCES routes(id)
        ON DELETE RESTRICT
);
