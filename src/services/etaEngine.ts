// Haversine formula to compute great-circle distance between two GPS coordinates in kilometers
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 100) / 100
}

export interface SmartETAParams {
  distanceKm: number
  averageSpeedKmH: number
  trafficMultiplier?: number // 1.0 = normal, 1.4 = congested
  diversionExtraMin?: number
  stopsRemaining: number
  dwellTimePerStopMin?: number
}

// Modular Smart ETA calculation
export function calculateSmartETA(params: SmartETAParams): {
  estimatedMinutes: number
  explanation: string
} {
  const speed = Math.max(params.averageSpeedKmH || 20, 10)
  const traffic = params.trafficMultiplier || 1.0
  const dwellPerStop = params.dwellTimePerStopMin ?? 1.2 // 1.2 min per stop average
  const diversion = params.diversionExtraMin || 0

  const travelMinutes = (params.distanceKm / speed) * 60 * traffic
  const dwellMinutes = params.stopsRemaining * dwellPerStop
  const totalMinutes = Math.max(1, Math.round(travelMinutes + dwellMinutes + diversion))

  let explanation = `Based on current distance (${params.distanceKm} km), ${speed} km/h speed, and ${params.stopsRemaining} intermediate stops.`
  if (traffic > 1.2) {
    explanation += ` Includes traffic congestion buffer (+${Math.round((traffic - 1) * travelMinutes)} min).`
  }
  if (diversion > 0) {
    explanation += ` Route diversion in effect (+${diversion} min).`
  }

  return { estimatedMinutes: totalMinutes, explanation }
}

// Modular Fare Calculation Engine
export function computeFare(
  distanceKm: number,
  busType: 'Standard' | 'Deluxe' | 'AC',
  passengerCategory: 'General' | 'Senior' | 'Student' | 'Differently Abled' | 'Woman' = 'General',
  passengerCount: number = 1
) {
  // Base rates per km (demo representative model based on regional urban stages)
  const baseRateMap = {
    Standard: 2.2,
    Deluxe: 3.2,
    AC: 4.5
  }

  const baseMinimum = {
    Standard: 8,
    Deluxe: 15,
    AC: 25
  }

  const rate = baseRateMap[busType]
  const rawSingleFare = Math.max(baseMinimum[busType], Math.round(distanceKm * rate))

  // Concession discount percent
  let concessionPct = 0
  let concessionNote = 'Standard fare applies'

  if (passengerCategory === 'Woman') {
    // In Tamil Nadu state ordinary city services, women travel fare-free on white-board/standard city services
    if (busType === 'Standard') {
      concessionPct = 100
      concessionNote = 'Zero-fare concession for women on Standard City services (TN Scheme)'
    } else {
      concessionPct = 0
      concessionNote = 'Standard fare applies on Deluxe/AC services'
    }
  } else if (passengerCategory === 'Student') {
    concessionPct = 50
    concessionNote = '50% student concession applicable with valid institutional ID'
  } else if (passengerCategory === 'Senior') {
    concessionPct = 25
    concessionNote = '25% senior citizen concession applicable'
  } else if (passengerCategory === 'Differently Abled') {
    concessionPct = 100
    concessionNote = '100% concession with valid transport authority disability pass'
  }

  const singleFinal = Math.round(rawSingleFare * (1 - concessionPct / 100))
  const total = singleFinal * Math.max(1, passengerCount)

  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    ratePerKm: rate,
    grossFare: rawSingleFare * passengerCount,
    concessionAmount: (rawSingleFare - singleFinal) * passengerCount,
    totalFare: total,
    concessionNote,
    disclaimer: 'Fare calculated using available transport authority stage matrix (Sample/Demo Fare).'
  }
}
