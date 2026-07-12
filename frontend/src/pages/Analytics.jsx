import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Download } from 'lucide-react';
import PageLayout from '../components/app/PageLayout';

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/analytics/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;

    const headers = [
      'Vehicle ID',
      'Registration',
      'Type',
      'Status',
      'Total Distance (km)',
      'Total Fuel (L)',
      'Fuel Efficiency (km/L)',
      'Total Ops Cost ($)',
      'Total Revenue ($)',
      'ROI (%)',
      'Completed Trips'
    ];

    const csvRows = data.map(v => [
      v.vehicleId,
      v.registrationNumber,
      v.type,
      v.status,
      v.totalDistance,
      v.totalFuelConsumed,
      v.fuelEfficiency,
      v.totalOpsCost,
      v.totalRevenue,
      v.roi,
      v.completedTripsCount
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fleet_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
        </div>
      </PageLayout>
    );
  }

  const fleetAvgEfficiency = data.length > 0 
    ? (data.reduce((sum, v) => sum + v.fuelEfficiency, 0) / data.filter(v => v.fuelEfficiency > 0).length || 1).toFixed(2)
    : 0;
  
  const fleetTotalRevenue = data.reduce((sum, v) => sum + v.totalRevenue, 0);
  const fleetTotalCost = data.reduce((sum, v) => sum + v.totalOpsCost, 0);
  
  const chartData = data.map(v => ({
    name: v.registrationNumber,
    Revenue: v.totalRevenue,
    Cost: v.totalOpsCost
  }));

  const renderInspector = () => (
    <div className="p-6 flex flex-col h-full bg-[#141416] overflow-y-auto">
      <h3 className="font-display font-medium text-lg mb-8">KPI Summary</h3>
      
      <div className="space-y-8 flex-1">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Revenue</div>
          <div className="text-3xl font-display font-medium text-white tracking-tight">${fleetTotalRevenue.toFixed(0)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Ops Cost</div>
          <div className="text-3xl font-display font-medium text-orange-400 tracking-tight">${fleetTotalCost.toFixed(0)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Avg Fuel Efficiency</div>
          <div className="text-3xl font-display font-medium text-white tracking-tight">{fleetAvgEfficiency} <span className="text-lg text-gray-500">km/L</span></div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10 text-sm text-gray-400">
        <h4 className="font-medium text-white mb-2">ROI Calculation</h4>
        <p className="mb-2"><strong>Vehicle ROI</strong> is calculated as:</p>
        <div className="bg-white/5 p-3 rounded-lg border border-white/10 mb-4 font-mono text-xs text-center text-gray-300">
          (Revenue - Ops Cost) / Acq. Cost
        </div>
        <p className="text-xs">
          Ops Cost includes Fuel Logs, Maintenance Records, and Tolls/Expenses.
        </p>
      </div>
    </div>
  );

  return (
    <PageLayout inspector={renderInspector()}>
      <div className="flex flex-col h-full overflow-y-auto pr-2">
        <div className="flex justify-between items-center mb-8 shrink-0">
          <h2 className="text-2xl font-display font-medium">Telemetry & Analytics</h2>
          <button 
            onClick={handleExportCSV}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm font-medium border border-white/10"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>
        
        <div className="flex-1 flex flex-col gap-8">
          <div className="min-h-[300px] w-full bg-[#141416] p-6 rounded-xl border border-white/10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#52525b" tick={{fill: '#a1a1aa', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" tick={{fill: '#a1a1aa', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141416', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cost" fill="#f57c00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#141416] border border-white/10 rounded-xl overflow-hidden shrink-0">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium text-white">Vehicle Analytics Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">Vehicle</th>
                    <th className="px-6 py-3 font-medium">Trips</th>
                    <th className="px-6 py-3 font-medium">Dist (km)</th>
                    <th className="px-6 py-3 font-medium">Efficiency</th>
                    <th className="px-6 py-3 font-medium">Ops Cost</th>
                    <th className="px-6 py-3 font-medium">Revenue</th>
                    <th className="px-6 py-3 font-medium">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No analytics data available.</td>
                    </tr>
                  ) : (
                    data.map(v => (
                      <tr key={v.vehicleId} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{v.registrationNumber}</div>
                          <div className="text-xs text-gray-500">{v.type}</div>
                        </td>
                        <td className="px-6 py-4">{v.completedTripsCount}</td>
                        <td className="px-6 py-4">{v.totalDistance}</td>
                        <td className="px-6 py-4">{v.fuelEfficiency > 0 ? `${v.fuelEfficiency} km/L` : '-'}</td>
                        <td className="px-6 py-4 font-medium text-orange-400">${v.totalOpsCost.toFixed(2)}</td>
                        <td className="px-6 py-4 font-medium text-emerald-400">${v.totalRevenue.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${v.roi >= 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {v.roi}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
