-- AquaSafari — optional seed data
-- Run this against the shared Azure SQL Database (Section 4 of the guide),
-- after all six members' entity classes have been merged into dev and
-- the tables already exist (Hibernate creates them on first backend run).
--
-- This is only for giving the team consistent demo data — it is NOT
-- required for the app itself to work, and table/column names below
-- are examples: adjust them to match your actual @Entity field names.

-- Sample users
-- INSERT INTO Users (Name, Email, Phone, PasswordHash, Role) VALUES
-- ('Nimal Perera', 'nimal@example.com', '0771234567', 'hashed_password', 'CUSTOMER'),
-- ('Admin User', 'admin@aquasafari.com', '0777654321', 'hashed_password', 'ADMIN');

-- Sample boats
-- INSERT INTO Boat (Name, Capacity, Type, Status) VALUES
-- ('Ocean Breeze', 12, 'Speedboat', 'AVAILABLE'),
-- ('River Explorer', 8, 'Longtail', 'AVAILABLE');

-- Sample trips
-- INSERT INTO Trip (BoatId, Route, DepartureTime, DurationMinutes, Price) VALUES
-- (1, 'Bentota River Safari', '2026-09-01 09:00:00', 90, 3500.00);

-- Sample booking
-- INSERT INTO Booking (UserId, TripId, Passengers, Status) VALUES
-- (1, 1, 2, 'CONFIRMED');

-- Sample payment (Payment Management module)
-- INSERT INTO Payment (BookingId, Amount, PaymentMethod, Status, PaymentDate) VALUES
-- (1, 3500.00, 'CARD', 'PAID', '2026-08-20');

-- Verify:
-- SELECT * FROM Users;
-- SELECT * FROM Boat;
-- SELECT * FROM Trip;
-- SELECT * FROM Booking;
-- SELECT * FROM Payment;
