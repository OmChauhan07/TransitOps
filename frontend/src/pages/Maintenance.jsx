import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PenTool, CheckCircle, Search, Wrench } from 'lucide-react';
import PageLayout from '../components/app/PageLayout';
import CustomSelect from '../components/CustomSelect';

export default function Maintenance() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);

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
      setFormData({ vehicleId: '', description: '', cost: '' });
      fetchLogs();
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to open maintenance ticket');
    }
  };

  const handleCloseTicket = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to close this ticket? The vehicle will be returned to the dispatch pool.')) return;
    try {
      await axios.post(`http://localhost:3000/api/maintenance/${id}/close`, {}, getHeaders());
      fetchLogs();
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to close ticket');
    }
  };

  const eligibleVehicles = vehicles.filter(v => v.status !== 'ON_TRIP');

  const renderInspector = () => {
    return (
      <div className="p-6 flex flex-col h-full overflow-y-auto">
        <h3 className="font-display font-medium text-lg mb-6">Open Ticket</h3>
        
        <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 h-full min-h-min">
          {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
          
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Vehicle *</label>
              <CustomSelect
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleInputChange}
                placeholder="Select a Vehicle"
                options={[
                  { value: '', label: 'Select a Vehicle' },
                  ...eligibleVehicles.map(v => ({
                    value: v.id,
                    label: `${v.registrationNumber} - ${v.type} (${v.status})`
                  }))
                ]}
              />
              <p className="text-xs text-gray-500 mt-1">Pulls vehicle from dispatch pool.</p>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Cost (₹) *</label>
              <input type="number" name="cost" value={formData.cost} onChange={handleInputChange} required min="0" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white" />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all min-h-[100px] text-white" placeholder="Describe the issue..." />
            </div>
          </div>

          <button type="submit" className="w-full bg-brand-accent hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg transition-colors mt-8 shadow-[0_0_15px_rgba(245,124,0,0.3)] flex items-center justify-center gap-2">
            <Wrench className="w-4 h-4" /> Open Ticket
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
              Maintenance
            </div>
          </div>
          
          <div className="flex gap-2 relative z-20">
            <div className="w-40">
              <CustomSelect 
                name="vehicleId"
                value={filters.vehicleId} 
                onChange={(e) => setFilters({...filters, vehicleId: e.target.value})}
                placeholder="All Vehicles"
                options={[
                  { value: '', label: 'All Vehicles' },
                  ...vehicles.map(v => ({ value: v.id, label: v.registrationNumber }))
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
                  { value: 'OPEN', label: 'Open' },
                  { value: 'CLOSED', label: 'Closed' }
                ]}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#141416] border border-white/10 rounded-xl overflow-hidden flex-1 overflow-y-auto">
          <div className="space-y-0 divide-y divide-white/5">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No maintenance records found.</div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="p-4 flex gap-4 items-start transition-colors hover:bg-white/[0.02]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${log.status === 'OPEN' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                    {log.status === 'OPEN' ? <PenTool className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{log.vehicle?.registrationNumber || 'N/A'}</span>
                        <span className="text-gray-500 text-xs">• {new Date(log.createdAt).toLocaleDateString()}</span>
                      </div>
                      {log.status === 'OPEN' && (
                        <button onClick={(e) => handleCloseTicket(log.id, e)} className="text-brand-accent hover:text-orange-400 transition-colors text-xs font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Close Ticket
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{log.description}</p>
                    <div className={`text-xs mt-2 font-medium ${log.status === 'OPEN' ? 'text-orange-400' : 'text-green-400'}`}>
                      {log.status} • ₹{log.cost.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
