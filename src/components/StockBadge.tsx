import React from 'react';
import { StockStatus } from '../types';

interface StockBadgeProps {
  status: StockStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StockStatus, { bg: string; text: string; dot: string }> = {
  'Full Stock': { bg: 'bg-[#F0FDF4]', text: 'text-[#166534]', dot: 'bg-green-500' },
  'Medium Stock': { bg: 'bg-[#FEFCE8]', text: 'text-[#854D0E]', dot: 'bg-yellow-400' },
  'Low Stock': { bg: 'bg-[#FFF7ED]', text: 'text-[#9A3412]', dot: 'bg-orange-400' },
  'Out of Stock': { bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]', dot: 'bg-red-400' },
  'Unknown': { bg: 'bg-[#F9FAFB]', text: 'text-[#374151]', dot: 'bg-gray-400' },
};

export default function StockBadge({ status, size = 'sm' }: StockBadgeProps) {
  const config = statusConfig[status];
  const padding = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
