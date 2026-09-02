USE AquaSafariDB;
GO

-- =========================================================================
-- STEP 1: Forcefully drop all existing foreign key constraints first
-- =========================================================================
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
GO

-- =========================================================================
-- STEP 2: Drop all legacy and old tables explicitly
-- =========================================================================
DROP TABLE IF EXISTS dbo.FEEDBACK;
DROP TABLE IF EXISTS dbo.PAYMENT;
DROP TABLE IF EXISTS dbo.payment;
DROP TABLE IF EXISTS dbo.BOOKING;
DROP TABLE IF EXISTS dbo.bookings;
DROP TABLE IF EXISTS dbo.booking;
DROP TABLE IF EXISTS dbo.TRIP;
DROP TABLE IF EXISTS dbo.trips;
DROP TABLE IF EXISTS dbo.BOAT;
DROP TABLE IF EXISTS dbo.boats;
DROP TABLE IF EXISTS dbo.SUPPORT_REQUEST;
DROP TABLE IF EXISTS dbo.NOTIFICATION;
DROP TABLE IF EXISTS dbo.[USER];
DROP TABLE IF EXISTS dbo.users;
GO

-- =========================================================================
-- STEP 3: Create the brand new EER-compliant schema tables
-- =========================================================================

-- 1. USER TABLE (Handling ISA Inheritance for Administrator, Customer, Boat Operator, Tour Guide, Accountant)
CREATE TABLE [USER] (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    PasswordHash VARCHAR(255) NOT NULL,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    user_type VARCHAR(30) NOT NULL, -- Discriminator: ADMINISTRATOR, CUSTOMER, BOAT_OPERATOR, TOUR_GUIDE, ACCOUNTANT
    RegistrationDate DATE NULL       -- Specific to CUSTOMER
);
GO

-- 2. NOTIFICATION TABLE
CREATE TABLE [NOTIFICATION] (
    NotificationID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    Message VARCHAR(500) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES [USER](UserID) ON DELETE CASCADE
);
GO

-- 3. SUPPORT REQUEST TABLE
CREATE TABLE [SUPPORT_REQUEST] (
    SupportRequestID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    AdminID INT NULL,
    Subject VARCHAR(150) NOT NULL,
    Message VARCHAR(1000) NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES [USER](UserID),
    FOREIGN KEY (AdminID) REFERENCES [USER](UserID)
);
GO

-- 4. BOAT TABLE
CREATE TABLE [BOAT] (
    BoatID INT IDENTITY(1,1) PRIMARY KEY,
    BoatType VARCHAR(50) NOT NULL,
    Capacity INT NOT NULL,
    Condition VARCHAR(50) NOT NULL
);
GO

-- 5. TRIP TABLE
CREATE TABLE [TRIP] (
    TripID INT IDENTITY(1,1) PRIMARY KEY,
    BoatID INT NOT NULL,
    OperatorID INT NOT NULL,         -- Boat Operator managing the trip
    GuideID INT NOT NULL,            -- Tour Guide guiding the trip
    TripDate DATE NOT NULL,
    DepartureTime TIME NOT NULL,
    Duration VARCHAR(50) NOT NULL,
    Route VARCHAR(150) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (BoatID) REFERENCES [BOAT](BoatID),
    FOREIGN KEY (OperatorID) REFERENCES [USER](UserID),
    FOREIGN KEY (GuideID) REFERENCES [USER](UserID)
);
GO

-- 6. BOOKING TABLE
CREATE TABLE [BOOKING] (
    BookingID INT IDENTITY(1,1) PRIMARY KEY,
    TripID INT NOT NULL,
    CustomerID INT NOT NULL,
    BookingDate DATE DEFAULT GETDATE(),
    PassengerCount INT NOT NULL,
    BookingStatus VARCHAR(30) NOT NULL,
    FOREIGN KEY (TripID) REFERENCES [TRIP](TripID),
    FOREIGN KEY (CustomerID) REFERENCES [USER](UserID)
);
GO

