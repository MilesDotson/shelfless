import React from 'react';
import { Urgency } from '../types';

interface UrgencyBadgeProps {
  urgency: Urgency;
}

const urgencyConfig: Record<Urgency, { bg: string; text: string }> = {
  'ASAP': { bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]' },
  'High': { bg: 'bg-[#FFF7ED]', text: 'text-[#9A3412]' },
  'Medium': { bg: 'bg-[#FEFCE8]', text: 'text-[#854D0E]' },
  'Low': { bg: 'bg-[#F9FAFB]', text: 'text-[#374151]' },
};

export default function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  const config = urgencyConfig[urgency];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {urgency === 'ASAP' ? '🚨 ASAP' : urgency}
    </span>
  );
}
