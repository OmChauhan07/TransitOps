import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Truck, Users, Map, Wrench, Receipt, BarChart3, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
  { name: 'Fleet', path: '/fleet', icon: Truck, roles: ['FLEET_MANAGER'] },
  { name: 'Drivers', path: '/drivers', icon: Users, roles: ['FLEET_MANAGER', 'SAFETY_OFFICER'] },
  { name: 'Trips', path: '/trips', icon: Map, roles: ['FLEET_MANAGER', 'DRIVER'] },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench, roles: ['FLEET_MANAGER'] },
  { name: 'Fuel & Expenses', path: '/expenses', icon: Receipt, roles: ['FLEET_MANAGER', 'FINANCIAL_ANALYST'] },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['FLEET_MANAGER', 'FINANCIAL_ANALYST', 'SAFETY_OFFICER'] },
  { name: 'Settings', path: '/settings', icon: Settings, roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
];

export default function LeftSidebar() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const allowedNavItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <div className="group w-[72px] hover:w-64 transition-all duration-300 ease-in-out border-r border-white/10 bg-[#141416] flex flex-col py-4 shrink-0 overflow-y-auto overflow-x-hidden relative z-50">
      
      {/* Logo Section */}
      <div className="flex items-center px-3 mb-8 w-64">
        <div className="w-12 h-12 bg-brand-accent/20 rounded-xl flex items-center justify-center text-brand-accent shrink-0">
          <Truck className="w-6 h-6 shrink-0" />
        </div>
        <span className="ml-3 font-display font-bold text-xl tracking-tight text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          TransitOps
        </span>
      </div>
      
      {/* Nav Items */}
      <div className="flex flex-col gap-2 w-64 px-3">
        {allowedNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `w-[48px] group-hover:w-full h-12 rounded-xl flex items-center transition-all duration-300 overflow-hidden ${
                isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
            title={item.name}
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 shrink-0" />
            </div>
            <span className="ml-1 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