-- 7. PAYMENT TABLE
CREATE TABLE [PAYMENT] (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT NOT NULL,
    AccountantID INT NULL,          -- Accountant who verifies the payment
    Amount DECIMAL(10,2) NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    PaymentMethod VARCHAR(50) NOT NULL,
    PaymentStatus VARCHAR(30) NOT NULL,
    FOREIGN KEY (BookingID) REFERENCES [BOOKING](BookingID),
    FOREIGN KEY (AccountantID) REFERENCES [USER](UserID)
);
GO

-- 8. FEEDBACK TABLE
CREATE TABLE [FEEDBACK] (
    FeedbackID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT NOT NULL,
    CustomerID INT NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment VARCHAR(500),
    FOREIGN KEY (BookingID) REFERENCES [BOOKING](BookingID),
    FOREIGN KEY (CustomerID) REFERENCES [USER](UserID)
);
GO

------------------------------------------------------------------------------
------------------------------------------------------------------------------
------------------------------------------------------------------------------

USE AquaSafariDB;
GO

-- =========================================================================
-- 1. INSERT USERS (Administrators, Customers, Operators, Guides, Accountants)
-- =========================================================================
INSERT INTO [USER] (Email, Phone, PasswordHash, FirstName, LastName, user_type, RegistrationDate)
VALUES
    ('admin@aquasafari.lk',     '0771234567', '$2b$12$rE4ucR7chvTBDD2uia0PhOu3WAG5poW8W13ee5ZKsRB1WA5lS0hEe', 'Ama',     'Dissanayake', 'ADMINISTRATOR', NULL),
    ('operator@aquasafari.lk',  '0772234567', '$2b$12$rE4ucR7chvTBDD2uia0PhOu3WAG5poW8W13ee5ZKsRB1WA5lS0hEe', 'Nuwan',   'Fernando',    'BOAT_OPERATOR', NULL),
    ('guide@aquasafari.lk',     '0773234567', '$2b$12$rE4ucR7chvTBDD2uia0PhOu3WAG5poW8W13ee5ZKsRB1WA5lS0hEe', 'Sanduni', 'Perera',      'TOUR_GUIDE',    NULL),
    ('accountant@aquasafari.lk','0774234567', '$2b$12$rE4ucR7chvTBDD2uia0PhOu3WAG5poW8W13ee5ZKsRB1WA5lS0hEe', 'Ruwan',   'Jayasuriya',  'ACCOUNTANT',    NULL),
    ('customer1@gmail.com',     '0775234567', '$2b$12$rE4ucR7chvTBDD2uia0PhOu3WAG5poW8W13ee5ZKsRB1WA5lS0hEe', 'Kasun',   'Silva',       'CUSTOMER',      '2026-08-01'),
    ('customer2@gmail.com',     '0776234567', '$2b$12$rE4ucR7chvTBDD2uia0PhOu3WAG5poW8W13ee5ZKsRB1WA5lS0hEe', 'Nimali',  'Jayasinghe',  'CUSTOMER',      '2026-08-15');
GO

-- =========================================================================
-- 2. INSERT BOATS
-- =========================================================================
INSERT INTO [BOAT] (BoatType, Capacity, Condition)
VALUES
    ('Speedboat', 12, 'Excellent'),
    ('Catamaran', 8, 'Good'),
    ('Luxury Cruiser', 20, 'Excellent');
GO

-- =========================================================================
-- 3. INSERT TRIPS (Linked to Boats, Operators [UserID 2], and Guides [UserID 3])
-- =========================================================================
INSERT INTO [TRIP] (BoatID, OperatorID, GuideID, TripDate, DepartureTime, Duration, Route, Price)
VALUES
    (1, 2, 3, '2026-09-15', '08:30:00', '3 Hours', 'Coral Reef & Lagoon Tour', 5000.00),
    (2, 2, 3, '2026-09-20', '14:00:00', '2 Hours', 'Mangrove River Safari', 3500.00),
    (3, 2, 3, '2026-09-25', '07:00:00', '5 Hours', 'Deep Sea Whale Watching', 7500.00);
