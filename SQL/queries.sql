
-- Query 1: List all managers, their hotels, and contact information
SELECT Employee.fullName AS managerName, hotelID, contactEmail, phoneNumber
FROM Employee
JOIN Hotel on Employee.SSN = Hotel.managerID
WHERE Employee.jobPosition = 'Manager';

-- Query 2: Rooms that are currently not booked (Nested Query)
SELECT roomNumber, hotelAddress
FROM Room
WHERE roomNumber NOT IN (
    SELECT roomNumber
    FROM Booking
    WHERE Booking.roomNumber = Room.roomNumber
);

-- Query 3: Average room price per hotel chain (Aggregation Query)
SELECT HotelChain.chainName, AVG(price) AS averageRoomPrice
FROM HotelChain
JOIN Hotel ON HotelChain.chainName = Hotel.chainName
JOIN ROOM ON Hotel.address = Room.hotelAddress
GROUP BY HotelChain.chainName;

-- Query 4: Bookings made by customer with customerID TC001
SELECT *
FROM Booking
WHERE customerID = 'TC001';