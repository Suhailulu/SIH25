import { BusStop, TransitRoute, LiveBus, ServiceAlert, TouristDestination, LegalInformationItem } from '../types/transport'

// Authentic Tamil Nadu Transit Network — Coimbatore Urban & Metropolitan Corridor
export const mockBusStops: BusStop[] = [
  {
    id: 'stop-central',
    stopCode: 'CBS-01',
    name: 'Gandhipuram Central Bus Stand',
    nameTa: 'காந்திபுரம் மத்திய பேருந்து நிலையம்',
    nameHi: 'गांधीपुरम केंद्रीय बस स्टैंड',
    latitude: 11.0183,
    longitude: 76.9682,
    landmark: 'Opposite State Express Transport Corporation (SETC) Terminal',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['12A', '14B', '8A', '70', '24A']
  },
  {
    id: 'stop-railway',
    stopCode: 'RLW-02',
    name: 'Coimbatore Railway Junction',
    nameTa: 'கோவை ரயில்வே சந்திப்பு',
    nameHi: 'कोयंबटूर रेलवे जंक्शन',
    latitude: 10.9982,
    longitude: 76.9664,
    landmark: 'Station Main Entrance (Near State Bank of India ATM)',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['12A', '14B', '24A']
  },
  {
    id: 'stop-clocktower',
    stopCode: 'TWH-03',
    name: 'Town Hall & Heritage Clock Tower',
    nameTa: 'டவுன் ஹால் & மணிக்கூண்டு',
    nameHi: 'टाउन हॉल एवं हेरिटेज क्लॉक टॉवर',
    latitude: 10.9950,
    longitude: 76.9610,
    landmark: 'Victoria Town Hall Circle, Raja Street corner',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['12A', '8A']
  },
  {
    id: 'stop-hospital',
    stopCode: 'GHO-04',
    name: 'Coimbatore Medical College Hospital (CMCH)',
    nameTa: 'கோவை அரசு மருத்துவக் கல்லூரி மருத்துவமனை',
    nameHi: 'कोयंबटूर सरकारी मेडिकल कॉलेज अस्पताल',
    latitude: 11.0025,
    longitude: 76.9740,
    landmark: 'Opposite Trichy Road Emergency Trauma Block',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['14B', '24A']
  },
  {
    id: 'stop-collectorate',
    stopCode: 'COL-05',
    name: 'District Collectorate Complex',
    nameTa: 'மாவட்ட ஆட்சியர் அலுவலக வளாகம்',
    nameHi: 'जिला कलेक्ट्रेट परिसर',
    latitude: 11.0055,
    longitude: 76.9702,
    landmark: 'State Highway Road East Arch Gate',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['12A', '14B', '8A']
  },
  {
    id: 'stop-lawley',
    stopCode: 'LAW-06',
    name: 'Lawley Road (TNAU Agricultural University)',
    nameTa: 'லாலி ரோடு (தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழகம்)',
    nameHi: 'लॉली रोड (टीएनएयू कृषि विश्वविद्यालय)',
    latitude: 11.0125,
    longitude: 76.9380,
    landmark: 'Main Centenary Gate of Tamil Nadu Agricultural University',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['70']
  },
  {
    id: 'stop-marudhamalai',
    stopCode: 'MRD-07',
    name: 'Marudhamalai Murugan Hill Temple (Adivaram)',
    nameTa: 'மருதமலை சுப்பிரமணிய சுவாமி திருக்கோவில் (அடிவாரம்)',
    nameHi: 'मरुधमलई मुरुगन पहाड़ी मंदिर (तलहटी)',
    latitude: 11.0450,
    longitude: 76.8520,
    landmark: 'Devasthanam Ghat Road Entrance & Bus Terminus',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['70']
  },
  {
    id: 'stop-museum',
    stopCode: 'VOC-08',
    name: 'VOC Park, Zoo & Heritage Science Centre',
    nameTa: 'வ.உ.சி பூங்கா மற்றும் அறிவியல் மையம்',
    nameHi: 'वीओसी पार्क एवं विज्ञान केंद्र',
    latitude: 11.0090,
    longitude: 76.9750,
    landmark: 'Park Main Gate, VOC Grounds Promenade',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['8A', '24A']
  },
  {
    id: 'stop-market',
    stopCode: 'MKT-09',
    name: 'Flower Market & Heritage Big Bazaar',
    nameTa: 'பூ மார்க்கெட் & பெரிய கடைவீதி',
    nameHi: 'फूल मंडी एवं हेरिटेज बिग बाजार',
    latitude: 10.9930,
    longitude: 76.9580,
    landmark: 'North Arch Gate near Sullivan Street junction',
    shelter: false,
    seating: false,
    lighting: 'Moderate',
    accessible: false,
    cctv: true,
    routesServing: ['12A', '8A']
  },
  {
    id: 'stop-temple',
    stopCode: 'PER-10',
    name: 'Perur Pateeswarar Ancient Temple Ghats',
    nameTa: 'பேரூர் பட்டீஸ்வரர் பழங்கால கோவில் படித்துறை',
    nameHi: 'पेरूर पटीस्वरार प्राचीन मंदिर घाट',
    latitude: 10.9720,
    longitude: 76.9140,
    landmark: 'Noyyal River Holy Bathing Ghat Entrance Arch',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['8A']
  },
  {
    id: 'stop-lake',
    stopCode: 'LAK-11',
    name: 'Valankulam Smart City Eco Lake Promenade',
    nameTa: 'வாலாங்குளம் ஸ்மார்ட் சிட்டி சூழல் ஏரி நடைபாதை',
    nameHi: 'वलनकुलम स्मार्ट सिटी इको लेक सैरगाह',
    latitude: 10.9920,
    longitude: 76.9720,
    landmark: 'Smart City Boathouse Promenade, Sungam bypass entrance',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['14B', '24A']
  }
]

