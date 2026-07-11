import React, { createContext, useContext, useEffect, useState } from 'react'
import { geocodeArea, geolocateByIp, reverseGeocode } from '../utils/geo'

const LOCATION_STORAGE_KEY = 'shelfless_location'
const DEFAULT_LOCATION = { locationName: 'Oakland', coords: { lat: 37.8044, lon: -122.2712 } }

interface LocationContextValue {
  coords: { lat: number; lon: number } | null
  locationName: string
  locating: boolean
  locationError: string
  setLocationName: (name: string) => void
  requestLocation: () => Promise<void>
  resolveTypedLocation: () => Promise<void>
}

const LocationContext = createContext<LocationContextValue>({
  coords: null,
  locationName: '',
  locating: false,
  locationError: '',
  setLocationName: () => {},
  requestLocation: async () => {},
  resolveTypedLocation: async () => {},
})

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const storedLocation = (() => {
    try {
      return JSON.parse(localStorage.getItem(LOCATION_STORAGE_KEY) || 'null') as { locationName?: string; coords?: { lat: number; lon: number } } | null
    } catch {
      return null
    }
  })()
  const hasStoredLocation = Boolean(storedLocation?.locationName)
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(storedLocation?.coords ?? DEFAULT_LOCATION.coords)
  const [locationName, setLocationNameState] = useState(storedLocation?.locationName ?? DEFAULT_LOCATION.locationName)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')

  const saveLocation = (name: string, nextCoords: { lat: number; lon: number } | null = coords) => {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({ locationName: name, coords: nextCoords }))
  }

  const setLocationName = (name: string) => {
    setLocationNameState(name)
    saveLocation(name)
  }

  const setResolvedLocation = (name: string, nextCoords: { lat: number; lon: number }) => {
    setCoords(nextCoords)
    setLocationNameState(name)
    saveLocation(name, nextCoords)
  }

  const resolveTypedLocation = async () => {
    if (!locationName.trim() || locating) return
    setLocating(true)
    setLocationError('')
    try {
      const result = await geocodeArea(locationName)
      if (!result) {
        setLocationError('Could not locate that area. Try a city or neighborhood.')
        return
      }

      const lat = parseFloat(result.lat)
      const lon = parseFloat(result.lon)
      const name =
        result.address?.suburb ||
        result.address?.city ||
        result.address?.town ||
        result.name ||
        locationName
      setResolvedLocation(name, { lat, lon })
    } catch {
      setLocationError('Location lookup failed. Using typed area only.')
    } finally {
      setLocating(false)
    }
  }

  const requestLocation = async () => {
    if (locating) return
    if (!navigator.geolocation || !window.isSecureContext) {
      if (locationName.trim()) {
        await resolveTypedLocation()
      } else {
        setLocationError('Browser GPS needs HTTPS. Type a city or neighborhood instead.')
      }
      return
    }

    setLocating(true)
    setLocationError('')
    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const { latitude: lat, longitude: lon } = pos.coords
          const nextCoords = { lat, lon }
          try {
            const result = await reverseGeocode(lat, lon)
            if (result) {
              const name =
                result.address?.suburb ||
                result.address?.city ||
                result.address?.town ||
                result.address?.state ||
                'Your Area'
              setResolvedLocation(name, nextCoords)
            } else {
              setResolvedLocation('Your Area', nextCoords)
            }
          } catch {
            setResolvedLocation('Your Area', nextCoords)
          }
          setLocating(false)
          resolve()
        },
        async () => {
          setLocating(false)
          if (locationName.trim()) {
            await resolveTypedLocation()
          } else {
            setLocationError('Browser GPS denied. Type a city or neighborhood instead.')
          }
          resolve()
        },
        { timeout: 8000, enableHighAccuracy: false }
      )
    })
  }

  const autopopulateLocation = async () => {
    if ((hasStoredLocation && locationName.trim()) || locating) return

    setLocating(true)
    setLocationError('')
    try {
      const result = await geolocateByIp()
      if (result) {
        setResolvedLocation(result.city, { lat: result.latitude, lon: result.longitude })
        return
      }

      setResolvedLocation(DEFAULT_LOCATION.locationName, DEFAULT_LOCATION.coords)
      setLocationError('Using default Oakland market. Type another area to change it.')
    } catch {
      setResolvedLocation(DEFAULT_LOCATION.locationName, DEFAULT_LOCATION.coords)
      setLocationError('Using default Oakland market. Type another area to change it.')
    } finally {
      setLocating(false)
    }
  }

  // Auto-request on mount
  useEffect(() => {
    autopopulateLocation()
  }, [])

  return (
    <LocationContext.Provider value={{ coords, locationName, locating, locationError, setLocationName, requestLocation, resolveTypedLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => useContext(LocationContext)
