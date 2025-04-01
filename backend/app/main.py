from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, not_, func, text
from typing import List, Optional
from datetime import datetime
from . import models, schemas, database
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Room search endpoint with multiple criteria
@app.post("/rooms/search/", response_model=List[schemas.Room])
def search_rooms(
    search_params: schemas.RoomSearch,
    db: Session = Depends(get_db)
):
    query = db.query(models.Room).join(models.Hotel)
    
    if search_params.start_date and search_params.end_date:
        # Exclude rooms that are already booked for the given dates
        booked_rooms = db.query(models.Room.roomnumber).join(models.Booking).filter(
            or_(
                and_(
                    models.Booking.startdate <= search_params.end_date,
                    models.Booking.enddate >= search_params.start_date
                )
            )
        )
        query = query.filter(not_(models.Room.roomnumber.in_(booked_rooms)))
    
    if search_params.capacity:
        query = query.filter(models.Room.capacity >= search_params.capacity)
    
    if search_params.area:
        query = query.filter(models.Hotel.address.ilike(f"%{search_params.area}%"))
    
    if search_params.hotel_chain:
        query = query.filter(models.Hotel.chainname == search_params.hotel_chain)
    
    if search_params.hotel_rating:
        query = query.filter(models.Hotel.rating == search_params.hotel_rating)
    
    if search_params.min_price is not None:
        query = query.filter(models.Room.price >= search_params.min_price)
    
    if search_params.max_price is not None:
        query = query.filter(models.Room.price <= search_params.max_price)
    
    if search_params.view_type:
        query = query.filter(models.Room.viewtype == search_params.view_type)
    
    return query.all()

# View endpoints
@app.get("/views/available-rooms-per-area/", response_model=List[schemas.AvailableRoomsPerArea])
def get_available_rooms_per_area(db: Session = Depends(get_db)):
    sql = text("""
        SELECT 
            SUBSTRING(Hotel.address FROM '^([^,]+)') AS area,
            COUNT(Room.roomNumber) AS available_rooms
        FROM Hotel
        JOIN Room ON Hotel.address = Room.hotelAddress
        WHERE Room.roomNumber NOT IN (
            SELECT roomNumber 
            FROM Booking 
            WHERE CURRENT_DATE BETWEEN startDate AND endDate
        )
        GROUP BY SUBSTRING(Hotel.address FROM '^([^,]+)')
    """)
    result = db.execute(sql)
    return [{"area": row[0], "available_rooms": row[1]} for row in result]

@app.get("/views/hotel-room-capacity/", response_model=List[schemas.HotelRoomCapacity])
def get_hotel_room_capacity(db: Session = Depends(get_db)):
    sql = text("""
        SELECT 
            Hotel.address AS hotel_address,
            Hotel.chainName AS hotel_chain,
            COUNT(Room.roomNumber) AS total_rooms,
            SUM(Room.capacity) AS total_capacity,
            AVG(Room.capacity)::numeric(10,2) AS average_room_capacity
        FROM Hotel
        JOIN Room ON Hotel.address = Room.hotelAddress
        GROUP BY Hotel.address, Hotel.chainName
    """)
    result = db.execute(sql)
    return [{"hotel_address": row[0], 
             "hotel_chain": row[1],
             "total_rooms": row[2],
             "total_capacity": row[3],
             "average_room_capacity": float(row[4])} for row in result]

# CRUD operations for each entity
# HotelChain
@app.post("/hotel-chains/", response_model=schemas.HotelChain)
def create_hotel_chain(hotel_chain: schemas.HotelChainCreate, db: Session = Depends(get_db)):
    db_hotel_chain = models.HotelChain(**hotel_chain.dict())
    db.add(db_hotel_chain)
    db.commit()
    db.refresh(db_hotel_chain)
    return db_hotel_chain

@app.get("/hotel-chains/", response_model=List[schemas.HotelChain])
def read_hotel_chains(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.HotelChain).offset(skip).limit(limit).all()

