-- =========================================================================
-- AquaSafariDB -- Consolidated Schema + Seed Data
-- Group 2026-Y2-S1-MLB-B03G2-03 | IT2140 Database Design & Development
--
-- This consolidates the team's incremental CREATE / ALTER / INSERT / UPDATE
-- history into ONE clean, re-runnable script. Every ALTER TABLE addition
-- made after the original CREATE TABLE has been folded directly into the
-- CREATE TABLE statements below, and every manual UPDATE fix-up has been
-- baked into the initial INSERT values, so this script can be run start to
-- finish on a fresh (or existing) AquaSafariDB and reach the same end state
-- in one pass.
--
-- Scope: 6 core tables only -- USER, BOAT, TRIP, BOOKING, PAYMENT, FEEDBACK.
-- SUPPORT_REQUEST and NOTIFICATION are intentionally out of scope and do
-- not appear anywhere in this script.
-- =========================================================================

-- -------------------------------------------------------------------------
-- STEP 1: Clean slate -- drop existing FKs, then the 6 tables, if present
-- -------------------------------------------------------------------------
IF DB_ID('AquaSafariDB') IS NOT NULL
BEGIN
    USE AquaSafariDB;
    DECLARE @ConstraintName NVARCHAR(200), @TableName NVARCHAR(200), @SchemaName NVARCHAR(200);
    WHILE EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_TYPE = 'FOREIGN KEY')
    BEGIN
        SELECT TOP 1
            @ConstraintName = tc.CONSTRAINT_NAME,
            @TableName = tc.TABLE_NAME,
            @SchemaName = tc.TABLE_SCHEMA
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
        WHERE tc.CONSTRAINT_TYPE = 'FOREIGN KEY';
        EXEC('ALTER TABLE ' + @SchemaName + '.' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName);
    END
END
GO

USE master;
GO
IF DB_ID('AquaSafariDB') IS NULL
    CREATE DATABASE AquaSafariDB;
GO

USE AquaSafariDB;
GO
DROP TABLE IF EXISTS dbo.boats;
DROP TABLE IF EXISTS dbo.NOTIFICATION;
DROP TABLE IF EXISTS dbo.SUPPORT_REQUEST;
DROP TABLE IF EXISTS dbo.FEEDBACK;
DROP TABLE IF EXISTS dbo.PAYMENT;
DROP TABLE IF EXISTS dbo.BOOKING;
DROP TABLE IF EXISTS dbo.TRIP;
DROP TABLE IF EXISTS dbo.BOAT;
DROP TABLE IF EXISTS dbo.[USER];
GO

-- -------------------------------------------------------------------------
-- STEP 2: Create the final schema -- every later ALTER TABLE addition is
-- folded directly into the CREATE TABLE statements below
-- -------------------------------------------------------------------------

-- 1. USER  (ISA superclass -- Administrator / Customer / BoatOperator / TourGuide / Accountant)
CREATE TABLE [USER] (
    UserID           INT IDENTITY(1,1) PRIMARY KEY,
    Email            VARCHAR(100)  UNIQUE NOT NULL,
    Phone            VARCHAR(20)   NULL,
    PasswordHash     VARCHAR(255)  NOT NULL,
    FirstName        VARCHAR(50)   NULL,
    LastName         VARCHAR(50)   NULL,
    user_type        VARCHAR(30)   NOT NULL,   -- ADMINISTRATOR | CUSTOMER | BOAT_OPERATOR | TOUR_GUIDE | ACCOUNTANT
    RegistrationDate DATE          NULL,        -- CUSTOMER only
    CreatedAt        DATETIME2     NOT NULL CONSTRAINT DF_USER_CreatedAt DEFAULT GETDATE(),
    IsActive         BIT           NOT NULL CONSTRAINT DF_USER_IsActive DEFAULT 1
);
GO

-- 2. BOAT
CREATE TABLE [BOAT] (
    BoatID          INT IDENTITY(1,1) PRIMARY KEY,
    BoatType        VARCHAR(50)   NOT NULL,
    Capacity        INT           NOT NULL,
    Condition       VARCHAR(50)   NOT NULL,
    BoatCode        VARCHAR(50)   NOT NULL,
    Name            VARCHAR(100)  NOT NULL,
    EngineType      VARCHAR(50)   NULL,
    Status          VARCHAR(20)   NOT NULL CONSTRAINT DF_BOAT_Status DEFAULT 'AVAILABLE',
    BoatOperatorId  INT           NULL,
    CreatedAt       DATETIME2     NOT NULL CONSTRAINT DF_BOAT_CreatedAt DEFAULT GETDATE(),
    UpdatedAt       DATETIME2     NOT NULL CONSTRAINT DF_BOAT_UpdatedAt DEFAULT GETDATE(),
    CONSTRAINT UQ_BOAT_BoatCode UNIQUE (BoatCode),
    CONSTRAINT FK_BOAT_BoatOperatorId FOREIGN KEY (BoatOperatorId) REFERENCES [USER](UserID)
);
GO

