import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Urgency, Condition } from '../types';
import { createRequest } from '../lib/dataService';
import Toast from '../components/Toast';

const CATEGORIES = [
  'Cleaning', 'Health', 'Baby', 'Food & Grocery', 'Clothing', 'Footwear',
  'Home Goods', 'Electronics', 'Kitchen Appliances', 'Toys', 'Beauty', 'Other',
];

const URGENCIES: Urgency[] = ['Low', 'Medium', 'High', 'ASAP'];
const CONDITIONS: { label: string; value: Condition }[] = [
  { label: 'Any condition', value: 'any' },
  { label: 'New', value: 'new' },
  { label: 'Used', value: 'used' },
  { label: 'Vintage', value: 'vintage' },
  { label: 'Sealed/unopened', value: 'sealed' },
];

export default function CreateRequest() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    productName: '',
    category: '',
    description: '',
    searchArea: '',
    condition: 'any' as Condition,
    maxPrice: '',
    reward: '',
    urgency: 'Medium' as Urgency,
    expiresAt: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.productName.trim()) newErrors.productName = 'Item name is required';
    if (!form.category) newErrors.category = 'Please select a category';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.searchArea.trim()) newErrors.searchArea = 'Search area is required';
    if (!form.expiresAt) newErrors.expiresAt = 'Expiration date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const result = await createRequest({
      product_name: form.productName.trim(),
      category: form.category,
      description: form.description.trim(),
      search_area: form.searchArea.trim(),
      max_price: form.maxPrice ? parseFloat(form.maxPrice) : undefined,
      reward: form.reward ? parseFloat(form.reward) : undefined,
      urgency: form.urgency,
      condition: form.condition,
      expires_at: new Date(form.expiresAt).toISOString(),
      requester_name: 'You',
    });

    if (result) {
      setToast('Request posted! Scavengers will be on the hunt.');
    } else {
      setToast('Request posted locally. Will sync when connection is restored.');
    }
    setTimeout(() => navigate('/requests'), 2000);
  };

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast('')} duration={4000} />}

      {/* Header */}
      <div className="sticky top-[56px] bg-white z-30 px-4 pt-4 pb-3 border-b border-gray-200 shadow-sm flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-black font-semibold text-sm"
        >
          <ChevronLeft size={20} />
          Cancel
        </button>
        <h1 className="text-base font-bold text-black flex-1 text-center pr-16">Post a Request</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-5">
        {/* Item name */}
        <div>
          <label className="block text-sm font-bold text-black mb-1.5">
            Item Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.productName}
            onChange={(e) => setField('productName', e.target.value)}
            placeholder="e.g. Baby Formula, Disinfectant Wipes..."
            className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-black placeholder-gray-400 ${
              errors.productName ? 'border-red-400' : 'border-[#E5E5E5]'
            }`}
          />
          {errors.productName && <p className="text-xs text-red-400 mt-1">{errors.productName}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-black mb-1.5">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
            className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-black bg-white ${
              errors.category ? 'border-red-400' : 'border-[#E5E5E5]'
            }`}
          >
            <option value="">Select a category...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-black mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Brand preference, quantity needed, any specific requirements..."
            rows={3}
            className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-black placeholder-gray-400 resize-none ${
              errors.description ? 'border-red-400' : 'border-[#E5E5E5]'
            }`}
          />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
        </div>

        {/* Search area */}
        <div>
          <label className="block text-sm font-bold text-black mb-1.5">
            Search Area <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.searchArea}
            onChange={(e) => setField('searchArea', e.target.value)}
            placeholder="e.g. Crown Heights, Brooklyn or any neighborhood"
            className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-black placeholder-gray-400 ${
              errors.searchArea ? 'border-red-400' : 'border-[#E5E5E5]'
            }`}
          />
          {errors.searchArea && <p className="text-xs text-red-400 mt-1">{errors.searchArea}</p>}
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-bold text-black mb-1.5">Condition</label>
          <select
            value={form.condition}
            onChange={(e) => setField('condition', e.target.value)}
            className="w-full border border-[#E5E5E5] rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-black bg-white"
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Max price + Reward side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold text-black mb-1.5">Max Price <span className="font-normal text-gray-400 text-xs">(optional)</span></label>
            <div className="flex items-center border border-[#E5E5E5] rounded-xl px-3 py-3 bg-white">
              <span className="text-gray-400 mr-1 text-sm">$</span>
              <input
                type="number"
                value={form.maxPrice}
                onChange={(e) => setField('maxPrice', e.target.value)}
                placeholder="0"
                className="flex-1 text-sm outline-none text-black placeholder-gray-400 bg-transparent w-full"
                min="0"
                step="1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1.5">Reward <span className="font-normal text-gray-400 text-xs">(optional)</span></label>
            <div className="flex items-center border border-[#E5E5E5] rounded-xl px-3 py-3 bg-white">
              <span className="text-gray-400 mr-1 text-sm">$</span>
              <input
                type="number"
                value={form.reward}
                onChange={(e) => setField('reward', e.target.value)}
                placeholder="0"
                className="flex-1 text-sm outline-none text-black placeholder-gray-400 bg-transparent w-full"
                min="0"
                step="1"
              />
            </div>
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">Urgency</label>
          <div className="grid grid-cols-4 gap-2">
            {URGENCIES.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setField('urgency', u)}
                className={`py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                  form.urgency === u
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Expiration */}
        <div>
          <label className="block text-sm font-bold text-black mb-1.5">
            Expiration Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={form.expiresAt}
            onChange={(e) => setField('expiresAt', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-black bg-white ${
              errors.expiresAt ? 'border-red-400' : 'border-[#E5E5E5]'
            }`}
          />
          {errors.expiresAt && <p className="text-xs text-red-400 mt-1">{errors.expiresAt}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white font-bold py-4 rounded-2xl text-base shadow-md hover:bg-gray-900 active:scale-95 transition-all disabled:opacity-50 mt-2"
        >
          {submitting ? 'Posting...' : 'Post Request'}
        </button>
      </form>
    </div>
  );
}
