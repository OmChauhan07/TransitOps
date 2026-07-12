import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import StatusPill from '../components/StatusPill';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
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

  const openModal = (driver = null) => {
    setError('');
    if (driver) {
      setCurrentDriver(driver);
      setFormData({
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        licenseCategory: driver.licenseCategory || 'LMV',
        licenseExpiryDate: driver.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toISOString().split('T')[0] : '',
        contactNumber: driver.contactNumber || '',
        status: driver.status
      });
    } else {
      setCurrentDriver(null);
      setFormData({
        name: '',
        licenseNumber: '',
        licenseCategory: 'LMV',
        licenseExpiryDate: '',
        contactNumber: '',
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
      
      if (currentDriver) {
        await axios.put(`http://localhost:3000/api/drivers/${currentDriver.id}`, formData, config);
      } else {
        await axios.post('http://localhost:3000/api/drivers', formData, config);
      }
      setShowModal(false);
      fetchDrivers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save driver');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/drivers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDrivers();
    } catch (err) {
      console.error('Failed to delete driver', err);
    }
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Driver Profiles</h1>
          <p className="text-gray-400 text-sm mt-1">Manage personnel, licenses, and safety records</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Driver
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search name or license..."
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
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="OFF_DUTY">Off Duty</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">License Number</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Expiry Date</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Safety Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No drivers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredDrivers.map(driver => {
                  const expired = isExpired(driver.licenseExpiryDate);
                  return (
                    <tr key={driver.id} className="hover:bg-[#334155] transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{driver.name}</td>
                      <td className="px-6 py-4">{driver.licenseNumber}</td>
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
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openModal(driver)} className="text-gray-400 hover:text-white mr-3 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(driver.id)} className="text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
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
                {currentDriver ? 'Edit Driver' : 'Register Driver'}
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">License Number *</label>
                  <input 
                    type="text" 
                    name="licenseNumber" 
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. DL-12345"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                    <select 
                      name="licenseCategory" 
                      value={formData.licenseCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="LMV">LMV (Light)</option>
                      <option value="HMV">HMV (Heavy)</option>
                      <option value="CDL">CDL (Commercial)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date *</label>
                    <input 
                      type="date" 
                      name="licenseExpiryDate" 
                      value={formData.licenseExpiryDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Contact Number</label>
                    <input 
                      type="text" 
                      name="contactNumber" 
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select 
                      name="status" 
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={currentDriver && currentDriver.status === 'ON_TRIP'}
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                      {!currentDriver && <option value="AVAILABLE">Available</option>}
                      {currentDriver && currentDriver.status === 'ON_TRIP' && <option value="ON_TRIP">On Trip</option>}
                      {currentDriver && currentDriver.status !== 'ON_TRIP' && (
                        <>
                          <option value="AVAILABLE">Available</option>
                          <option value="OFF_DUTY">Off Duty</option>
                          <option value="SUSPENDED">Suspended</option>
                        </>
                      )}
                    </select>
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
                  {currentDriver ? 'Save Changes' : 'Register Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
