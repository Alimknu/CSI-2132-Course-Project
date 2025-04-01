export interface HotelChain {
    chainname: string;
    address: string;
    numberofhotels: number;
    contactemail: string;
    phonenumber: string;
}

export interface Hotel {
    address: string;
    contactemail: string;
    phonenumber: string;
    numberofrooms: number;
    rating: number;
    chainname: string;
    managerid: string;
}

export interface Room {
    roomnumber: number;
    hoteladdress: string;
    price: number;
    amenities: string;
    problems: string;
    capacity: number;
    viewtype: string;
    extendable: boolean;
}

export interface Employee {
    ssn: string;
    fullname: string;
    address: string;
    jobposition: string;
    hotelid: string;
}

export interface Customer {
    customerid: string;
    fullname: string;
    address: string;
}

export interface Booking {
    bookingid: number;
    customerid: string;
    roomnumber: number;
    startdate: string;
    enddate: string;
}

export interface Renting {
    rentingid: number;
    customerid: string;
    roomnumber: number;
    employeeid: string;
    bookingid: number;
    startdate: string;
    enddate: string;
    paymentinformation: string;
}

export interface RoomSearch {
    startDate: string;
    endDate: string;
    capacity?: number;
    hotelChain?: string;
    hotelAddress?: string;
    minPrice?: number;
    maxPrice?: number;
}

export interface AvailableRoomsPerArea {
    area: string;
    available_rooms: number;
}

export interface HotelRoomCapacity {
    hotel_address: string;
    hotel_chain: string;
    total_rooms: number;
    total_capacity: number;
    average_room_capacity: number;
} 