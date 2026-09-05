import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  LiveBus,
  TransitRoute,
  BusStop,
  ServiceAlert,
  SmartReminder,
  TouristDestination,
  LegalInformationItem
} from '../types/transport'
import {
  mockBusStops,
  mockRoutes,
  mockLiveBuses,
  mockAlerts,
  mockTouristDestinations,
  mockLegalRules
} from '../data/mockTransportData'
import { demoComplaints, ComplaintRecord } from '../data/demoComplaints'

interface SafeJourneyState {
  isActive: boolean
  targetBusId?: string
  destinationStopId?: string
  destinationName?: string
  emergencyContact?: string
  startedAt?: string
}

interface TransportContextType {
  buses: LiveBus[]
  routes: TransitRoute[]
  stops: BusStop[]
  alerts: ServiceAlert[]
  reminders: SmartReminder[]
  complaints: ComplaintRecord[]
  touristDestinations: TouristDestination[]
  legalRules: LegalInformationItem[]
  safeJourney: SafeJourneyState
  userRole: 'passenger' | 'authority' | 'admin'
  setUserRole: (role: 'passenger' | 'authority' | 'admin') => void
  isSimulationRunning: boolean
  setIsSimulationRunning: (running: boolean) => void

  // Actions
  addReminder: (reminder: Omit<SmartReminder, 'id' | 'createdAt'>) => void
  removeReminder: (id: string) => void
  toggleReminder: (id: string) => void
  startSafeJourney: (details: { busId: string; destinationStopId: string; contact?: string }) => void
  stopSafeJourney: () => void
  triggerBusDelay: (busId: string, delayMinutes: number) => void
  triggerEmergencyAlert: (routeNumber: string, reason: string) => void
  clearAlert: (alertId: string) => void
  advanceComplaintStatus: (complaintId: string, newStatus: string, note?: string) => void
  addComplaint: (complaint: ComplaintRecord) => void
  
  // Admin methods
  addBus: (bus: LiveBus) => void
  updateBus: (id: string, updates: Partial<LiveBus>) => void
  addRoute: (route: TransitRoute) => void
  updateRoute: (id: string, updates: Partial<TransitRoute>) => void
  addStop: (stop: BusStop) => void
  updateStop: (id: string, updates: Partial<BusStop>) => void
  addAlert: (alert: ServiceAlert) => void
}

const TransportContext = createContext<TransportContextType | undefined>(undefined)

const STORAGE_KEYS = {
  BUSES: 'lst_live_buses',
  ALERTS: 'lst_alerts',
  REMINDERS: 'lst_reminders',
  COMPLAINTS: 'lst_complaints',
  SAFE_JOURNEY: 'lst_safe_journey',
  ROLE: 'lst_user_role'
}

