CREATE TABLE HotelChain (
    chainName VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(255),
    numberOfHotels INT CHECK (numberOfHotels >= 0),
    contactEmail VARCHAR(255),
    phoneNumber VARCHAR(20),
    PRIMARY KEY (chainName)
);

CREATE TABLE Hotel (
    address VARCHAR(255) UNIQUE NOT NULL,
    contactEmail VARCHAR(255),
    phoneNumber VARCHAR(20),
    numberOfRooms INT CHECK (numberOfRooms >= 0),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    chainName VARCHAR(255) NOT NULL,
	managerID TEXT UNIQUE,
    PRIMARY KEY (address),
    FOREIGN KEY (chainName) REFERENCES HotelChain (chainName) ON DELETE CASCADE
);

CREATE TABLE Room (
    roomID SERIAL,
    roomNumber INT CHECK (roomNumber >= 0),
    price float,
    amenities VARCHAR(255),
    problems VARCHAR(255),
    extendable BOOLEAN,
    viewType VARCHAR(255),
    capacity INT,
    hotelAddress VARCHAR(255) NOT NULL,
    PRIMARY KEY (roomID),
    FOREIGN KEY (hotelAddress) REFERENCES Hotel (address) ON DELETE CASCADE,
    UNIQUE (roomNumber, hotelAddress)
);

CREATE TABLE Employee (
	SSN TEXT NOT NULL UNIQUE CHECK (SSN ~ '^[0-9](9)$'),
	fullName VARCHAR(255),
	address VARCHAR(255),
	jobPosition VARCHAR(255),
	hotelID VARCHAR(255) NOT NULL,
	PRIMARY KEY (SSN)
);

CREATE TABLE Customer (
	customerID VARCHAR(255) UNIQUE NOT NULL,
	fullName VARCHAR(255) NOT NULL,
	address VARCHAR(255),
	dateOfRegistration TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (customerID)
);

CREATE TABLE Booking (
	bookingID SERIAL,
	startDate TIMESTAMPTZ,
	endDate TIMESTAMPTZ,
	roomID INT NOT NULL,
	customerID VARCHAR(255) NOT NULL,
	PRIMARY KEY (bookingID),
	FOREIGN KEY (roomID) REFERENCES Room (roomID) ON DELETE CASCADE,
	FOREIGN KEY (customerID) REFERENCES Customer (customerID) ON DELETE CASCADE
);

CREATE TABLE Renting (
	rentingID SERIAL,
	paymentInformation VARCHAR(255),
	startDate TIMESTAMPTZ,
	endDate TIMESTAMPTZ,
	employeeID TEXT NOT NULL,
	customerID VARCHAR(255) NOT NULL,
	roomID INT NOT NULL,
	bookingID INT,
	PRIMARY KEY (rentingID),
	FOREIGN KEY (employeeID) REFERENCES Employee (SSN) ON DELETE SET NULL,
	FOREIGN KEY (customerID) REFERENCES Customer (customerID) ON DELETE CASCADE,
	FOREIGN KEY (roomID) REFERENCES Room (roomID) ON DELETE CASCADE,
	FOREIGN KEY (bookingID) REFERENCES Booking (bookingID) ON DELETE SET NULL
);

ALTER TABLE Hotel 
ADD FOREIGN KEY (managerID) REFERENCES Employee (SSN) ON DELETE SET NULL;

ALTER TABLE Employee
ADD FOREIGN KEY (hotelID) REFERENCES Hotel (address) ON DELETE SET NULL;