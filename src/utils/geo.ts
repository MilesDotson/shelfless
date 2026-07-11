export interface NominatimResult {
  place_id: number
  display_name: string
  name: string
  lat: string
  lon: string
  address: {
    road?: string
    house_number?: string
    city?: string
    town?: string
    suburb?: string
    state?: string
    postcode?: string
    country_code?: string
  }
  type: string
  category: string
}

export interface OverpassElement {
  id: number
  lat: number
  lon: number
  tags: {
    name?: string
    'addr:street'?: string
    'addr:housenumber'?: string
    'addr:city'?: string
    'addr:postcode'?: string
    shop?: string
    amenity?: string
    opening_hours?: string
  }
}

const fallbackBusinessesByArea = [
  {
    match: /oakland|bay area|east bay/i,
    businesses: [
      { id: 900001, lat: 37.8049, lon: -122.2711, tags: { name: 'Swan Market', 'addr:street': '9th St', 'addr:city': 'Oakland', shop: 'marketplace' } },
      { id: 900002, lat: 37.8124, lon: -122.2665, tags: { name: 'Piedmont Grocery', 'addr:street': 'Piedmont Ave', 'addr:city': 'Oakland', shop: 'supermarket' } },
      { id: 900003, lat: 37.8012, lon: -122.2628, tags: { name: 'Downtown Convenience', 'addr:street': 'Broadway', 'addr:city': 'Oakland', shop: 'convenience' } },
      { id: 900004, lat: 37.8071, lon: -122.3008, tags: { name: 'West Oakland Pharmacy', 'addr:street': '7th St', 'addr:city': 'Oakland', amenity: 'pharmacy' } },
      { id: 900005, lat: 37.8358, lon: -122.2514, tags: { name: 'Temescal Market', 'addr:street': 'Telegraph Ave', 'addr:city': 'Oakland', shop: 'convenience' } },
    ],
  },
  {
    match: /brooklyn|new york|nyc/i,
    businesses: [
      { id: 910001, lat: 40.6872, lon: -73.9884, tags: { name: "Lucky's Corner Store", 'addr:street': 'Atlantic Ave', 'addr:city': 'Brooklyn', shop: 'convenience' } },
      { id: 910002, lat: 40.6812, lon: -73.9758, tags: { name: 'Rainbow Bodega', 'addr:street': 'Flatbush Ave', 'addr:city': 'Brooklyn', shop: 'convenience' } },
      { id: 910003, lat: 40.7146, lon: -73.9574, tags: { name: "Mike's Convenience", 'addr:street': 'Bedford Ave', 'addr:city': 'Brooklyn', shop: 'convenience' } },
    ],
  },
]

// Search businesses by name query string using Nominatim
export async function searchLocations(query: string, nearLat?: number, nearLon?: number): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '8',
    countrycodes: 'us',
  })
  if (nearLat && nearLon) {
    params.set('viewbox', `${nearLon - 0.1},${nearLat + 0.1},${nearLon + 0.1},${nearLat - 0.1}`)
    params.set('bounded', '0')
  }
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'ShelfLess/1.0' }
  })
  return res.json()
}

export async function geocodeArea(query: string): Promise<NominatimResult | null> {
  if (!query.trim()) return null
  const results = await searchLocations(query)
  return results[0] ?? null
}

// Reverse geocode lat/lon to address
export async function reverseGeocode(lat: number, lon: number): Promise<NominatimResult | null> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
    { headers: { 'Accept-Language': 'en', 'User-Agent': 'ShelfLess/1.0' } }
  )
  if (!res.ok) return null
  return res.json()
}

// Fetch nearby shops/venues using Overpass API
export async function fetchNearbyBusinesses(lat: number, lon: number, radiusMeters = 800): Promise<OverpassElement[]> {
  const query = `
    [out:json][timeout:10];
    (
      node["shop"](around:${radiusMeters},${lat},${lon});
      node["amenity"~"convenience|pharmacy|supermarket|marketplace"](around:${radiusMeters},${lat},${lon});
    );
    out body;
  `
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  })
  if (!res.ok) throw new Error(`Overpass failed: ${res.status}`)
  const data = await res.json()
  return (data.elements as OverpassElement[]).filter(e => e.tags?.name)
}

export function fallbackBusinessesForArea(areaName: string): OverpassElement[] {
  return (
    fallbackBusinessesByArea.find(area => area.match.test(areaName))?.businesses ??
    fallbackBusinessesByArea[0].businesses
  ) as OverpassElement[]
}

export function formatAddress(result: NominatimResult): string {
  const { address } = result
  const parts = [
    address.house_number && address.road ? `${address.house_number} ${address.road}` : address.road,
    address.suburb || address.city || address.town,
    address.state,
    address.postcode,
  ].filter(Boolean)
  return parts.join(', ')
}

export function overpassElementToLocation(el: OverpassElement) {
  const { tags } = el
  const addressParts = [
    tags['addr:housenumber'] && tags['addr:street'] ? `${tags['addr:housenumber']} ${tags['addr:street']}` : tags['addr:street'],
    tags['addr:city'],
    tags['addr:postcode'],
  ].filter(Boolean)
  return {
    id: String(el.id),
    placeName: tags.name || 'Unknown',
    address: addressParts.join(', ') || 'Address unavailable',
    lat: el.lat,
    lng: el.lon,
    placeType: tags.shop || tags.amenity || 'store',
    source: 'osm',
    verified_status: 'unverified',
  }
}
