import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '../store';

export function Layout() {
  const sidebarOpen = useAppStore(s => s.sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarOpen && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
