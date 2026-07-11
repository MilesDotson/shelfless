import React from 'react';
import { StockStatus } from '../types';

interface StockBadgeProps {
  status: StockStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StockStatus, { text: string; code: string }> = {
  'Full Stock': { text: 'text-link', code: 'FULL +92' },
  'Medium Stock': { text: 'text-link', code: 'MED +43' },
  'Low Stock': { text: 'text-gray-600', code: 'LOW -18' },
  'Out of Stock': { text: 'text-red-500', code: 'OUT -100' },
  'Unknown': { text: 'text-gray-400', code: 'UNK ---' },
};

export default function StockBadge({ status, size = 'sm' }: StockBadgeProps) {
  const config = statusConfig[status];
  const padding = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-[10px]';

  return (
    <span className={`inline-flex items-center border border-gray-300 bg-white font-mono font-black uppercase ${config.text} ${padding}`}>
      {config.code}
    </span>
  );
}
