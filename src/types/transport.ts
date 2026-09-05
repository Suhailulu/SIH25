export type OccupancyLevel = 'Low' | 'Medium' | 'High' | 'Full'
export type BusStatus = 'On time' | 'Delayed' | 'Diversion' | 'Cancelled' | 'Out of service'
export type ServiceDisruptionType = 'Information' | 'Warning' | 'Disruption' | 'Emergency'

export interface GPSPosition {
  latitude: number
  longitude: number
  timestamp: string
  speedKmH: number
  headingDeg: number
}

export interface BusStop {
  id: string
  stopCode: string
  name: string
  nameTa: string
  nameHi: string
  latitude: number
  longitude: number
  landmark: string
  shelter: boolean
  seating: boolean
  lighting: 'Good' | 'Moderate' | 'Poor'
  accessible: boolean
  cctv: boolean
  routesServing: string[]
}

export interface RouteStop {
  stopId: string
  stopName: string
  stopNameTa: string
  stopNameHi: string
  sequence: number
  distanceFromStartKm: number
  scheduledMinutesFromStart: number
}

export interface TransitRoute {
  id: string
  routeNumber: string
  routeName: string
  origin: string
  destination: string
  operator: string
  totalDistanceKm: number
  estimatedDurationMin: number
  fareMin: number
  fareMax: number
  firstService: string
  lastService: string
  frequencyMin: number
  status: 'Normal' | 'Delayed' | 'Diversion' | 'Suspended'
  diversionNote?: string
  color: string
  stops: RouteStop[]
  polylineCoords: [number, number][]
}

export interface LiveBus {
  id: string
  registrationNumber: string
  routeId: string
  routeNumber: string
  routeName: string
  operator: string
  currentLocation: GPSPosition
  currentStopId: string
  nextStopId: string
  nextStopName: string
  etaNextStopMin: number
  etaDestinationMin: number
  status: BusStatus
  delayMinutes: number
  occupancy: OccupancyLevel
  vehicleType: 'Standard City' | 'Low-Floor AC' | 'Deluxe Mini' | 'Electric Express'
  features: {
    ac: boolean
    lowFloor: boolean
    wheelchairAccessible: boolean
    cctv: boolean
    emergencyButtons: boolean
    womenSection: boolean
  }
  lastUpdatedSecondsAgo: number
}

export interface ServiceAlert {
  id: string
  title: string
  description: string
  severity: ServiceDisruptionType
  affectedRoutes: string[]
  affectedStops: string[]
  recommendedAction: string
  suggestedAlternativeRoute?: string
  startTime: string
  endTime?: string
  status: 'Active' | 'Resolved'
  isDemo: boolean
}

export interface SmartReminder {
  id: string
  busId: string
  busNumber: string
  routeNumber: string
  stopName: string
  minutesBefore: number
  triggerDistanceKm?: number
  enabled: boolean
  createdAt: string
}

export interface TouristDestination {
  id: string
  name: string
  nameTa: string
  nameHi: string
  category: 'Heritage' | 'Nature' | 'Religious' | 'Food & Market' | 'Family'
  description: string
  nearestStopId: string
  nearestStopName: string
  connectingRoutes: string[]
  approxTravelTimeMin: number
  demoFare: number
  bestTime: string
  image: string
  tags: string[]
}

export interface LegalInformationItem {
  id: string
  title: string
  shortExplanation: string
  applicability: string
  officialSource: string
  sourceUrl?: string
  lastVerified: string
  category: 'Fares & Tickets' | 'Safety & Women' | 'Accessibility' | 'Driver Conduct' | 'Grievance Redressal'
}

export interface FareCalculationInput {
  originStopId: string
  destinationStopId: string
  busType: 'Standard' | 'Deluxe' | 'AC'
  passengerCategory: 'General' | 'Senior' | 'Student' | 'Differently Abled' | 'Woman'
  passengerCount: number
}

export interface FareCalculationResult {
  distanceKm: number
  baseRatePerKm: number
  grossFare: number
  concessionAmount: number
  totalFare: number
  fareNote: string
}
