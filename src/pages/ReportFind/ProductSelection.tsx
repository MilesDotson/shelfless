import React, { useState } from 'react';
import { Search, MapPin, Plus, Check } from 'lucide-react';
import { Location, Product } from '../../types';
import { mockProducts } from '../../data/mockData';

interface ProductSelectionProps {
  location: Location;
  selected: Product[];
  onSelect: (products: Product[]) => void;
  onContinue: () => void;
}

export default function ProductSelection({ location, selected, onSelect, onContinue }: ProductSelectionProps) {
  const [query, setQuery] = useState('');
  const [customProduct, setCustomProduct] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts);

  const toggle = (product: Product) => {
    const isSelected = selected.some((p) => p.id === product.id);
    if (isSelected) {
      onSelect(selected.filter((p) => p.id !== product.id));
    } else {
      onSelect([...selected, product]);
    }
  };

  const addCustom = () => {
    if (!customProduct.trim()) return;
    const newProduct: Product = {
      id: `custom_${Date.now()}`,
      name: customProduct.trim(),
      category: 'Other',
    };
    setAllProducts((prev) => [...prev, newProduct]);
    onSelect([...selected, newProduct]);
    setCustomProduct('');
    setShowCustomInput(false);
  };

  const filtered = allProducts.filter(
    (p) =>
      query === '' ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {/* Selected location chip */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 mb-5">
        <MapPin size={14} className="text-black flex-shrink-0" />
        <span className="text-sm font-semibold text-black truncate">{location.placeName}</span>
      </div>

      <h2 className="text-xl font-black text-black mb-1">What did you find?</h2>
      <p className="text-sm text-gray-500 mb-4">Select all items you spotted at this location.</p>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-[#E5E5E5] rounded-xl px-3 py-2.5 shadow-sm mb-4">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 text-sm outline-none text-black placeholder-gray-400 bg-transparent"
        />
      </div>

      {/* Product list */}
      <div className="space-y-2 mb-4">
        {filtered.map((product) => {
          const isSelected = selected.some((p) => p.id === product.id);
          return (
            <button
              key={product.id}
              onClick={() => toggle(product)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left active:scale-95 ${
                isSelected
                  ? 'border-black bg-gray-50'
                  : 'border-gray-100 bg-white hover:border-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'border-black bg-black' : 'border-gray-300 bg-white'
                }`}
              >
                {isSelected && <Check size={14} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black">{product.name}</p>
                <p className="text-xs text-gray-400">{product.category}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom product */}
      {showCustomInput ? (
        <div className="flex gap-2 mb-4">
          <input
            autoFocus
            type="text"
            value={customProduct}
            onChange={(e) => setCustomProduct(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="Product name..."
            className="flex-1 border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-black"
          />
          <button
            onClick={addCustom}
            disabled={!customProduct.trim()}
            className="bg-black text-white px-4 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-gray-900"
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowCustomInput(true)}
          className="w-full flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 text-link text-sm font-medium hover:border-black transition-colors mb-4"
        >
          <Plus size={18} />
          Add custom product
        </button>
      )}

      <button
        onClick={onContinue}
        disabled={selected.length === 0}
        className="w-full bg-black text-white font-bold py-4 rounded-2xl text-base shadow-md hover:bg-gray-900 active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Continue ({selected.length} selected)
      </button>
    </div>
  );
}
