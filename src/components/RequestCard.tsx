import React from 'react';
import { MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { Request } from '../types';
import { timeAgo } from '../utils/time';
import UrgencyBadge from './UrgencyBadge';

interface RequestCardProps {
  request: Request;
  onClaim?: (id: string) => void;
}

export default function RequestCard({ request, onClaim }: RequestCardProps) {
  return (
    <div className="tape-panel p-3">
      <div className="flex items-start justify-between gap-2 border-b border-gray-300 pb-3">
        <div className="min-w-0 flex-1">
          <p className="tape-label mb-1">Open Bid / {request.category}</p>
          <h3 className="tape-title truncate text-xl">{request.productName}</h3>
        </div>
        <UrgencyBadge urgency={request.urgency} />
      </div>

      <div className="flex items-center gap-1 border-b border-gray-300 py-3 font-mono text-[10px] font-bold uppercase text-gray-500">
        <MapPin size={12} className="flex-shrink-0" />
        <span className="truncate">{request.searchArea}</span>
      </div>

      <p className="border-b border-gray-300 py-3 font-mono text-[11px] font-bold uppercase text-gray-600 line-clamp-2">{request.description}</p>

      <div className="flex items-center gap-2 border-b border-gray-300 py-3 flex-wrap">
        {request.reward !== undefined && request.reward > 0 && (
          <span className="flex items-center gap-1 border border-gray-300 bg-white px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black">
            <DollarSign size={11} />
            ${request.reward.toFixed(0)} reward
          </span>
        )}
        {request.maxPrice !== undefined && (
          <span className="font-mono text-[10px] font-black uppercase text-gray-500">Max ${request.maxPrice.toFixed(0)}</span>
        )}
        <span className="border border-gray-300 bg-white px-2 py-0.5 font-mono text-[10px] font-black uppercase text-gray-600">
          {request.condition}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {timeAgo(request.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} />
            {request.responseCount} {request.responseCount === 1 ? 'response' : 'responses'}
          </span>
        </div>
        <button
          onClick={() => onClaim?.(request.id)}
          className="bg-black px-3 py-1.5 font-mono text-[10px] font-black uppercase text-white hover:bg-gray-900 active:scale-95 transition-all"
        >
          Claim Bid
        </button>
      </div>
    </div>
  );
}
