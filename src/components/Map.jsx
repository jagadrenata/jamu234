'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { useMapEvents } from 'react-leaflet'

// Dynamic import supaya aman di SSR
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false })
const Circle = dynamic(() => import('react-leaflet').then((m) => m.Circle), { ssr: false })

function MapClickHandler({ center, radius, onChange, LReady }) {
  useMapEvents({
    click(e) {
      const distance = LReady.latLng(center.lat, center.lng).distanceTo(e.latlng)
      if (distance <= radius) {
        onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
      } else {
        alert(`Titik terlalu jauh! Maksimum ${radius / 1000} km dari pusat area.`)
      }
    },
  })
  return null
}

export default function Map({ position, onChange, radius = 1200 }) {
  const [LReady, setLReady] = useState(null)
  const markerRef = useRef(null)

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      delete leaflet.Icon.Default.prototype._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      setLReady(leaflet)
    })
  }, [])

  useEffect(() => {
    markerRef.current?.dragging?.enable()
  }, [])

  if (typeof window === 'undefined' || !LReady) return null

  const mapCenter = [position.lat, position.lng]
  const markerPos = [position.lat, position.lng]

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden border">
      <MapContainer center={mapCenter} zoom={15} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={markerPos}
          ref={markerRef}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target
              const { lat, lng } = marker.getLatLng()
              onChange({ lat, lng })
            },
          }}
        />

        <Circle
          center={mapCenter}
          radius={radius}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#bfdbfe',
            fillOpacity: 0.3,
          }}
        />

        <MapClickHandler center={position} radius={radius} onChange={onChange} LReady={LReady} />
      </MapContainer>

      <div className="absolute top-2 right-2 bg-white/90 text-xs px-2 py-1 rounded-md shadow">
        Klik pada peta untuk memilih lokasi
      </div>
    </div>
  )
}