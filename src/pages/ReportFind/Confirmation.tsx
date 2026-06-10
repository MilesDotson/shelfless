import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Edit3, Trash2, Package } from 'lucide-react';
import { createFind } from '../../lib/dataService';
import StockBadge from '../../components/StockBadge';
import Toast from '../../components/Toast';
import { ReportState } from './index';

interface ConfirmationProps {
  state: ReportState;
  onEditLocation: () => void;
  onEditProduct: (idx: number) => void;
  onDeleteProduct: (id: string) => void;
}

export default function Confirmation({ state, onEditLocation, onEditProduct, onDeleteProduct }: ConfirmationProps) {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!state.location || state.products.length === 0) return;
    setSaving(true);

    // Create each product as a separate find in PocketBase
    const createPromises = state.products.map((product) =>
      createFind({
        product_name: product.name,
        product_category: product.category,
        location_name: state.location!.placeName,
        location_address: state.location!.address,
        location_lat: state.location!.lat,
        location_lng: state.location!.lng,
        location_type: state.location!.placeType,
        stock_status: state.stockStatuses[product.id] ?? 'Unknown',
        price: state.prices[product.id] ? parseFloat(state.prices[product.id]) : undefined,
        notes: state.notes[product.id] ?? undefined,
        source_type: state.location!.placeType ?? 'other',
        reporter_name: 'You',
      })
    );

    await Promise.all(createPromises);

    setToast(`${state.products.length} find${state.products.length > 1 ? 's' : ''} saved! Thanks for helping the community.`);
    setTimeout(() => {
      navigate('/feed');
    }, 2000);
  };

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast('')} duration={4000} />}

      <h2 className="text-xl font-black text-black mb-1">Review Your Find</h2>
      <p className="text-sm text-gray-500 mb-5">Double-check everything looks right before saving.</p>

      {/* Location card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-4 mb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-black mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-black text-sm">{state.location?.placeName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{state.location?.address}</p>
              <p className="text-xs text-gray-400 capitalize mt-0.5">{state.location?.placeType}</p>
            </div>
          </div>
          <button
            onClick={onEditLocation}
            className="flex items-center gap-1 text-xs text-link font-semibold hover:opacity-70 flex-shrink-0"
          >
            <Edit3 size={14} />
            Edit
          </button>
        </div>
      </div>

      {/* Product cards */}
      <div className="space-y-3 mb-6">
        {state.products.map((product, idx) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-gray-400 flex-shrink-0" />
                <p className="font-semibold text-black text-sm">{product.name}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onEditProduct(idx)}
                  className="flex items-center gap-1 text-xs text-link font-semibold hover:opacity-70"
                >
                  <Edit3 size={13} />
                  Edit
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="flex items-center gap-1 text-xs text-red-500 font-semibold hover:opacity-70"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <StockBadge status={state.stockStatuses[product.id] ?? 'Unknown'} />
              {state.prices[product.id] && (
                <span className="text-sm font-semibold text-black">${parseFloat(state.prices[product.id]).toFixed(2)}</span>
              )}
              {(state.photos[product.id] ?? 0) > 0 && (
                <span className="text-xs text-gray-400">{state.photos[product.id]} photo{state.photos[product.id] !== 1 ? 's' : ''}</span>
              )}
            </div>

            {state.notes[product.id] && (
              <p className="mt-2 text-xs text-gray-500 border-t border-gray-100 pt-2">{state.notes[product.id]}</p>
            )}
          </div>
        ))}
      </div>

      {state.products.length === 0 && (
        <div className="text-center py-8 text-gray-400 mb-6">
          <Package size={36} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">No products remaining. Go back to add some.</p>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={state.products.length === 0 || saving}
        className="w-full bg-black text-white font-bold py-4 rounded-2xl text-base shadow-md hover:bg-gray-900 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : `Save Find${state.products.length > 1 ? 's' : ''}`}
      </button>

      <p className="text-xs text-center text-gray-400 mt-3">
        Your find will appear in the feed immediately and help your community.
      </p>
    </div>
  );
}
