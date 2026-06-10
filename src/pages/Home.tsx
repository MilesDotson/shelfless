import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Search,
  Package,
  ShoppingBag,
  Droplets,
  Baby,
  Zap,
  Wind,
  Loader2,
} from 'lucide-react';
import { mockRequests } from '../data/mockData';
import { useLocation } from '../context/LocationContext';

const trendingIcons = [Package, ShoppingBag, Droplets, Baby, Zap, Wind];

export default function Home() {
  const navigate = useNavigate();
  const { locationName, setLocationName, locating, requestLocation } = useLocation();

  const handleGetStarted = () => {
    navigate('/feed', { state: { location: locationName } });
  };

  const trendingItems = mockRequests.slice(0, 6);

  return (
    <div className="px-4 py-6">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black leading-tight mb-2">
          Find what<br />
          <span className="text-black">big-box search</span><br />
          misses.
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Community-powered finds at bodegas, garage sales, flea markets & more — right in your neighborhood.
        </p>
      </div>

      {/* Location input */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Your Location</p>
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-black flex-shrink-0" />
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Enter your neighborhood or city..."
            className="flex-1 text-sm outline-none text-black placeholder-gray-400"
          />
        </div>
        <button
          onClick={requestLocation}
          disabled={locating}
          className="mt-3 flex items-center gap-2 text-link text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {locating ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
          {locating ? 'Getting location...' : 'Use my current location'}
        </button>
      </div>

      {/* CTA button */}
      <button
        onClick={handleGetStarted}
        className="w-full bg-black text-white font-bold py-4 rounded-2xl text-base shadow-md hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center gap-2 mb-8"
      >
        <Search size={20} />
        Get Started
      </button>

      {/* Trending / Most Desired */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-black">Most Desired Items</h2>
          <button
            onClick={() => navigate('/requests')}
            className="text-link text-xs font-semibold hover:opacity-80"
          >
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {trendingItems.map((req, idx) => {
            const Icon = trendingIcons[idx % trendingIcons.length];
            return (
              <button
                key={req.id}
                onClick={() => navigate('/requests')}
                className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-3 flex items-center gap-3 hover:border-gray-400 active:scale-95 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-black leading-tight line-clamp-2">{req.productName}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{req.responseCount} hunters</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/feed')}
          className="bg-black text-white rounded-2xl p-4 flex flex-col items-start gap-2 shadow-sm hover:bg-gray-900 active:scale-95 transition-all"
        >
          <Search size={22} />
          <span className="font-bold text-sm">Browse Finds</span>
          <span className="text-xs opacity-80">See what's been spotted nearby</span>
        </button>
        <button
          onClick={() => navigate('/report')}
          className="bg-black text-white rounded-2xl p-4 flex flex-col items-start gap-2 shadow-sm hover:bg-gray-900 active:scale-95 transition-all"
        >
          <ShoppingBag size={22} />
          <span className="font-bold text-sm">Report a Find</span>
          <span className="text-xs opacity-80">Help your community shop smarter</span>
        </button>
      </div>
    </div>
  );
}
