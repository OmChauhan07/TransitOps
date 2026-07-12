import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
  { name: 'Fleet', path: '/fleet', roles: ['FLEET_MANAGER'] },
  { name: 'Drivers', path: '/drivers', roles: ['FLEET_MANAGER', 'SAFETY_OFFICER'] },
  { name: 'Trips', path: '/trips', roles: ['FLEET_MANAGER', 'DRIVER'] },
  { name: 'Maintenance', path: '/maintenance', roles: ['FLEET_MANAGER'] },
  { name: 'Fuel & Expenses', path: '/expenses', roles: ['FLEET_MANAGER', 'FINANCIAL_ANALYST'] },
  { name: 'Analytics', path: '/analytics', roles: ['FLEET_MANAGER', 'FINANCIAL_ANALYST', 'SAFETY_OFFICER'] },
  { name: 'Settings', path: '/settings', roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
];

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const allowedNavItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Transit<span className="text-blue-500">Ops</span></h1>
        <div className="mt-2 text-xs font-medium text-slate-400 bg-slate-800 inline-block px-2 py-1 rounded">
          {user.role}
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {allowedNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-slate-800 text-slate-300 border border-slate-700 px-4 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all text-sm font-medium"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
