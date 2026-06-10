import React, { useState } from 'react';
import { Camera, Plus, X } from 'lucide-react';
import { Product, StockStatus } from '../../types';
import StockBadge from '../../components/StockBadge';

interface PhotosStockProps {
  products: Product[];
  stockStatuses: Record<string, StockStatus>;
  photos: Record<string, number>;
  notes: Record<string, string>;
  prices: Record<string, string>;
  onUpdate: (partial: {
    stockStatuses?: Record<string, StockStatus>;
    photos?: Record<string, number>;
    notes?: Record<string, string>;
    prices?: Record<string, string>;
  }) => void;
  onContinue: () => void;
}

const STOCK_OPTIONS: StockStatus[] = ['Full Stock', 'Medium Stock', 'Low Stock', 'Out of Stock', 'Unknown'];

export default function PhotosStock({
  products,
  stockStatuses,
  photos,
  notes,
  prices,
  onUpdate,
  onContinue,
}: PhotosStockProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentProduct = products[currentIdx];

  const setStock = (status: StockStatus) => {
    onUpdate({ stockStatuses: { ...stockStatuses, [currentProduct.id]: status } });
  };

  const addPhoto = () => {
    const currentCount = photos[currentProduct.id] ?? 0;
    if (currentCount < 5) {
      onUpdate({ photos: { ...photos, [currentProduct.id]: currentCount + 1 } });
    }
  };

  const removePhoto = (idx: number) => {
    const currentCount = photos[currentProduct.id] ?? 0;
    if (currentCount > 0) {
      onUpdate({ photos: { ...photos, [currentProduct.id]: Math.max(0, currentCount - 1) } });
    }
  };

  const setNote = (note: string) => {
    onUpdate({ notes: { ...notes, [currentProduct.id]: note } });
  };

  const setPrice = (price: string) => {
    onUpdate({ prices: { ...prices, [currentProduct.id]: price } });
  };

  const handleContinue = () => {
    if (currentIdx < products.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onContinue();
    }
  };

  const photoCount = photos[currentProduct.id] ?? 0;
  const isLast = currentIdx === products.length - 1;

  return (
    <div>
      {/* Product progress */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black text-black">Photos & Stock</h2>
        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {currentIdx + 1} / {products.length}
        </span>
      </div>
      <p className="text-sm font-semibold text-black mb-5">{currentProduct.name}</p>

      {/* Product mini tabs */}
      {products.length > 1 && (
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {products.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentIdx(idx)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                idx === currentIdx ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Add Pictures */}
      <div className="mb-5">
        <p className="text-sm font-bold text-black mb-3 flex items-center gap-2">
          <Camera size={16} />
          Add Pictures <span className="text-gray-400 font-normal text-xs">({photoCount}/5)</span>
        </p>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: photoCount }).map((_, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center"
            >
              <Camera size={20} className="text-gray-400" />
              <button
                onClick={() => removePhoto(idx)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {photoCount < 5 && (
            <button
              onClick={addPhoto}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-black hover:text-black transition-colors"
            >
              <Plus size={20} />
              <span className="text-[10px]">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Stock Status */}
      <div className="mb-5">
        <p className="text-sm font-bold text-black mb-3">Stock Status</p>
        <div className="space-y-2">
          {STOCK_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStock(status)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                stockStatuses[currentProduct.id] === status
                  ? 'border-black bg-black text-white'
                  : 'border-gray-100 bg-white hover:border-gray-300'
              }`}
            >
              <span className={`text-sm font-medium ${stockStatuses[currentProduct.id] === status ? 'text-white' : 'text-black'}`}>
                {status}
              </span>
              {stockStatuses[currentProduct.id] === status && (
                <StockBadge status={status} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price (optional) */}
      <div className="mb-5">
        <p className="text-sm font-bold text-black mb-2">Price <span className="font-normal text-gray-400">(optional)</span></p>
        <div className="flex items-center bg-white border border-[#E5E5E5] rounded-xl px-3 py-2.5 shadow-sm">
          <span className="text-gray-400 mr-1 text-sm">$</span>
          <input
            type="number"
            value={prices[currentProduct.id] ?? ''}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="flex-1 text-sm outline-none text-black placeholder-gray-400 bg-transparent"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <p className="text-sm font-bold text-black mb-2">Notes <span className="font-normal text-gray-400">(optional)</span></p>
        <textarea
          value={notes[currentProduct.id] ?? ''}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Brand, quantity, shelf location, condition..."
          rows={3}
          className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-black text-black placeholder-gray-400 resize-none shadow-sm"
        />
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-black text-white font-bold py-4 rounded-2xl text-base shadow-md hover:bg-gray-900 active:scale-95 transition-all"
      >
        {isLast ? 'Review & Confirm' : `Next: ${products[currentIdx + 1]?.name}`}
      </button>
    </div>
  );
}
