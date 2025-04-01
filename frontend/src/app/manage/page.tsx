'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  getBookings,
  getRentings,
  getCustomers,
  getEmployees,
  getHotels,
  getRooms,
  updateCustomer,
  updateEmployee,
  updateHotel,
  updateRoom,
  updateBooking,
  updateRenting,
  deleteCustomer,
  deleteEmployee,
  deleteHotel,
  deleteRoom,
  deleteBooking,
  deleteRenting,
  createCustomer,
  createEmployee,
  createHotel,
  createRoom,
  createBooking,
  createRenting
} from '@/utils/api';
import { Booking, Renting, Customer, Employee, Hotel, Room } from '@/types';

type EntityType = 'customers' | 'employees' | 'hotels' | 'rooms' | 'bookings' | 'rentings';

export default function ManagePage() {
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('customers');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<any>({});
  const [hotels, setHotels] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    if (selectedEntity === 'employees') {
      fetchHotels();
    }
  }, [selectedEntity]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let fetchedData;
      switch (selectedEntity) {
        case 'customers':
          fetchedData = await getCustomers();
          break;
        case 'employees':
          fetchedData = await getEmployees();
          break;
        case 'hotels':
          fetchedData = await getHotels();
          break;
        case 'rooms':
          fetchedData = await getRooms();
          break;
        case 'bookings':
          fetchedData = await getBookings();
          break;
        case 'rentings':
          fetchedData = await getRentings();
          break;
      }
      
      // Debug logging
      console.log('Raw fetched data:', fetchedData);
      
      // Ensure fetchedData is an array and filter out any null/undefined entries
      const filteredData = Array.isArray(fetchedData) 
        ? fetchedData.filter(item => item !== null && item !== undefined)
        : [];
      
      // Sort the data based on the ID field to maintain order
      const sortedData = filteredData.sort((a, b) => {
        const idField = getIdField();
        if (typeof a[idField] === 'string') {
          return a[idField].localeCompare(b[idField]);
        }
        return a[idField] - b[idField];
      });
      
      console.log('Sorted data:', sortedData);
      setData(sortedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const fetchedHotels = await getHotels();
      setHotels(fetchedHotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const getColumns = () => {
    switch (selectedEntity) {
      case 'customers':
        return ['customerid', 'fullname', 'address'];
      case 'employees':
        return ['ssn', 'fullname', 'address', 'jobposition', 'hotelid'];
      case 'hotels':
        return ['address', 'contactemail', 'phonenumber', 'numberofrooms', 'rating', 'chainname', 'managerid'];
      case 'rooms':
        return ['roomnumber', 'hoteladdress', 'price', 'amenities', 'problems', 'capacity', 'viewtype', 'extendable'];
      case 'bookings':
        return ['bookingid', 'customerid', 'roomnumber', 'startdate', 'enddate'];
      case 'rentings':
        return ['rentingid', 'customerid', 'roomnumber', 'employeeid', 'bookingid', 'startdate', 'enddate', 'paymentinformation'];
      default:
        return [];
    }
  };

  const getItemKey = (item: any, index: number) => {
    if (!item) return `empty-${index}`;
    
    try {
      // Create a unique key based on the entity type and index
      const entityPrefix = selectedEntity.slice(0, -1); // Remove 's' from the end
      const idField = getIdField();
      const idValue = item[idField];
      
      return `${entityPrefix}-${idValue}-${index}`;
    } catch (error) {
      console.error('Error generating key for item:', item, error);
      return `temp-${index}-${Math.random()}`; // Fallback unique key
    }
  };

  // Helper function to get the ID field name for each entity type
  const getIdField = () => {
    switch (selectedEntity) {
      case 'customers':
        return 'customerid';
      case 'employees':
        return 'ssn';
      case 'hotels':
        return 'address';
      case 'rooms':
        return 'roomnumber';
      case 'bookings':
        return 'bookingid';
      case 'rentings':
        return 'rentingid';
      default:
        return 'id';
    }
  };

  const handleEdit = (item: any, index: number) => {
    const key = getItemKey(item, index);
    if (key) {
      setEditingId(key);
      setEditForm({...item}); // Create a copy of the item
    }
  };

  const handleDelete = async (item: any, index: number) => {
    const key = getItemKey(item, index);
    if (!key || !confirm('Are you sure you want to delete this item?')) return;
    
    try {
      switch (selectedEntity) {
        case 'customers':
          await deleteCustomer(item.customerid);
          break;
        case 'employees':
          await deleteEmployee(item.ssn);
          break;
        case 'hotels':
          await deleteHotel(item.address);
          break;
        case 'rooms':
          if (item.roomnumber && item.hoteladdress) {
            await deleteRoom(item.roomnumber.toString(), item.hoteladdress);
          }
          break;
        case 'bookings':
          if (item.bookingid) {
            await deleteBooking(item.bookingid);
          }
          break;
        case 'rentings':
          if (item.rentingid) {
            await deleteRenting(item.rentingid);
          }
          break;
        default:
          console.error('Delete not implemented for this entity type');
          return;
      }
      await fetchData();
    } catch (error: any) {
      console.error('Error deleting item:', error);
      alert(`Error deleting item: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleSave = async () => {
    try {
      switch (selectedEntity) {
        case 'customers':
          await updateCustomer(editForm.customerid, {
            fullname: editForm.fullname,
            address: editForm.address
          });
          break;
        case 'employees':
          // Create update data without the SSN field
          const employeeUpdateData = {
            fullname: editForm.fullname,
            address: editForm.address,
            jobposition: editForm.jobposition,
            hotelid: editForm.hotelid
          };
          await updateEmployee(editForm.ssn, employeeUpdateData);
          break;
        case 'hotels':
          await updateHotel(editForm.address, {
            contactemail: editForm.contactemail,
            phonenumber: editForm.phonenumber,
            numberofrooms: editForm.numberofrooms,
            rating: editForm.rating,
            chainname: editForm.chainname,
            managerid: editForm.managerid
          });
          break;
        case 'rooms':
          await updateRoom(editForm.roomnumber, editForm.hoteladdress, {
            price: editForm.price,
            amenities: editForm.amenities,
            problems: editForm.problems,
            capacity: editForm.capacity,
            viewtype: editForm.viewtype,
            extendable: editForm.extendable
          });
          break;
        case 'bookings':
          await updateBooking(editForm.bookingid, {
            customerid: editForm.customerid,
            roomnumber: editForm.roomnumber,
            startdate: editForm.startdate,
            enddate: editForm.enddate
          });
          break;
        case 'rentings':
          await updateRenting(editForm.rentingid, {
            customerid: editForm.customerid,
            roomnumber: editForm.roomnumber,
            employeeid: editForm.employeeid,
            bookingid: editForm.bookingid,
            startdate: editForm.startdate,
            enddate: editForm.enddate,
            paymentinformation: editForm.paymentinformation
          });
          break;
        default:
          console.error('Update not implemented for this entity type');
          return;
      }
      setEditingId(null);
      await fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item. Please try again.');
    }
  };

  const handleAdd = async () => {
    try {
      // Validate SSN format
      if (selectedEntity === 'employees' && addForm.ssn) {
        if (!/^\d{9}$/.test(addForm.ssn)) {
          alert('SSN must be exactly 9 digits');
          return;
        }
      }

      let response;
      switch (selectedEntity) {
        case 'customers':
          response = await createCustomer({
            customerid: addForm.customerid,
            fullname: addForm.fullname,
            address: addForm.address
          });
          break;
        case 'employees':
          response = await createEmployee({
            ssn: addForm.ssn,
            fullname: addForm.fullname,
            address: addForm.address,
            jobposition: addForm.jobposition,
            hotelid: addForm.hotelid
          });
          break;
        case 'hotels':
          response = await createHotel({
            address: addForm.address,
            contactemail: addForm.contactemail,
            phonenumber: addForm.phonenumber,
            numberofrooms: parseInt(addForm.numberofrooms),
            rating: parseInt(addForm.rating),
            chainname: addForm.chainname,
            managerid: addForm.managerid
          });
          break;
        case 'rooms':
          response = await createRoom({
            roomnumber: parseInt(addForm.roomnumber),
            hoteladdress: addForm.hoteladdress,
            price: parseFloat(addForm.price),
            amenities: addForm.amenities,
            problems: addForm.problems,
            capacity: parseInt(addForm.capacity),
            viewtype: addForm.viewtype,
            extendable: addForm.extendable === 'true'
          });
          break;
        case 'bookings':
          response = await createBooking({
            customerid: addForm.customerid,
            roomnumber: parseInt(addForm.roomnumber),
            startdate: new Date(addForm.startdate).toISOString(),
            enddate: new Date(addForm.enddate).toISOString()
          });
          break;
        case 'rentings':
          response = await createRenting({
            customerid: addForm.customerid,
            roomnumber: parseInt(addForm.roomnumber),
            employeeid: addForm.employeeid,
            bookingid: parseInt(addForm.bookingid),
            startdate: new Date(addForm.startdate).toISOString(),
            enddate: new Date(addForm.enddate).toISOString(),
            paymentinformation: addForm.paymentinformation
          });
          break;
      }

      if (response) {
        // Close the form and reset state
        setShowAddForm(false);
        setAddForm({});
        
        // Fetch fresh data
        await fetchData();
        
        // Show success message
        alert(`${selectedEntity.slice(0, -1)} created successfully!`);
      } else {
        throw new Error('No response received from server');
      }
    } catch (error: any) {
      console.error('Error adding item:', error);
      const errorMessage = error.response?.data?.detail || error.message;
      alert(`Error adding item: ${errorMessage}`);
    }
  };

  const getAddFormFields = () => {
    switch (selectedEntity) {
      case 'customers':
        return ['customerid', 'fullname', 'address'];
      case 'employees':
        return ['ssn', 'fullname', 'address', 'jobposition', 'hotelid'];
      case 'hotels':
        return ['address', 'contactemail', 'phonenumber', 'numberofrooms', 'rating', 'chainname', 'managerid'];
      case 'rooms':
        return ['roomnumber', 'hoteladdress', 'price', 'amenities', 'problems', 'capacity', 'viewtype', 'extendable'];
      case 'bookings':
        return ['customerid', 'roomnumber', 'startdate', 'enddate'];
      case 'rentings':
        return ['customerid', 'roomnumber', 'employeeid', 'bookingid', 'startdate', 'enddate', 'paymentinformation'];
      default:
        return [];
    }
  };

  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Database Management
            </h1>
          </div>
        </header>

        <main className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            {/* Entity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Select Entity</label>
              <select
                className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3"
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value as EntityType)}
              >
                <option value="customers">Customers</option>
                <option value="employees">Employees</option>
                <option value="hotels">Hotels</option>
                <option value="rooms">Rooms</option>
                <option value="bookings">Bookings</option>
                <option value="rentings">Rentings</option>
              </select>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add New {selectedEntity.slice(0, -1)}
            </button>

            {/* Data Table */}
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-xl">
                    {loading ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : data.length === 0 ? (
                      <div className="text-center py-4">No data available</div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            {getColumns().map((column) => (
                              <th
                                key={column}
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                {column.toUpperCase()}
                              </th>
                            ))}
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {data.map((item, index) => {
                            const key = getItemKey(item, index);
                            return (
                              <tr key={key}>
                                {getColumns().map((column) => (
                                  <td
                                    key={`${key}-${column}`}
                                    className="whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                                  >
                                    {editingId === key ? (
                                      <input
                                        type={getInputType(column)}
                                        value={editForm[column] || ''}
                                        onChange={(e) =>
                                          setEditForm({ ...editForm, [column]: e.target.value })
                                        }
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                      />
                                    ) : (
                                      formatValue(item[column], column)
                                    )}
                                  </td>
                                ))}
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {editingId === key ? (
                                    <>
                                      <button
                                        onClick={() => handleSave()}
                                        className="text-primary-600 hover:text-primary-900 mr-2"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingId(null)}
                                        className="text-gray-600 hover:text-gray-900"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleEdit(item, index)}
                                        className="text-primary-600 hover:text-primary-900 mr-2"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDelete(item, index)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Add New {selectedEntity.slice(0, -1)}</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAdd();
                }}>
                  {getAddFormFields().map((field) => (
                    <div key={field} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        {field === 'ssn' && <span className="text-sm text-gray-500 ml-1">(9 digits)</span>}
                      </label>
                      {field === 'hotelid' ? (
                        <select
                          value={addForm[field] || ''}
                          onChange={(e) => setAddForm({ ...addForm, [field]: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          required
                        >
                          <option value="">Select a hotel...</option>
                          {hotels.map((hotel) => (
                            <option key={hotel.address} value={hotel.address}>
                              {hotel.address}
                            </option>
                          ))}
                        </select>
                      ) : field === 'ssn' ? (
                        <input
                          type="text"
                          pattern="\d{9}"
                          maxLength={9}
                          value={addForm[field] || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                            setAddForm({ ...addForm, [field]: value });
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          required
                        />
                      ) : field.includes('date') ? (
                        <input
                          type="datetime-local"
                          value={addForm[field] || ''}
                          onChange={(e) => setAddForm({ ...addForm, [field]: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          required
                        />
                      ) : field === 'extendable' ? (
                        <select
                          value={addForm[field] || ''}
                          onChange={(e) => setAddForm({ ...addForm, [field]: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          required
                        >
                          <option value="">Select...</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      ) : (
                        <input
                          type={field.includes('price') || field.includes('number') || field.includes('rating') ? 'number' : 'text'}
                          value={addForm[field] || ''}
                          onChange={(e) => setAddForm({ ...addForm, [field]: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          required
                        />
                      )}
                    </div>
                  ))}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setAddForm({});
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

// Helper function to determine input type based on column name
const getInputType = (column: string): string => {
  if (column.includes('date')) return 'datetime-local';
  if (column.includes('price') || column.includes('number') || column.includes('rating')) return 'number';
  if (column === 'extendable') return 'checkbox';
  return 'text';
};

// Helper function to format values for display
const formatValue = (value: any, column: string): string | number | boolean => {
  if (value === null || value === undefined) return '';
  if (column.includes('date')) {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }
  if (column === 'extendable') return value ? 'Yes' : 'No';
  return value;
}; 