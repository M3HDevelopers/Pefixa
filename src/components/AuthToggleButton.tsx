import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export function AuthToggleButton() {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  
  // Hide on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <div 
      className="fixed right-6 top-24 z-40 auth-toggle-button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center bg-[#0a0a0a] border border-[#1a1a1a] rounded-full overflow-hidden shadow-lg hover:border-[#333] transition-all duration-300">
        {/* Sign In Button */}
        <Link
          to="/login"
          className={`flex items-center gap-2 px-5 py-3 text-[13px] font-medium transition-all duration-300 ${
            location.pathname === '/login'
              ? 'bg-white text-black'
              : 'text-[#888] hover:text-white hover:bg-white/5'
          }`}
        >
          <LogIn size={16} className={isHovered ? 'animate-pulse-icon' : ''} />
          <span>Sign In</span>
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-[#1a1a1a]" />

        {/* Sign Up Button */}
        <Link
          to="/register"
          className={`flex items-center gap-2 px-5 py-3 text-[13px] font-medium transition-all duration-300 ${
            location.pathname === '/register'
              ? 'bg-white text-black'
              : 'text-[#888] hover:text-white hover:bg-white/5'
          }`}
        >
          <UserPlus size={16} className={isHovered ? 'animate-pulse-icon' : ''} />
          <span>Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
