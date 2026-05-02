CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'driver', 'parent')),
    phone VARCHAR(50),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    vehicle_id INTEGER UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_drivers_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    driver_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL,
    schedule VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_routes_driver
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_routes_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE RESTRICT
);CREATE TABLE IF NOT EXISTS route_stops (
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
);CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    school VARCHAR(255),
    pickup_stop_id INTEGER,
    dropoff_stop_id INTEGER,
    pickup_lat DECIMAL(10, 8),
    pickup_lng DECIMAL(11, 8),
    dropoff_lat DECIMAL(10, 8),
    dropoff_lng DECIMAL(11, 8),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS predefined_stops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed with some major Sri Lankan cities/suburbs
INSERT INTO predefined_stops (name, latitude, longitude) VALUES 
('Colombo Fort', 6.9344, 79.8501),
('Galle Face Green', 6.9234, 79.8456),
('Kollupitiya', 6.9114, 79.8492),
('Bambalapitiya', 6.8981, 79.8552),
('Wellawatte', 6.8778, 79.8631),
('Dehiwala', 6.8512, 79.8661),
('Mount Lavinia', 6.8333, 79.8642),
('Ratmalana', 6.8181, 79.8732),
('Moratuwa', 6.7731, 79.8812),
('Panadura', 6.7111, 79.9074),
('Nugegoda', 6.8744, 79.8942),
('Maharagama', 6.8488, 79.9262),
('Kottawa', 6.8412, 79.9652),
('Homagama', 6.8441, 80.0022),
('Battaramulla', 6.8981, 79.9162),
('Malabe', 6.9048, 79.9542);
CREATE TABLE IF NOT EXISTS parent_students (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    relationship_type VARCHAR(50),
    UNIQUE (parent_id, student_id)
);CREATE TABLE IF NOT EXISTS journeys (
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
CREATE TABLE IF NOT EXISTS journey_locations (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL,
    journey_id INTEGER NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_journey_locations_journey
ON journey_locations (journey_id);CREATE TABLE IF NOT EXISTS journey_events (
    id SERIAL PRIMARY KEY,
    journey_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);CREATE TABLE IF NOT EXISTS student_boarding (
    id SERIAL PRIMARY KEY,
    journey_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    boarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);CREATE TABLE IF NOT EXISTS student_dropoff (
    id SERIAL PRIMARY KEY,
    journey_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    dropped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);CREATE TABLE IF NOT EXISTS student_absences (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    absence_date DATE NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, absence_date)
);
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    journey_id INTEGER NOT NULL,
    user_id INTEGER,
    student_id INTEGER,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_journey
ON notifications (journey_id);