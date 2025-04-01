from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
import re

# Base schemas
class HotelChainBase(BaseModel):
    chainname: str
    address: str
    numberofhotels: int
    contactemail: str
    phonenumber: str

class HotelBase(BaseModel):
    address: str
    contactemail: str
    phonenumber: str
    numberofrooms: int
    rating: int
    chainname: str
    managerid: Optional[str] = None

class RoomBase(BaseModel):
    roomnumber: int
    price: float
    amenities: str
    problems: Optional[str] = None
    extendable: bool
    viewtype: str
    capacity: int
    hoteladdress: str

class EmployeeBase(BaseModel):
    ssn: str = Field(..., pattern=r'^\d{9}$', description="SSN must be exactly 9 digits")
    fullname: str
    address: str
    jobposition: str
    hotelid: str

class CustomerBase(BaseModel):
    customerid: str
    fullname: str
    address: str
    dateofregistration: Optional[datetime] = None

class BookingBase(BaseModel):
    startdate: datetime
    enddate: datetime
    roomnumber: int
    customerid: str

class RentingBase(BaseModel):
    paymentinformation: str
    startdate: datetime
    enddate: datetime
    employeeid: str
    customerid: str
    roomnumber: int
    bookingid: Optional[int] = None

# Create schemas
class HotelChainCreate(HotelChainBase):
    pass

class HotelCreate(HotelBase):
    pass

class RoomCreate(RoomBase):
    pass

class EmployeeCreate(EmployeeBase):
    pass

class CustomerCreate(CustomerBase):
    pass

class BookingCreate(BookingBase):
    pass

class RentingCreate(RentingBase):
    pass

# Response schemas
class HotelChain(HotelChainBase):
    class Config:
        from_attributes = True

class Hotel(HotelBase):
    class Config:
        from_attributes = True

class Room(RoomBase):
    class Config:
        from_attributes = True

class Employee(EmployeeBase):
    class Config:
        from_attributes = True

class Customer(CustomerBase):
    class Config:
        from_attributes = True

class Booking(BookingBase):
    bookingid: int
    class Config:
        from_attributes = True

class Renting(RentingBase):
    rentingid: int
    class Config:
        from_attributes = True

# Search schemas
class RoomSearch(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    capacity: Optional[int] = None
    area: Optional[str] = None
    hotel_chain: Optional[str] = None
    hotel_rating: Optional[int] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    view_type: Optional[str] = None

# View schemas
class AvailableRoomsPerArea(BaseModel):
    area: str
    available_rooms: int

class HotelRoomCapacity(BaseModel):
    hotel_address: str
    hotel_chain: str
    total_rooms: int
    total_capacity: int
    average_room_capacity: float

# Customer schemas
class CustomerUpdate(BaseModel):
    fullname: Optional[str] = None
    address: Optional[str] = None

class Customer(CustomerBase):
    class Config:
        orm_mode = True

# Employee schemas
class EmployeeUpdate(BaseModel):
    ssn: Optional[str] = Field(None, pattern=r'^\d{9}$', description="SSN must be exactly 9 digits")
    fullname: Optional[str] = None
    address: Optional[str] = None
    jobposition: Optional[str] = None
    hotelid: Optional[str] = None

class Employee(EmployeeBase):
    ssn: str

    class Config:
        orm_mode = True

# Hotel schemas
class HotelUpdate(BaseModel):
    contactemail: Optional[str] = None
    phonenumber: Optional[str] = None
    numberofrooms: Optional[int] = None
    rating: Optional[int] = None
    chainname: Optional[str] = None
    managerid: Optional[str] = None

class Hotel(HotelBase):
    class Config:
        orm_mode = True

# Room schemas
class RoomUpdate(BaseModel):
    price: Optional[float] = None
    amenities: Optional[str] = None
    problems: Optional[str] = None
    capacity: Optional[int] = None
    viewtype: Optional[str] = None
    extendable: Optional[bool] = None

class Room(RoomBase):
    roomnumber: int
    hoteladdress: str

    class Config:
        orm_mode = True

# Booking schemas
class BookingUpdate(BaseModel):
    customerid: Optional[str] = None
    roomnumber: Optional[int] = None
    startdate: Optional[datetime] = None
    enddate: Optional[datetime] = None

class Booking(BookingBase):
    bookingid: int

    class Config:
        orm_mode = True

# Renting schemas
class RentingUpdate(BaseModel):
    customerid: Optional[str] = None
    roomnumber: Optional[int] = None
    employeeid: Optional[str] = None
    bookingid: Optional[int] = None
    startdate: Optional[datetime] = None
    enddate: Optional[datetime] = None
    paymentinformation: Optional[str] = None

class Renting(RentingBase):
    rentingid: int

    class Config:
        orm_mode = True 