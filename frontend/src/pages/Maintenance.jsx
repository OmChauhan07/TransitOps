import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, Search, Wrench, CheckCircle } from 'lucide-react';
import StatusPill from '../components/StatusPill';

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    description: '',
    cost: ''
  });
  
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ vehicleId: '', status: '' });

  useEffect(() => {
    fetchLogs();
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/maintenance', getHeaders());
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch maintenance logs', err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/vehicles', getHeaders());
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    }
  };

  const applyFilters = () => {
    let result = logs;
    if (filters.vehicleId) {
      result = result.filter(l => l.vehicleId === filters.vehicleId);
    }
    if (filters.status) {
      result = result.filter(l => l.status === filters.status);
    }
    setFilteredLogs(result);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:3000/api/maintenance', formData, getHeaders());
      setShowCreateModal(false);
      setFormData({ vehicleId: '', description: '', cost: '' });
      fetchLogs();
      fetchVehicles(); // update vehicle statuses
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to open maintenance ticket');
    }
  };

  const handleCloseTicket = async (id) => {
    if (!window.confirm('Are you sure you want to close this ticket? The vehicle will be returned to the dispatch pool.')) return;
    try {
      await axios.post(`http://localhost:3000/api/maintenance/${id}/close`, {}, getHeaders());
      fetchLogs();
      fetchVehicles(); // update vehicle statuses
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to close ticket');
    }
  };

  // We can show all vehicles in the lookup, or just ones that aren't retired. 
  // For maintenance, it's possible you do maintenance on an available or in-shop vehicle.
  const eligibleVehicles = vehicles.filter(v => v.status !== 'ON_TRIP');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance Logs</h1>
          <p className="text-gray-400 text-sm mt-1">Track vehicle repairs and govern dispatch availability</p>
        </div>
        <button 
          onClick={() => { setError(''); setShowCreateModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Open Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 mb-6 flex flex-wrap gap-4 items-center">
        <select 
          className="bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          value={filters.vehicleId}
          onChange={(e) => setFilters({...filters, vehicleId: e.target.value})}
        >
          <option value="">All Vehicles</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.registrationNumber} ({v.type})</option>
          ))}
        </select>
        
        <select 
          className="bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Cost ($)</th>
                <th className="px-6 py-4 font-medium">Opened Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No maintenance records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#334155] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {log.vehicle?.registrationNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={log.description}>{log.description}</td>
                    <td className="px-6 py-4">${log.cost.toFixed(2)}</td>
                    <td className="px-6 py-4">{new Date(log.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {/* For the Log status, we can use the same StatusPill component but maybe mapped since log status is OPEN/CLOSED */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        log.status === 'OPEN' 
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                        {log.status === 'OPEN' ? <Wrench className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {log.status === 'OPEN' && (
                        <button 
                          onClick={() => handleCloseTicket(log.id)} 
                          className="text-blue-400 hover:text-blue-300 transition-colors inline-flex p-1 text-sm font-medium items-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Close Ticket
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] rounded-xl border border-gray-700 w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Open Maintenance Ticket</h3>
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle *</label>
                  <select 
                    name="vehicleId" 
                    value={formData.vehicleId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a Vehicle</option>
                    {eligibleVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} - {v.type} ({v.status})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">This will pull the vehicle from the dispatch pool.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                  <textarea 
                    name="description" 
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Describe the issue or maintenance required..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Estimated or Actual Cost ($) *</label>
                  <input 
                    type="number" 
                    name="cost" 
                    value={formData.cost}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center"
                >
                  <Wrench className="w-4 h-4 mr-2" /> Open Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