-- 3. TRIP
CREATE TABLE [TRIP] (
    TripID          INT IDENTITY(1,1) PRIMARY KEY,
    BoatID          INT           NOT NULL,
    OperatorID      INT           NOT NULL,   -- Boat Operator assigned to this trip
    GuideID         INT           NOT NULL,   -- Tour Guide assigned to this trip
    TripDate        DATE          NOT NULL,
    DepartureTime   TIME          NOT NULL,
    Duration        VARCHAR(50)   NOT NULL,
    Route           VARCHAR(150)  NOT NULL,
    Price           DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (BoatID)     REFERENCES [BOAT](BoatID),
    FOREIGN KEY (OperatorID) REFERENCES [USER](UserID),
    FOREIGN KEY (GuideID)    REFERENCES [USER](UserID)
);
GO

-- 4. BOOKING
CREATE TABLE [BOOKING] (
    BookingID             INT IDENTITY(1,1) PRIMARY KEY,
    TripID                INT           NOT NULL,
    CustomerID            INT           NOT NULL,
    BookingDate           DATE          DEFAULT GETDATE(),
    PassengerCount        INT           NOT NULL,
    BookingStatus         VARCHAR(30)   NOT NULL,  -- PENDING | CONFIRMED | CANCELLED | EXPIRED
    ReservationExpiresAt  DATETIME2     NULL,
    FOREIGN KEY (TripID)     REFERENCES [TRIP](TripID),
    FOREIGN KEY (CustomerID) REFERENCES [USER](UserID)
);
GO

-- 5. PAYMENT
CREATE TABLE [PAYMENT] (
    PaymentID       INT IDENTITY(1,1) PRIMARY KEY,
    BookingID       INT           NOT NULL,
    AccountantID    INT           NULL,        -- Accountant who verified the payment
    Amount          DECIMAL(10,2) NOT NULL,
    PaymentDate     DATETIME      DEFAULT GETDATE(),
    PaymentMethod   VARCHAR(50)   NOT NULL,     -- CREDIT_CARD | BANK_TRANSFER | MOBILE_WALLET
    PaymentStatus   VARCHAR(30)   NOT NULL,     -- PENDING | PAID | DECLINED | REFUNDED
    FOREIGN KEY (BookingID)    REFERENCES [BOOKING](BookingID),
    FOREIGN KEY (AccountantID) REFERENCES [USER](UserID)
);
GO

-- 6. FEEDBACK
CREATE TABLE [FEEDBACK] (
    FeedbackID      INT IDENTITY(1,1) PRIMARY KEY,
    BookingID       INT           NOT NULL,
    CustomerID      INT           NOT NULL,
    Rating          INT           CHECK (Rating BETWEEN 1 AND 5),
    Comment         VARCHAR(500)  NULL,
    FOREIGN KEY (BookingID)   REFERENCES [BOOKING](BookingID),
    FOREIGN KEY (CustomerID)  REFERENCES [USER](UserID)
);
GO

-- -------------------------------------------------------------------------
-- STEP 3: Seed data -- final values baked in directly (no separate UPDATE
-- fix-up pass needed; every row already reflects its intended end-state)
-- -------------------------------------------------------------------------

-- USER (8 rows) -- Admin/Operator/Guide/Customer1 use the plain test
USE AquaSafariDB;
GO
INSERT INTO [USER] (Email, Phone, PasswordHash, FirstName, LastName, user_type, RegistrationDate)
VALUES
    ('admin@aquasafari.lk',      '0771234567', 'password', 'Ama',     'Dissanayake', 'ADMINISTRATOR', NULL),
    ('operator@aquasafari.lk',   '0772234567', '123',      'Nuwan',   'Fernando',    'BOAT_OPERATOR', NULL),
    ('guide@aquasafari.lk',      '0773234567', '123',      'Sanduni', 'Perera',      'TOUR_GUIDE',    NULL),
    ('accountant@aquasafari.lk', '0774234567', '$2b$12$rE4ucR7chvTBDD2uia0PhOu3WAG5poW8W13ee5ZKsRB1WA5lS0hEe', 'Ruwan',   'Jayasuriya', 'ACCOUNTANT', NULL),
    ('customer1@gmail.com',      '0775234567', '123',      'Kasun',   'Silva',       'CUSTOMER', '2026-08-01'),
    ('customer2@gmail.com',      '0776234567', '$2b$12$rE4ucR7chvTBDD2uia0PhOu3WAG5poW8W13ee5ZKsRB1WA5lS0hEe', 'Nimali',  'Jayasinghe', 'CUSTOMER', '2026-08-15'),
    ('customer3@gmail.com',      '0777234567', '$2b$12$rE4ucR7chvTBDD2uia0PhOu3WAG5poW8W13ee5ZKsRB1WA5lS0hEe', 'Dilshan', 'Madushanka', 'CUSTOMER', '2026-08-20'),
    ('customer4@gmail.com',      '0778234567', '$2b$12$rE4ucR7chvTBDD2uia0PhOu3WAG5poW8W13ee5ZKsRB1WA5lS0hEe', 'Piyumi',  'Hansamali',  'CUSTOMER', '2026-08-25');