export const mockRoutes: TransitRoute[] = [
  {
    id: 'route-12a',
    routeNumber: '12A',
    routeName: 'Gandhipuram ⇄ Coimbatore Railway Junction (via Collectorate)',
    origin: 'Gandhipuram Central Bus Stand',
    destination: 'Coimbatore Railway Junction',
    operator: 'TNSTC Coimbatore (White-Board Ordinary)',
    totalDistanceKm: 4.8,
    estimatedDurationMin: 22,
    fareMin: 8,
    fareMax: 18,
    firstService: '05:15 AM',
    lastService: '11:45 PM',
    frequencyMin: 8,
    status: 'Normal',
    color: '#1261d6',
    stops: [
      { stopId: 'stop-central', stopName: 'Gandhipuram Central Bus Stand', stopNameTa: 'காந்திபுரம் மத்திய பேருந்து நிலையம்', stopNameHi: 'गांधीपुरम बस स्टैंड', sequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-collectorate', stopName: 'District Collectorate Complex', stopNameTa: 'மாவட்ட ஆட்சியர் அலுவலகம்', stopNameHi: 'जिला कलेक्ट्रेट', sequence: 2, distanceFromStartKm: 1.8, scheduledMinutesFromStart: 8 },
      { stopId: 'stop-clocktower', stopName: 'Town Hall & Heritage Clock Tower', stopNameTa: 'டவுன் ஹால் மணிக்கூண்டு', stopNameHi: 'क्लॉक टॉवर', sequence: 3, distanceFromStartKm: 3.5, scheduledMinutesFromStart: 15 },
      { stopId: 'stop-railway', stopName: 'Coimbatore Railway Junction', stopNameTa: 'கோவை ரயில்வே சந்திப்பு', stopNameHi: 'रेलवे जंक्शन', sequence: 4, distanceFromStartKm: 4.8, scheduledMinutesFromStart: 22 }
    ],
    polylineCoords: [
      [11.0183, 76.9682],
      [11.0110, 76.9695],
      [11.0055, 76.9702],
      [11.0010, 76.9650],
      [10.9950, 76.9610],
      [10.9970, 76.9640],
      [10.9982, 76.9664]
    ]
  },
  {
    id: 'route-70',
    routeNumber: '70',
    routeName: 'Gandhipuram ⇄ Marudhamalai Murugan Hill Temple (via TNAU)',
    origin: 'Gandhipuram Central Bus Stand',
    destination: 'Marudhamalai Murugan Hill Temple (Adivaram)',
    operator: 'TNSTC Coimbatore (Devasthanam Express)',
    totalDistanceKm: 14.2,
    estimatedDurationMin: 45,
    fareMin: 14,
    fareMax: 32,
    firstService: '05:00 AM',
    lastService: '10:30 PM',
    frequencyMin: 12,
    status: 'Normal',
    color: '#e11d48',
    stops: [
      { stopId: 'stop-central', stopName: 'Gandhipuram Central Bus Stand', stopNameTa: 'காந்திபுரம் மத்திய பேருந்து நிலையம்', stopNameHi: 'गांधीपुरम बस स्टैंड', sequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-lawley', stopName: 'Lawley Road (TNAU Agricultural University)', stopNameTa: 'லாலி ரோடு (வேளாண்மைப் பல்கலைக்கழகம்)', stopNameHi: 'लॉली रोड', sequence: 2, distanceFromStartKm: 4.5, scheduledMinutesFromStart: 14 },
      { stopId: 'stop-marudhamalai', stopName: 'Marudhamalai Murugan Hill Temple (Adivaram)', stopNameTa: 'மருதமலை சுப்பிரமணிய சுவாமி திருக்கோவில்', stopNameHi: 'मरुधमलई मंदिर', sequence: 3, distanceFromStartKm: 14.2, scheduledMinutesFromStart: 45 }
    ],
    polylineCoords: [
      [11.0183, 76.9682],
      [11.0140, 76.9550],
      [11.0125, 76.9380],
      [11.0250, 76.8900],
      [11.0450, 76.8520]
    ]
  },
  {
    id: 'route-8a',
    routeNumber: '8A',
    routeName: 'Gandhipuram ⇄ Perur Pateeswarar Temple (via Town Hall)',
    origin: 'Gandhipuram Central Bus Stand',
    destination: 'Perur Pateeswarar Ancient Temple Ghats',
    operator: 'TNSTC Coimbatore (Heritage Corridor White-Board)',
    totalDistanceKm: 9.4,
    estimatedDurationMin: 36,
    fareMin: 10,
    fareMax: 24,
    firstService: '05:30 AM',
    lastService: '10:15 PM',
    frequencyMin: 15,
    status: 'Normal',
    color: '#d97706',
    stops: [
      { stopId: 'stop-central', stopName: 'Gandhipuram Central Bus Stand', stopNameTa: 'காந்திபுரம் மத்திய பேருந்து நிலையம்', stopNameHi: 'गांधीपुरम बस स्टैंड', sequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-museum', stopName: 'VOC Park, Zoo & Heritage Science Centre', stopNameTa: 'வ.உ.சி பூங்கா', stopNameHi: 'वीओसी पार्क', sequence: 2, distanceFromStartKm: 1.5, scheduledMinutesFromStart: 6 },
      { stopId: 'stop-clocktower', stopName: 'Town Hall & Heritage Clock Tower', stopNameTa: 'டவுன் ஹால் மணிக்கூண்டு', stopNameHi: 'क्लॉक टॉवर', sequence: 3, distanceFromStartKm: 3.4, scheduledMinutesFromStart: 14 },
      { stopId: 'stop-market', stopName: 'Flower Market & Heritage Big Bazaar', stopNameTa: 'பூ மார்க்கெட் & பெரிய கடைவீதி', stopNameHi: 'फूल मंडी', sequence: 4, distanceFromStartKm: 4.6, scheduledMinutesFromStart: 19 },
      { stopId: 'stop-temple', stopName: 'Perur Pateeswarar Ancient Temple Ghats', stopNameTa: 'பேரூர் பட்டீஸ்வரர் கோவில் படித்துறை', stopNameHi: 'पेरूर प्राचीन मंदिर', sequence: 5, distanceFromStartKm: 9.4, scheduledMinutesFromStart: 36 }
    ],
    polylineCoords: [
      [11.0183, 76.9682],
      [11.0090, 76.9750],
      [10.9950, 76.9610],
      [10.9930, 76.9580],
      [10.9850, 76.9400],
      [10.9720, 76.9140]
    ]
  },
  {
    id: 'route-14b',
    routeNumber: '14B',
    routeName: 'Gandhipuram ⇄ Valankulam Lake Promenade (via CMCH Hospital)',
    origin: 'Gandhipuram Central Bus Stand',
    destination: 'Valankulam Smart City Eco Lake Promenade',
    operator: 'TNSTC City Circular Shuttle',
    totalDistanceKm: 5.6,
    estimatedDurationMin: 25,
    fareMin: 10,
    fareMax: 20,
    firstService: '06:00 AM',
    lastService: '10:45 PM',
    frequencyMin: 12,
    status: 'Normal',
    color: '#059669',
    stops: [
      { stopId: 'stop-central', stopName: 'Gandhipuram Central Bus Stand', stopNameTa: 'காந்திபுரம் மத்திய பேருந்து நிலையம்', stopNameHi: 'गांधीपुरम बस स्टैंड', sequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-collectorate', stopName: 'District Collectorate Complex', stopNameTa: 'மாவட்ட ஆட்சியர் அலுவலகம்', stopNameHi: 'जिला कलेक्ट्रेट', sequence: 2, distanceFromStartKm: 1.8, scheduledMinutesFromStart: 8 },
      { stopId: 'stop-hospital', stopName: 'Coimbatore Medical College Hospital (CMCH)', stopNameTa: 'அரசு மருத்துவக் கல்லூரி மருத்துவமனை', stopNameHi: 'मेडिकल कॉलेज अस्पताल', sequence: 3, distanceFromStartKm: 3.2, scheduledMinutesFromStart: 14 },
      { stopId: 'stop-railway', stopName: 'Coimbatore Railway Junction', stopNameTa: 'ரயில்வே சந்திப்பு', stopNameHi: 'रेलवे जंक्शन', sequence: 4, distanceFromStartKm: 4.2, scheduledMinutesFromStart: 19 },
      { stopId: 'stop-lake', stopName: 'Valankulam Smart City Eco Lake Promenade', stopNameTa: 'வாலாங்குளம் ஏரி நடைபாதை', stopNameHi: 'इको लेक सैरगाह', sequence: 5, distanceFromStartKm: 5.6, scheduledMinutesFromStart: 25 }
    ],
    polylineCoords: [
      [11.0183, 76.9682],
      [11.0090, 76.9720],
      [11.0055, 76.9702],
      [11.0025, 76.9740],
      [10.9982, 76.9664],
      [10.9940, 76.9690],
      [10.9920, 76.9720]
    ]
  },
  {
    id: 'route-24a',
    routeNumber: '24A',
    routeName: 'Gandhipuram ⇄ Railway Junction (Trichy Road Fast Express)',
    origin: 'Gandhipuram Central Bus Stand',
    destination: 'Coimbatore Railway Junction',
    operator: 'TNSTC Fast Passenger Express',
    totalDistanceKm: 4.5,
    estimatedDurationMin: 18,
    fareMin: 15,
    fareMax: 25,
    firstService: '06:15 AM',
    lastService: '11:00 PM',
    frequencyMin: 10,
    status: 'Normal',
    color: '#7c3aed',
    stops: [
      { stopId: 'stop-central', stopName: 'Gandhipuram Central Bus Stand', stopNameTa: 'காந்திபுரம் மத்திய பேருந்து நிலையம்', stopNameHi: 'गांधीपुरम बस स्टैंड', sequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-hospital', stopName: 'Coimbatore Medical College Hospital (CMCH)', stopNameTa: 'அரசு மருத்துவக் கல்லூரி', stopNameHi: 'मेडिकल कॉलेज अस्पताल', sequence: 2, distanceFromStartKm: 2.8, scheduledMinutesFromStart: 10 },
      { stopId: 'stop-railway', stopName: 'Coimbatore Railway Junction', stopNameTa: 'ரயில்வே சந்திப்பு', stopNameHi: 'रेलवे जंक्शन', sequence: 3, distanceFromStartKm: 4.5, scheduledMinutesFromStart: 18 }
    ],
    polylineCoords: [
      [11.0183, 76.9682],
      [11.0110, 76.9740],
      [11.0025, 76.9740],
      [10.9982, 76.9664]
    ]
  }
]

export const mockLiveBuses: LiveBus[] = [
  {
    id: 'bus-12a-01',
    registrationNumber: 'TN-38-N-1204',
    routeId: 'route-12a',
    routeNumber: '12A',
    routeName: 'Gandhipuram ⇄ Coimbatore Railway Junction',
    operator: 'TNSTC Coimbatore (White-Board Ordinary)',
    currentLocation: {
      latitude: 11.0080,
      longitude: 76.9698,
      timestamp: new Date().toISOString(),
      speedKmH: 26,
      headingDeg: 195
    },
    currentStopId: 'stop-central',
    nextStopId: 'stop-collectorate',
    nextStopName: 'District Collectorate Complex',
    etaNextStopMin: 3,
    etaDestinationMin: 12,
    status: 'On time',
    delayMinutes: 0,
    occupancy: 'Medium',
    vehicleType: 'Standard City',
    features: {
      ac: false,
      lowFloor: false,
      wheelchairAccessible: true,
      cctv: true,
      emergencyButtons: true,
      womenSection: true
    },
    lastUpdatedSecondsAgo: 6
  },
  {
    id: 'bus-70-01',
    registrationNumber: 'TN-38-N-2022',
    routeId: 'route-70',
    routeNumber: '70',
    routeName: 'Gandhipuram ⇄ Marudhamalai Murugan Temple',
    operator: 'TNSTC (Marudhamalai Depot)',
    currentLocation: {
      latitude: 11.0200,
      longitude: 76.9200,
      timestamp: new Date().toISOString(),
      speedKmH: 34,
      headingDeg: 285
    },
    currentStopId: 'stop-lawley',
    nextStopId: 'stop-marudhamalai',
    nextStopName: 'Marudhamalai Murugan Hill Temple (Adivaram)',
    etaNextStopMin: 14,
    etaDestinationMin: 14,
    status: 'On time',
    delayMinutes: 0,
    occupancy: 'High',
    vehicleType: 'Deluxe Mini',
    features: {
      ac: false,
      lowFloor: false,
      wheelchairAccessible: false,
      cctv: true,
      emergencyButtons: true,
      womenSection: true
    },
    lastUpdatedSecondsAgo: 8
  },
  {
    id: 'bus-14b-01',
    registrationNumber: 'TN-38-N-1540',
    routeId: 'route-14b',
    routeNumber: '14B',
    routeName: 'Gandhipuram ⇄ Valankulam Lake Promenade',
    operator: 'TNSTC (Ukkadam Depot)',
    currentLocation: {
      latitude: 11.0040,
      longitude: 76.9720,
      timestamp: new Date().toISOString(),
      speedKmH: 22,
      headingDeg: 175
    },
    currentStopId: 'stop-collectorate',
    nextStopId: 'stop-hospital',
    nextStopName: 'Coimbatore Medical College Hospital (CMCH)',
    etaNextStopMin: 4,
    etaDestinationMin: 15,
    status: 'On time',
    delayMinutes: 0,
    occupancy: 'Low',
    vehicleType: 'Standard City',
    features: {
      ac: false,
      lowFloor: true,
      wheelchairAccessible: true,
      cctv: true,
      emergencyButtons: true,
      womenSection: true
    },
    lastUpdatedSecondsAgo: 12
  },
  {
    id: 'bus-24a-01',
    registrationNumber: 'TN-38-N-3110',
    routeId: 'route-24a',
    routeNumber: '24A',
    routeName: 'Gandhipuram ⇄ Railway Junction (Express)',
    operator: 'TNSTC Metropolitan Fast Service',
    currentLocation: {
      latitude: 11.0140,
      longitude: 76.9710,
      timestamp: new Date().toISOString(),
      speedKmH: 35,
      headingDeg: 190
    },
    currentStopId: 'stop-central',
    nextStopId: 'stop-hospital',
    nextStopName: 'Coimbatore Medical College Hospital (CMCH)',
    etaNextStopMin: 6,
    etaDestinationMin: 14,
    status: 'On time',
    delayMinutes: 0,
    occupancy: 'Low',
    vehicleType: 'Low-Floor AC',
    features: {
      ac: true,
      lowFloor: true,
      wheelchairAccessible: true,
      cctv: true,
      emergencyButtons: true,
      womenSection: true
    },
    lastUpdatedSecondsAgo: 10
  }
]

export const mockAlerts: ServiceAlert[] = [
  {
    id: 'alert-01',
    title: 'Cross Cut Road Stormwater Drain Works (Gandhipuram Corridor)',
    description: 'Buses leaving Gandhipuram towards Railway Junction via Collectorate may experience 8-12 minute delays between 5:30 PM and 7:30 PM due to ongoing municipal stormwater drain upgrades.',
    severity: 'Warning',
    affectedRoutes: ['12A', '14B'],
    affectedStops: ['CBS-01', 'COL-05'],
    recommendedAction: 'Plan 15 minutes in advance or take Express Route 24A via flyover.',
    suggestedAlternativeRoute: '24A',
    startTime: 'Today, 05:00 PM',
    status: 'Active',
    isDemo: true
  },
  {
    id: 'alert-02',
    title: 'Tamil Nadu Pink Police Women Assistance Booth Activated',
    description: '24/7 dedicated Pink Police escort and commuter helpline stationed at Bay 4, Gandhipuram Central Stand. Free bus pass validation and immediate help available.',
    severity: 'Information',
    affectedRoutes: ['12A', '14B', '8A', '70', '24A'],
    affectedStops: ['CBS-01'],
    recommendedAction: 'Direct assistance available at Bay 4 or call toll-free 1091.',
    startTime: 'Ongoing Civic Initiative',
    status: 'Active',
    isDemo: true
  }
]

export const mockTouristDestinations: TouristDestination[] = [
  {
    id: 'tourist-perur',
    name: 'Perur Pateeswarar Temple',
    nameTa: 'பேரூர் பட்டீஸ்வரர் திருக்கோவில்',
    nameHi: 'पेरूर पटीस्वरार मंदिर',
    category: 'Religious',
    description: 'An architectural jewel dating back to Karikala Chola with magnificent stone carvings in the Kanaka Sabha (Golden Hall) along the holy Noyyal River.',
    nearestStopId: 'stop-temple',
    nearestStopName: 'Perur Pateeswarar Ancient Temple Ghats',
    connectingRoutes: ['8A'],
    approxTravelTimeMin: 36,
    demoFare: 20,
    bestTime: '06:00 AM – 11:30 AM & 04:30 PM – 08:30 PM',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    tags: ['Chola Heritage', 'Kanaka Sabha', 'Holy Noyyal River']
  },
  {
    id: 'tourist-marudhamalai',
    name: 'Marudhamalai Murugan Hill Temple',
    nameTa: 'மருதமலை சுப்பிரமணிய சுவாமி திருக்கோவில்',
    nameHi: 'मरुधमलई मुरुगन पहाड़ी मंदिर',
    category: 'Religious',
    description: 'Picturesque 12th-century hill shrine set against the Western Ghats dedicated to Lord Murugan (Dhandayuthapani) surrounded by medicinal herb forests.',
    nearestStopId: 'stop-marudhamalai',
    nearestStopName: 'Marudhamalai Murugan Hill Temple (Adivaram)',
    connectingRoutes: ['70'],
    approxTravelTimeMin: 45,
    demoFare: 28,
    bestTime: '06:00 AM – 01:00 PM & 04:00 PM – 08:00 PM',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    tags: ['Western Ghats', 'Hill Shrine', 'Medicinal Flora']
  },
  {
    id: 'tourist-valankulam',
    name: 'Valankulam Smart City Eco Lake Promenade',
    nameTa: 'வாலாங்குளம் ஸ்மார்ட் சிட்டி சூழல் ஏரி மற்றும் படகு இல்லம்',
    nameHi: 'वलनकुलम स्मार्ट सिटी इको लेक और नौकायन',
    category: 'Nature',
    description: 'Vibrant urban wetland restoration featuring pedestrian boardwalks, sunset viewpoint decks, municipal boathouse, and local snack kiosks.',
    nearestStopId: 'stop-lake',
    nearestStopName: 'Valankulam Smart City Eco Lake Promenade',
    connectingRoutes: ['14B', '24A'],
    approxTravelTimeMin: 22,
    demoFare: 14,
    bestTime: '05:30 PM – 08:30 PM (Sunset Views)',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    tags: ['Sunset Boardwalk', 'Eco Boating', 'Smart City Promenade']
  },
  {
    id: 'tourist-bazaar',
    name: 'Heritage Big Bazaar & Flower Market (பூ மார்க்கெட்)',
    nameTa: 'பாரம்பரிய பெரிய கடைவீதி & பூ மார்க்கெட்',
    nameHi: 'हेरिटेज बिग बाजार एवं फूल मंडी',
    category: 'Food & Market',
    description: 'Century-old bustling retail heart known for fragrant Madurai/Coimbatore jasmine flower auctions, traditional textiles, and authentic Kongu street snacks.',
    nearestStopId: 'stop-market',
    nearestStopName: 'Flower Market & Heritage Big Bazaar',
    connectingRoutes: ['12A', '8A'],
    approxTravelTimeMin: 18,
    demoFare: 10,
    bestTime: '07:00 AM – 11:00 AM for fresh jasmine auctions',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
    tags: ['Jasmine Market', 'Kongu Street Food', 'Handlooms']
  },
  {
    id: 'tourist-voc',
    name: 'VOC Park, Zoo & Science Centre',
    nameTa: 'வ.உ.சி பூங்கா மற்றும் விலங்கியல் தோட்டம்',
    nameHi: 'वीओसी पार्क एवं प्राणि उद्यान',
    category: 'Family',
    description: 'Named after freedom fighter V.O. Chidambaram Pillai, this popular municipal recreation area features lush shaded lawns, a children toy train, and science exhibits.',
    nearestStopId: 'stop-museum',
    nearestStopName: 'VOC Park, Zoo & Heritage Science Centre',
    connectingRoutes: ['8A', '24A'],
    approxTravelTimeMin: 10,
    demoFare: 10,
    bestTime: '04:00 PM – 07:30 PM',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
    tags: ['Recreation', 'Toy Train', 'Green Park']
  }
]

export const mockLegalRules: LegalInformationItem[] = [
  {
    id: 'rule-women-free-travel',
    title: 'Zero-Fare Travel Scheme for Women (Vidiyal Payanam)',
    shortExplanation: 'Under Tamil Nadu Government G.O. Ms. No. 14, all women, transgender persons, and differently-abled passengers accompanied by one assistant travel 100% fare-free on all ordinary white-board city/town stage carriages. Conductor must issue zero-fare printed slip upon request without discrimination.',
    applicability: 'All Tamil Nadu State Transport Undertakings (TNSTC, MTC) Ordinary City Buses',
    officialSource: 'Government of Tamil Nadu, Transport (C1) Department G.O. Ms. No. 14',
    lastVerified: '2026-08-01',
    category: 'Fares & Tickets'
  },
  {
    id: 'rule-women-seats',
    title: '33% Statutory Seating Reservation for Women (Rule 245-A)',
    shortExplanation: 'Rule 245-A of Tamil Nadu Motor Vehicles Rules, 1989 mandates that not less than 33% of seats in the front section of stage carriages must be reserved exclusively for women passengers. Male passengers are required by law to vacate these seats upon request.',
    applicability: 'All Stage Carriage Urban Buses in Tamil Nadu',
    officialSource: 'Tamil Nadu Motor Vehicles Rules, 1989 (Rule 245-A)',
    lastVerified: '2026-08-10',
    category: 'Safety & Women'
  },
  {
    id: 'rule-complaint-book',
    title: 'Mandatory Stage Carriage Complaint Book (Rule 250)',
    shortExplanation: 'Under Rule 250 of the Tamil Nadu Motor Vehicles Rules, every stage carriage conductor must maintain an official bound Complaint Book. The conductor must produce this book immediately to any passenger desiring to record an irregularity, overcharging, or crew misbehaviour.',
    applicability: 'Every Licensed Public Bus Conductor in Tamil Nadu',
    officialSource: 'Tamil Nadu Motor Vehicles Rules, 1989 (Rule 250)',
    lastVerified: '2026-08-15',
    category: 'Grievance Redressal'
  },
  {
    id: 'rule-safe-stopping',
    title: 'Mandatory Designated Halt Halting by Drivers',
    shortExplanation: 'Motor Vehicles Act and Central Rules mandate that drivers must stop at all designated bus stops along the permit route when waiting passengers signal, unless the bus has reached certified maximum standing capacity. Willful skipping of stops attracts disciplinary suspension under Section 178.',
    applicability: 'All TNSTC & Permitted Stage Carriage Operators',
    officialSource: 'Motor Vehicles Act, 1988 (Sec 178/179) & CMVR Rule 21',
    lastVerified: '2026-08-20',
    category: 'Driver Conduct'
  }
]
