import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fuel, Receipt, DollarSign, Droplets, Wrench, Search } from 'lucide-react';
import PageLayout from '../components/app/PageLayout';
import CustomSelect from '../components/CustomSelect';

export default function Expenses() {
  const [logs, setLogs] = useState([]);
  const [costs, setCosts] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [activeTab, setActiveTab] = useState('LOGS'); // 'LOGS' | 'ROLLUP'
  const [logType, setLogType] = useState('FUEL'); // 'FUEL' | 'TOLL' | 'OTHER' (Simplified to FUEL or EXPENSE in UI)

  const [formData, setFormData] = useState({
    vehicleId: '',
    entryType: 'FUEL', // FUEL, TOLL, OTHER
    amount: '',
    liters: ''
  });
  
  const [error, setError] = useState('');
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

  const setUIEntryType = (type) => {
    setLogType(type);
    setFormData({ ...formData, entryType: type === 'FUEL' ? 'FUEL' : 'OTHER' });
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
          type: formData.entryType, // TOLL or OTHER
          amount: formData.amount
        }, getHeaders());
      }

      setFormData({ vehicleId: '', entryType: logType === 'FUEL' ? 'FUEL' : 'OTHER', amount: '', liters: '' });
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

  const getStyleClass = (category) => {
    switch(category) {
      case 'FUEL': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'MAINTENANCE': return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      default: return 'bg-green-500/10 border-green-500/20 text-green-400';
    }
  };

  const filteredLogs = logs.filter(l => filters.vehicleId ? l.vehicleId === filters.vehicleId : true);
  const filteredCosts = costs.filter(c => filters.vehicleId ? c.vehicleId === filters.vehicleId : true);

  const renderInspector = () => {
    return (
      <div className="p-6 flex flex-col h-full overflow-y-auto">
        <h3 className="font-display font-medium text-lg mb-6">New Log Entry</h3>
        
        <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg border border-white/10 shrink-0">
          <button 
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${logType === 'FUEL' ? 'bg-white/10 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setUIEntryType('FUEL')}
          >
            <Fuel className="w-3.5 h-3.5" /> Fuel
          </button>
          <button 
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${logType === 'EXPENSE' ? 'bg-white/10 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setUIEntryType('EXPENSE')}
          >
            <Receipt className="w-3.5 h-3.5" /> Expense
          </button>
        </div>

        <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 h-full min-h-min">
          {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
          
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Vehicle *</label>
              <CustomSelect
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleInputChange}
                placeholder="Select vehicle..."
                options={[
                  { value: '', label: 'Select vehicle...' },
                  ...vehicles.map(v => ({ value: v.id, label: v.registrationNumber }))
                ]}
              />
            </div>
            
            {logType === 'EXPENSE' && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Expense Type *</label>
                <CustomSelect
                  name="entryType"
                  value={formData.entryType}
                  onChange={handleInputChange}
                  placeholder="Expense Type"
                  options={[
                    { value: 'OTHER', label: 'Other Expense' },
                    { value: 'TOLL', label: 'Toll' }
                  ]}
                />
              </div>
            )}

            {logType === 'FUEL' && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Liters *</label>
                <input type="number" name="liters" value={formData.liters} onChange={handleInputChange} required min="0" step="0.1" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white" placeholder="0.0" />
              </div>
            )}
            
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Cost (₹) *</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required min="0" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white" placeholder="0.00" />
            </div>
          </div>

          <button type="submit" className="w-full bg-brand-accent hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg transition-colors mt-8 shadow-[0_0_15px_rgba(245,124,0,0.3)]">
            Submit Log
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
            <button 
              className={`text-lg font-display font-medium transition-colors ${activeTab === 'LOGS' ? 'text-white border-b-2 border-brand-accent pb-2 -mb-[9px]' : 'text-gray-500 hover:text-gray-300 pb-2 -mb-[9px]'}`}
              onClick={() => setActiveTab('LOGS')}
            >
              Recent Logs
            </button>
            <button 
              className={`text-lg font-display font-medium transition-colors ${activeTab === 'ROLLUP' ? 'text-white border-b-2 border-brand-accent pb-2 -mb-[9px]' : 'text-gray-500 hover:text-gray-300 pb-2 -mb-[9px]'}`}
              onClick={() => setActiveTab('ROLLUP')}
            >
              Cost Rollup
            </button>
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
          </div>
        </div>

        <div className="bg-[#141416] border border-white/10 rounded-xl overflow-hidden flex-1 overflow-y-auto">
          {activeTab === 'LOGS' ? (
            <div className="space-y-0 divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No expense logs found.</div>
              ) : (
                filteredLogs.map(log => (
                  <div key={log.id} className="p-4 flex gap-4 items-start transition-colors hover:bg-white/[0.02]">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${getStyleClass(log.category)}`}>
                      {getIcon(log.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{log.vehicle?.registrationNumber || 'N/A'}</span>
                        <span className="text-gray-500 text-xs">• {new Date(log.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-300">{log.description}</p>
                      <div className={`text-xs mt-2 font-medium ${log.category === 'FUEL' ? 'text-blue-400' : log.category === 'MAINTENANCE' ? 'text-orange-400' : 'text-green-400'}`}>
                        {log.category} • ₹{log.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCosts.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500">
                  No vehicle costs found.
                </div>
              ) : (
                filteredCosts.map(cost => (
                  <div key={cost.vehicleId} className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white">{cost.registrationNumber}</h3>
                      <span className="text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded">Rollup</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-400" /> Fuel</span>
                        <span className="text-gray-200">₹{cost.fuelTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><Wrench className="w-4 h-4 text-orange-400" /> Maintenance</span>
                        <span className="text-gray-200">₹{cost.maintenanceTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-400" /> Expenses</span>
                        <span className="text-gray-200">₹{cost.expenseTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-400">Total Ops Cost</span>
                      <span className="text-xl font-bold text-white">₹{cost.totalOperationalCost.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
