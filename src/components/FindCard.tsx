import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, Share2, Clock, CheckCircle, Camera } from 'lucide-react';
import { Find } from '../types';
import { timeAgo } from '../utils/time';
import StockBadge from './StockBadge';

interface FindCardProps {
  find: Find;
  onToggleSave: (id: string) => void;
}

const verificationColor: Record<string, string> = {
  'Unverified': 'text-gray-400',
  'Photo Verified': 'text-link',
  'Recently Confirmed': 'text-link',
  'Community Confirmed': 'text-link',
  'Stale': 'text-gray-400',
  'Reported as Gone': 'text-red-500',
};

const sourceTypeLabel: Record<string, string> = {
  store: 'Store',
  bodega: 'Bodega',
  'garage sale': 'Garage Sale',
  'flea market': 'Flea Market',
  'pop-up': 'Pop-Up',
  'estate sale': 'Estate Sale',
  'online pickup': 'Online Pickup',
  other: 'Other',
};

export default function FindCard({ find, onToggleSave }: FindCardProps) {
  const navigate = useNavigate();

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Found: ${find.product.name}`,
        text: `${find.product.name} spotted at ${find.location.placeName} — ${find.stockStatus}`,
        url: window.location.origin + `/find/${find.id}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin + `/find/${find.id}`).catch(() => {});
    }
  };

  return (
    <div
      className="tape-panel cursor-pointer overflow-hidden transition-colors hover:border-black"
      onClick={() => navigate(`/find/${find.id}`)}
    >
      <div className="p-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 border-b border-gray-300 pb-3">
          <div className="flex-1 min-w-0">
            <p className="tape-label mb-1">Drop / {find.product.category}</p>
            <h3 className="tape-title truncate text-xl">
              {find.product.name}
            </h3>
            <div className="mt-2 flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-gray-500">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="text-xs truncate">{find.location.placeName}</span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-xs text-gray-400 truncate">{find.location.address.split(',')[1]?.trim() ?? ''}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave(find.id); }}
              className="border border-gray-300 bg-white p-1.5 hover:border-black transition-colors"
            >
              <Heart
                size={18}
                className={find.saved ? 'fill-black text-black' : 'text-gray-400'}
              />
            </button>
            <button
              onClick={handleShare}
              className="border border-gray-300 bg-white p-1.5 hover:border-black transition-colors"
            >
              <Share2 size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Stock badge + price */}
        <div className="flex items-center gap-2 border-b border-gray-300 py-3 flex-wrap">
          <StockBadge status={find.stockStatus} />
          {find.price !== undefined && (
            <span className="font-mono text-sm font-black text-black">${find.price.toFixed(2)}</span>
          )}
          <span className="border border-gray-300 bg-white px-2 py-0.5 font-mono text-[10px] font-black uppercase text-gray-600">
            {sourceTypeLabel[find.sourceType]}
          </span>
        </div>

        {/* Notes */}
        {find.notes && (
          <p className="border-b border-gray-300 py-3 font-mono text-[11px] font-bold uppercase text-gray-500 line-clamp-2">{find.notes}</p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3 font-mono text-[10px] font-bold uppercase text-gray-400">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{timeAgo(find.createdAt)}</span>
            <span className="text-gray-300">•</span>
            <span className="font-medium text-gray-500">{find.reporterName}</span>
          </div>
          <div className="flex items-center gap-1">
            {find.photos.length > 0 && (
              <span className="flex items-center gap-0.5 text-gray-400">
                <Camera size={12} />
                <span>{find.photos.length}</span>
              </span>
            )}
            <CheckCircle size={12} className={verificationColor[find.verificationStatus]} />
            <span className={`${verificationColor[find.verificationStatus]} font-medium`}>
              {find.verificationStatus.replace('Community ', '').replace('Recently ', '')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
