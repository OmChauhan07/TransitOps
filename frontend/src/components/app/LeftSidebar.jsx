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
    <div className="w-16 border-r border-white/10 bg-[#141416] flex flex-col items-center py-4 shrink-0">
      <div className="w-10 h-10 bg-brand-accent/20 rounded-xl flex items-center justify-center mb-8 text-brand-accent">
        <Truck className="w-6 h-6" />
      </div>
      
      <div className="flex flex-col gap-4 w-full px-2">
        {allowedNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `w-12 h-12 rounded-xl flex items-center justify-center transition-colors mx-auto ${
                isActive ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`
            }
            title={item.name}
          >
            <item.icon className="w-5 h-5" />
          </NavLink>
        ))}
      </div>
    </div>
  );
}
