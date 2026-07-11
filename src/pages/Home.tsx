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
import { LOCATION_SUGGESTIONS } from '../utils/locationSuggestions';
import DesktopHome from './DesktopHome';

const trendingIcons = [Package, ShoppingBag, Droplets, Baby, Zap, Wind];

export default function Home() {
  const navigate = useNavigate();
  const { locationName, setLocationName, locating, locationError, requestLocation, resolveTypedLocation } = useLocation();

  const handleGetStarted = () => {
    navigate('/feed', { state: { location: locationName } });
  };

  const trendingItems = mockRequests.slice(0, 6);

  return (
    <>
    <DesktopHome />
    <div className="px-4 py-5 lg:hidden">
      {/* Hero */}
      <div className="mb-5 border-b border-black pb-5">
        <p className="tape-label mb-2 text-link">ShelfLess Tape / Mobile</p>
        <h1 className="tape-title text-[38px]">
          Find what<br />
          big-box search<br />
          misses.
        </h1>
        <p className="mt-3 font-mono text-xs font-bold uppercase leading-5 text-gray-500">
          Community stock drops, open bids, and neighborhood product signals.
        </p>
      </div>

      {/* Location input */}
      <div className="tape-panel p-4 mb-4">
        <p className="tape-label mb-2">Browser Location</p>
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-black flex-shrink-0" />
          <input
            type="text"
            list="mobile-location-suggestions"
            autoComplete="address-level2"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            onBlur={resolveTypedLocation}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
                resolveTypedLocation();
              }
            }}
            placeholder="Neighborhood or city"
            className="flex-1 bg-transparent font-mono text-xs font-black uppercase outline-none text-black placeholder-gray-400"
          />
          <datalist id="mobile-location-suggestions">
            {LOCATION_SUGGESTIONS.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </div>
        <button
          onClick={requestLocation}
          disabled={locating}
          className="mt-3 flex items-center gap-2 tape-link disabled:opacity-50"
        >
          {locating ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
          {locating ? 'Resolving Position' : 'Set / Grab Position'}
        </button>
        {locationError && (
          <p className="mt-2 font-mono text-[10px] font-black uppercase leading-4 text-red-500">{locationError}</p>
        )}
      </div>

      {/* CTA button */}
      <button
        onClick={handleGetStarted}
        className="w-full tape-button flex items-center justify-center gap-2 mb-6"
      >
        <Search size={20} />
        Open Tape
      </button>

      {/* Trending / Most Desired */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="tape-title text-lg">Top Open Bids</h2>
          <button
            onClick={() => navigate('/requests')}
            className="tape-link"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {trendingItems.map((req, idx) => {
            const Icon = trendingIcons[idx % trendingIcons.length];
            return (
              <button
                key={req.id}
                onClick={() => navigate('/requests')}
                className="tape-panel p-3 flex items-center gap-3 hover:border-black active:scale-95 transition-all text-left"
              >
                <div className="w-10 h-10 border border-gray-300 bg-white flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-black uppercase text-black leading-tight line-clamp-2">{req.productName}</p>
                  <p className="text-[10px] font-mono font-bold uppercase text-gray-400 mt-0.5">{req.responseCount} hunters</p>
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
          className="bg-black text-white p-4 flex flex-col items-start gap-2 hover:bg-gray-900 active:scale-95 transition-all"
        >
          <Search size={22} />
          <span className="font-black uppercase text-sm">Browse Tape</span>
          <span className="font-mono text-xs uppercase opacity-80">Live product drops</span>
        </button>
        <button
          onClick={() => navigate('/report')}
          className="bg-black text-white p-4 flex flex-col items-start gap-2 hover:bg-gray-900 active:scale-95 transition-all"
        >
          <ShoppingBag size={22} />
          <span className="font-black uppercase text-sm">Add Drop</span>
          <span className="font-mono text-xs uppercase opacity-80">Report stock now</span>
        </button>
      </div>
    </div>
    </>
  );
}
