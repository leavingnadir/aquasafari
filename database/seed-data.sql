USE AquaSafariDB;

CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    role VARCHAR(20)
);

CREATE TABLE boats (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100),
    capacity INT,
    status VARCHAR(20)
);

CREATE TABLE trips (
    id INT IDENTITY(1,1) PRIMARY KEY,
    boat_id INT FOREIGN KEY REFERENCES boats(id),
    trip_date DATE,
    price DECIMAL(10,2)
);

CREATE TABLE bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    trip_id INT FOREIGN KEY REFERENCES trips(id),
    user_id INT FOREIGN KEY REFERENCES users(id),
    status VARCHAR(20)
);

CREATE TABLE feedback (
    id INT IDENTITY(1,1) PRIMARY KEY,
    booking_id INT FOREIGN KEY REFERENCES bookings(id),
    user_id INT FOREIGN KEY REFERENCES users(id),
    rating INT,
    comment VARCHAR(500)
);

CREATE TABLE payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    booking_id INT FOREIGN KEY REFERENCES bookings(id),
    amount DECIMAL(10,2),
    status VARCHAR(20)
);


-- Users
INSERT INTO users (name, email, password, role)
VALUES 
('Test Customer', 'testuser@example.com', 'dummy_hashed_pw', 'CUSTOMER'),
('Nimal Perera', 'nimal@example.com', 'dummy_hashed_pw', 'CUSTOMER'),
('Test Admin', 'admin@example.com', 'dummy_hashed_pw', 'ADMIN');

-- Boats
INSERT INTO boats (name, capacity, status)
VALUES 
('Ocean Explorer', 12, 'AVAILABLE'),
('Sea Breeze', 8, 'MAINTENANCE'),
('Wave Rider', 20, 'AVAILABLE');

-- Trips
INSERT INTO trips (boat_id, trip_date, price)
VALUES 
(1, '2026-09-15', 5000.00),
(1, '2026-09-22', 5000.00),
(2, '2026-09-20', 3500.00),
(3, '2026-09-25', 7500.00);

-- Bookings
INSERT INTO bookings (trip_id, user_id, status)
VALUES 
(1, 1, 'CONFIRMED'),
(2, 1, 'PENDING'),
(3, 2, 'CONFIRMED'),
(4, 2, 'CANCELLED');

-- Payments
INSERT INTO payments (booking_id, amount, status)
VALUES 
(1, 5000.00, 'COMPLETED'),
(2, 5000.00, 'PENDING'),
(3, 3500.00, 'COMPLETED');

-- Feedback
INSERT INTO feedback (booking_id, user_id, rating, comment)
VALUES 
(1, 1, 5, 'Great trip, very smooth!'),
(3, 2, 4, 'Good experience, slightly delayed departure.');

SELECT * FROM users;
SELECT * FROM boats;
SELECT * FROM trips;
SELECT * FROM bookings;
SELECT * FROM payments;
SELECT * FROM feedback;

DROP TABLE payments;

INSERT INTO payment (amount, bookingid, payment_date, payment_method, payment_status, transaction_reference)
VALUES 
(5000.00, 1, GETDATE(), 'CARD', 'PAID', 'TXN-00123'),
(3500.00, 3, GETDATE(), 'BANK_TRANSFER', 'PAID', 'TXN-00124'),
(7500.00, 2, GETDATE(), 'MOBILE_WALLET', 'PENDING', NULL);