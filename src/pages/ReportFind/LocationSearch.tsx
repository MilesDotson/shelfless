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
    <div className="px-0 py-2">
      <p className="tape-label mb-2 text-link">Place Signal</p>
      <h2 className="tape-title text-3xl mb-2">Where is the drop?</h2>
      <p className="font-mono text-xs font-bold uppercase leading-5 text-gray-500 mb-4">Search OSM businesses, stores, bodegas, markets, and street-level venues.</p>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search stores, bodegas, markets..."
          className="w-full pl-9 pr-4 py-3 border border-gray-300 bg-white font-mono text-xs font-black uppercase focus:outline-none focus:border-black"
        />
      </div>

      <button
        onClick={handleLocate}
        disabled={locating}
        className="flex items-center gap-2 tape-link mb-5"
      >
        {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
        {locating ? 'Locating' : 'Grab nearby places'}
      </button>

      {loading && (
        <div className="flex items-center justify-center py-8 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="font-mono text-xs font-black uppercase">Searching places...</span>
        </div>
      )}

      {!loading && results.length === 0 && !query && (
        <p className="text-center font-mono text-xs font-black uppercase text-gray-400 py-8">
          Allow browser position or search above.
        </p>
      )}

      {!loading && results.length === 0 && query && (
        <p className="text-center font-mono text-xs font-black uppercase text-gray-400 py-8">No tape places for "{query}"</p>
      )}

      <div className="space-y-2">
        {results.map(loc => (
          <button
            key={loc.id}
            onClick={() => onSelect(loc)}
            className="w-full flex items-start gap-3 tape-panel p-4 text-left hover:border-black transition-colors"
          >
            <div className="w-9 h-9 border border-gray-300 bg-white flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm font-black uppercase text-black truncate">{loc.placeName}</p>
              <p className="font-mono text-[10px] font-bold uppercase text-gray-500 truncate">{loc.address}</p>
              <p className="font-mono text-[10px] font-bold uppercase text-gray-500 capitalize mt-0.5">{loc.placeType}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
