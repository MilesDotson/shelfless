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
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-black text-base leading-tight flex-1">{request.productName}</h3>
        <UrgencyBadge urgency={request.urgency} />
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
        <MapPin size={12} className="flex-shrink-0" />
        <span className="truncate">{request.searchArea}</span>
      </div>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{request.description}</p>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {request.reward !== undefined && request.reward > 0 && (
          <span className="flex items-center gap-1 bg-gray-100 text-black px-2 py-0.5 rounded-full text-xs font-semibold">
            <DollarSign size={11} />
            ${request.reward.toFixed(0)} reward
          </span>
        )}
        {request.maxPrice !== undefined && (
          <span className="text-xs text-gray-500">Max: ${request.maxPrice.toFixed(0)}</span>
        )}
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
          {request.condition}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-400">
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
          className="bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-900 active:scale-95 transition-all"
        >
          Claim Hunt
        </button>
      </div>
    </div>
  );
}
