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
    if (!form.productName.trim()) newErrors.productName = 'Product is required';
    if (!form.category) newErrors.category = 'Please select a category';
    if (!form.description.trim()) newErrors.description = 'Bid notes are required';
    if (!form.searchArea.trim()) newErrors.searchArea = 'Market area is required';
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
      setToast('Bid posted to the tape.');
    } else {
      setToast('Bid failed to sync. Try again.');
    }
    setTimeout(() => navigate('/requests'), 2000);
  };

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast('')} duration={4000} />}

      {/* Header */}
      <div className="sticky top-[56px] bg-white z-30 px-4 pt-4 pb-3 border-b border-black flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 font-mono text-xs font-black uppercase text-black"
        >
          <ChevronLeft size={20} />
          Cancel
        </button>
        <h1 className="tape-title text-base flex-1 text-center pr-16">Post Bid</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-5">
        {/* Item name */}
        <div>
          <label className="block tape-label mb-1.5">
            Product <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.productName}
            onChange={(e) => setField('productName', e.target.value)}
            placeholder="Baby Formula, Disinfectant Wipes..."
            className={`w-full border px-3 py-3 font-mono text-xs font-black uppercase outline-none focus:border-black text-black placeholder-gray-400 ${
              errors.productName ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.productName && <p className="text-xs text-red-400 mt-1">{errors.productName}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block tape-label mb-1.5">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
            className={`w-full border px-3 py-3 font-mono text-xs font-black uppercase outline-none focus:border-black text-black bg-white ${
              errors.category ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <option value="">Select category...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
        </div>

        {/* Bid Notes */}
        <div>
          <label className="block tape-label mb-1.5">
            Bid Notes <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Brand, quantity, requirements..."
            rows={3}
            className={`w-full border px-3 py-3 font-mono text-xs font-black uppercase outline-none focus:border-black text-black placeholder-gray-400 resize-none ${
              errors.description ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
        </div>

        {/* Search area */}
        <div>
          <label className="block tape-label mb-1.5">
            Market Area <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.searchArea}
            onChange={(e) => setField('searchArea', e.target.value)}
            placeholder="Crown Heights, Brooklyn or any neighborhood"
            className={`w-full border px-3 py-3 font-mono text-xs font-black uppercase outline-none focus:border-black text-black placeholder-gray-400 ${
              errors.searchArea ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.searchArea && <p className="text-xs text-red-400 mt-1">{errors.searchArea}</p>}
        </div>

        {/* Condition */}
        <div>
          <label className="block tape-label mb-1.5">Condition</label>
          <select
            value={form.condition}
            onChange={(e) => setField('condition', e.target.value)}
            className="w-full border border-gray-300 px-3 py-3 font-mono text-xs font-black uppercase outline-none focus:border-black text-black bg-white"
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Max price + Bounty side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block tape-label mb-1.5">Max Ask <span className="font-normal text-gray-400 text-xs">(optional)</span></label>
            <div className="flex items-center border border-gray-300 px-3 py-3 bg-white">
              <span className="text-gray-400 mr-1 text-sm">$</span>
              <input
                type="number"
                value={form.maxPrice}
                onChange={(e) => setField('maxPrice', e.target.value)}
                placeholder="0"
                className="flex-1 font-mono text-xs font-black uppercase outline-none text-black placeholder-gray-400 bg-transparent w-full"
                min="0"
                step="1"
              />
            </div>
          </div>
          <div>
            <label className="block tape-label mb-1.5">Bounty <span className="font-normal text-gray-400 text-xs">(optional)</span></label>
            <div className="flex items-center border border-gray-300 px-3 py-3 bg-white">
              <span className="text-gray-400 mr-1 text-sm">$</span>
              <input
                type="number"
                value={form.reward}
                onChange={(e) => setField('reward', e.target.value)}
                placeholder="0"
                className="flex-1 font-mono text-xs font-black uppercase outline-none text-black placeholder-gray-400 bg-transparent w-full"
                min="0"
                step="1"
              />
            </div>
          </div>
        </div>

        {/* Bid Signal */}
        <div>
          <label className="block tape-label mb-2">Bid Signal</label>
          <div className="grid grid-cols-4 gap-2">
            {URGENCIES.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setField('urgency', u)}
                className={`py-2 border font-mono text-[10px] font-black uppercase transition-all ${
                  form.urgency === u
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-gray-500 hover:border-black'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Expiration */}
        <div>
          <label className="block tape-label mb-1.5">
            Expires <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={form.expiresAt}
            onChange={(e) => setField('expiresAt', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full border px-3 py-3 font-mono text-xs font-black uppercase outline-none focus:border-black text-black bg-white ${
              errors.expiresAt ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.expiresAt && <p className="text-xs text-red-400 mt-1">{errors.expiresAt}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full tape-button active:scale-95 transition-all disabled:opacity-50 mt-2"
        >
          {submitting ? 'Posting Bid...' : 'Post Bid'}
        </button>
      </form>
    </div>
  );
}