GO

-- =========================================================================
-- 4. INSERT BOOKINGS (Made by Customers [UserID 5 and 6] for Trips)
-- =========================================================================
INSERT INTO [BOOKING] (TripID, CustomerID, BookingDate, PassengerCount, BookingStatus)
VALUES
    (1, 5, '2026-09-02', 2, 'CONFIRMED'),
    (2, 5, '2026-09-02', 3, 'PENDING'),
    (3, 6, '2026-09-02', 4, 'CONFIRMED');
GO

-- =========================================================================
-- 5. INSERT PAYMENTS (Verified by Accountant [UserID 4], tied to Bookings)
-- =========================================================================
INSERT INTO [PAYMENT] (BookingID, AccountantID, Amount, PaymentDate, PaymentMethod, PaymentStatus)
VALUES
    (1, 4, 10000.00, GETDATE(), 'CREDIT_CARD', 'PAID'),
    (2, NULL, 10500.00, GETDATE(), 'MOBILE_WALLET', 'PENDING'),
    (3, 4, 30000.00, GETDATE(), 'BANK_TRANSFER', 'PAID');
GO

-- =========================================================================
-- 6. INSERT FEEDBACK (Left by Customers for Bookings)
-- =========================================================================
INSERT INTO [FEEDBACK] (BookingID, CustomerID, Rating, Comment)
VALUES
    (1, 5, 5, 'Amazing experience! The guide was very knowledgeable and the boat ride was super smooth.'),
    (3, 6, 4, 'Breathtaking views of the whales, highly recommend!');
GO

-- =========================================================================
-- 7. INSERT NOTIFICATIONS (Sent to Users)
-- =========================================================================
INSERT INTO [NOTIFICATION] (UserID, Message, CreatedAt)
VALUES
    (5, 'Your booking for the Coral Reef & Lagoon Tour has been confirmed!', GETDATE()),
    (6, 'Your payment for the Deep Sea Whale Watching trip has been verified.', GETDATE());
GO

-- =========================================================================
-- 8. INSERT SUPPORT REQUESTS (Raised by Customers, Managed by Admin [UserID 1])
-- =========================================================================
INSERT INTO [SUPPORT_REQUEST] (CustomerID, AdminID, Subject, Message)
VALUES
    (5, 1, 'Rescheduling Inquiry', 'Can I change my trip date from 15th Sept to 18th Sept?');
GO

SELECT * FROM [USER];
SELECT * FROM [BOAT];
SELECT * FROM [TRIP];
SELECT * FROM [BOOKING];
SELECT * FROM [PAYMENT];
SELECT * FROM [FEEDBACK];

USE AquaSafariDB;
GO

