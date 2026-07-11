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
  { label: 'Store', value: 'store' },
  { label: 'Bodega', value: 'bodega' },
  { label: 'Garage', value: 'garage sale' },
  { label: 'Flea', value: 'flea market' },
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
      <div className="sticky top-[56px] bg-[#F5F5F5] z-30 px-4 pt-4 pb-3 border-b border-black">
        <div className="mb-3">
          <p className="tape-label text-link">ShelfLess Feed</p>
          <h1 className="tape-title text-3xl">Live Drops</h1>
        </div>
        <div className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 px-3 py-2.5">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tape..."
              className="flex-1 font-mono text-xs font-black uppercase outline-none text-black placeholder-gray-400 bg-transparent"
            />
          </div>
          <button className="bg-white border border-gray-300 px-3 flex items-center hover:border-black">
            <SlidersHorizontal size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`flex-shrink-0 border px-3 py-1.5 font-mono text-[10px] font-black uppercase transition-colors ${
                activeFilter === opt.value
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-black'
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
          className="w-full mb-5 flex items-center justify-center gap-2 border border-black bg-white py-3 font-mono text-xs font-black uppercase text-link hover:bg-gray-100 active:scale-95 transition-all"
        >
          <Plus size={18} />
          Add New Drop
        </button>

        {/* Finds list */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="tape-title text-base">Product Tape</h2>
          {!loading && <span className="tape-label">{filtered.length} listed</span>}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span className="font-mono text-xs font-black uppercase">Loading tape...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-mono text-xs font-black uppercase">No tape entries match</p>
            <p className="text-xs mt-1">Try another product, store, or market</p>
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
