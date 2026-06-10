export type StockStatus = 'Full Stock' | 'Medium Stock' | 'Low Stock' | 'Out of Stock' | 'Unknown';
export type VerificationStatus = 'Unverified' | 'Photo Verified' | 'Recently Confirmed' | 'Community Confirmed' | 'Stale' | 'Reported as Gone';
export type SourceType = 'store' | 'bodega' | 'garage sale' | 'flea market' | 'pop-up' | 'estate sale' | 'online pickup' | 'other';
export type Urgency = 'Low' | 'Medium' | 'High' | 'ASAP';
export type Condition = 'new' | 'used' | 'vintage' | 'sealed' | 'any';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  reputationScore: number;
  role: ('requester' | 'scavenger' | 'retailer' | 'admin')[];
}

export interface Location {
  id: string;
  placeName: string;
  address: string;
  lat: number;
  lng: number;
  placeType: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image?: string;
}

export interface Find {
  id: string;
  product: Product;
  location: Location;
  reporterUserId: string;
  reporterName: string;
  stockStatus: StockStatus;
  price?: number;
  notes?: string;
  photos: string[];
  sourceType: SourceType;
  createdAt: string;
  verificationStatus: VerificationStatus;
  confirmations: number;
  saved?: boolean;
}

export interface Request {
  id: string;
  requesterUserId: string;
  requesterName: string;
  productName: string;
  category: string;
  description: string;
  searchArea: string;
  maxPrice?: number;
  reward?: number;
  urgency: Urgency;
  condition: Condition;
  status: 'open' | 'in-progress' | 'completed' | 'expired';
  createdAt: string;
  expiresAt: string;
  responseCount: number;
}
