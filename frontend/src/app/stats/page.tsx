'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { getAvailableRoomsPerArea, getHotelRoomCapacity } from '@/utils/api';
import { AvailableRoomsPerArea, HotelRoomCapacity } from '@/types';

export default function StatsPage() {
  const [availableRooms, setAvailableRooms] = useState<AvailableRoomsPerArea[]>([]);
  const [hotelCapacity, setHotelCapacity] = useState<HotelRoomCapacity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, capacityData] = await Promise.all([
          getAvailableRoomsPerArea(),
          getHotelRoomCapacity()
        ]);
        setAvailableRooms(roomsData);
        setHotelCapacity(capacityData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold pb-6 leading-tight tracking-tight text-gray-900">
              Hotel Statistics
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="space-y-8">
              {/* Available Rooms Per Area */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Available Rooms by Area</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRooms.map((item) => (
                    <div
                      key={item.area}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <h3 className="font-medium text-gray-900">{item.area}</h3>
                      <p className="text-3xl font-bold text-primary-600">
                        {item.available_rooms}
                      </p>
                      <p className="text-sm text-gray-500">Available Rooms</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotel Room Capacity */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Hotel Room Capacity</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hotel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chain
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Rooms
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Capacity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg Room Capacity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {hotelCapacity.map((hotel) => (
                        <tr key={hotel.hotel_address}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {hotel.hotel_address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {hotel.hotel_chain}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {hotel.total_rooms}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {hotel.total_capacity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {hotel.average_room_capacity.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
} 