import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import StatusPill from '../components/StatusPill';

const Fleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    name: '',
    type: 'Van',
    maxLoadCapacity: '',
    acquisitionCost: '',
    status: 'AVAILABLE'
  });
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ type: '', status: '', search: '' });

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, filters]);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    }
  };

  const applyFilters = () => {
    let result = vehicles;
    if (filters.type) {
      result = result.filter(v => v.type === filters.type);
    }
    if (filters.status) {
      result = result.filter(v => v.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(v => 
        v.registrationNumber.toLowerCase().includes(q) || 
        v.name.toLowerCase().includes(q)
      );
    }
    setFilteredVehicles(result);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (vehicle = null) => {
    setError('');
    if (vehicle) {
      setCurrentVehicle(vehicle);
      setFormData({
        registrationNumber: vehicle.registrationNumber,
        name: vehicle.name || '',
        type: vehicle.type,
        maxLoadCapacity: vehicle.maxLoadCapacity,
        acquisitionCost: vehicle.acquisitionCost,
        status: vehicle.status
      });
    } else {
      setCurrentVehicle(null);
      setFormData({
        registrationNumber: '',
        name: '',
        type: 'Van',
        maxLoadCapacity: '',
        acquisitionCost: '',
        status: 'AVAILABLE'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (currentVehicle) {
        await axios.put(`http://localhost:3000/api/vehicles/${currentVehicle.id}`, formData, config);
      } else {
        await axios.post('http://localhost:3000/api/vehicles', formData, config);
      }
      setShowModal(false);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchVehicles();
    } catch (err) {
      console.error('Failed to delete vehicle', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Vehicle Registry</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your fleet and track vehicle status</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Vehicle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search registration or name..."
            className="w-full pl-9 pr-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <select 
          className="bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="">All Types</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
          <option value="Car">Car</option>
          <option value="Motorcycle">Motorcycle</option>
        </select>
        <select 
          className="bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="IN_SHOP">In Shop</option>
          <option value="RETIRED">Retired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Registration</th>
                <th className="px-6 py-4 font-medium">Name/Model</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Capacity (kg)</th>
                <th className="px-6 py-4 font-medium">Odometer</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No vehicles found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map(vehicle => (
                  <tr key={vehicle.id} className="hover:bg-[#334155] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{vehicle.registrationNumber}</td>
                    <td className="px-6 py-4">{vehicle.name || '-'}</td>
                    <td className="px-6 py-4">{vehicle.type}</td>
                    <td className="px-6 py-4">{vehicle.maxLoadCapacity}</td>
                    <td className="px-6 py-4">{vehicle.odometer} km</td>
                    <td className="px-6 py-4">
                      <StatusPill status={vehicle.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(vehicle)} className="text-gray-400 hover:text-white mr-3 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(vehicle.id)} className="text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] rounded-xl border border-gray-700 w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">
                {currentVehicle ? 'Edit Vehicle' : 'Register Vehicle'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Registration Number *</label>
                  <input 
                    type="text" 
                    name="registrationNumber" 
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. VAN-01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name / Model</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Ford Transit"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type *</label>
                    <select 
                      name="type" 
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Van">Van</option>
                      <option value="Truck">Truck</option>
                      <option value="Car">Car</option>
                      <option value="Motorcycle">Motorcycle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    {/* Read-only unless current status is RETIRED, or manually switching to RETIRED */}
                    <select 
                      name="status" 
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                      {!currentVehicle && <option value="AVAILABLE">Available</option>}
                      {currentVehicle && <option value={currentVehicle.status}>{currentVehicle.status.replace('_', ' ')}</option>}
                      {currentVehicle && currentVehicle.status !== 'RETIRED' && <option value="RETIRED">Retired</option>}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Max Load Capacity (kg) *</label>
                    <input 
                      type="number" 
                      name="maxLoadCapacity" 
                      value={formData.maxLoadCapacity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Acquisition Cost *</label>
                    <input 
                      type="number" 
                      name="acquisitionCost" 
                      value={formData.acquisitionCost}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-transparent text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  {currentVehicle ? 'Save Changes' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fleet;
