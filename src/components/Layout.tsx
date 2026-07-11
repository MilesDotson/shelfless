import React from 'react';
import { NavLink, useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Plus, List, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { pathname } = useRouterLocation();
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Top bar */}
      <header className="bg-white text-black px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-black lg:px-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-normal">
            <span className="text-black">Shelf</span><span className="text-link">Less</span>
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-2 font-mono text-xs font-black uppercase">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `border px-4 py-2 transition-colors ${isActive ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-500 hover:border-black hover:text-black'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `border px-4 py-2 transition-colors ${isActive ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-500 hover:border-black hover:text-black'}`
            }
          >
            Feed
          </NavLink>
          <NavLink
            to="/requests"
            className={({ isActive }) =>
              `border px-4 py-2 transition-colors ${isActive ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-500 hover:border-black hover:text-black'}`
            }
          >
            Requests
          </NavLink>
          <button
            onClick={() => navigate('/report')}
            className="border border-black bg-black px-4 py-2 text-white transition-colors hover:bg-gray-900"
          >
            Add Drop
          </button>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 border border-gray-300 bg-white flex items-center justify-center hover:border-black transition-colors"
        >
          <User size={18} className="text-black" />
        </button>
      </header>

      {/* Main content */}
      <main className={`flex-1 w-full ${isHome ? 'lg:max-w-none' : 'max-w-md mx-auto'} pb-20 lg:pb-8`}>
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-black flex items-center z-50 lg:hidden">
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
            <span className="text-[10px] font-black uppercase">Tape</span>
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
            <span className="text-[10px] font-black uppercase">Feed</span>
          </NavLink>

          <NavLink
            to="/report"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive ? 'text-link' : 'text-gray-400'
              }`
            }
          >
            <div className="w-12 h-12 bg-black flex items-center justify-center -mt-5 border-4 border-white">
              <Plus size={24} className="text-white" />
            </div>
            <span className="text-[10px] font-black uppercase mt-0.5">Add</span>
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
            <span className="text-[10px] font-black uppercase">Bids</span>
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
            <span className="text-[10px] font-black uppercase">User</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
