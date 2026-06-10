import React, { createContext, useContext, useEffect, useState } from 'react'
import { reverseGeocode } from '../utils/geo'

interface LocationContextValue {
  coords: { lat: number; lon: number } | null
  locationName: string
  locating: boolean
  setLocationName: (name: string) => void
  requestLocation: () => void
}

const LocationContext = createContext<LocationContextValue>({
  coords: null,
  locationName: '',
  locating: false,
  setLocationName: () => {},
  requestLocation: () => {},
})

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [locationName, setLocationName] = useState('')
  const [locating, setLocating] = useState(false)

  const requestLocation = () => {
    if (!navigator.geolocation || locating) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        setCoords({ lat, lon })
        try {
          const result = await reverseGeocode(lat, lon)
          if (result) {
            const name =
              result.address?.suburb ||
              result.address?.city ||
              result.address?.town ||
              result.address?.state ||
              'Your Area'
            setLocationName(name)
          }
        } catch {
          setLocationName('Your Area')
        }
        setLocating(false)
      },
      () => {
        setLocating(false)
      },
      { timeout: 8000 }
    )
  }

  // Auto-request on mount
  useEffect(() => {
    requestLocation()
  }, [])

  return (
    <LocationContext.Provider value={{ coords, locationName, locating, setLocationName, requestLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => useContext(LocationContext)
