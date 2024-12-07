import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface Step {
  location: {
    latitude: number
    longitude: number
  }
  timestamp: string
}

interface MapProps {
  onLocationSelected: (lat: number, lng: number) => void
  steps: Step[]
}

interface LocationMarkerProps {
  onLocationSelected: (lat: number, lng: number) => void
}

function LocationMarker({ onLocationSelected }: LocationMarkerProps) {
  useMapEvents({
    click(e: any) {
      onLocationSelected(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function MapResizer() {
  const maps = useMap()
  
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      maps.invalidateSize()
    })
    resizeObserver.observe(maps.getContainer())

    return () => {
      resizeObserver.disconnect()
    }
  }, [maps])

  return null
}

export default function Map({ onLocationSelected, steps }: MapProps) {
  return (
    <MapContainer 
      center ={[20.5937, 78.9629]} 
      zoom={5} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker onLocationSelected={onLocationSelected} />
      {steps.map((step, index) => (
        <Marker 
          key={index} 
          position={[step.location.latitude, step.location.longitude]} 
        />
      ))}
      <MapResizer />
    </MapContainer>
  )
}
