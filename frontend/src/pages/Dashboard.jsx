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
  Plus,
  ArrowRight
} from 'lucide-react';
import PageLayout from '../components/app/PageLayout';

const KPICard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-3xl font-display font-medium text-white">{value}</span>
    </div>
    <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
    {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
  </div>
);

export default function Dashboard() {
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
      <PageLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
        </div>
      </PageLayout>
    );
  }

  const renderInspector = () => (
    <div className="p-6 flex flex-col h-full bg-[#141416]">
      <h3 className="font-display font-medium text-lg mb-6">Quick Actions</h3>
      
      <div className="space-y-3 flex-1">
        <button
          onClick={() => navigate('/trips')}
          className="w-full bg-brand-accent hover:bg-orange-500 text-white font-medium p-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(245,124,0,0.3)] flex items-center justify-between group"
        >
          <div className="flex items-center">
            <Play className="w-5 h-5 mr-3" />
            <span className="text-sm">Create Trip</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>

        <button
          onClick={() => navigate('/fleet')}
          className="w-full bg-white/5 hover:bg-white/10 text-white font-medium p-4 rounded-xl transition-colors border border-white/10 flex items-center justify-between group"
        >
          <div className="flex items-center">
            <Plus className="w-5 h-5 mr-3 text-blue-400" />
            <span className="text-sm">Register Vehicle</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>

        <button
          onClick={() => navigate('/maintenance')}
          className="w-full bg-white/5 hover:bg-white/10 text-white font-medium p-4 rounded-xl transition-colors border border-white/10 flex items-center justify-between group"
        >
          <div className="flex items-center">
            <Wrench className="w-5 h-5 mr-3 text-orange-400" />
            <span className="text-sm">Raise Maintenance</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10 text-sm text-gray-400">
        <h4 className="font-medium text-white mb-2">Fleet Status</h4>
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span>Active</span>
          <span className="text-white">{kpis.totalVehicles}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span>Available</span>
          <span className="text-green-400">{kpis.availableVehicles}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span>In Shop</span>
          <span className="text-orange-400">{kpis.maintenanceVehicles}</span>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout inspector={renderInspector()}>
      <div className="flex flex-col h-full overflow-y-auto pr-2">
        <div className="mb-8 shrink-0">
          <h2 className="text-2xl font-display font-medium mb-1">Fleet Overview</h2>
          <p className="text-sm text-gray-400">Real-time metrics and operations center</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard
            title="Total Active Vehicles"
            value={kpis.totalVehicles}
            icon={Truck}
            colorClass="bg-blue-500/10 text-blue-400 border border-blue-500/20"
          />
          <KPICard
            title="Available for Dispatch"
            value={kpis.availableVehicles}
            icon={CheckCircle}
            colorClass="bg-green-500/10 text-green-400 border border-green-500/20"
          />
          <KPICard
            title="Vehicles In Shop"
            value={kpis.maintenanceVehicles}
            icon={Wrench}
            colorClass="bg-orange-500/10 text-orange-400 border border-orange-500/20"
          />
          <KPICard
            title="Fleet Utilization"
            value={`${kpis.fleetUtilization}%`}
            icon={Activity}
            colorClass="bg-purple-500/10 text-purple-400 border border-purple-500/20"
          />
          <KPICard
            title="Active Trips"
            value={kpis.activeTrips}
            icon={Play}
            colorClass="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          />
          <KPICard
            title="Pending Trips"
            value={kpis.pendingTrips}
            icon={FileText}
            colorClass="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
          />
          <KPICard
            title="Drivers On Duty"
            value={kpis.driversOnDuty}
            icon={Users}
            colorClass="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            subtitle="Available + On Trip"
          />
        </div>
      </div>
    </PageLayout>
  );
}