-- =========================================================================
-- STEP 1: Add the missing columns (nullable first, so the 3 existing rows
-- from your INSERT script don't get rejected for violating NOT NULL)
-- =========================================================================
ALTER TABLE BOAT ADD
    BoatCode         VARCHAR(50)   NULL,
    Name             VARCHAR(100)  NULL,
    EngineType       VARCHAR(50)   NULL,
    Status           VARCHAR(20)   NOT NULL CONSTRAINT DF_BOAT_Status DEFAULT 'AVAILABLE',
    BoatOperatorId   INT           NULL,
    CreatedAt        DATETIME2     NOT NULL CONSTRAINT DF_BOAT_CreatedAt DEFAULT GETDATE(),
    UpdatedAt        DATETIME2     NOT NULL CONSTRAINT DF_BOAT_UpdatedAt DEFAULT GETDATE();
GO

-- =========================================================================
-- STEP 2: Backfill BoatCode / Name for the 3 boats already in the table
-- (edit these values to real registration codes / names if you have them —
-- these are just placeholders so NOT NULL can be safely enforced next)
-- =========================================================================
USE AquaSafariDB;
GO
UPDATE BOAT
SET BoatCode = 'BT-' + RIGHT('000' + CAST(BoatID AS VARCHAR), 3),
    Name     = BoatType + ' Boat ' + CAST(BoatID AS VARCHAR)
WHERE BoatCode IS NULL;
GO

-- =========================================================================
-- STEP 3: Now that every row has a value, lock BoatCode/Name down the way
-- the entity expects (NOT NULL + BoatCode unique for the duplicate-ID check)
-- =========================================================================

ALTER TABLE BOAT ALTER COLUMN BoatCode VARCHAR(50) NOT NULL;
ALTER TABLE BOAT ALTER COLUMN Name VARCHAR(100) NOT NULL;

ALTER TABLE BOAT ADD CONSTRAINT UQ_BOAT_BoatCode UNIQUE (BoatCode);
GO

-- =========================================================================
-- STEP 4: FK from BoatOperatorId -> USER, matching the entity's comment
-- that it references the assigned Boat Operator's UserID
-- =========================================================================

ALTER TABLE BOAT ADD CONSTRAINT FK_BOAT_BoatOperatorId
    FOREIGN KEY (BoatOperatorId) REFERENCES [USER](UserID);
GO

-- =========================================================================
-- STEP 5: Normalize existing Condition values to match the BoatCondition
-- enum's exact spelling (@Enumerated(EnumType.STRING) is case-sensitive and
-- has no "Excellent" value — reading 'Excellent'/'Good' as-is would throw
-- "No enum constant BoatCondition.Excellent" the moment GET /api/boats runs)
-- =========================================================================
USE AquaSafariDB;
GO
UPDATE BOAT SET Condition = 'GOOD' WHERE Condition IN ('Excellent', 'Good');
GO

--------------------------------------------------------------------------
--------------------------------------------------------------------------

USE AquaSafariDB;
GO

-- Add ReservationExpiresAt column to the BOOKING table if it doesn't exist
IF COL_LENGTH('dbo.BOOKING', 'ReservationExpiresAt') IS NULL
BEGIN
    ALTER TABLE dbo.BOOKING ADD ReservationExpiresAt DATETIME2 NULL;
END
GO

-------------------------------------------------------------------------
-------------------------------------------------------------------------
USE AquaSafariDB;
GO

-- Add missing columns to the [USER] table if they don't exist
IF COL_LENGTH('dbo.[USER]', 'CreatedAt') IS NULL
BEGIN
    ALTER TABLE dbo.[USER] ADD CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_USER_CreatedAt DEFAULT GETDATE();
END
GO

IF COL_LENGTH('dbo.[USER]', 'IsActive') IS NULL
BEGIN
    ALTER TABLE dbo.[USER] ADD IsActive BIT NOT NULL CONSTRAINT DF_USER_IsActive DEFAULT 1;
END
GO

-- Update user_type discriminator value if any exist as 'ADMIN' to 'ADMINISTRATOR'
UPDATE dbo.[USER] 
SET user_type = 'ADMINISTRATOR' 
WHERE user_type = 'ADMIN';
GO

UPDATE [USER]
SET PasswordHash = 'password'
WHERE Email = 'admin@aquasafari.lk';

UPDATE [USER]
SET PasswordHash = '123'
WHERE Email = 'customer1@gmail.com';

UPDATE [USER]
SET PasswordHash = '123'
WHERE Email = 'operator@aquasafari.lk';

UPDATE [USER]
SET PasswordHash = '123'
WHERE Email = 'guide@aquasafari.lk';

SELECT * FROM [USER];

--- =============================================
USE AquaSafariDB;
GO
ALTER TABLE BOAT ADD image_url VARCHAR(500);
SELECT * FROM [BOAT];
--- =============================================

USE AquaSafariDB;
GO
ALTER TABLE BOAT DROP COLUMN image_url;
GO
SELECT * FROM [BOAT];

--- =============================================