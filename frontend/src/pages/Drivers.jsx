import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import PageLayout from '../components/app/PageLayout';
import StatusPill from '../components/StatusPill';
import CustomSelect from '../components/CustomSelect';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseCategory: 'LMV',
    licenseExpiryDate: '',
    contactNumber: '',
    status: 'AVAILABLE'
  });
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', search: '' });

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [drivers, filters]);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/drivers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrivers(res.data);
    } catch (err) {
      console.error('Failed to fetch drivers', err);
    }
  };

  const applyFilters = () => {
    let result = drivers;
    if (filters.status) {
      result = result.filter(d => d.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.licenseNumber.toLowerCase().includes(q)
      );
    }
    setFilteredDrivers(result);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectDriver = (driver) => {
    setError('');
    setSelectedAsset(driver);
    if (driver) {
      setFormData({
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        licenseCategory: driver.licenseCategory || 'LMV',
        licenseExpiryDate: driver.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toISOString().split('T')[0] : '',
        contactNumber: driver.contactNumber || '',
        status: driver.status
      });
    } else {
      setFormData({
        name: '',
        licenseNumber: '',
        licenseCategory: 'LMV',
        licenseExpiryDate: '',
        contactNumber: '',
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
        await axios.put(`http://localhost:3000/api/drivers/${selectedAsset.id}`, formData, config);
      } else {
        await axios.post('http://localhost:3000/api/drivers', formData, config);
      }
      selectDriver(null);
      fetchDrivers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save driver');
    }
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const renderInspector = () => {
    return (
      <div className="p-6 flex flex-col h-full overflow-y-auto">
        <h3 className="font-display font-medium text-lg mb-6">
          {selectedAsset ? 'Edit Driver' : 'Register Driver'}
        </h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 h-full min-h-min">
          {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
          
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none text-white transition-all" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">License Number *</label>
              <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none text-white transition-all" placeholder="e.g. DL-12345" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Category</label>
                <CustomSelect
                  name="licenseCategory"
                  value={formData.licenseCategory}
                  onChange={handleInputChange}
                  placeholder="Select category..."
                  options={[
                    { value: 'LMV', label: 'LMV (Light)' },
                    { value: 'HMV', label: 'HMV (Heavy)' },
                    { value: 'CDL', label: 'CDL (Commercial)' }
                  ]}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Expiry *</label>
                <input type="date" name="licenseExpiryDate" value={formData.licenseExpiryDate} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none text-white transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Contact</label>
                <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none text-white transition-all" placeholder="e.g. +1 234 567" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Status</label>
                <div className={selectedAsset && selectedAsset.status === 'ON_TRIP' ? 'pointer-events-none opacity-50' : ''}>
                  <CustomSelect
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    placeholder="Select status..."
                    options={
                      !selectedAsset 
                        ? [{ value: 'AVAILABLE', label: 'Available' }]
                        : selectedAsset.status === 'ON_TRIP'
                          ? [{ value: 'ON_TRIP', label: 'On Trip' }]
                          : [
                              { value: 'AVAILABLE', label: 'Available' },
                              { value: 'OFF_DUTY', label: 'Off Duty' },
                              { value: 'SUSPENDED', label: 'Suspended' }
                            ]
                    }
                  />
                </div>
              </div>
            </div>

            {selectedAsset && (
              <div className="pt-4 mt-4 border-t border-white/10">
                <button type="button" onClick={() => selectDriver(null)} className="text-sm text-gray-400 hover:text-white transition-colors">
                  ← Back to Create New
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-lg transition-colors mt-8 border border-white/10">
            {selectedAsset ? 'Save Changes' : 'Register Driver'}
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
              Drivers
            </div>
          </div>
          
          <div className="flex gap-2 relative z-20">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent text-white" value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} />
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
                  { value: 'OFF_DUTY', label: 'Off Duty' },
                  { value: 'SUSPENDED', label: 'Suspended' }
                ]}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#141416] border border-white/10 rounded-xl overflow-hidden flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-gray-400 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">License</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Expiry Date</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Safety Score</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No drivers found.</td>
                </tr>
              ) : (
                filteredDrivers.map(driver => {
                  const expired = isExpired(driver.licenseExpiryDate);
                  return (
                    <tr 
                      key={driver.id} 
                      onClick={() => selectDriver(driver)}
                      className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedAsset?.id === driver.id ? 'bg-white/[0.04]' : ''}`}
                    >
                      <td className="px-6 py-4 font-medium text-white">{driver.name}</td>
                      <td className="px-6 py-4 text-gray-400">{driver.licenseNumber}</td>
                      <td className="px-6 py-4">{driver.licenseCategory || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={expired ? 'text-red-400 font-semibold' : ''}>
                          {driver.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toLocaleDateString() : '-'}
                          {expired && ' (Expired)'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{driver.contactNumber || '-'}</td>
                      <td className="px-6 py-4">{driver.safetyScore} / 100</td>
                      <td className="px-6 py-4">
                        <StatusPill status={driver.status} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
