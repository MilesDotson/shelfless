import React from 'react';
import { Urgency } from '../types';

interface UrgencyBadgeProps {
  urgency: Urgency;
}

const urgencyConfig: Record<Urgency, { text: string; label: string }> = {
  'ASAP': { text: 'text-red-500', label: 'ASAP +99' },
  'High': { text: 'text-link', label: 'HIGH +61' },
  'Medium': { text: 'text-gray-700', label: 'MED +24' },
  'Low': { text: 'text-gray-400', label: 'LOW +07' },
};

export default function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  const config = urgencyConfig[urgency];
  return (
    <span className={`inline-flex items-center border border-gray-300 bg-white px-2 py-0.5 font-mono text-[10px] font-black uppercase ${config.text}`}>
      {config.label}
    </span>
  );
}
