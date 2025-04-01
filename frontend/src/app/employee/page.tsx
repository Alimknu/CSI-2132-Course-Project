'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { getBookings, getRentings, convertBookingToRenting } from '@/utils/api';
import { Booking, Renting } from '@/types';

export default function EmployeePortal() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rentings, setRentings] = useState<Renting[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [paymentInfo, setPaymentInfo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsData, rentingsData] = await Promise.all([
        getBookings(),
        getRentings()
      ]);
      setBookings(bookingsData);
      setRentings(rentingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCreditCard = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add a space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const isValidCreditCard = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 16;
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCreditCard(e.target.value);
    setPaymentInfo(formatted);
  };

  const handleConvertToRenting = async (bookingId: number) => {
    try {
      if (!isValidCreditCard(paymentInfo)) {
        alert('Please enter a valid 16-digit credit card number');
        return;
      }

      // Format payment info for database storage
      const lastFourDigits = paymentInfo.replace(/\D/g, '').slice(-4);
      const formattedPaymentInfo = `Credit Card ${lastFourDigits}`;

      // Use the employee's SSN as the ID
      const employeeId = '100000001'; // Employee SSN

      // Call the API with the correct request body format
      await convertBookingToRenting(
        bookingId,
        formattedPaymentInfo,
        employeeId
      );

      await fetchData(); // Refresh the data
      setSelectedBooking(null);
      setPaymentInfo('');
      alert('Successfully converted booking to renting!');
    } catch (error: any) {
      console.error('Error converting booking to renting:', error);
      if (error.response?.data?.detail) {
        alert(`Error: ${error.response.data.detail}`);
      } else {
        alert('Error converting booking to renting. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl pb-6 font-bold leading-tight tracking-tight text-gray-900">
              Employee Portal
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Bookings Section */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">Active Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-in
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.bookingid}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.bookingid}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.roomnumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.customerid}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.startdate ? new Date(booking.startdate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.enddate ? new Date(booking.enddate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => setSelectedBooking(booking.bookingid)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Convert to Renting
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Payment Modal */}
            {selectedBooking && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8 max-w-md w-full">
                  <h3 className="text-lg font-medium mb-4">Enter Credit Card Information</h3>
                  <input
                    type="text"
                    value={paymentInfo}
                    onChange={handlePaymentInfoChange}
                    placeholder="Enter 16-digit credit card number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                    maxLength={19}
                  />
                  <p className="text-sm text-gray-500 mb-4">
                    Format: XXXX XXXX XXXX XXXX
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        setSelectedBooking(null);
                        setPaymentInfo('');
                      }}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleConvertToRenting(selectedBooking)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                      disabled={!isValidCreditCard(paymentInfo)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rentings Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">Active Rentings</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Renting ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-out
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rentings.map((renting) => (
                        <tr key={renting.rentingid}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {renting.rentingid}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {renting.roomnumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {renting.customerid}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {renting.paymentinformation}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {renting.enddate ? new Date(renting.enddate).toLocaleDateString() : 'N/A'}
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