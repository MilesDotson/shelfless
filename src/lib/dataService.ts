import pb from './pb'
import { Find, Request } from '../types'
import { mockFinds, mockRequests } from '../data/mockData'

// Map PocketBase record to Find type
function recordToFind(record: any): Find {
  return {
    id: record.id,
    product: {
      id: record.id,
      name: record.product_name,
      category: record.product_category || 'General',
    },
    location: {
      id: record.id,
      placeName: record.location_name,
      address: record.location_address || '',
      lat: record.location_lat || 0,
      lng: record.location_lng || 0,
      placeType: record.location_type || 'store',
    },
    reporterUserId: 'user',
    reporterName: record.reporter_name || 'Anonymous',
    stockStatus: record.stock_status || 'Unknown',
    price: record.price || undefined,
    notes: record.notes || undefined,
    photos: [],
    sourceType: record.source_type || 'store',
    createdAt: record.created,
    verificationStatus: record.verification_status || 'Unverified',
    confirmations: record.confirmations || 0,
    saved: false,
  }
}

function recordToRequest(record: any): Request {
  return {
    id: record.id,
    requesterUserId: 'user',
    requesterName: record.requester_name || 'Anonymous',
    productName: record.product_name,
    category: record.category || 'General',
    description: record.description || '',
    searchArea: record.search_area || '',
    maxPrice: record.max_price || undefined,
    reward: record.reward || undefined,
    urgency: record.urgency || 'Medium',
    condition: record.condition || 'any',
    status: record.status || 'open',
    createdAt: record.created,
    expiresAt: record.expires_at || '',
    responseCount: record.response_count || 0,
  }
}

// FINDS
export async function getFinds(): Promise<Find[]> {
  try {
    const records = await pb.collection('finds').getFullList({ sort: '-created' })
    const pbFinds = records.map(recordToFind)
    // Merge with mock data (mock data shown if PocketBase has no records or as fallback)
    return [...pbFinds, ...mockFinds]
  } catch (e) {
    console.warn('PocketBase unavailable, using mock data', e)
    return mockFinds
  }
}

export async function createFind(data: {
  product_name: string
  product_category: string
  location_name: string
  location_address: string
  location_lat: number
  location_lng: number
  location_type: string
  stock_status: string
  price?: number
  notes?: string
  source_type: string
  reporter_name: string
}): Promise<Find | null> {
  try {
    const record = await pb.collection('finds').create({
      ...data,
      verification_status: 'Unverified',
      confirmations: 0,
    })
    return recordToFind(record)
  } catch (e) {
    console.error('Failed to create find', e)
    return null
  }
}

export async function confirmFind(findId: string, type: 'up' | 'down'): Promise<void> {
  try {
    const record = await pb.collection('finds').getOne(findId)
    if (type === 'up') {
      await pb.collection('finds').update(findId, {
        confirmations: (record.confirmations || 0) + 1,
        verification_status: 'Recently Confirmed',
      })
    } else {
      await pb.collection('finds').update(findId, {
        verification_status: 'Reported as Gone',
      })
    }
  } catch (e) {
    console.warn('Could not confirm find (might be mock data)', e)
  }
}

// REQUESTS
export async function getRequests(): Promise<Request[]> {
  try {
    const records = await pb.collection('requests').getFullList({ sort: '-created' })
    const pbRequests = records.map(recordToRequest)
    return [...pbRequests, ...mockRequests]
  } catch (e) {
    console.warn('PocketBase unavailable, using mock data', e)
    return mockRequests
  }
}

export async function createRequest(data: {
  product_name: string
  category: string
  description: string
  search_area: string
  max_price?: number
  reward?: number
  urgency: string
  condition: string
  expires_at: string
  requester_name: string
}): Promise<Request | null> {
  try {
    const record = await pb.collection('requests').create({
      ...data,
      status: 'open',
      response_count: 0,
    })
    return recordToRequest(record)
  } catch (e) {
    console.error('Failed to create request', e)
    return null
  }
}
