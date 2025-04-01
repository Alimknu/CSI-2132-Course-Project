import axios from 'axios';
import { RoomSearch, Customer, Employee, Hotel, Room, Booking, Renting } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

// Room related endpoints
export const searchRooms = async (params: RoomSearch) => {
    const response = await api.post('/rooms/search', params);
    return response.data;
};

export const getRooms = async () => {
    const response = await api.get('/rooms');
    return response.data;
};

export const createRoom = async (roomData: Room) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
};

// Hotel Chain related endpoints
export const getHotelChains = async () => {
    const response = await api.get('/hotel-chains');
    return response.data;
};

// Hotel related endpoints
export const getHotels = async () => {
    const response = await api.get('/hotels');
    return response.data;
};

export const createHotel = async (hotelData: Hotel) => {
    const response = await api.post('/hotels', hotelData);
    return response.data;
};

// Customer related endpoints
export const createCustomer = async (customerData: Omit<Customer, 'dateofregistration'>) => {
    const response = await api.post('/customers', customerData);
    return response.data;
};

export const getCustomers = async () => {
    const response = await api.get('/customers');
    return response.data;
};

// Employee related endpoints
export const createEmployee = async (employeeData: Employee) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
};

export const getEmployees = async () => {
    const response = await api.get('/employees');
    return response.data;
};

// Booking related endpoints
export const createBooking = async (bookingData: Omit<Booking, 'bookingid'>) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

export const getBookings = async () => {
    const response = await api.get('/bookings');
    return response.data;
};

// Renting related endpoints
export const createRenting = async (rentingData: Omit<Renting, 'rentingid'>) => {
    const response = await api.post('/rentings', rentingData);
    return response.data;
};

export const getRentings = async () => {
    const response = await api.get('/rentings');
    return response.data;
};

// Convert booking to renting
export const convertBookingToRenting = async (bookingId: number, paymentInfo: string, employeeId: string) => {
    try {
        const response = await api.post(`/bookings/${bookingId}/convert-to-renting/`, {
            payment_info: paymentInfo,
            employee_ssn: employeeId
        });
        return response.data;
    } catch (error: any) {
        console.error('Error in convertBookingToRenting:', error.response?.data || error);
        throw error;
    }
};

// View related endpoints
export const getAvailableRoomsPerArea = async () => {
    const response = await api.get('/views/available-rooms-per-area');
    return response.data;
};

export const getHotelRoomCapacity = async () => {
    const response = await api.get('/views/hotel-room-capacity');
    return response.data;
};

// Update endpoints
export const updateCustomer = async (id: string, data: Partial<Customer>) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
};

export const updateEmployee = async (id: string, data: Partial<Employee>) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
};

export const updateHotel = async (address: string, data: Partial<Hotel>) => {
    const response = await api.put(`/hotels/${address}`, data);
    return response.data;
};

export const updateRoom = async (roomNumber: string, hotelAddress: string, data: Partial<Room>) => {
    const response = await api.put(`/rooms/${roomNumber}/${encodeURIComponent(hotelAddress)}`, data);
    return response.data;
};

// Delete endpoints
export const deleteCustomer = async (id: string) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
};

export const deleteEmployee = async (id: string) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
};

export const deleteHotel = async (address: string) => {
    const response = await api.delete(`/hotels/${address}`);
    return response.data;
};

export const deleteRoom = async (roomNumber: string, hotelAddress: string) => {
    const response = await api.delete(`/rooms/${roomNumber}/${encodeURIComponent(hotelAddress)}`);
    return response.data;
};

// Booking update and delete endpoints
export const updateBooking = async (id: number, data: Partial<Booking>) => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
};

export const deleteBooking = async (id: number) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
};

// Renting update and delete endpoints
export const updateRenting = async (id: number, data: Partial<Renting>) => {
    const response = await api.put(`/rentings/${id}`, data);
    return response.data;
};

export const deleteRenting = async (id: number) => {
    const response = await api.delete(`/rentings/${id}`);
    return response.data;
}; 