# Hotel
@app.post("/hotels/", response_model=schemas.Hotel)
def create_hotel(hotel: schemas.HotelCreate, db: Session = Depends(get_db)):
    db_hotel = models.Hotel(**hotel.dict())
    db.add(db_hotel)
    db.commit()
    db.refresh(db_hotel)
    return db_hotel

@app.get("/hotels/", response_model=List[schemas.Hotel])
def read_hotels(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Hotel).offset(skip).limit(limit).all()

# Room
@app.post("/rooms/", response_model=schemas.Room)
def create_room(room: schemas.RoomCreate, db: Session = Depends(get_db)):
    db_room = models.Room(**room.dict())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

@app.get("/rooms/", response_model=List[schemas.Room])
def read_rooms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Room).offset(skip).limit(limit).all()

# Employee
@app.post("/employees/", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    # Verify hotel exists before creating employee
    hotel = db.query(models.Hotel).filter(models.Hotel.address == employee.hotelid).first()
    if not hotel:
        raise HTTPException(status_code=400, detail="Hotel not found")
    
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.get("/employees/", response_model=List[schemas.Employee])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Employee).offset(skip).limit(limit).all()

@app.put("/employees/{ssn}", response_model=schemas.Employee)
def update_employee(ssn: str, employee: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.ssn == ssn).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # If hotelid is being updated, verify it exists
    if employee.hotelid:
        hotel = db.query(models.Hotel).filter(models.Hotel.address == employee.hotelid).first()
        if not hotel:
            raise HTTPException(status_code=400, detail="Hotel not found")
    
    # Update fields excluding SSN
    update_data = employee.dict(exclude_unset=True)
    if 'ssn' in update_data:
        del update_data['ssn']  # Don't allow SSN updates
    
    for key, value in update_data.items():
        setattr(db_employee, key, value)
    
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.delete("/employees/{ssn}")
def delete_employee(ssn: str, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.ssn == ssn).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(db_employee)
    db.commit()
    return {"message": "Employee deleted successfully"}

# Customer
@app.post("/customers/", response_model=schemas.Customer)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@app.get("/customers/", response_model=List[schemas.Customer])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Customer).offset(skip).limit(limit).all()

# Booking
@app.post("/bookings/", response_model=schemas.Booking)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    # Check if room is available for the given dates
    existing_booking = db.query(models.Booking).filter(
        models.Booking.roomnumber == booking.roomnumber,
        or_(
            and_(
                models.Booking.startdate <= booking.enddate,
                models.Booking.enddate >= booking.startdate
            )
        )
    ).first()
    
    if existing_booking:
        raise HTTPException(status_code=400, detail="Room is already booked for these dates")
    
    db_booking = models.Booking(**booking.dict())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.get("/bookings/", response_model=List[schemas.Booking])
def read_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Booking).offset(skip).limit(limit).all()

# Renting
@app.post("/rentings/", response_model=schemas.Renting)
def create_renting(renting: schemas.RentingCreate, db: Session = Depends(get_db)):
    db_renting = models.Renting(**renting.dict())
    db.add(db_renting)
    db.commit()
    db.refresh(db_renting)
    return db_renting

@app.get("/rentings/", response_model=List[schemas.Renting])
def read_rentings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Renting).offset(skip).limit(limit).all()

# Create a schema for the convert-to-renting request
class ConvertToRentingRequest(BaseModel):
    payment_info: str
    employee_ssn: str

