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
