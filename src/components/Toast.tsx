import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] animate-bounce-in">
      <div className="bg-[#1A1A2E] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
        <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="p-0.5 hover:opacity-70">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
