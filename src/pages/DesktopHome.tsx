import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Loader2,
  LocateFixed,
  MapPin,
  PackagePlus,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { getFinds, getRequests } from '../lib/dataService';
import { Find, Request, StockStatus } from '../types';
import { timeAgo } from '../utils/time';

const explorePrompts = ['paper towels', 'baby formula', 'vintage lamp', 'sneakers', 'wipes'];

const stockSignal: Record<StockStatus, { label: string; code: string; color: string }> = {
  'Full Stock': { label: 'FULL', code: '+92', color: 'text-link' },
  'Medium Stock': { label: 'MED', code: '+43', color: 'text-link' },
  'Low Stock': { label: 'LOW', code: '-18', color: 'text-gray-500' },
  'Out of Stock': { label: 'OUT', code: '-100', color: 'text-red-500' },
  Unknown: { label: 'UNK', code: '---', color: 'text-gray-400' },
};

type TickerItem =
  | { kind: 'find'; sortDate: string; find: Find }
  | { kind: 'request'; sortDate: string; request: Request };

function tickerId(index: number) {
  return String(index + 1).padStart(3, '0');
}

export default function DesktopHome() {
  const navigate = useNavigate();
  const { locationName, setLocationName, locating, locationError, requestLocation } = useLocation();
  const [finds, setFinds] = useState<Find[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([getFinds(), getRequests()])
      .then(([findData, requestData]) => {
        if (!active) return;
        setFinds(findData);
        setRequests(requestData);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const tickerItems = useMemo<TickerItem[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const items: TickerItem[] = [
      ...finds.map((find) => ({ kind: 'find' as const, sortDate: find.createdAt, find })),
      ...requests
        .filter((request) => request.status === 'open')
        .map((request) => ({ kind: 'request' as const, sortDate: request.createdAt, request })),
    ];

    return items
      .filter((item) => {
        if (!normalizedQuery) return true;
        if (item.kind === 'find') {
          return [
            item.find.product.name,
            item.find.product.category,
            item.find.location.placeName,
            item.find.location.address,
            item.find.stockStatus,
          ].some((value) => value.toLowerCase().includes(normalizedQuery));
        }

        return [
          item.request.productName,
          item.request.category,
          item.request.searchArea,
          item.request.description,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      })
      .sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
  }, [finds, query, requests]);

  const stats = useMemo(() => {
    const locations = new Set(finds.map((find) => find.location.placeName.toLowerCase())).size;
    const products = new Set(finds.map((find) => find.product.name.toLowerCase())).size;
    const openRequests = requests.filter((request) => request.status === 'open').length;
    return { locations, products, openRequests };
  }, [finds, requests]);

  return (
    <div className="hidden lg:block min-h-[calc(100vh-57px)] bg-[#F5F5F5] text-black">
      <div className="grid min-h-[calc(100vh-57px)] grid-cols-[minmax(0,1fr)_390px] border-t border-gray-200">
        <section className="min-w-0 border-r border-gray-300 bg-white">
          <div className="sticky top-[57px] z-20 border-b border-black bg-white">
            <div className="grid grid-cols-[88px_minmax(0,1fr)_150px_120px_100px] items-end gap-4 px-5 py-4">
              <div className="font-mono text-xs font-bold uppercase text-gray-400">Index</div>
              <div>
                <h1 className="text-[44px] font-black uppercase leading-none tracking-normal">ShelfLess Tape</h1>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Live product library / community demand / neighborhood stock
                </p>
              </div>
              <div className="text-right font-mono text-xs font-bold uppercase text-gray-400">Market</div>
              <div className="text-right font-mono text-xs font-bold uppercase text-gray-400">Signal</div>
              <div className="text-right font-mono text-xs font-bold uppercase text-gray-400">Age</div>
            </div>
          </div>

          <div className="border-b border-gray-300 bg-[#F5F5F5] px-5 py-3">
            <div className="flex items-center gap-3">
              <Search size={16} className="text-gray-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="SEARCH THE TAPE: product, store, request, neighborhood"
                className="min-w-0 flex-1 bg-transparent font-mono text-sm font-bold uppercase text-black outline-none placeholder-gray-400"
              />
              <button onClick={() => navigate('/feed')} className="text-xs font-black uppercase text-link">
                Full Feed <ArrowUpRight className="inline" size={13} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-[520px] items-center justify-center font-mono text-sm font-bold uppercase text-gray-400">
              <Loader2 className="mr-2 animate-spin" size={18} />
              Loading Tape
            </div>
          ) : (
            <div>
              {tickerItems.map((item, index) => {
                if (item.kind === 'request') {
                  const request = item.request;
                  return (
                    <button
                      key={`request-${request.id}`}
                      onClick={() => navigate('/requests')}
                      className="grid w-full grid-cols-[88px_minmax(0,1fr)_150px_120px_100px] items-center gap-4 border-b border-gray-300 px-5 py-4 text-left transition-colors hover:bg-black hover:text-white"
                    >
                      <span className="font-mono text-sm font-black text-gray-400">#{tickerId(index)}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-2xl font-black uppercase leading-none">{request.productName}</span>
                        <span className="mt-1 block truncate font-mono text-xs font-bold uppercase text-gray-500">
                          BID / {request.searchArea || 'ANYWHERE'} / {request.category}
                        </span>
                      </span>
                      <span className="text-right font-mono text-sm font-black uppercase">
                        {request.reward ? `$${request.reward.toFixed(0)} REWARD` : 'OPEN REQ'}
                      </span>
                      <span className="text-right font-mono text-sm font-black uppercase text-link">{request.urgency}</span>
                      <span className="text-right font-mono text-xs font-bold uppercase text-gray-500">{timeAgo(request.createdAt)}</span>
                    </button>
                  );
                }

                const find = item.find;
                const signal = stockSignal[find.stockStatus];
                return (
                  <button
                    key={`find-${find.id}`}
                    onClick={() => navigate(`/find/${find.id}`)}
                    className="grid w-full grid-cols-[88px_minmax(0,1fr)_150px_120px_100px] items-center gap-4 border-b border-gray-300 px-5 py-4 text-left transition-colors hover:bg-black hover:text-white"
                  >
                    <span className="font-mono text-sm font-black text-gray-400">#{tickerId(index)}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-2xl font-black uppercase leading-none">{find.product.name}</span>
                      <span className="mt-1 block truncate font-mono text-xs font-bold uppercase text-gray-500">
                        {find.location.placeName} / {find.product.category} / {find.sourceType}
                      </span>
                    </span>
                    <span className="text-right font-mono text-sm font-black uppercase">
                      {find.price === undefined ? 'ASK --' : `$${find.price.toFixed(2)}`}
                    </span>
                    <span className={`text-right font-mono text-sm font-black uppercase ${signal.color}`}>
                      {signal.label} {signal.code}
                    </span>
                    <span className="text-right font-mono text-xs font-bold uppercase text-gray-500">{timeAgo(find.createdAt)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <aside className="min-w-0 bg-[#F5F5F5]">
          <div className="sticky top-[57px] min-h-[calc(100vh-57px)] border-l border-white">
            <div className="border-b border-black bg-white px-5 py-5">
              <p className="font-mono text-xs font-black uppercase tracking-wide text-link">Explore / Add Tool</p>
              <h2 className="mt-2 text-4xl font-black uppercase leading-none tracking-normal">
                Find what big-box search misses.
              </h2>
            </div>

            <div className="border-b border-gray-300 px-5 py-4">
              <p className="mb-2 font-mono text-xs font-black uppercase text-gray-500">Browser Location</p>
              <div className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-3">
                <MapPin size={16} className="shrink-0 text-black" />
                <input
                  value={locationName}
                  onChange={(event) => setLocationName(event.target.value)}
                  placeholder="NEIGHBORHOOD OR CITY"
                  className="min-w-0 flex-1 bg-transparent font-mono text-sm font-bold uppercase text-black outline-none placeholder-gray-400"
                />
              </div>
              <button
                onClick={requestLocation}
                disabled={locating}
                className="mt-3 flex items-center gap-2 font-mono text-xs font-black uppercase text-link disabled:opacity-50"
              >
                {locating ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
                {locating ? 'Resolving Position' : 'Set / Grab Position'}
              </button>
              {locationError && (
                <p className="mt-2 font-mono text-[10px] font-black uppercase leading-4 text-red-500">{locationError}</p>
              )}
            </div>

            <div className="grid grid-cols-3 border-b border-gray-300 bg-white">
              <div className="border-r border-gray-300 px-4 py-4">
                <p className="font-mono text-xs font-black uppercase text-gray-400">Products</p>
                <p className="mt-2 text-3xl font-black">{stats.products}</p>
              </div>
              <div className="border-r border-gray-300 px-4 py-4">
                <p className="font-mono text-xs font-black uppercase text-gray-400">Places</p>
                <p className="mt-2 text-3xl font-black">{stats.locations}</p>
              </div>
              <div className="px-4 py-4">
                <p className="font-mono text-xs font-black uppercase text-gray-400">Bids</p>
                <p className="mt-2 text-3xl font-black">{stats.openRequests}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 border-b border-gray-300">
              <button
                onClick={() => navigate('/report')}
                className="border-r border-gray-300 bg-black px-5 py-6 text-left text-white hover:bg-gray-900"
              >
                <PackagePlus size={22} />
                <span className="mt-5 block text-2xl font-black uppercase leading-none">Add Product</span>
                <span className="mt-2 block font-mono text-xs font-bold uppercase text-gray-300">Report stock now</span>
              </button>
              <button
                onClick={() => navigate('/requests/new')}
                className="bg-white px-5 py-6 text-left text-black hover:bg-gray-100"
              >
                <ShoppingBag size={22} />
                <span className="mt-5 block text-2xl font-black uppercase leading-none">Post Bid</span>
                <span className="mt-2 block font-mono text-xs font-bold uppercase text-gray-500">Request a hunt</span>
              </button>
            </div>

            <div className="border-b border-gray-300 px-5 py-4">
              <p className="mb-3 font-mono text-xs font-black uppercase text-gray-500">Quick Tape Filters</p>
              <div className="grid grid-cols-1">
                {explorePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setQuery(prompt)}
                    className="flex items-center justify-between border-t border-gray-300 py-3 text-left first:border-t-0"
                  >
                    <span className="font-mono text-sm font-black uppercase">{prompt}</span>
                    <span className="font-mono text-xs font-black text-link">OPEN</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 py-4">
              <p className="mb-3 font-mono text-xs font-black uppercase text-gray-500">Recent Drops</p>
              {finds.slice(0, 5).map((find, index) => (
                <button
                  key={find.id}
                  onClick={() => navigate(`/find/${find.id}`)}
                  className="grid w-full grid-cols-[44px_minmax(0,1fr)_54px] border-t border-gray-300 py-3 text-left first:border-t-0"
                >
                  <span className="font-mono text-xs font-black text-gray-400">#{tickerId(index)}</span>
                  <span className="min-w-0 truncate font-mono text-xs font-black uppercase">{find.product.name}</span>
                  <span className="text-right font-mono text-xs font-black text-gray-500">{stockSignal[find.stockStatus].label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
