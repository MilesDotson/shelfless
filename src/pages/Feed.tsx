import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Find, SourceType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getFinds } from '../lib/dataService';
import FindCard from '../components/FindCard';

type FilterType = 'all' | SourceType;

const filterOptions: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Stores', value: 'store' },
  { label: 'Bodegas', value: 'bodega' },
  { label: 'Garage Sales', value: 'garage sale' },
  { label: 'Flea Markets', value: 'flea market' },
];

export default function Feed() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [finds, setFinds] = useState<Find[]>([]);
  const [loading, setLoading] = useState(true);
  // Keep saved state in localStorage (user-specific preference)
  const [savedIds, setSavedIds] = useLocalStorage<string[]>('shelfless_saved_finds', []);

  useEffect(() => {
    getFinds().then((data) => {
      // Merge saved state from localStorage
      const withSaved = data.map((f) => ({ ...f, saved: savedIds.includes(f.id) }));
      setFinds(withSaved);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setFinds((prev) => prev.map((f) => f.id === id ? { ...f, saved: !f.saved } : f));
  };

  const filtered = finds.filter((f) => {
    const matchesSearch =
      search === '' ||
      f.product.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.placeName.toLowerCase().includes(search.toLowerCase()) ||
      f.location.address.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' || f.sourceType === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* Search bar */}
      <div className="sticky top-[56px] bg-[#F5F5F5] z-30 px-4 pt-4 pb-3 border-b border-gray-200">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-white border border-[#E5E5E5] rounded-xl px-3 py-2.5 shadow-sm">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items, stores..."
              className="flex-1 text-sm outline-none text-black placeholder-gray-400 bg-transparent"
            />
          </div>
          <button className="bg-white border border-[#E5E5E5] rounded-xl px-3 flex items-center shadow-sm hover:bg-gray-50">
            <SlidersHorizontal size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeFilter === opt.value
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 border border-[#E5E5E5] hover:border-gray-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Report CTA */}
        <button
          onClick={() => navigate('/report')}
          className="w-full mb-5 flex items-center justify-center gap-2 border border-dashed border-black rounded-2xl py-3 text-link font-semibold text-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          <Plus size={18} />
          Report a new find
        </button>

        {/* Finds list */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-black">Recent Finds</h2>
          {!loading && <span className="text-xs text-gray-400">{filtered.length} found</span>}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span className="text-sm">Loading finds...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No finds match your search</p>
            <p className="text-xs mt-1">Try different keywords or filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((find) => (
              <FindCard key={find.id} find={find} onToggleSave={handleToggleSave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
