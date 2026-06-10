import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  MapPin,
  Star,
  ThumbsUp,
  ThumbsDown,
  Package,
  Flag,
  Camera,
  Share2,
  Loader2,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Find } from '../types';
import { getFinds, confirmFind } from '../lib/dataService';
import { timeAgo } from '../utils/time';
import StockBadge from '../components/StockBadge';
import Toast from '../components/Toast';

const placeholderColors = [
  'bg-gray-200',
  'bg-gray-300',
  'bg-gray-200',
  'bg-gray-300',
  'bg-gray-200',
];

export default function FindDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [find, setFind] = useState<Find | null | undefined>(undefined); // undefined = loading
  const [toast, setToast] = useState('');
  const [voted, setVoted] = useState<'still-there' | 'gone' | 'found' | null>(null);

  useEffect(() => {
    getFinds().then((finds) => {
      const match = finds.find((f) => f.id === id);
      setFind(match ?? null);
    });
  }, [id]);

  if (find === undefined) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <Loader2 size={28} className="animate-spin mr-2" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!find) {
    return (
      <div className="px-4 py-8 text-center text-gray-400">
        <Package size={48} className="mx-auto mb-3 opacity-30" />
        <p className="font-semibold">Find not found</p>
        <button onClick={() => navigate('/feed')} className="mt-4 text-link font-semibold text-sm">
          Back to Feed
        </button>
      </div>
    );
  }

  const handleConfirm = async (type: 'still-there' | 'gone' | 'found') => {
    setVoted(type);

    // Optimistic UI update
    setFind((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        confirmations:
          type === 'still-there' || type === 'found'
            ? prev.confirmations + 1
            : prev.confirmations,
        verificationStatus:
          type === 'gone' ? 'Reported as Gone' : 'Community Confirmed',
      };
    });

    // Persist to PocketBase (gracefully ignores mock data IDs)
    if (type === 'gone') {
      await confirmFind(find.id, 'down');
    } else {
      await confirmFind(find.id, 'up');
    }

    const messages: Record<string, string> = {
      'still-there': "Thanks! Confirmed it's still there.",
      gone: 'Got it — marked as no longer available.',
      found: 'Awesome! Glad you found it!',
    };
    setToast(messages[type]);
  };

  const photoPlaceholders = Math.max(find.photos.length, 3);

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {/* Back button + share */}
      <div className="flex items-center justify-between px-4 py-3 sticky top-[56px] bg-[#F5F5F5] z-30 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-black font-semibold text-sm"
        >
          <ChevronLeft size={20} />
          Back
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <Share2 size={18} className="text-gray-600" />
        </button>
      </div>

      <div className="px-4 py-4">
        {/* Title */}
        <h1 className="text-2xl font-black text-black mb-1">{find.product.name}</h1>
        <p className="text-xs text-gray-400 mb-4">
          Reported {timeAgo(find.createdAt)} · {find.product.category}
        </p>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden mb-4" style={{ height: '200px' }}>
          <MapContainer
            center={[find.location.lat, find.location.lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '200px', width: '100%', borderRadius: '16px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[find.location.lat, find.location.lng]}>
              <Popup>{find.location.placeName}<br />{find.location.address}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Product card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Stock Status</p>
              <StockBadge status={find.stockStatus} size="md" />
            </div>
            {find.price !== undefined && (
              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Price</p>
                <p className="text-2xl font-black text-black">${find.price.toFixed(2)}</p>
              </div>
            )}
          </div>
          {find.notes && (
            <p className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-3">{find.notes}</p>
          )}
          <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
              {find.sourceType}
            </span>
            <span className="text-xs text-gray-400">
              {find.confirmations} confirmation{find.confirmations !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Photo gallery */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-black">Photos</h2>
            <span className="text-xs text-gray-400">{find.photos.length > 0 ? find.photos.length : 'No photos yet'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: photoPlaceholders }).map((_, idx) => (
              <div
                key={idx}
                className={`${placeholderColors[idx % placeholderColors.length]} rounded-xl aspect-square flex items-center justify-center`}
              >
                <Camera size={20} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Reporter info */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-4 mb-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Reported by</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-black text-sm">
              {find.reporterName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-black text-sm">{find.reporterName}</p>
              <div className="flex items-center gap-1 text-xs text-yellow-500">
                <Star size={12} fill="currentColor" />
                <span className="font-medium">4.8</span>
                <span className="text-gray-400 ml-1">reputation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation buttons */}
        <div className="mb-4">
          <p className="font-bold text-black mb-3">Is this still accurate?</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleConfirm('still-there')}
              disabled={voted !== null}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all text-xs font-semibold ${
                voted === 'still-there'
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-black'
              } disabled:opacity-60`}
            >
              <ThumbsUp size={18} />
              Still There
            </button>
            <button
              onClick={() => handleConfirm('gone')}
              disabled={voted !== null}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all text-xs font-semibold ${
                voted === 'gone'
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-black'
              } disabled:opacity-60`}
            >
              <ThumbsDown size={18} />
              Gone Now
            </button>
            <button
              onClick={() => handleConfirm('found')}
              disabled={voted !== null}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all text-xs font-semibold ${
                voted === 'found'
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-black'
              } disabled:opacity-60`}
            >
              <Package size={18} />
              I Found It!
            </button>
          </div>
        </div>

        {/* Flag */}
        <button className="flex items-center gap-1.5 text-xs text-link hover:opacity-80 transition-opacity mx-auto">
          <Flag size={14} />
          Report inaccurate listing
        </button>
      </div>
    </div>
  );
}
