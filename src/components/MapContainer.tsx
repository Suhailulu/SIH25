import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { LiveBus, BusStop, TransitRoute } from '../types/transport'
import {
  Maximize2,
  Minimize2,
  Navigation,
  RotateCcw,
  Move,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react'

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

  const [isExpanded, setIsExpanded] = useState(false)
  const [isDraggingActive, setIsDraggingActive] = useState(false)

  // Initialize Leaflet Map with optimized dragging & pan parameters
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const mapOptions: any = {
        center,
        zoom,
        zoomControl: false, // We provide modern accessible touch controls
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        boxZoom: interactive,
        keyboard: interactive,
        // Vital fix for modern mobile touch dragging: disable Leaflet's legacy tap simulation
        tap: false,
        // Smooth inertia panning configuration
        inertia: true,
        inertiaDeceleration: 3000,
        inertiaMaxSpeed: 1500,
        easeLinearity: 0.2
      }

      const map = L.map(mapContainerRef.current, mapOptions)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map)

      // Drag event listeners for UI feedback
      map.on('dragstart', () => setIsDraggingActive(true))
      map.on('dragend', () => setIsDraggingActive(false))

      markersGroupRef.current = L.layerGroup().addTo(map)
      mapInstanceRef.current = map

      // Invalidate size immediately to prevent grey tile seams
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Invalidate map size when expanded / restored
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize()
      }, 200)
    }
  }, [isExpanded])

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
        map.panTo([selectedBus.currentLocation.latitude, selectedBus.currentLocation.longitude], {
          animate: true,
          duration: 0.8
        })
      }
    }
  }, [buses, stops, routes, selectedBusId, onSelectBus, onSelectStop])

  // Recenter Map on Coimbatore Transit Core
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(center, zoom, { duration: 1 })
    }
  }

  // Zoom in / out controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn()
  }

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut()
  }

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md transition-all duration-300 ${
        isExpanded
          ? 'fixed inset-4 z-50 rounded-3xl shadow-2xl border-2 border-blue-500'
          : ''
      }`}
      style={{
        height: isExpanded ? 'calc(100vh - 32px)' : height,
        touchAction: 'none' // Ensures touch drag gestures pass directly to Leaflet without page jump
      }}
    >
      {/* Leaflet Map DOM Node */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing ${
          isDraggingActive ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          touchAction: 'none'
        }}
      />

      {/* Floating Drag & Pan Assist Indicator */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-md border transition-all ${
            isDraggingActive
              ? 'bg-blue-600 text-white border-blue-700 scale-105'
              : 'bg-white/95 text-slate-700 border-slate-200'
          }`}
        >
          <Move size={14} className={isDraggingActive ? 'animate-bounce' : 'text-[#1261d6]'} />
          <span>{isDraggingActive ? 'Panning map...' : 'Drag / Pan enabled'}</span>
        </div>

        {/* Live Buses counter */}
        {buses.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-slate-700 shadow-md border border-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{buses.length} Live Buses</span>
          </div>
        )}
      </div>

      {/* Top-Right Map Status Info */}
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-slate-700 shadow border border-slate-200 pointer-events-none hidden sm:block">
        OpenStreetMap • Coimbatore TNSTC
      </div>

      {/* Right Floating Map Toolbar: Zoom, Recenter, Fullscreen */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
        {/* Recenter Hub Button */}
        <button
          type="button"
          onClick={handleRecenter}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-[#1261d6] shadow-lg border border-slate-200 transition active:scale-95"
          title="Recenter Map on Coimbatore Central Hub"
          aria-label="Recenter map"
        >
          <RotateCcw size={18} />
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-[#1261d6] shadow-lg border border-slate-200 transition active:scale-95"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <ZoomIn size={18} />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-[#1261d6] shadow-lg border border-slate-200 transition active:scale-95"
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <ZoomOut size={18} />
        </button>

        {/* Fullscreen / Expand Map Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`h-10 w-10 flex items-center justify-center rounded-xl text-white shadow-lg transition active:scale-95 ${
            isExpanded ? 'bg-slate-900 hover:bg-slate-800' : 'bg-[#1261d6] hover:bg-blue-700'
          }`}
          title={isExpanded ? 'Restore Map View' : 'Expand Fullscreen Map for Smooth Dragging'}
          aria-label="Toggle full screen"
        >
          {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* Bottom Hint for Mobile Commuters */}
      <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] text-white font-medium shadow pointer-events-none hidden md:block">
        Use mouse drag or finger swipe to navigate • Expand for distraction-free pan
      </div>
    </div>
  )
}
