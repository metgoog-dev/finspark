import React, { useRef, useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { DollarSign, Users, Home, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../hooks/useAuth';

const SidebarLayout: React.FC = () => {
  const token = useAuthStore(s => s.token);
  const navigate = useNavigate();
  const { user, role, email } = useAuthStore();

  React.useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const logout = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLButtonElement | null>(null);
  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      window.addEventListener('mousedown', handleClick);
      return () => window.removeEventListener('mousedown', handleClick);
    }
  }, [dropdownOpen]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <img src="/finspark-logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Finspark</h1>
            <p className="text-xs text-slate-400">Microfinance</p>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <NavLink to="/dashboard" className={({ isActive }: { isActive: boolean }) => `flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}> <Home className="w-5 h-5"/><span>Dashboard</span> </NavLink>
          <NavLink to="/customers" className={({ isActive }: { isActive: boolean }) => `flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}> <Users className="w-5 h-5"/><span>Customers</span> </NavLink>
          <NavLink to="/loans" className={({ isActive }: { isActive: boolean }) => `flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}> <DollarSign className="w-5 h-5"/><span>Loans</span> </NavLink>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Finspark Microfinance</h2>
          {/* Authenticated user info with dropdown */}
          <div className="flex items-center gap-3 relative">
            <button
              ref={avatarRef}
              type="button"
              className="w-9 h-9 bg-blue-100 flex items-center justify-center rounded-full text-blue-700 font-bold text-lg border border-blue-200 hover:shadow-md focus:outline-none"
              aria-label="Show account options"
              onClick={() => setDropdownOpen(o => !o)}
            >
              {user?.charAt(0).toUpperCase() || <User className="w-5 h-5 text-blue-400" />}
            </button>
            <div>
              <div className="font-semibold text-slate-800 text-sm max-w-[130px] truncate">{user}</div>
              {role && (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium">{role}</span>
              )}
            </div>
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-60 bg-white shadow-2xl rounded-xl border border-slate-100 p-0.5 animate-fade-in z-30">
                <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                    {user?.charAt(0).toUpperCase() || <User className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 leading-tight truncate">{user}</div>
                    {email && <div className="text-xs text-slate-500 leading-tight truncate">{email}</div>}
                    {role && <span className="text-xs text-blue-700 px-2 py-0.5 rounded bg-blue-50 ml-0 mt-0.5 font-medium border border-blue-100">{role}</span>}
                  </div>
                </div>
                <button
                  className="flex items-center w-full text-left px-4 py-3 text-slate-700 hover:bg-blue-50 transition rounded-xl"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default SidebarLayout;
