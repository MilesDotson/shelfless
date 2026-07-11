import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Location, Product, StockStatus } from '../../types';
import LocationSearch from './LocationSearch';
import ProductSelection from './ProductSelection';
import PhotosStock from './PhotosStock';
import Confirmation from './Confirmation';

export interface ReportState {
  location: Location | null;
  products: Product[];
  stockStatuses: Record<string, StockStatus>;
  photos: Record<string, number>;
  notes: Record<string, string>;
  prices: Record<string, string>;
}

const STEPS = ['Place', 'Products', 'Signal', 'Publish'];

export default function ReportFind() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<ReportState>({
    location: null,
    products: [],
    stockStatuses: {},
    photos: {},
    notes: {},
    prices: {},
  });

  const goBack = () => {
    if (step === 0) navigate(-1);
    else setStep((s) => s - 1);
  };

  const updateState = (partial: Partial<ReportState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-[56px] bg-white z-30 px-4 pt-4 pb-3 border-b border-black">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goBack}
            className="flex items-center gap-1 font-mono text-xs font-black uppercase text-black"
          >
            <ChevronLeft size={20} />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          <span className="font-mono text-xs font-black uppercase text-gray-400">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1">
          {STEPS.map((label, idx) => (
            <div key={label} className="flex-1 flex flex-col gap-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  idx <= step ? 'bg-black' : 'bg-gray-200'
                }`}
              />
            </div>
          ))}
        </div>
        <p className="tape-label mt-1.5">{STEPS[step]} / Add drop to tape</p>
      </div>

      <div className="px-4 py-4">
        {step === 0 && (
          <LocationSearch
            onSelect={(loc) => {
              updateState({ location: loc });
              setStep(1);
            }}
          />
        )}
        {step === 1 && (
          <ProductSelection
            location={state.location!}
            selected={state.products}
            onSelect={(products) => updateState({ products })}
            onContinue={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <PhotosStock
            products={state.products}
            stockStatuses={state.stockStatuses}
            photos={state.photos}
            notes={state.notes}
            prices={state.prices}
            onUpdate={(partial) => updateState(partial)}
            onContinue={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Confirmation
            state={state}
            onEditLocation={() => setStep(0)}
            onEditProduct={(idx) => setStep(2)}
            onDeleteProduct={(id) => {
              const products = state.products.filter((p) => p.id !== id);
              const stockStatuses = { ...state.stockStatuses };
              const photos = { ...state.photos };
              const notes = { ...state.notes };
              const prices = { ...state.prices };
              delete stockStatuses[id];
              delete photos[id];
              delete notes[id];
              delete prices[id];
              updateState({ products, stockStatuses, photos, notes, prices });
            }}
          />
        )}
      </div>
    </div>
  );
}
