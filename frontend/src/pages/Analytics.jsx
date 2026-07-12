import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Download, TrendingUp, DollarSign, Activity, Percent } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-3xl font-bold text-white">{value}</span>
    </div>
    <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
    {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
  </div>
);

const Analytics = () => {
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

    // Define CSV headers
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

    // Map data to CSV rows
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

    // Construct CSV string
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Trigger download
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
      <div className="p-6 max-w-7xl mx-auto flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Aggregate fleet-wide metrics for KPIs
  const fleetAvgEfficiency = data.length > 0 
    ? (data.reduce((sum, v) => sum + v.fuelEfficiency, 0) / data.filter(v => v.fuelEfficiency > 0).length || 1).toFixed(2)
    : 0;
  
  const fleetTotalRevenue = data.reduce((sum, v) => sum + v.totalRevenue, 0);
  const fleetTotalCost = data.reduce((sum, v) => sum + v.totalOpsCost, 0);
  
  // Prepare data for the chart (filtering out retired or zero-trip vehicles if preferred, but let's show all)
  const chartData = data.map(v => ({
    name: v.registrationNumber,
    Revenue: v.totalRevenue,
    Cost: v.totalOpsCost
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Deep insights into fleet performance and ROI</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Fleet Avg Fuel Efficiency"
          value={`${fleetAvgEfficiency} km/L`}
          icon={Activity}
          colorClass="bg-blue-500/10 text-blue-400"
          subtitle="Across all completed trips"
        />
        <KPICard 
          title="Total Fleet Revenue"
          value={`$${fleetTotalRevenue.toFixed(2)}`}
          icon={TrendingUp}
          colorClass="bg-green-500/10 text-green-400"
          subtitle="Generated from all trips"
        />
        <KPICard 
          title="Total Operational Cost"
          value={`$${fleetTotalCost.toFixed(2)}`}
          icon={DollarSign}
          colorClass="bg-orange-500/10 text-orange-400"
          subtitle="Fuel + Maintenance + Expenses"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Panel */}
        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6">Revenue vs Cost per Vehicle</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cost" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">ROI Calculation</h3>
          <div className="prose prose-invert text-sm text-gray-400">
            <p><strong>Vehicle ROI</strong> is calculated as:</p>
            <div className="bg-[#0f172a] p-3 rounded-lg border border-gray-700 my-3 text-center">
              <code>(Revenue - Ops Cost) / Acquisition Cost</code>
            </div>
            <p className="mt-4">
              <strong>Note:</strong> Since <em>Acquisition Cost</em> is not present in the current schema, we are using a standard assumed baseline of <strong>$50,000</strong> per vehicle for demonstration purposes.
            </p>
            <p className="mt-4">
              Operational Cost (Ops Cost) includes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Fuel Logs</li>
              <li>Maintenance Records</li>
              <li>Tolls & Other Expenses</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Data Table */}
      <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Vehicle Analytics Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Trips</th>
                <th className="px-6 py-4 font-medium">Dist (km)</th>
                <th className="px-6 py-4 font-medium">Efficiency</th>
                <th className="px-6 py-4 font-medium">Ops Cost</th>
                <th className="px-6 py-4 font-medium">Revenue</th>
                <th className="px-6 py-4 font-medium">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No analytics data available.
                  </td>
                </tr>
              ) : (
                data.map(v => (
                  <tr key={v.vehicleId} className="hover:bg-[#334155] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{v.registrationNumber}</div>
                      <div className="text-xs text-gray-500">{v.type}</div>
                    </td>
                    <td className="px-6 py-4">{v.completedTripsCount}</td>
                    <td className="px-6 py-4">{v.totalDistance}</td>
                    <td className="px-6 py-4">
                      {v.fuelEfficiency > 0 ? `${v.fuelEfficiency} km/L` : '-'}
                    </td>
                    <td className="px-6 py-4 font-medium text-orange-400">${v.totalOpsCost.toFixed(2)}</td>
                    <td className="px-6 py-4 font-medium text-emerald-400">${v.totalRevenue.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${v.roi >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
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
  );
};

export default Analytics;
