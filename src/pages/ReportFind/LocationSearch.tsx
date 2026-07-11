import React, { useState, useEffect, useMemo, useRef } from 'react'
import { MapPin, Search, Loader2, Navigation } from 'lucide-react'
import { searchLocations, fetchNearbyBusinesses, overpassElementToLocation, formatAddress, NominatimResult } from '../../utils/geo'
import { Location } from '../../types'
import { useLocation as useAppLocation } from '../../context/LocationContext'

interface Props {
  onSelect: (location: Location) => void
}

function nominatimToLocation(r: NominatimResult): Location {
  return {
    id: String(r.place_id),
    placeName: r.name || r.display_name.split(',')[0],
    address: formatAddress(r),
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    placeType: r.type || 'place',
  }
}

export default function LocationSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Use shared location context — already fetched on app load
  const { coords } = useAppLocation()
  const userPos = useMemo(
    () => (coords ? { lat: coords.lat, lon: coords.lon } : null),
    [coords?.lat, coords?.lon]
  )

  // Load nearby businesses when we have position and no query
  useEffect(() => {
    if (!userPos || query) return
    setLoading(true)
    fetchNearbyBusinesses(userPos.lat, userPos.lon, 1000)
      .then(els => setResults(els.map(overpassElementToLocation) as Location[]))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [userPos])

  // Search as user types
  useEffect(() => {
    if (!query.trim()) {
      if (userPos) return // let the nearby effect handle it
      setResults([])
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await searchLocations(query, userPos?.lat, userPos?.lon)
        setResults(res.map(nominatimToLocation))
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, userPos])

  const handleLocate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        setLocating(false)
        setLoading(true)
        try {
          const els = await fetchNearbyBusinesses(lat, lon, 1000)
          setResults(els.map(overpassElementToLocation) as Location[])
        } catch {
          setResults([])
        } finally {
          setLoading(false)
        }
      },
      () => setLocating(false)
    )
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-black text-black mb-1">Where did you find it?</h2>
      <p className="text-sm text-gray-500 mb-4">Search for the store, bodega, or venue.</p>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search stores, bodegas, markets..."
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>

      <button
        onClick={handleLocate}
        disabled={locating}
        className="flex items-center gap-2 text-sm text-link font-semibold mb-5"
      >
        {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
        {locating ? 'Locating...' : 'Find stores near me'}
      </button>

      {loading && (
        <div className="flex items-center justify-center py-8 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Searching...</span>
        </div>
      )}

      {!loading && results.length === 0 && !query && (
        <p className="text-center text-sm text-gray-400 py-8">
          Allow location access or search for a store above.
        </p>
      )}

      {!loading && results.length === 0 && query && (
        <p className="text-center text-sm text-gray-400 py-8">No results for "{query}"</p>
      )}

      <div className="space-y-2">
        {results.map(loc => (
          <button
            key={loc.id}
            onClick={() => onSelect(loc)}
            className="w-full flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-[#E5E5E5] text-left hover:border-black transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-black text-sm truncate">{loc.placeName}</p>
              <p className="text-xs text-gray-500 truncate">{loc.address}</p>
              <p className="text-xs text-gray-500 capitalize mt-0.5">{loc.placeType}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
