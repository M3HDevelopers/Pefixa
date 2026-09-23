import { Outlet, useLocation } from 'react-router-dom';
import { TopNav } from './TopNav';
import { MouseFollower } from './MouseFollower';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <MouseFollower />
      <TopNav />
      <main className="pt-14 page-enter" key={location.pathname}>
        <Outlet />
      </main>
    </div>
  );
}
