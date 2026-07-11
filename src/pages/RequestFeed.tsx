import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MapPin, Loader2 } from 'lucide-react';
import { Request } from '../types';
import { getRequests } from '../lib/dataService';
import RequestCard from '../components/RequestCard';
import Toast from '../components/Toast';

export default function RequestFeed() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    getRequests().then((data) => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  const handleClaim = (id: string) => {
    // Optimistic local update (no PocketBase write for claims yet)
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: 'in-progress', responseCount: r.responseCount + 1 } : r)
    );
    setToast('Hunt claimed! The requester has been notified.');
  };

  const filtered = requests.filter((r) =>
    search === '' ||
    r.productName.toLowerCase().includes(search.toLowerCase()) ||
    r.searchArea.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  const openRequests = filtered.filter((r) => r.status === 'open' || r.status === 'in-progress');

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {/* Header */}
      <div className="sticky top-[56px] bg-[#F5F5F5] z-30 px-4 pt-4 pb-3 border-b border-black">
        <p className="tape-label text-link">Community Demand</p>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-black" />
          <h1 className="tape-title text-3xl">Open Bids</h1>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2.5">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bids..."
            className="flex-1 font-mono text-xs font-black uppercase outline-none text-black placeholder-gray-400 bg-transparent"
          />
        </div>
      </div>

      <div className="px-4 py-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          {loading ? (
            <span className="tape-label">Loading...</span>
          ) : (
            <span className="tape-label">{openRequests.length} open bid{openRequests.length !== 1 ? 's' : ''}</span>
          )}
          <button
            onClick={() => navigate('/requests/new')}
            className="tape-link"
          >
            + Post Bid
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span className="font-mono text-xs font-black uppercase">Loading bids...</span>
          </div>
        ) : openRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-mono text-xs font-black uppercase">No open bids found</p>
            <p className="text-xs mt-1">Try another product or post a bid</p>
          </div>
        ) : (
          <div className="space-y-3">
            {openRequests.map((req) => (
              <RequestCard key={req.id} request={req} onClaim={handleClaim} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/requests/new')}
        className="fixed bottom-20 right-4 w-14 h-14 bg-black text-white border-4 border-white flex items-center justify-center hover:bg-gray-900 active:scale-95 transition-all z-40"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
