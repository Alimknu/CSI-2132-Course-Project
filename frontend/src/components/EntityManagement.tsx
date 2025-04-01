import { useState } from 'react';
import { Customer, Employee, Hotel, Room } from '@/types';
import { createCustomer, createEmployee, createHotel, createRoom } from '@/utils/api';

type EntityType = 'customer' | 'employee' | 'hotel' | 'room';

export default function EntityManagement() {
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('customer');
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      switch (selectedEntity) {
        case 'customer':
          await createCustomer(formData);
          break;
        case 'employee':
          await createEmployee(formData);
          break;
        case 'hotel':
          await createHotel(formData);
          break;
        case 'room':
          await createRoom(formData);
          break;
      }
      alert('Entity created successfully!');
      setFormData({});
    } catch (error) {
      console.error('Error creating entity:', error);
      alert('Error creating entity');
    }
  };

  const renderForm = () => {
    switch (selectedEntity) {
      case 'customer':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Customer ID</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.customerid || ''}
                onChange={(e) => setFormData({ ...formData, customerid: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.fullname || ''}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </>
        );

      case 'employee':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">SSN</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.ssn || ''}
                onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.fullname || ''}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Job Position</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.jobposition || ''}
                onChange={(e) => setFormData({ ...formData, jobposition: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Hotel ID</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.hotelid || ''}
                onChange={(e) => setFormData({ ...formData, hotelid: e.target.value })}
              />
            </div>
          </>
        );

      case 'hotel':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.contactemail || ''}
                onChange={(e) => setFormData({ ...formData, contactemail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.phonenumber || ''}
                onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Number of Rooms</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.numberofrooms || ''}
                onChange={(e) => setFormData({ ...formData, numberofrooms: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.rating || ''}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Chain Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.chainname || ''}
                onChange={(e) => setFormData({ ...formData, chainname: e.target.value })}
              />
            </div>
          </>
        );

      case 'room':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Room Number</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.roomnumber || ''}
                onChange={(e) => setFormData({ ...formData, roomnumber: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Amenities</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.amenities || ''}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Problems</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.problems || ''}
                onChange={(e) => setFormData({ ...formData, problems: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Extendable</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.extendable ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, extendable: e.target.value === 'true' })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">View Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.viewtype || ''}
                onChange={(e) => setFormData({ ...formData, viewtype: e.target.value })}
              >
                <option value="">Select view type</option>
                <option value="sea view">Sea View</option>
                <option value="mountain view">Mountain View</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Hotel Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={formData.hoteladdress || ''}
                onChange={(e) => setFormData({ ...formData, hoteladdress: e.target.value })}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Manage Entities</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Entity Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            value={selectedEntity}
            onChange={(e) => {
              setSelectedEntity(e.target.value as EntityType);
              setFormData({});
            }}
          >
            <option value="customer">Customer</option>
            <option value="employee">Employee</option>
            <option value="hotel">Hotel</option>
            <option value="room">Room</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
          >
            Create {selectedEntity.charAt(0).toUpperCase() + selectedEntity.slice(1)}
          </button>
        </form>
      </div>
    </div>
  );
} 