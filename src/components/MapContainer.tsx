import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import { LiveBus, BusStop, TransitRoute } from '../types/transport'

interface MapContainerProps {
  buses?: LiveBus[]
  stops?: BusStop[]
  routes?: TransitRoute[]
  selectedBusId?: string
  onSelectBus?: (bus: LiveBus) => void
  onSelectStop?: (stop: BusStop) => void
  center?: [number, number]
  zoom?: number
  height?: string
  interactive?: boolean
}

export default function MapContainer({
  buses = [],
  stops = [],
  routes = [],
  selectedBusId,
  onSelectBus,
  onSelectStop,
  center = [11.005, 76.965],
  zoom = 13,
  height = '500px',
  interactive = true
}: MapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersGroupRef = useRef<L.LayerGroup | null>(null)

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map)

      markersGroupRef.current = L.layerGroup().addTo(map)
      mapInstanceRef.current = map
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update Layers (Polylines, Stops, Buses)
  useEffect(() => {
    const map = mapInstanceRef.current
    const group = markersGroupRef.current
    if (!map || !group) return

    group.clearLayers()

    // 1. Draw Route Polylines
    routes.forEach((route) => {
      if (route.polylineCoords && route.polylineCoords.length > 1) {
        const line = L.polyline(route.polylineCoords, {
          color: route.color || '#1261d6',
          weight: 4,
          opacity: 0.85,
          dashArray: route.status === 'Diversion' ? '8, 8' : undefined
        })
        line.bindTooltip(`${route.routeNumber}: ${route.routeName}`, { sticky: true })
        group.addLayer(line)
      }
    })

    // 2. Draw Stop Markers
    stops.forEach((stop) => {
      const stopIcon = L.divIcon({
        className: 'custom-stop-wrapper',
        html: `<div class="custom-stop-pin" title="${stop.name}">${stop.stopCode.slice(0, 3)}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      const marker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px;">
          <div style="font-weight: 700; color: #17202a;">${stop.name}</div>
          <div style="color: #64748b; font-size: 11px; margin-top: 2px;">Landmark: ${stop.landmark}</div>
          <div style="margin-top: 6px; font-weight: 600; color: #1261d6;">Routes: ${stop.routesServing.join(', ')}</div>
          <div style="margin-top: 4px; font-size: 11px; color: ${stop.shelter ? '#059669' : '#dc2626'};">
            ${stop.shelter ? '✓ Weather Shelter Available' : '⚠ Open Stand (No Shelter)'}
          </div>
        </div>
      `)

      if (onSelectStop) {
        marker.on('click', () => onSelectStop(stop))
      }
      group.addLayer(marker)
    })

    // 3. Draw Bus Markers
    buses.forEach((bus) => {
      const isSelected = bus.id === selectedBusId
      const isDelayed = bus.status === 'Delayed'
      const pinClass = `custom-bus-pin ${isDelayed ? 'delayed' : ''} ${isSelected ? 'ring-4 ring-offset-2 ring-blue-500 scale-110' : ''}`

      const busIcon = L.divIcon({
        className: 'custom-bus-wrapper',
        html: `
          <div class="${pinClass}" title="Bus ${bus.routeNumber} (${bus.registrationNumber})">
            <span style="font-size: 11px; font-weight: 800;">${bus.routeNumber}</span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      })

      const marker = L.marker([bus.currentLocation.latitude, bus.currentLocation.longitude], { icon: busIcon })
      
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; min-width: 180px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="background: #1261d6; color: white; padding: 2px 6px; border-radius: 6px; font-weight: 700; font-size: 11px;">
              Route ${bus.routeNumber}
            </span>
            <span style="font-size: 10px; font-weight: 600; color: ${isDelayed ? '#e96b4c' : '#059669'};">
              ${bus.status}
            </span>
          </div>
          <div style="font-weight: 700; margin-top: 6px;">${bus.registrationNumber}</div>
          <div style="color: #64748b; font-size: 11px;">${bus.operator}</div>
          <div style="margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <div><strong>Next Stop:</strong> ${bus.nextStopName}</div>
            <div><strong>ETA:</strong> ~${Math.round(bus.etaNextStopMin)} min</div>
            <div><strong>Speed:</strong> ${bus.currentLocation.speedKmH} km/h</div>
            <div><strong>Occupancy:</strong> ${bus.occupancy}</div>
          </div>
        </div>
      `)

      marker.on('click', () => {
        if (onSelectBus) onSelectBus(bus)
      })

      group.addLayer(marker)
    })

    // If a specific bus is selected, pan map smoothly to it
    if (selectedBusId) {
      const selectedBus = buses.find((b) => b.id === selectedBusId)
      if (selectedBus) {
        map.panTo([selectedBus.currentLocation.latitude, selectedBus.currentLocation.longitude], { animate: true })
      }
    }
  }, [buses, stops, routes, selectedBusId, onSelectBus, onSelectStop])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-slate-700 shadow border border-slate-200 pointer-events-none">
        OpenStreetMap • Demo Live Data
      </div>
    </div>
  )
}
