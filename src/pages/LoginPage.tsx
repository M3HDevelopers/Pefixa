import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { RevealSection } from '../components/RevealSection';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login
    console.log('Login:', { email, password });
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-12">
      <RevealSection className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-[13px] text-[#888]">Sign in to your Pefixa account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[12px] text-[#888] font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-3 py-2.5 input-dark text-[13px]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] text-[#888] font-medium mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 input-dark text-[13px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[#333] bg-[#050505]" />
                <span className="text-[11px] text-[#888]">Remember me</span>
              </label>
              <Link to="#" className="text-[11px] text-[#60a5fa] hover:text-[#93c5fd] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="w-full btn-primary py-2.5 text-[13px] font-medium">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[12px] text-[#888]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#60a5fa] hover:text-[#93c5fd] transition-colors font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </RevealSection>
    </div>
  );
}