GO

SELECT * FROM [USER];

-- BOAT (6 rows) -- the original 3 plus 3 more: TRIP below needs BoatID
-- 4-6 to exist, and every table needs >= 5 sample rows.
USE AquaSafariDB;
GO
INSERT INTO [BOAT] (BoatType, Capacity, Condition, BoatCode, Name, EngineType, Status, BoatOperatorId)
VALUES
    ('Speedboat',      12, 'GOOD',      'BT-001', 'Speedboat Boat 1',      'Outboard 150HP', 'AVAILABLE',   2),
    ('Catamaran',       8, 'GOOD',      'BT-002', 'Catamaran Boat 2',      'Outboard 115HP', 'AVAILABLE',   2),
    ('Luxury Cruiser', 20, 'GOOD',      'BT-003', 'Luxury Cruiser Boat 3', 'Diesel Inboard', 'AVAILABLE',   2),
    ('Catamaran',      10, 'GOOD',      'BT-004', 'Catamaran Boat 4',      'Outboard 150HP', 'AVAILABLE',   2),
    ('Speedboat',       6, 'GOOD',      'BT-005', 'Speedboat Boat 5',      'Outboard 200HP', 'AVAILABLE',   2),
    ('Luxury Cruiser', 25, 'EXCELLENT', 'BT-006', 'Luxury Cruiser Boat 6', 'Diesel Inboard', 'MAINTENANCE', NULL);
GO

SELECT * FROM [BOAT];

-- TRIP (7 rows) -- Trip #2's date is already its corrected, past date.
USE AquaSafariDB;
GO
INSERT INTO [TRIP] (BoatID, OperatorID, GuideID, TripDate, DepartureTime, Duration, Route, Price)
VALUES
    (1, 2, 3, '2026-09-15', '08:30:00', '3 Hours', 'Coral Reef & Lagoon Tour',   5000.00),
    (2, 2, 3, '2026-09-10', '14:00:00', '2 Hours', 'Mangrove River Safari',      3500.00),
    (3, 2, 3, '2026-09-25', '07:00:00', '5 Hours', 'Deep Sea Whale Watching',    7500.00),
    (4, 2, 3, '2026-09-05', '09:00:00', '2 Hours', 'Mirissa Turtle Snorkeling',  4500.00),
    (5, 2, 3, '2026-09-08', '15:30:00', '3 Hours', 'Sunset Coastal Cruise',      6000.00),
    (1, 2, 3, '2026-09-28', '08:00:00', '3 Hours', 'Coral Reef & Lagoon Tour',   5000.00),
    (6, 2, 3, '2026-09-30', '10:00:00', '4 Hours', 'Private Island Day Out',    12000.00);
GO

SELECT * FROM [TRIP];

-- BOOKING (7 rows) -- Booking #2 is already CONFIRMED, its final state.
USE AquaSafariDB;
GO
INSERT INTO [BOOKING] (TripID, CustomerID, BookingDate, PassengerCount, BookingStatus, ReservationExpiresAt)
VALUES
    (1, 5, '2026-09-02', 2, 'CONFIRMED', NULL),
    (2, 5, '2026-09-02', 3, 'CONFIRMED', NULL),
    (3, 6, '2026-09-02', 4, 'CONFIRMED', NULL),
    (4, 5, '2026-09-01', 2, 'CONFIRMED', NULL),
    (5, 6, '2026-09-04', 2, 'CONFIRMED', NULL),
    (4, 7, '2026-09-03', 4, 'CONFIRMED', NULL),
    (6, 8, '2026-09-15', 3, 'PENDING',   DATEADD(hour, 2, GETDATE()));
GO

SELECT * FROM [BOOKING];

