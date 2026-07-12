import { User, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function TopNav() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#141416] shrink-0">
      <div className="font-display font-medium text-white tracking-tight">TransitOps Workspace</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-300">
            {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-gray-400" />}
          </div>
          <span className="text-sm text-gray-300 font-medium">{user.role}</span>
        </div>
        <div className="w-[1px] h-4 bg-white/10" />
        <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" title="Sign out">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
