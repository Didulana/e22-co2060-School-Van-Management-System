CREATE TABLE IF NOT EXISTS route_stops (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL,
    stop_name VARCHAR(100) NOT NULL,
    stop_order INTEGER NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_route_stops_route
        FOREIGN KEY (route_id)
        REFERENCES routes(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_route_stop_order
        UNIQUE (route_id, stop_order)
);