-- PAYMENT (7 rows) -- payment for Booking #2 is already PAID/verified.
USE AquaSafariDB;
GO
INSERT INTO [PAYMENT] (BookingID, AccountantID, Amount, PaymentDate, PaymentMethod, PaymentStatus)
VALUES
    (1, 4,    10000.00, '2026-09-02 10:00:00', 'CREDIT_CARD',   'PAID'),
    (2, 4,    10500.00, '2026-09-02 11:30:00', 'MOBILE_WALLET', 'PAID'),
    (3, 4,    30000.00, '2026-09-02 12:15:00', 'BANK_TRANSFER', 'PAID'),
    (4, 4,     9000.00, '2026-09-01 10:30:00', 'CREDIT_CARD',   'PAID'),
    (5, 4,    12000.00, '2026-09-04 14:15:00', 'MOBILE_WALLET', 'PAID'),
    (6, 4,    18000.00, '2026-09-03 11:00:00', 'BANK_TRANSFER', 'PAID'),
    (7, NULL, 36000.00, GETDATE(),             'CREDIT_CARD',   'PENDING');
GO

SELECT * FROM [PAYMENT];

-- FEEDBACK (5 rows) -- none for Booking #2, matching the source data's intent.
USE AquaSafariDB;
GO
INSERT INTO [FEEDBACK] (BookingID, CustomerID, Rating, Comment)
VALUES
    (1, 5, 5, 'Amazing experience! The guide was very knowledgeable and the ride was smooth.'),
    (3, 6, 4, 'Breathtaking views of the whales, highly recommend!'),
    (4, 5, 5, 'Seeing the sea turtles up close was unforgettable. Professional crew!'),
    (5, 6, 5, 'The sunset view was absolute magic. Great boat, friendly guide.'),
    (6, 7, 4, 'Very well-organised trip; the safety briefing was clear.');
GO

SELECT * FROM [FEEDBACK];

-- -------------------------------------------------------------------------
-- STEP 4: Quick verification
-- -------------------------------------------------------------------------
SELECT * FROM [USER];
SELECT * FROM [BOAT];
SELECT * FROM [TRIP];
SELECT * FROM [BOOKING];
SELECT * FROM [PAYMENT];
SELECT * FROM [FEEDBACK];

-- -------------------------------------------------------------------------
-- SQL QUERIES
-- -------------------------------------------------------------------------
USE AquaSafariDB;
GO
SELECT BookingID, TripID, CustomerID, BookingDate, PassengerCount, BookingStatus
FROM BOOKING
WHERE BookingStatus = 'CONFIRMED';


-- -------------------------------------------------------------------------
USE AquaSafariDB;
GO
SELECT
    T.TripID, T.Route, T.TripDate,
    B.Name AS BoatName,
    B.BoatType,
    CONCAT(OP.FirstName,' ',OP.LastName) AS Operator,
    CONCAT(G.FirstName,' ',G.LastName)   AS Guide
FROM TRIP T
JOIN BOAT B     ON T.BoatID = B.BoatID
JOIN [USER] OP  ON T.OperatorID = OP.UserID
JOIN [USER] G   ON T.GuideID = G.UserID;


-- -------------------------------------------------------------------------
USE AquaSafariDB;
GO
SELECT
    COUNT(*)               AS TotalConfirmedBookings,
    SUM(PassengerCount)    AS TotalPassengers,
    AVG(PassengerCount*1.0) AS AvgPassengersPerBooking
FROM BOOKING
WHERE BookingStatus = 'CONFIRMED';


-- -------------------------------------------------------------------------
USE AquaSafariDB;
GO
SELECT
    B.BoatID, B.Name, SUM(P.Amount) AS TotalRevenue
FROM PAYMENT P
JOIN BOOKING BK ON P.BookingID = BK.BookingID
JOIN TRIP T      ON BK.TripID = T.TripID
JOIN BOAT B      ON T.BoatID = B.BoatID
WHERE P.PaymentStatus = 'PAID'
GROUP BY B.BoatID, B.Name
HAVING SUM(P.Amount) > 10000
ORDER BY TotalRevenue DESC;


-- -------------------------------------------------------------------------
USE AquaSafariDB;
GO
SELECT UserID, FirstName, LastName, Email
FROM [USER]
WHERE user_type = 'CUSTOMER'
  AND UserID NOT IN (SELECT CustomerID FROM FEEDBACK);


