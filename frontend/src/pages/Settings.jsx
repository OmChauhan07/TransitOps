import React from 'react';
import { Shield, Check, X } from 'lucide-react';

const Settings = () => {
  
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-white">Settings & RBAC</h1>
        <p className="text-gray-400 text-sm mt-1">Manage platform configuration and role-based access control</p>
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Role-Based Access Matrix</h3>
        </div>
        <div className="p-6 text-sm text-gray-400 border-b border-gray-700">
          This read-only matrix outlines the modules available to each user role. Access to these routes is strictly enforced by the platform's security middleware.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Module</th>
                {roles.map(role => (
                  <th key={role} className="px-6 py-4 font-medium text-center">{role.replace('_', ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {modules.map(module => (
                <tr key={module.key} className="hover:bg-[#334155] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{module.key}</td>
                  {roles.map(role => (
                    <td key={role} className="px-6 py-4 text-center">
                      {module.access.includes(role) ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Organization Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
            <input type="text" value="TransitOps Demo Corp" disabled className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Support Email</label>
            <input type="text" value="support@transitops.demo" disabled className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed" />
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">Settings are locked in the demo environment.</div>
      </div>

    </div>
  );
};

export default Settings;
