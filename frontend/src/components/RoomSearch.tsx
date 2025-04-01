import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { RoomSearch as RoomSearchType, HotelChain, Room } from '@/types';
import { searchRooms, getHotelChains, createBooking } from '@/utils/api';

export default function RoomSearch() {
  const [searchParams, setSearchParams] = useState<RoomSearchType>({});
  const [hotelChains, setHotelChains] = useState<HotelChain[]>([]);
  const [results, setResults] = useState<Room[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchHotelChains = async () => {
      try {
        const chains = await getHotelChains();
        setHotelChains(chains);
      } catch (error) {
        console.error('Error fetching hotel chains:', error);
      }
    };
    fetchHotelChains();
  }, []);

  const handleSearch = async () => {
    try {
      const params: RoomSearchType = {
        ...searchParams,
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString(),
      };
      const rooms = await searchRooms(params);
      setResults(rooms);
    } catch (error) {
      console.error('Error searching rooms:', error);
    }
  };

  const handleBooking = async (room: Room) => {
    if (!startDate || !endDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    try {
      // In a real app, you would get the customer ID from authentication
      const customerID = 'TC001'; // Example customer ID
      await createBooking({
        startdate: startDate.toISOString(),
        enddate: endDate.toISOString(),
        roomnumber: room.roomnumber,
        customerid: customerID
      });
      alert('Booking created successfully!');
      // Refresh the search results
      handleSearch();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Search Available Rooms</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              placeholderText="Select check-in date"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              placeholderText="Select check-out date"
            />
          </div>

          {/* Room Capacity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Room Capacity</label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              onChange={(e) => setSearchParams({...searchParams, capacity: parseInt(e.target.value)})}
            />
          </div>

          {/* Area */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Area</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              onChange={(e) => setSearchParams({...searchParams, area: e.target.value})}
              placeholder="Enter city or area"
            />
          </div>

          {/* Hotel Chain */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hotel Chain</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              onChange={(e) => setSearchParams({...searchParams, hotel_chain: e.target.value})}
            >
              <option value="">Select a hotel chain</option>
              {hotelChains.map((chain) => (
                <option key={chain.chainname} value={chain.chainname} className="text-gray-900">
                  {chain.chainname}
                </option>
              ))}
            </select>
          </div>

          {/* Hotel Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hotel Rating</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              onChange={(e) => setSearchParams({...searchParams, hotel_rating: parseInt(e.target.value)})}
            >
              <option value="">Any rating</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating} className="text-gray-900">{rating} Stars</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Minimum Price</label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              onChange={(e) => setSearchParams({...searchParams, min_price: parseFloat(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Maximum Price</label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              onChange={(e) => setSearchParams({...searchParams, max_price: parseFloat(e.target.value)})}
            />
          </div>

          {/* View Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">View Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              onChange={(e) => setSearchParams({...searchParams, view_type: e.target.value})}
            >
              <option value="">Any view</option>
              <option value="sea view" className="text-gray-900">Sea View</option>
              <option value="mountain view" className="text-gray-900">Mountain View</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6">
          <button
            onClick={handleSearch}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
          >
            Search Rooms
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Search Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((room) => (
                <div key={`${room.roomnumber}-${room.hoteladdress}`} className="border rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold">Room {room.roomnumber}</h4>
                  <p className="text-gray-600">{room.hoteladdress}</p>
                  <p className="text-gray-600">Capacity: {room.capacity} persons</p>
                  <p className="text-gray-600">View: {room.viewtype}</p>
                  <p className="text-gray-600">Extendable: {room.extendable ? 'Yes' : 'No'}</p>
                  <p className="font-semibold text-primary-600">${room.price}/night</p>
                  <p className="text-sm text-gray-500">Amenities: {room.amenities}</p>
                  {room.problems && room.problems !== 'None' && (
                    <p className="text-sm text-red-500">Issues: {room.problems}</p>
                  )}
                  <button
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    onClick={() => handleBooking(room)}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 