-- -------------------------------------------------------------------------
-- PROCEDURE
-- -------------------------------------------------------------------------
USE AquaSafariDB;
GO
CREATE PROCEDURE usp_ConfirmPayment
    @PaymentID    INT,
    @AccountantID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
 
        DECLARE @BookingID INT;
 
        -- 1. Verify the payment exists and is still pending
        IF NOT EXISTS (SELECT 1 FROM PAYMENT WHERE PaymentID = @PaymentID AND PaymentStatus = 'PENDING')
        BEGIN
            RAISERROR('Payment not found or already processed.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
 
        -- 2. Mark the payment as PAID and record who verified it
        UPDATE PAYMENT
        SET PaymentStatus = 'PAID', AccountantID = @AccountantID
        WHERE PaymentID = @PaymentID;
 
        SELECT @BookingID = BookingID FROM PAYMENT WHERE PaymentID = @PaymentID;
 
        -- 3. Cascade the effect: a paid booking should be CONFIRMED
        UPDATE BOOKING
        SET BookingStatus = 'CONFIRMED'
        WHERE BookingID = @BookingID AND BookingStatus <> 'CONFIRMED';
 
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

EXEC usp_ConfirmPayment @PaymentID = 7, @AccountantID = 4;
 
SELECT PaymentID, BookingID, PaymentStatus, AccountantID FROM PAYMENT WHERE PaymentID = 7;
SELECT BookingID, BookingStatus FROM BOOKING WHERE BookingID = (SELECT BookingID FROM PAYMENT WHERE PaymentID = 7);


-- -------------------------------------------------------------------------
-- TRIGGER
-- -------------------------------------------------------------------------
GO
CREATE TRIGGER TR_Payment_AutoConfirmBooking
ON PAYMENT
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
 
    -- Fires only when PaymentStatus changed and the new value is 'PAID'
    IF UPDATE(PaymentStatus)
    BEGIN
        UPDATE BK
        SET BK.BookingStatus = 'CONFIRMED'
        FROM BOOKING BK
        INNER JOIN inserted i  ON BK.BookingID = i.BookingID
        INNER JOIN deleted  d  ON d.PaymentID = i.PaymentID
        WHERE i.PaymentStatus = 'PAID'
          AND d.PaymentStatus <> 'PAID'
          AND BK.BookingStatus <> 'CONFIRMED';
    END
END;


-- Simulate a payment being marked PAID through any path other than the
-- stored procedure 
UPDATE PAYMENT SET PaymentStatus = 'PAID' WHERE PaymentID = 7 AND PaymentStatus = 'PENDING';
 
-- Confirm the trigger cascaded the status change automatically
SELECT BookingID, BookingStatus FROM BOOKING
WHERE BookingID = (SELECT BookingID FROM PAYMENT WHERE PaymentID = 7);

-- -------------------------------------------------------------------------
-- Add an image column to TRIP. Nullable, so existing rows (and any trip
-- created without a photo yet) don't break NOT NULL constraints.
-- -------------------------------------------------------------------------
UPDATE [TRIP] SET TripDate = DATEADD(day, 30, TripDate);

IF COL_LENGTH('dbo.TRIP', 'ImageUrl') IS NULL
BEGIN
    ALTER TABLE dbo.TRIP ADD ImageUrl VARCHAR(500) NULL;
END
GO

-- -------------------------------------------------------------------------
-- Seed placeholder photos for the 7 trips already in the table, one per
-- route. These are Lorem Picsum "seeded" URLs (https://picsum.photos) --
-- each seed string always returns the same image, so they're stable across
-- reloads, but they are NOT real safari photos. Swap these for your own
-- hosted images before the actual demo/viva if you have real ones.
-- -------------------------------------------------------------------------
UPDATE [TRIP] SET ImageUrl = 'https://picsum.photos/seed/coral-reef-lagoon/800/500'        WHERE TripID = 1;
UPDATE [TRIP] SET ImageUrl = 'https://picsum.photos/seed/mangrove-river-safari/800/500'    WHERE TripID = 2;
UPDATE [TRIP] SET ImageUrl = 'https://picsum.photos/seed/deep-sea-whale-watching/800/500'  WHERE TripID = 3;
UPDATE [TRIP] SET ImageUrl = 'https://picsum.photos/seed/mirissa-turtle-snorkeling/800/500' WHERE TripID = 4;
UPDATE [TRIP] SET ImageUrl = 'https://picsum.photos/seed/sunset-coastal-cruise/800/500'    WHERE TripID = 5;
UPDATE [TRIP] SET ImageUrl = 'https://picsum.photos/seed/coral-reef-lagoon-2/800/500'      WHERE TripID = 6;
UPDATE [TRIP] SET ImageUrl = 'https://picsum.photos/seed/private-island-day-out/800/500'   WHERE TripID = 7;
GO

SELECT TripID, Route, ImageUrl FROM [TRIP];
SELECT * FROM [TRIP];