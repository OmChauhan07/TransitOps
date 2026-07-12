import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import LeftSidebar from './LeftSidebar';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-brand-bg text-white overflow-hidden font-sans">
      <LeftSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 flex overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
