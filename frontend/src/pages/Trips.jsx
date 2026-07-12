import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Check, XCircle, Trash2, Search, X, Play } from 'lucide-react';
import StatusPill from '../components/StatusPill';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  
  // Data for lookups
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    cargoWeight: '',
    plannedDistance: '',
    vehicleId: '',
    driverId: ''
  });

  const [completeData, setCompleteData] = useState({
    actualDistance: '',
    fuelConsumed: '',
    revenue: ''
  });

  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', search: '' });

  useEffect(() => {
    fetchTrips();
    fetchLookups();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [trips, filters]);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchTrips = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/trips', getHeaders());
      setTrips(res.data);
    } catch (err) {
      console.error('Failed to fetch trips', err);
    }
  };

  const fetchLookups = async () => {
    try {
      const [vRes, dRes] = await Promise.all([
        axios.get('http://localhost:3000/api/vehicles', getHeaders()),
        axios.get('http://localhost:3000/api/drivers', getHeaders())
      ]);
      setVehicles(vRes.data);
      setDrivers(dRes.data);
    } catch (err) {
      console.error('Failed to fetch lookups', err);
    }
  };

  const applyFilters = () => {
    let result = trips;
    if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => 
        t.source.toLowerCase().includes(q) || 
        t.destination.toLowerCase().includes(q) ||
        (t.vehicle?.registrationNumber || '').toLowerCase().includes(q) ||
        (t.driver?.name || '').toLowerCase().includes(q)
      );
    }
    setFilteredTrips(result);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:3000/api/trips', formData, getHeaders());
      setShowCreateModal(false);
      setFormData({
        source: '', destination: '', cargoWeight: '', plannedDistance: '', vehicleId: '', driverId: ''
      });
      fetchTrips();
      // Also refresh lookups to get latest status
      fetchLookups();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create trip');
    }
  };

  const handleDispatch = async (id) => {
    try {
      await axios.post(`http://localhost:3000/api/trips/${id}/dispatch`, {}, getHeaders());
      fetchTrips();
      fetchLookups();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to dispatch trip');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    try {
      await axios.post(`http://localhost:3000/api/trips/${id}/cancel`, {}, getHeaders());
      fetchTrips();
      fetchLookups();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel trip');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this DRAFT trip?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/trips/${id}`, getHeaders());
      fetchTrips();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete trip');
    }
  };

  const openCompleteModal = (trip) => {
    setActiveTrip(trip);
    setCompleteData({ actualDistance: '', fuelConsumed: '', revenue: '' });
    setShowCompleteModal(true);
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`http://localhost:3000/api/trips/${activeTrip.id}/complete`, completeData, getHeaders());
      setShowCompleteModal(false);
      fetchTrips();
      fetchLookups();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete trip');
    }
  };

  // Helper for driver filtering
  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE');
  const availableDrivers = drivers.filter(d => d.status === 'AVAILABLE' && !isExpired(d.licenseExpiryDate));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Trip Dispatch</h1>
          <p className="text-gray-400 text-sm mt-1">Manage trip lifecycle from drafting to completion</p>
        </div>
        <button 
          onClick={() => { setError(''); setShowCreateModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> New Trip
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search route, vehicle, or driver..."
            className="w-full pl-9 pr-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <select 
          className="bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Route (Src → Dest)</th>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Driver</th>
                <th className="px-6 py-4 font-medium">Cargo (kg)</th>
                <th className="px-6 py-4 font-medium">Distance (km)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No trips found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTrips.map(trip => (
                  <tr key={trip.id} className="hover:bg-[#334155] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {trip.source} <span className="text-gray-500 mx-1">→</span> {trip.destination}
                    </td>
                    <td className="px-6 py-4">{trip.vehicle?.registrationNumber || 'N/A'}</td>
                    <td className="px-6 py-4">{trip.driver?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{trip.cargoWeight}</td>
                    <td className="px-6 py-4">
                      {trip.plannedDistance}
                      {trip.actualOdometer && <span className="text-green-400 block text-xs">Actual: {trip.actualOdometer}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={trip.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {trip.status === 'DRAFT' && (
                        <>
                          <button onClick={() => handleDispatch(trip.id)} title="Dispatch" className="text-blue-400 hover:text-blue-300 transition-colors inline-flex p-1">
                            <Play className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(trip.id)} title="Delete Draft" className="text-red-400 hover:text-red-300 transition-colors inline-flex p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {trip.status === 'DISPATCHED' && (
                        <>
                          <button onClick={() => openCompleteModal(trip)} title="Complete Trip" className="text-green-400 hover:text-green-300 transition-colors inline-flex p-1">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleCancel(trip.id)} title="Cancel Trip" className="text-yellow-400 hover:text-yellow-300 transition-colors inline-flex p-1">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Trip Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] rounded-xl border border-gray-700 w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Create New Trip</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6">
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Source *</label>
                    <input 
                      type="text" 
                      name="source" 
                      value={formData.source}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Destination *</label>
                    <input 
                      type="text" 
                      name="destination" 
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle (Available Only) *</label>
                  <select 
                    name="vehicleId" 
                    value={formData.vehicleId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a Vehicle</option>
                    {availableVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} - {v.type} (Max: {v.maxLoadCapacity}kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Driver (Available & Valid License) *</label>
                  <select 
                    name="driverId" 
                    value={formData.driverId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a Driver</option>
                    {availableDrivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.licenseNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Cargo Weight (kg) *</label>
                    <input 
                      type="number" 
                      name="cargoWeight" 
                      value={formData.cargoWeight}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Planned Distance (km) *</label>
                    <input 
                      type="number" 
                      name="plannedDistance" 
                      value={formData.plannedDistance}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-transparent text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Trip Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] rounded-xl border border-gray-700 w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Complete Trip</h3>
              <button onClick={() => setShowCompleteModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCompleteSubmit} className="p-6">
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Actual Distance (km) *</label>
                  <input 
                    type="number" 
                    value={completeData.actualDistance}
                    onChange={(e) => setCompleteData({...completeData, actualDistance: e.target.value})}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Fuel Consumed (Liters) *</label>
                  <input 
                    type="number" 
                    value={completeData.fuelConsumed}
                    onChange={(e) => setCompleteData({...completeData, fuelConsumed: e.target.value})}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Trip Revenue ($) *</label>
                  <input 
                    type="number" 
                    value={completeData.revenue}
                    onChange={(e) => setCompleteData({...completeData, revenue: e.target.value})}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCompleteModal(false)}
                  className="px-4 py-2 bg-transparent text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center"
                >
                  <Check className="w-4 h-4 mr-2" /> Mark Completed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Trips;
