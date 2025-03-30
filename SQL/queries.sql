
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

-- INDEXES
-- This index allows us to quickly check the duration for which a room is booked. This would allow us to quickly find out whether or not a room is available for a given date range.
-- It is expected to be used in queries checking room availability, which is a common operation in hotel management systems. Example: "Find rooms not booked between 2025-01-01 and 2025-01-10"
CREATE INDEX idx_booking_dates ON Booking (startDate, endDate);

-- This index allows us to search for rooms with a specific view within a specific price range. This is useful for queries where customers only want to see one type of view and have a specific budget.
-- Example: "Find rooms with a sea view under $250"
CREATE INDEX idx_room_view_price ON Room (view, price);

-- This index allows us to quickly find hotels by their ratings. This is useful for customers who want to look through hotels in a specific rating range.
-- Example: "Find hotels with a rating of 4 stars or higher"
CREATE INDEX idx_hotel_rating ON Hotel (rating);