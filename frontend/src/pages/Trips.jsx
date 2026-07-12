import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Check, XCircle, Trash2, Search, X } from 'lucide-react';
import PageLayout from '../components/app/PageLayout';
import StatusPill from '../components/StatusPill';
import CustomSelect from '../components/CustomSelect';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  
  // Data for lookups
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // Right Inspector State: 'CREATE' | 'COMPLETE' | null
  const [inspectorMode, setInspectorMode] = useState('CREATE');
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
      setFormData({
        source: '', destination: '', cargoWeight: '', plannedDistance: '', vehicleId: '', driverId: ''
      });
      fetchTrips();
      fetchLookups();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create trip');
    }
  };

  const handleDispatch = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.post(`http://localhost:3000/api/trips/${id}/dispatch`, {}, getHeaders());
      fetchTrips();
      fetchLookups();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to dispatch trip');
    }
  };

  const handleCancel = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    try {
      await axios.post(`http://localhost:3000/api/trips/${id}/cancel`, {}, getHeaders());
      fetchTrips();
      fetchLookups();
      setInspectorMode('CREATE');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel trip');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this DRAFT trip?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/trips/${id}`, getHeaders());
      fetchTrips();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete trip');
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`http://localhost:3000/api/trips/${activeTrip.id}/complete`, completeData, getHeaders());
      setInspectorMode('CREATE');
      setActiveTrip(null);
      fetchTrips();
      fetchLookups();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete trip');
    }
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE');
  const availableDrivers = drivers.filter(d => d.status === 'AVAILABLE' && !isExpired(d.licenseExpiryDate));

  const renderInspector = () => {
    if (inspectorMode === 'COMPLETE' && activeTrip) {
      return (
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-medium text-lg">Complete Trip</h3>
            <button onClick={() => setInspectorMode('CREATE')} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleCompleteSubmit} className="flex flex-col flex-1 h-full">
            {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
            <div className="space-y-4 flex-1">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg mb-4">
                <p className="text-sm font-medium text-white mb-1">{activeTrip.source} → {activeTrip.destination}</p>
                <p className="text-xs text-gray-400">Planned Dist: {activeTrip.plannedDistance}km</p>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Actual Distance (km) *</label>
                <input type="number" required min="0" value={completeData.actualDistance} onChange={(e) => setCompleteData({...completeData, actualDistance: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Fuel Consumed (Liters) *</label>
                <input type="number" required min="0" value={completeData.fuelConsumed} onChange={(e) => setCompleteData({...completeData, fuelConsumed: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Trip Revenue ($) *</label>
                <input type="number" required min="0" value={completeData.revenue} onChange={(e) => setCompleteData({...completeData, revenue: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white" />
              </div>
            </div>

            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 rounded-lg transition-colors mt-auto flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Mark Completed
            </button>
          </form>
        </div>
      );
    }

    // Default CREATE mode
    return (
      <div className="p-6 flex flex-col h-full overflow-y-auto">
        <h3 className="font-display font-medium text-lg mb-6">Dispatch Configuration</h3>
        <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 h-full min-h-min">
          {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Source *</label>
              <input type="text" name="source" value={formData.source} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white" placeholder="Origin" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Destination *</label>
              <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white" placeholder="Destination" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Vehicle *</label>
              <CustomSelect 
                name="vehicleId" 
                value={formData.vehicleId} 
                onChange={handleInputChange} 
                placeholder="Select vehicle..."
                options={[
                  { value: '', label: 'Select vehicle...' },
                  ...availableVehicles.map(v => ({ value: v.id, label: `${v.registrationNumber} (Max: ${v.maxLoadCapacity}kg)` }))
                ]}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Driver *</label>
              <CustomSelect 
                name="driverId" 
                value={formData.driverId} 
                onChange={handleInputChange} 
                placeholder="Select driver..."
                options={[
                  { value: '', label: 'Select driver...' },
                  ...availableDrivers.map(d => ({ value: d.id, label: d.name }))
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Cargo (kg) *</label>
                <input type="number" min="1" name="cargoWeight" value={formData.cargoWeight} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Dist. (km) *</label>
                <input type="number" min="1" name="plannedDistance" value={formData.plannedDistance} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white" />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button type="submit" className="w-full bg-brand-accent hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg transition-colors shadow-[0_0_15px_rgba(245,124,0,0.3)]">
              Save Draft
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <PageLayout inspector={renderInspector()}>
      <div className="h-full flex flex-col relative z-10">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-2xl font-display font-medium">Active Trips</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search trips..." className="pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent text-white" value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} />
            </div>
            <div className="w-40">
              <CustomSelect 
                name="status"
                value={filters.status} 
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                placeholder="All Statuses"
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'DRAFT', label: 'Draft' },
                  { value: 'DISPATCHED', label: 'Dispatched' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'CANCELLED', label: 'Cancelled' }
                ]}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#141416] border border-white/10 rounded-xl overflow-hidden flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-gray-400 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 font-medium">Trip ID</th>
                <th className="px-6 py-3 font-medium">Route</th>
                <th className="px-6 py-3 font-medium">Asset / Driver</th>
                <th className="px-6 py-3 font-medium">Cargo/Dist</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No trips found.</td>
                </tr>
              ) : (
                filteredTrips.map(trip => (
                  <tr 
                    key={trip.id} 
                    className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${activeTrip?.id === trip.id ? 'bg-white/[0.04]' : ''}`}
                    onClick={() => {
                      if (trip.status === 'DISPATCHED') {
                        setActiveTrip(trip);
                        setCompleteData({ actualDistance: '', fuelConsumed: '', revenue: '' });
                        setInspectorMode('COMPLETE');
                      } else {
                        setInspectorMode('CREATE');
                        setActiveTrip(null);
                      }
                    }}
                  >
                    <td className="px-6 py-4 font-medium text-white text-xs opacity-70">
                      {trip.id.substring(0,8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {trip.source} <span className="mx-2">→</span> {trip.destination}
                    </td>
                    <td className="px-6 py-4">
                      {trip.vehicle?.registrationNumber} • {trip.driver?.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      <div>{trip.cargoWeight}kg</div>
                      <div>{trip.plannedDistance}km</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={trip.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {trip.status === 'DRAFT' && (
                        <>
                          <button onClick={(e) => handleDispatch(trip.id, e)} title="Dispatch" className="text-brand-accent hover:text-orange-400 transition-colors inline-flex p-1">
                            <Play className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => handleDelete(trip.id, e)} title="Delete" className="text-gray-500 hover:text-red-400 transition-colors inline-flex p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {trip.status === 'DISPATCHED' && (
                        <>
                          <button onClick={(e) => handleCancel(trip.id, e)} title="Cancel Trip" className="text-gray-500 hover:text-yellow-400 transition-colors inline-flex p-1">
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
    </PageLayout>
  );
}