# Convert booking to renting
@app.post("/bookings/{booking_id}/convert-to-renting/", response_model=schemas.Renting)
def convert_booking_to_renting(
    booking_id: int,
    convert_data: ConvertToRentingRequest,
    db: Session = Depends(get_db)
):
    booking = db.query(models.Booking).filter(models.Booking.bookingid == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify that the employee exists
    employee = db.query(models.Employee).filter(models.Employee.ssn == convert_data.employee_ssn).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    try:
        renting = models.Renting(
            paymentinformation=convert_data.payment_info,
            startdate=booking.startdate,
            enddate=booking.enddate,
            employeeid=convert_data.employee_ssn,
            customerid=booking.customerid,
            roomnumber=booking.roomnumber,
            bookingid=booking_id
        )
        
        db.add(renting)
        db.commit()
        db.refresh(renting)
        return renting
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Update endpoints
@app.put("/customers/{customer_id}", response_model=schemas.Customer)
def update_customer(customer_id: str, customer: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    db_customer = db.query(models.Customer).filter(models.Customer.customerid == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    for key, value in customer.dict(exclude_unset=True).items():
        setattr(db_customer, key, value)
    
    db.commit()
    db.refresh(db_customer)
    return db_customer

@app.put("/hotels/{hotel_address}", response_model=schemas.Hotel)
def update_hotel(hotel_address: str, hotel: schemas.HotelUpdate, db: Session = Depends(get_db)):
    db_hotel = db.query(models.Hotel).filter(models.Hotel.address == hotel_address).first()
    if not db_hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    for key, value in hotel.dict(exclude_unset=True).items():
        setattr(db_hotel, key, value)
    
    db.commit()
    db.refresh(db_hotel)
    return db_hotel

@app.put("/rooms/{room_number}/{hotel_address}", response_model=schemas.Room)
def update_room(room_number: int, hotel_address: str, room: schemas.RoomUpdate, db: Session = Depends(get_db)):
    db_room = db.query(models.Room).filter(
        models.Room.roomnumber == room_number,
        models.Room.hoteladdress == hotel_address
    ).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    for key, value in room.dict(exclude_unset=True).items():
        setattr(db_room, key, value)
    
    db.commit()
    db.refresh(db_room)
    return db_room

@app.put("/bookings/{booking_id}", response_model=schemas.Booking)
def update_booking(booking_id: int, booking: schemas.BookingUpdate, db: Session = Depends(get_db)):
    db_booking = db.query(models.Booking).filter(models.Booking.bookingid == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    for key, value in booking.dict(exclude_unset=True).items():
        setattr(db_booking, key, value)
    
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.put("/rentings/{renting_id}", response_model=schemas.Renting)
def update_renting(renting_id: int, renting: schemas.RentingUpdate, db: Session = Depends(get_db)):
    db_renting = db.query(models.Renting).filter(models.Renting.rentingid == renting_id).first()
    if not db_renting:
        raise HTTPException(status_code=404, detail="Renting not found")
    
    for key, value in renting.dict(exclude_unset=True).items():
        setattr(db_renting, key, value)
    
    db.commit()
    db.refresh(db_renting)
    return db_renting

# Delete endpoints
@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: str, db: Session = Depends(get_db)):
    db_customer = db.query(models.Customer).filter(models.Customer.customerid == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db.delete(db_customer)
    db.commit()
    return {"message": "Customer deleted successfully"}

@app.delete("/hotels/{hotel_address}")
def delete_hotel(hotel_address: str, db: Session = Depends(get_db)):
    db_hotel = db.query(models.Hotel).filter(models.Hotel.address == hotel_address).first()
    if not db_hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    db.delete(db_hotel)
    db.commit()
    return {"message": "Hotel deleted successfully"}

@app.delete("/rooms/{room_number}/{hotel_address}")
def delete_room(room_number: int, hotel_address: str, db: Session = Depends(get_db)):
    db_room = db.query(models.Room).filter(
        models.Room.roomnumber == room_number,
        models.Room.hoteladdress == hotel_address
    ).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    db.delete(db_room)
    db.commit()
    return {"message": "Room deleted successfully"}

@app.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    db_booking = db.query(models.Booking).filter(models.Booking.bookingid == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    db.delete(db_booking)
    db.commit()
    return {"message": "Booking deleted successfully"}

@app.delete("/rentings/{renting_id}")
def delete_renting(renting_id: int, db: Session = Depends(get_db)):
    db_renting = db.query(models.Renting).filter(models.Renting.rentingid == renting_id).first()
    if not db_renting:
        raise HTTPException(status_code=404, detail="Renting not found")
    
    db.delete(db_renting)
    db.commit()
    return {"message": "Renting deleted successfully"} 