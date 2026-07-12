import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, DollarSign, Droplets, Wrench, Search } from 'lucide-react';

const Expenses = () => {
  const [logs, setLogs] = useState([]);
  const [costs, setCosts] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    entryType: 'FUEL', // FUEL, TOLL, OTHER
    amount: '',
    liters: ''
  });
  
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('LOGS'); // LOGS or ROLLUP
  const [filters, setFilters] = useState({ vehicleId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchData = async () => {
    try {
      const [logsRes, costsRes, vRes] = await Promise.all([
        axios.get('http://localhost:3000/api/finance/logs', getHeaders()),
        axios.get('http://localhost:3000/api/finance/costs', getHeaders()),
        axios.get('http://localhost:3000/api/vehicles', getHeaders())
      ]);
      setLogs(logsRes.data);
      setCosts(costsRes.data);
      setVehicles(vRes.data);
    } catch (err) {
      console.error('Failed to fetch finance data', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (formData.entryType === 'FUEL') {
        await axios.post('http://localhost:3000/api/finance/fuel', {
          vehicleId: formData.vehicleId,
          liters: formData.liters,
          cost: formData.amount
        }, getHeaders());
      } else {
        await axios.post('http://localhost:3000/api/finance/expense', {
          vehicleId: formData.vehicleId,
          type: formData.entryType,
          amount: formData.amount
        }, getHeaders());
      }

      setShowCreateModal(false);
      setFormData({ vehicleId: '', entryType: 'FUEL', amount: '', liters: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add entry');
    }
  };

  const getIcon = (category) => {
    switch(category) {
      case 'FUEL': return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'MAINTENANCE': return <Wrench className="w-4 h-4 text-orange-400" />;
      default: return <DollarSign className="w-4 h-4 text-green-400" />;
    }
  };

  const filteredLogs = logs.filter(l => filters.vehicleId ? l.vehicleId === filters.vehicleId : true);
  const filteredCosts = costs.filter(c => filters.vehicleId ? c.vehicleId === filters.vehicleId : true);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Fuel & Expenses</h1>
          <p className="text-gray-400 text-sm mt-1">Track and rollup all operational costs per vehicle</p>
        </div>
        <button 
          onClick={() => { setError(''); setShowCreateModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Entry
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex bg-[#0f172a] rounded-lg p-1 border border-gray-700">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'LOGS' ? 'bg-[#1e293b] text-white shadow' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('LOGS')}
          >
            Recent Logs
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ROLLUP' ? 'bg-[#1e293b] text-white shadow' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('ROLLUP')}
          >
            Cost Rollup
          </button>
        </div>

        <select 
          className="bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 min-w-[200px]"
          value={filters.vehicleId}
          onChange={(e) => setFilters({...filters, vehicleId: e.target.value})}
        >
          <option value="">All Vehicles</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.registrationNumber} ({v.type})</option>
          ))}
        </select>
      </div>

      {activeTab === 'LOGS' ? (
        <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Vehicle</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Amount ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No expense logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#334155] transition-colors">
                      <td className="px-6 py-4">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-white">{log.vehicle?.registrationNumber}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2">
                          {getIcon(log.category)}
                          {log.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">{log.description}</td>
                      <td className="px-6 py-4 font-medium">${log.amount.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCosts.map(cost => (
            <div key={cost.vehicleId} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white">{cost.registrationNumber}</h3>
                <span className="text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded">Rollup</span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><Droplets className="w-4 h-4" /> Fuel</span>
                  <span className="text-gray-200">${cost.fuelTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><Wrench className="w-4 h-4" /> Maintenance</span>
                  <span className="text-gray-200">${cost.maintenanceTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Other Expenses</span>
                  <span className="text-gray-200">${cost.expenseTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-400">Total Ops Cost</span>
                <span className="text-xl font-bold text-white">${cost.totalOperationalCost.toFixed(2)}</span>
              </div>
            </div>
          ))}
          
          {filteredCosts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-[#1e293b] rounded-xl border border-gray-700">
              No vehicle costs found.
            </div>
          )}
        </div>
      )}

      {/* Unified Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] rounded-xl border border-gray-700 w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Add Entry</h3>
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
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Entry Type *</label>
                  <select 
                    name="entryType" 
                    value={formData.entryType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="FUEL">Fuel Log</option>
                    <option value="TOLL">Toll Expense</option>
                    <option value="OTHER">Other Expense</option>
                  </select>
                </div>

                {formData.entryType === 'FUEL' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Liters *</label>
                    <input 
                      type="number" 
                      name="liters" 
                      value={formData.liters}
                      onChange={handleInputChange}
                      required={formData.entryType === 'FUEL'}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Amount / Cost ($) *</label>
                  <input 
                    type="number" 
                    name="amount" 
                    value={formData.amount}
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
