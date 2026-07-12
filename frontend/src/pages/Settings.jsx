import React from 'react';
import { Shield, Check, X, Building2 } from 'lucide-react';
import PageLayout from '../components/app/PageLayout';

export default function Settings() {
  
  const roles = ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];
  const modules = [
    { key: 'Dashboard', access: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { key: 'Fleet Registry', access: ['FLEET_MANAGER'] },
    { key: 'Driver Profiles', access: ['FLEET_MANAGER', 'SAFETY_OFFICER'] },
    { key: 'Trip Dispatch', access: ['FLEET_MANAGER', 'DRIVER'] },
    { key: 'Maintenance', access: ['FLEET_MANAGER'] },
    { key: 'Fuel & Expenses', access: ['FLEET_MANAGER', 'FINANCIAL_ANALYST'] },
    { key: 'Analytics', access: ['FLEET_MANAGER', 'FINANCIAL_ANALYST', 'SAFETY_OFFICER'] },
    { key: 'Settings', access: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
  ];

  const renderInspector = () => (
    <div className="p-6 flex flex-col h-full bg-[#141416]">
      <div className="flex items-center gap-2 mb-8">
        <Building2 className="w-5 h-5 text-brand-accent" />
        <h3 className="font-display font-medium text-lg">Organization Profile</h3>
      </div>
      
      <div className="space-y-6 flex-1">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Company Name</label>
          <input type="text" value="TransitOps Demo Corp" disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Support Email</label>
          <input type="text" value="support@transitops.demo" disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
        </div>
        
        <div className="p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-lg">
          <p className="text-xs text-brand-accent font-medium">Demo Environment</p>
          <p className="text-xs text-brand-accent/70 mt-1">
            Organization settings are locked in the current demo environment.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout inspector={renderInspector()}>
      <div className="flex flex-col h-full overflow-y-auto pr-2">
        <div className="mb-8 shrink-0">
          <h2 className="text-2xl font-display font-medium mb-1">Settings & RBAC</h2>
          <p className="text-sm text-gray-400">Manage platform configuration and role-based access control</p>
        </div>

        <div className="bg-[#141416] border border-white/10 rounded-xl overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="p-6 border-b border-white/10 flex items-center gap-3 shrink-0">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-medium text-white">Role-Based Access Matrix</h3>
          </div>
          <div className="px-6 py-4 text-sm text-gray-400 border-b border-white/10 bg-white/[0.02] shrink-0">
            This read-only matrix outlines the modules available to each user role. Access to these routes is strictly enforced by the platform's security middleware.
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 font-medium">Module</th>
                  {roles.map(role => (
                    <th key={role} className="px-6 py-3 font-medium text-center text-xs tracking-wider">{role.replace('_', ' ')}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {modules.map(module => (
                  <tr key={module.key} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{module.key}</td>
                    {roles.map(role => (
                      <td key={role} className="px-6 py-4 text-center">
                        {module.access.includes(role) ? (
                          <div className="flex justify-center"><Check className="w-4 h-4 text-green-400" /></div>
                        ) : (
                          <div className="flex justify-center"><X className="w-4 h-4 text-gray-600" /></div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
