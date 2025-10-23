'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ClientNavbar from '@/components/ClientNavbar'
import { useRouteStore } from '@/store/routeStore'
import 'leaflet/dist/leaflet.css'

// Dynamic import Leaflet komponen (client-only)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
)

// useMapEvents tetap import normal
import { useMapEvents as useMapEventsHook } from 'react-leaflet'

export default function EditAddress() {
  const currentPath = useRouteStore((state) => state.currentPath)
  const [center, setCenter] = useState([-7.7160079, 110.3403678])
  const [position, setPosition] = useState([-7.7160079, 110.3403678])
  const [L, setLeaflet] = useState(null) // Leaflet library
  const maxDistance = 1200

  // Import Leaflet hanya di client
  useEffect(() => {
    if (typeof window === 'undefined') return // hanya di browser
    import('leaflet').then((leaflet) => {
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      })
      setLeaflet(leaflet)
    })
  }, [])

  function LocationMarker() {
    if (!L) return null // jangan render sebelum Leaflet siap

    useMapEventsHook({
      click(e) {
        const clicked = e.latlng
        const distance = L.latLng(center).distanceTo(clicked)
        if (distance <= maxDistance) {
          setPosition([clicked.lat, clicked.lng])
        } else {
          alert('Titik terlalu jauh! Maksimal 1.2 km dari area yang ditentukan.')
        }
      },
    })

    return (
      <Circle
        center={center}
        radius={maxDistance}
        pathOptions={{ color: '#f97316', fillColor: '#ffedd5', fillOpacity: 0.3 }}
      />
    )
  }

  // Jangan render apapun di server (Next.js build)
  if (typeof window === 'undefined') return null

  return (
    <div className='bg-gray-50 min-h-screen flex flex-col md:flex-row'>
      <ClientNavbar />

      <main className='pt-24 px-4 md:px-8 flex-1 max-w-6xl'>
        <div className='text-sm text-gray-500 mb-2'>{currentPath}</div>
        <h1 className='text-lg md:text-xl font-semibold text-gray-800 mb-4'>Edit Alamat</h1>

        <div className='bg-white rounded-xl shadow p-5 md:p-6 space-y-6'>
          <div className='relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border'>
            <MapContainer center={center} zoom={14} className='h-full w-full'>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <Marker position={position} />
              <LocationMarker />
            </MapContainer>
            <div className='absolute top-3 right-3 bg-white/90 text-xs px-3 py-1 rounded-md shadow'>
              Klik pada peta untuk memilih lokasi
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Koordinat</label>
              <input
                type='text'
                readOnly
                value={`${position[0].toFixed(6)}, ${position[1].toFixed(6)}`}
                className='w-full border rounded-lg px-3 py-2 bg-gray-100 text-sm'
              />
            </div>

            <div className='flex items-end'>
              <button className='w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition'>
                Simpan Lokasi
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}