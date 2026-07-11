import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Boxes,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  PackagePlus,
  Search,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import FindCard from '../components/FindCard';
import RequestCard from '../components/RequestCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLocation } from '../context/LocationContext';
import { getFinds, getRequests } from '../lib/dataService';
import { Find, Request } from '../types';
import { timeAgo } from '../utils/time';

const explorePrompts = [
  'Paper towels',
  'Baby formula',
  'Vintage lamps',
  'Disinfectant wipes',
  'Sneakers',
];

export default function DesktopHome() {
  const navigate = useNavigate();
  const { locationName, setLocationName, locating, requestLocation } = useLocation();
  const [finds, setFinds] = useState<Find[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savedIds, setSavedIds] = useLocalStorage<string[]>('shelfless_saved_finds', []);

  useEffect(() => {
    let active = true;

    Promise.all([getFinds(), getRequests()])
      .then(([findData, requestData]) => {
        if (!active) return;
        setFinds(findData.map((find) => ({ ...find, saved: savedIds.includes(find.id) })));
        setRequests(requestData);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // savedIds is intentionally applied on initial dashboard load. Card toggles update local state below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredFinds = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return finds;

    return finds.filter((find) =>
      [
        find.product.name,
        find.product.category,
        find.location.placeName,
        find.location.address,
        find.sourceType,
      ].some((value) => value.toLowerCase().includes(q))
    );
  }, [finds, search]);

  const libraryStats = useMemo(() => {
    const uniqueProducts = new Set(finds.map((find) => find.product.name.toLowerCase())).size;
    const liveLocations = new Set(finds.map((find) => find.location.placeName.toLowerCase())).size;
    const confirmed = finds.filter((find) =>
      ['Photo Verified', 'Recently Confirmed', 'Community Confirmed'].includes(find.verificationStatus)
    ).length;

    return { uniqueProducts, liveLocations, confirmed };
  }, [finds]);

  const recentFinds = filteredFinds.slice(0, 8);
  const activeRequests = requests.filter((request) => request.status === 'open').slice(0, 3);

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
    );
    setFinds((prev) => prev.map((find) => (find.id === id ? { ...find, saved: !find.saved } : find)));
  };

  return (
    <div className="hidden lg:block px-8 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)] gap-6">
        <section className="min-w-0">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-link">
                <Boxes size={15} />
                Product Library
              </p>
              <h1 className="text-4xl font-black leading-tight text-black">New products added nearby</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Live ShelfLess submissions from stores, bodegas, garage sales, and community spots.
              </p>
            </div>
            <button
              onClick={() => navigate('/feed')}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-black hover:border-black"
            >
              Full feed
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Products</p>
              <p className="mt-2 text-3xl font-black text-black">{libraryStats.uniqueProducts}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Locations</p>
              <p className="mt-2 text-3xl font-black text-black">{libraryStats.liveLocations}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Confirmed</p>
              <p className="mt-2 text-3xl font-black text-black">{libraryStats.confirmed}</p>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
            <Search size={18} className="text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter library by product, store, category, or neighborhood..."
              className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder-gray-400"
            />
          </div>

          {loading ? (
            <div className="flex h-80 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-400">
              <Loader2 className="mr-2 animate-spin" size={22} />
              Loading library activity...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {recentFinds.map((find) => (
                <FindCard key={find.id} find={find} onToggleSave={handleToggleSave} />
              ))}
            </div>
          )}
        </section>

        <aside className="min-w-0">
          <div className="sticky top-[88px] space-y-4">
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-link">
                    <Sparkles size={15} />
                    ShelfLess Explore
                  </p>
                  <h2 className="text-2xl font-black leading-tight text-black">Explore and add a find</h2>
                </div>
                <div className="rounded-2xl bg-gray-100 p-3">
                  <PackagePlus size={24} className="text-black" />
                </div>
              </div>

              <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Current area</p>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="shrink-0 text-black" />
                  <input
                    value={locationName}
                    onChange={(event) => setLocationName(event.target.value)}
                    placeholder="Enter a city or neighborhood"
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={requestLocation}
                  disabled={locating}
                  className="mt-3 flex items-center gap-2 text-xs font-bold text-link disabled:opacity-50"
                >
                  {locating ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                  {locating ? 'Getting browser location...' : 'Use browser location'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/report')}
                  className="rounded-2xl bg-black p-4 text-left text-white transition-colors hover:bg-gray-900"
                >
                  <PackagePlus size={22} />
                  <span className="mt-4 block text-sm font-black">Add product</span>
                  <span className="mt-1 block text-xs text-gray-300">Report shelf, sale, or store stock</span>
                </button>
                <button
                  onClick={() => navigate('/requests/new')}
                  className="rounded-2xl border border-gray-200 bg-white p-4 text-left text-black transition-colors hover:border-black"
                >
                  <ShoppingBag size={22} />
                  <span className="mt-4 block text-sm font-black">Post request</span>
                  <span className="mt-1 block text-xs text-gray-500">Ask the community to hunt</span>
                </button>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Quick explore</p>
                <div className="flex flex-wrap gap-2">
                  {explorePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setSearch(prompt)}
                      className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-black hover:text-black"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-black text-black">Open community requests</h3>
                <button
                  onClick={() => navigate('/requests')}
                  className="text-xs font-bold text-link hover:opacity-80"
                >
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {activeRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-black">
                <Clock size={17} />
                Latest library activity
              </div>
              <div className="mt-3 space-y-3">
                {finds.slice(0, 4).map((find) => (
                  <button
                    key={find.id}
                    onClick={() => navigate(`/find/${find.id}`)}
                    className="flex w-full items-center justify-between gap-3 border-t border-gray-100 pt-3 text-left first:border-t-0 first:pt-0"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-black">{find.product.name}</span>
                      <span className="block truncate text-xs text-gray-500">{find.location.placeName}</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-gray-400">{timeAgo(find.createdAt)}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
