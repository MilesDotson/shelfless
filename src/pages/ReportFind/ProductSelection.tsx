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
      <div className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-2 mb-5">
        <MapPin size={14} className="text-black flex-shrink-0" />
        <span className="font-mono text-xs font-black uppercase text-black truncate">{location.placeName}</span>
      </div>

      <p className="tape-label mb-2 text-link">Product Signal</p>
      <h2 className="tape-title text-3xl mb-2">What entered the tape?</h2>
      <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-4">Select every product spotted at this place.</p>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2.5 mb-4">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 font-mono text-xs font-black uppercase outline-none text-black placeholder-gray-400 bg-transparent"
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
              className={`w-full flex items-center gap-3 p-3 border transition-all text-left active:scale-95 ${
                isSelected
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white hover:border-black'
              }`}
            >
              <div
                className={`w-6 h-6 border flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'border-white bg-white' : 'border-gray-300 bg-white'
                }`}
              >
                {isSelected && <Check size={14} className="text-black" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-mono text-sm font-black uppercase ${isSelected ? 'text-white' : 'text-black'}`}>{product.name}</p>
                <p className={`font-mono text-[10px] font-bold uppercase ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>{product.category}</p>
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
            className="flex-1 border border-gray-300 px-3 py-2.5 font-mono text-xs font-black uppercase outline-none focus:border-black"
          />
          <button
            onClick={addCustom}
            disabled={!customProduct.trim()}
            className="tape-button disabled:opacity-50"
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowCustomInput(true)}
          className="w-full flex items-center gap-2 p-3 border border-dashed border-gray-400 text-link font-mono text-xs font-black uppercase hover:border-black transition-colors mb-4"
        >
          <Plus size={18} />
          Add custom product
        </button>
      )}

      <button
        onClick={onContinue}
        disabled={selected.length === 0}
        className="w-full tape-button active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Continue / {selected.length} Selected
      </button>
    </div>
  );
}
