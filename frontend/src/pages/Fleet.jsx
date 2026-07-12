import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import PageLayout from '../components/app/PageLayout';
import StatusPill from '../components/StatusPill';
import CustomSelect from '../components/CustomSelect';

export default function Fleet() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null); // null means show filters/create

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
        (v.name || '').toLowerCase().includes(q)
      );
    }
    setFilteredVehicles(result);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectVehicle = (vehicle) => {
    setError('');
    setSelectedAsset(vehicle);
    if (vehicle) {
      setFormData({
        registrationNumber: vehicle.registrationNumber,
        name: vehicle.name || '',
        type: vehicle.type,
        maxLoadCapacity: vehicle.maxLoadCapacity,
        acquisitionCost: vehicle.acquisitionCost,
        status: vehicle.status
      });
    } else {
      setFormData({
        registrationNumber: '',
        name: '',
        type: 'Van',
        maxLoadCapacity: '',
        acquisitionCost: '',
        status: 'AVAILABLE'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (selectedAsset && selectedAsset.id) {
        await axios.put(`http://localhost:3000/api/vehicles/${selectedAsset.id}`, formData, config);
      } else {
        await axios.post('http://localhost:3000/api/vehicles', formData, config);
      }
      selectVehicle(null);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save vehicle');
    }
  };

  const renderInspector = () => {
    return (
      <div className="p-6 flex flex-col h-full overflow-y-auto">
        <h3 className="font-display font-medium text-lg mb-6">
          {selectedAsset ? 'Edit Vehicle' : 'Register Vehicle'}
        </h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 h-full min-h-min">
          {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
          
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Registration Number *</label>
              <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none text-white transition-all" placeholder="e.g. VAN-01" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Name / Model</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none text-white transition-all" placeholder="e.g. Ford Transit" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Type *</label>
                <CustomSelect
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Select type..."
                  options={[
                    { value: 'Van', label: 'Van' },
                    { value: 'Truck', label: 'Truck' },
                    { value: 'Car', label: 'Car' },
                    { value: 'Motorcycle', label: 'Motorcycle' }
                  ]}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Status</label>
                <CustomSelect
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  placeholder="Select status..."
                  options={[
                    ...(selectedAsset 
                        ? [{ value: selectedAsset.status, label: selectedAsset.status.replace('_', ' ') }] 
                        : [{ value: 'AVAILABLE', label: 'Available' }]
                    ),
                    ...(selectedAsset && selectedAsset.status !== 'RETIRED' 
                        ? [{ value: 'RETIRED', label: 'Retired' }] 
                        : []
                    )
                  ]}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Max Load (kg) *</label>
                <input type="number" min="0" name="maxLoadCapacity" value={formData.maxLoadCapacity} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none text-white transition-all" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Cost (₹) *</label>
                <input type="number" min="0" name="acquisitionCost" value={formData.acquisitionCost} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none text-white transition-all" />
              </div>
            </div>

            {selectedAsset && (
              <div className="pt-4 mt-4 border-t border-white/10">
                <button type="button" onClick={() => selectVehicle(null)} className="text-sm text-gray-400 hover:text-white transition-colors">
                  ← Back to Create New
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-lg transition-colors mt-8 border border-white/10">
            {selectedAsset ? 'Save Changes' : 'Register Vehicle'}
          </button>
        </form>
      </div>
    );
  };

  return (
    <PageLayout inspector={renderInspector()}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2 shrink-0">
          <div className="flex items-center gap-6">
            <div className="text-lg font-display font-medium text-white border-b-2 border-brand-accent pb-2 -mb-[9px]">
              Vehicles
            </div>
          </div>
          
          <div className="flex gap-2 relative z-20">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent text-white" value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} />
            </div>
            <div className="w-32">
              <CustomSelect 
                name="type"
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                placeholder="All Types"
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'Van', label: 'Van' },
                  { value: 'Truck', label: 'Truck' },
                  { value: 'Car', label: 'Car' }
                ]}
              />
            </div>
            <div className="w-36">
              <CustomSelect 
                name="status"
                value={filters.status} 
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                placeholder="All Statuses"
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'AVAILABLE', label: 'Available' },
                  { value: 'ON_TRIP', label: 'On Trip' },
                  { value: 'IN_SHOP', label: 'In Shop' },
                  { value: 'RETIRED', label: 'Retired' }
                ]}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#141416] border border-white/10 rounded-xl overflow-hidden flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-gray-400 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 font-medium">Registration</th>
                <th className="px-6 py-3 font-medium">Model</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Capacity</th>
                <th className="px-6 py-3 font-medium">Odometer</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No vehicles found.</td>
                </tr>
              ) : (
                filteredVehicles.map(vehicle => (
                  <tr 
                    key={vehicle.id} 
                    onClick={() => selectVehicle(vehicle)}
                    className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedAsset?.id === vehicle.id ? 'bg-white/[0.04]' : ''}`}
                  >
                    <td className="px-6 py-4 font-medium text-white">{vehicle.registrationNumber}</td>
                    <td className="px-6 py-4 text-gray-400">{vehicle.name || '-'}</td>
                    <td className="px-6 py-4">{vehicle.type}</td>
                    <td className="px-6 py-4">{vehicle.maxLoadCapacity} kg</td>
                    <td className="px-6 py-4">{vehicle.odometer} km</td>
                    <td className="px-6 py-4">
                      <StatusPill status={vehicle.status} />
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
