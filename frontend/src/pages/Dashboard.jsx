import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  CheckCircle,
  Wrench,
  Play,
  FileText,
  Users,
  Activity,
  Plus
} from 'lucide-react';

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

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/dashboard/kpis', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKpis(res.data);
    } catch (err) {
      console.error('Failed to fetch KPIs', err);
    }
  };

  if (!kpis) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Fleet Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time metrics and operations center</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/fleet')}
            className="bg-[#1e293b] hover:bg-[#334155] border border-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Register Vehicle
          </button>
          <button
            onClick={() => navigate('/trips')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
          >
            <Play className="w-4 h-4 mr-2" /> Create Trip
          </button>
          <button
            onClick={() => navigate('/maintenance')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
          >
            <Wrench className="w-4 h-4 mr-2" /> Raise Maintenance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Active Vehicles"
          value={kpis.totalVehicles}
          icon={Truck}
          colorClass="bg-blue-500/10 text-blue-400"
          subtitle=""
        />
        <KPICard
          title="Available for Dispatch"
          value={kpis.availableVehicles}
          icon={CheckCircle}
          colorClass="bg-green-500/10 text-green-400"
        />
        <KPICard
          title="Vehicles In Shop"
          value={kpis.maintenanceVehicles}
          icon={Wrench}
          colorClass="bg-orange-500/10 text-orange-400"
        />
        <KPICard
          title="Fleet Utilization"
          value={`${kpis.fleetUtilization}%`}
          icon={Activity}
          colorClass="bg-purple-500/10 text-purple-400"
          subtitle=""
        />
        <KPICard
          title="Active Trips"
          value={kpis.activeTrips}
          icon={Play}
          colorClass="bg-emerald-500/10 text-emerald-400"
          subtitle=""
        />
        <KPICard
          title="Pending Trips"
          value={kpis.pendingTrips}
          icon={FileText}
          colorClass="bg-yellow-500/10 text-yellow-400"
          subtitle=""
        />
        <KPICard
          title="Drivers On Duty"
          value={kpis.driversOnDuty}
          icon={Users}
          colorClass="bg-indigo-500/10 text-indigo-400"
          subtitle="Available + On Trip"
        />
      </div>

    </div>
  );
};

export default Dashboard;