export const TransportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buses, setBuses] = useState<LiveBus[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUSES)
    return saved ? JSON.parse(saved) : mockLiveBuses
  })

  const [routes, setRoutes] = useState<TransitRoute[]>(mockRoutes)
  const [stops, setStops] = useState<BusStop[]>(mockBusStops)

  const [alerts, setAlerts] = useState<ServiceAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS)
    return saved ? JSON.parse(saved) : mockAlerts
  })

  const [reminders, setReminders] = useState<SmartReminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS)
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'rem-1',
            busId: 'bus-12a-01',
            busNumber: 'TN-38-N-1204',
            routeNumber: '12A',
            stopName: 'Central Bus Stand (Gandhipuram)',
            minutesBefore: 10,
            enabled: true,
            createdAt: new Date().toISOString()
          }
        ]
  })

  const [complaints, setComplaints] = useState<ComplaintRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS)
    return saved ? JSON.parse(saved) : demoComplaints
  })

  const [touristDestinations, setTouristDestinations] = useState<TouristDestination[]>(mockTouristDestinations)
  const [legalRules, setLegalRules] = useState<LegalInformationItem[]>(mockLegalRules)

  const [safeJourney, setSafeJourney] = useState<SafeJourneyState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAFE_JOURNEY)
    return saved ? JSON.parse(saved) : { isActive: false }
  })

  const [userRole, setUserRole] = useState<'passenger' | 'authority' | 'admin'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE)
    return (saved as any) || 'passenger'
  })

  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true)

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSES, JSON.stringify(buses))
  }, [buses])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts))
  }, [alerts])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders))
  }, [reminders])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints))
  }, [complaints])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAFE_JOURNEY, JSON.stringify(safeJourney))
  }, [safeJourney])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, userRole)
  }, [userRole])

  // Real-time GPS Movement Simulator:
  // Every 4 seconds, if simulation is running, slightly advance coordinates along polyline and update ETA
  useEffect(() => {
    if (!isSimulationRunning) return

    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          const route = routes.find((r) => r.id === bus.routeId)
          if (!route || route.polylineCoords.length < 2) {
            return { ...bus, lastUpdatedSecondsAgo: 2 }
          }

          // Generate slight continuous motion along path
          const jitterLat = (Math.random() - 0.48) * 0.0004
          const jitterLon = (Math.random() - 0.48) * 0.0004
          const newSpeed = Math.max(12, Math.min(48, Math.round(bus.currentLocation.speedKmH + (Math.random() - 0.5) * 4)))

          // Adjust ETA countdown
          const nextEta = Math.max(1, bus.etaNextStopMin > 1 ? bus.etaNextStopMin - 0.1 : 5)
          const destEta = Math.max(2, bus.etaDestinationMin > 2 ? bus.etaDestinationMin - 0.1 : 16)

          return {
            ...bus,
            currentLocation: {
              ...bus.currentLocation,
              latitude: bus.currentLocation.latitude + jitterLat,
              longitude: bus.currentLocation.longitude + jitterLon,
              speedKmH: newSpeed,
              timestamp: new Date().toISOString()
            },
            etaNextStopMin: Math.round(nextEta * 10) / 10,
            etaDestinationMin: Math.round(destEta * 10) / 10,
            lastUpdatedSecondsAgo: Math.floor(Math.random() * 6) + 1
          }
        })
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [isSimulationRunning, routes])

  // Reminders
  const addReminder = useCallback((reminder: Omit<SmartReminder, 'id' | 'createdAt'>) => {
    const newRem: SmartReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    setReminders((prev) => [newRem, ...prev])
  }, [])

  const removeReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    )
  }, [])

  // Safe Journey
  const startSafeJourney = useCallback(
    (details: { busId: string; destinationStopId: string; contact?: string }) => {
      const dest = stops.find((s) => s.id === details.destinationStopId)
      setSafeJourney({
        isActive: true,
        targetBusId: details.busId,
        destinationStopId: details.destinationStopId,
        destinationName: dest?.name || 'Selected Destination',
        emergencyContact: details.contact || '+91 98765 43210 (Mother)',
        startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    },
    [stops]
  )

  const stopSafeJourney = useCallback(() => {
    setSafeJourney({ isActive: false })
  }, [])

  // Delays and Alerts simulation
  const triggerBusDelay = useCallback((busId: string, delayMinutes: number) => {
    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === busId) {
          return {
            ...b,
            status: delayMinutes > 0 ? 'Delayed' : 'On time',
            delayMinutes,
            etaNextStopMin: b.etaNextStopMin + delayMinutes,
            etaDestinationMin: b.etaDestinationMin + delayMinutes
          }
        }
        return b
      })
    )

    const targetBus = buses.find((b) => b.id === busId)
    if (targetBus && delayMinutes > 0) {
      const newAlert: ServiceAlert = {
        id: `alert-delay-${Date.now()}`,
        title: `Route ${targetBus.routeNumber} Delayed by ~${delayMinutes} min`,
        description: `Bus ${targetBus.registrationNumber} is held up due to heavy traffic on the corridor. Expected delay: ${delayMinutes} minutes.`,
        severity: 'Warning',
        affectedRoutes: [targetBus.routeNumber],
        affectedStops: [targetBus.nextStopId],
        recommendedAction: 'Take Express Route 24A or wait for the next service.',
        suggestedAlternativeRoute: '24A',
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Active',
        isDemo: true
      }
      setAlerts((prev) => [newAlert, ...prev])
    }
  }, [buses])

  const triggerEmergencyAlert = useCallback((routeNumber: string, reason: string) => {
    const alert: ServiceAlert = {
      id: `alert-emerg-${Date.now()}`,
      title: `EMERGENCY ALERT: Route ${routeNumber} Service Suspension`,
      description: reason || `Route ${routeNumber} temporarily suspended due to emergency road water-logging. Maintenance teams are on-site.`,
      severity: 'Emergency',
      affectedRoutes: [routeNumber],
      affectedStops: ['CBS-01', 'RLW-02'],
      recommendedAction: 'Please use alternative Route 14B or Metro link. Exercise caution.',
      suggestedAlternativeRoute: '14B',
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active',
      isDemo: true
    }
    setAlerts((prev) => [alert, ...prev])

    // Also mark route status as Diversion/Suspended
    setRoutes((prev) =>
      prev.map((r) =>
        r.routeNumber === routeNumber
          ? { ...r, status: 'Suspended', diversionNote: reason }
          : r
      )
    )
  }, [])

  const clearAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId))
  }, [])

  // Complaints
  const advanceComplaintStatus = useCallback(
    (complaintId: string, newStatus: string, note?: string) => {
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id === complaintId || c.complaint_number === complaintId) {
            return {
              ...c,
              status: newStatus as any
            }
          }
          return c
        })
      )
    },
    []
  )

  const addComplaint = useCallback((complaint: ComplaintRecord) => {
    setComplaints((prev) => [complaint, ...prev])
  }, [])

  // Admin Fleet CRUD
  const addBus = useCallback((newBus: LiveBus) => {
    setBuses((prev) => [newBus, ...prev])
  }, [])

  const updateBus = useCallback((id: string, updates: Partial<LiveBus>) => {
    setBuses((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }, [])

  const addRoute = useCallback((newRoute: TransitRoute) => {
    setRoutes((prev) => [newRoute, ...prev])
  }, [])

  const updateRoute = useCallback((id: string, updates: Partial<TransitRoute>) => {
    setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
  }, [])

  const addStop = useCallback((newStop: BusStop) => {
    setStops((prev) => [newStop, ...prev])
  }, [])

  const updateStop = useCallback((id: string, updates: Partial<BusStop>) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }, [])

  const addAlert = useCallback((alert: ServiceAlert) => {
    setAlerts((prev) => [alert, ...prev])
  }, [])

  return (
    <TransportContext.Provider
      value={{
        buses,
        routes,
        stops,
        alerts,
        reminders,
        complaints,
        touristDestinations,
        legalRules,
        safeJourney,
        userRole,
        setUserRole,
        isSimulationRunning,
        setIsSimulationRunning,
        addReminder,
        removeReminder,
        toggleReminder,
        startSafeJourney,
        stopSafeJourney,
        triggerBusDelay,
        triggerEmergencyAlert,
        clearAlert,
        advanceComplaintStatus,
        addComplaint,
        addBus,
        updateBus,
        addRoute,
        updateRoute,
        addStop,
        updateStop,
        addAlert
      }}
    >
      {children}
    </TransportContext.Provider>
  )
}

export function useTransport() {
  const ctx = useContext(TransportContext)
  if (!ctx) throw new Error('useTransport must be used within TransportProvider')
  return ctx
}
