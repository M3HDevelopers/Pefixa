import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav />
      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
}
