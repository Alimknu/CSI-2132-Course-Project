from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, CheckConstraint, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class HotelChain(Base):
    __tablename__ = 'hotelchain'
    
    chainname = Column(String(255), primary_key=True)
    address = Column(String(255))
    numberofhotels = Column(Integer)
    contactemail = Column(String(255))
    phonenumber = Column(String(20))
    
    hotels = relationship("Hotel", back_populates="chain")

class Hotel(Base):
    __tablename__ = 'hotel'
    
    address = Column(String(255), primary_key=True)
    contactemail = Column(String(255))
    phonenumber = Column(String(20))
    numberofrooms = Column(Integer)
    rating = Column(Integer)
    chainname = Column(String(255), ForeignKey('hotelchain.chainname', ondelete='CASCADE'))
    managerid = Column(Text, ForeignKey('employee.ssn', ondelete='SET NULL'), unique=True)
    
    chain = relationship("HotelChain", back_populates="hotels")
    rooms = relationship("Room", back_populates="hotel")
    employees = relationship("Employee", back_populates="hotel", foreign_keys="[Employee.hotelid]")
    manager = relationship("Employee", foreign_keys=[managerid])

class Room(Base):
    __tablename__ = 'room'
    
    roomnumber = Column(Integer, primary_key=True)
    price = Column(Float)
    amenities = Column(String(255))
    problems = Column(String(255))
    extendable = Column(Boolean)
    viewtype = Column(String(255))
    capacity = Column(Integer)
    hoteladdress = Column(String(255), ForeignKey('hotel.address', ondelete='CASCADE'))
    
    hotel = relationship("Hotel", back_populates="rooms")
    bookings = relationship("Booking", back_populates="room")
    rentings = relationship("Renting", back_populates="room")

class Employee(Base):
    __tablename__ = 'employee'
    
    ssn = Column(Text, primary_key=True)
    fullname = Column(String(255))
    address = Column(String(255))
    jobposition = Column(String(255))
    hotelid = Column(String(255), ForeignKey('hotel.address', ondelete='SET NULL'))
    
    hotel = relationship("Hotel", back_populates="employees", foreign_keys=[hotelid])
    rentings = relationship("Renting", back_populates="employee")

class Customer(Base):
    __tablename__ = 'customer'
    
    customerid = Column(String(255), primary_key=True)
    fullname = Column(String(255))
    address = Column(String(255))
    dateofregistration = Column(DateTime)
    
    bookings = relationship("Booking", back_populates="customer")
    rentings = relationship("Renting", back_populates="customer")

class Booking(Base):
    __tablename__ = 'booking'
    
    bookingid = Column(Integer, primary_key=True, autoincrement=True)
    startdate = Column(DateTime)
    enddate = Column(DateTime)
    roomnumber = Column(Integer, ForeignKey('room.roomnumber', ondelete='CASCADE'))
    customerid = Column(String(255), ForeignKey('customer.customerid', ondelete='CASCADE'))
    
    room = relationship("Room", back_populates="bookings")
    customer = relationship("Customer", back_populates="bookings")
    renting = relationship("Renting", back_populates="booking", uselist=False)

class Renting(Base):
    __tablename__ = 'renting'
    
    rentingid = Column(Integer, primary_key=True, autoincrement=True)
    paymentinformation = Column(String(255))
    startdate = Column(DateTime)
    enddate = Column(DateTime)
    employeeid = Column(Text, ForeignKey('employee.ssn', ondelete='SET NULL'))
    customerid = Column(String(255), ForeignKey('customer.customerid', ondelete='CASCADE'))
    roomnumber = Column(Integer, ForeignKey('room.roomnumber', ondelete='CASCADE'))
    bookingid = Column(Integer, ForeignKey('booking.bookingid', ondelete='SET NULL'))
    
    employee = relationship("Employee", back_populates="rentings")
    customer = relationship("Customer", back_populates="rentings")
    room = relationship("Room", back_populates="rentings")
    booking = relationship("Booking", back_populates="renting") 