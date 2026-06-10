import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Plus, List, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Top bar */}
      <header className="bg-white text-black px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight">
            <span className="text-black">Shelf</span><span className="text-link">Less</span>
          </span>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <User size={18} className="text-black" />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 max-w-md mx-auto w-full">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-gray-200 flex items-center z-50 shadow-lg">
        <div className="max-w-md mx-auto w-full flex items-center justify-around h-full px-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive ? 'text-link' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <Home size={22} />
            <span className="text-[10px] font-medium">Home</span>
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive ? 'text-link' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <Search size={22} />
            <span className="text-[10px] font-medium">Feed</span>
          </NavLink>

          <NavLink
            to="/report"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive ? 'text-link' : 'text-gray-400'
              }`
            }
          >
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-md -mt-5 border-4 border-white">
              <Plus size={24} className="text-white" />
            </div>
            <span className="text-[10px] font-medium mt-0.5">Report</span>
          </NavLink>

          <NavLink
            to="/requests"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive ? 'text-link' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <List size={22} />
            <span className="text-[10px] font-medium">Requests</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive ? 'text-link' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <User size={22} />
            <span className="text-[10px] font-medium">Profile</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
