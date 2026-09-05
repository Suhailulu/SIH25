import { BusStop, TransitRoute, LiveBus, ServiceAlert, TouristDestination, LegalInformationItem } from '../types/transport'

// Coordinates centered around a vibrant small-city hub (Coimbatore / Salem region, TN)
export const mockBusStops: BusStop[] = [
  {
    id: 'stop-central',
    stopCode: 'CBS-01',
    name: 'Central Bus Stand (Gandhipuram)',
    nameTa: 'மத்திய பேருந்து நிலையம் (காந்திபுரம்)',
    nameHi: 'केंद्रीय बस स्टैंड (गांधीपुरम)',
    latitude: 11.0183,
    longitude: 76.9682,
    landmark: 'Opposite State Bank Headquarters',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['12A', '14B', '8A', '24A']
  },
  {
    id: 'stop-railway',
    stopCode: 'RLW-02',
    name: 'Railway Junction',
    nameTa: 'ரயில்வே சந்திப்பு',
    nameHi: 'रेलवे जंक्शन',
    latitude: 10.9982,
    longitude: 76.9664,
    landmark: 'Station Main Concourse Gate 1',
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
    name: 'Clock Tower & Town Hall',
    nameTa: 'மணிக்கூண்டு & டவுன் ஹால்',
    nameHi: 'क्लॉक टॉवर एवं टाउन हॉल',
    latitude: 10.9950,
    longitude: 76.9610,
    landmark: 'Heritage Clock Tower circle',
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
    name: 'Government Medical College Hospital',
    nameTa: 'அரசு மருத்துவக் கல்லூரி மருத்துவமனை',
    nameHi: 'सरकारी मेडिकल कॉलेज अस्पताल',
    latitude: 11.0025,
    longitude: 76.9740,
    landmark: 'Emergency Block Gate',
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
    name: 'District Collectorate',
    nameTa: 'மாவட்ட ஆட்சியர் அலுவலகம்',
    nameHi: 'जिला कलेक्ट्रेट',
    latitude: 11.0055,
    longitude: 76.9702,
    landmark: 'Administrative Complex East Gate',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['12A', '14B', '8A']
  },
  {
    id: 'stop-museum',
    stopCode: 'MUS-06',
    name: 'Heritage Museum & VOC Park',
    nameTa: 'பாரம்பரிய அருங்காட்சியகம் & வ.உ.சி பூங்கா',
    nameHi: 'हेरिटेज म्यूजियम एवं वीओसी पार्क',
    latitude: 11.0090,
    longitude: 76.9750,
    landmark: 'Museum Promenade Entry',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['8A', '24A']
  },
  {
    id: 'stop-market',
    stopCode: 'MKT-07',
    name: 'Flower Market & Big Bazaar',
    nameTa: 'பூ சந்தை & பெரிய கடைவீதி',
    nameHi: 'फूल बाजार एवं बिग बाजार',
    latitude: 10.9930,
    longitude: 76.9580,
    landmark: 'Near North Arch Gate',
    shelter: false,
    seating: false,
    lighting: 'Moderate',
    accessible: false,
    cctv: true,
    routesServing: ['12A', '8A']
  },
  {
    id: 'stop-temple',
    stopCode: 'TMP-08',
    name: 'Perur Ancient Temple Ghats',
    nameTa: 'பேரூர் பழங்கால கோவில் படித்துறை',
    nameHi: 'पेरूर प्राचीन मंदिर घाट',
    latitude: 10.9720,
    longitude: 76.9140,
    landmark: 'Noyyal River Bridge entrance',
    shelter: true,
    seating: true,
    lighting: 'Good',
    accessible: true,
    cctv: true,
    routesServing: ['8A']
  },
  {
    id: 'stop-lake',
    stopCode: 'LAK-09',
    name: 'Valankulam Eco Lake Promenade',
    nameTa: 'வாலாங்குளம் சூழல் ஏரி நடைபாதை',
    nameHi: 'वलनकुलम इको लेक सैरगाह',
    latitude: 10.9920,
    longitude: 76.9720,
    landmark: 'Eco park boat house entry',
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
    routeName: 'Central Bus Stand ⇄ Railway Station (via Collectorate)',
    origin: 'Central Bus Stand (Gandhipuram)',
    destination: 'Railway Junction',
    operator: 'TNSTC Public Express',
    totalDistanceKm: 4.8,
    estimatedDurationMin: 22,
    fareMin: 8,
    fareMax: 20,
    firstService: '05:30 AM',
    lastService: '11:15 PM',
    frequencyMin: 8,
    status: 'Normal',
    color: '#1261d6',
    stops: [
      { stopId: 'stop-central', stopName: 'Central Bus Stand (Gandhipuram)', stopNameTa: 'மத்திய பேருந்து நிலையம்', stopNameHi: 'केंद्रीय बस स्टैंड', sequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-collectorate', stopName: 'District Collectorate', stopNameTa: 'மாவட்ட ஆட்சியர் அலுவலகம்', stopNameHi: 'जिला कलेक्ट्रेट', sequence: 2, distanceFromStartKm: 1.8, scheduledMinutesFromStart: 8 },
      { stopId: 'stop-clocktower', stopName: 'Clock Tower & Town Hall', stopNameTa: 'மணிக்கூண்டு & டவுன் ஹால்', stopNameHi: 'क्लॉक टॉवर', sequence: 3, distanceFromStartKm: 3.5, scheduledMinutesFromStart: 15 },
      { stopId: 'stop-railway', stopName: 'Railway Junction', stopNameTa: 'ரயில்வே சந்திப்பு', stopNameHi: 'रेलवे जंक्शन', sequence: 4, distanceFromStartKm: 4.8, scheduledMinutesFromStart: 22 }
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
    id: 'route-14b',
    routeNumber: '14B',
    routeName: 'Central Bus Stand ⇄ Lake Promenade (via General Hospital)',
    origin: 'Central Bus Stand (Gandhipuram)',
    destination: 'Valankulam Eco Lake Promenade',
    operator: 'City Circular Shuttle',
    totalDistanceKm: 5.6,
    estimatedDurationMin: 25,
    fareMin: 10,
    fareMax: 22,
    firstService: '06:00 AM',
    lastService: '10:30 PM',
    frequencyMin: 12,
    status: 'Normal',
    color: '#059669',
    stops: [
      { stopId: 'stop-central', stopName: 'Central Bus Stand (Gandhipuram)', stopNameTa: 'மத்திய பேருந்து நிலையம்', stopNameHi: 'केंद्रीय बस स्टैंड', sequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-collectorate', stopName: 'District Collectorate', stopNameTa: 'மாவட்ட ஆட்சியர் அலுவலகம்', stopNameHi: 'जिला कलेक्ट्रेट', sequence: 2, distanceFromStartKm: 1.8, scheduledMinutesFromStart: 8 },
      { stopId: 'stop-hospital', stopName: 'Government Medical College Hospital', stopNameTa: 'அரசு மருத்துவக் கல்லூரி', stopNameHi: 'मेडिकल कॉलेज अस्पताल', sequence: 3, distanceFromStartKm: 3.2, scheduledMinutesFromStart: 14 },
      { stopId: 'stop-railway', stopName: 'Railway Junction', stopNameTa: 'ரயில்வே சந்திப்பு', stopNameHi: 'रेलवे जंक्शन', sequence: 4, distanceFromStartKm: 4.2, scheduledMinutesFromStart: 19 },
      { stopId: 'stop-lake', stopName: 'Valankulam Eco Lake Promenade', stopNameTa: 'வாலாங்குளம் ஏரி நடைபாதை', stopNameHi: 'इको लेक सैरगाह', sequence: 5, distanceFromStartKm: 5.6, scheduledMinutesFromStart: 25 }
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
    id: 'route-8a',
    routeNumber: '8A',
    routeName: 'Central Bus Stand ⇄ Perur Temple Heritage Corridor',
    origin: 'Central Bus Stand (Gandhipuram)',
    destination: 'Perur Ancient Temple Ghats',
    operator: 'TNSTC Heritage Transit',
    totalDistanceKm: 9.4,
    estimatedDurationMin: 38,
    fareMin: 12,
    fareMax: 28,
    firstService: '05:00 AM',
    lastService: '10:00 PM',
    frequencyMin: 15,
    status: 'Normal',
    color: '#d97706',
    stops: [
      { stopId: 'stop-central', stopName: 'Central Bus Stand (Gandhipuram)', stopNameTa: 'மத்திய பேருந்து நிலையம்', stopNameHi: 'केंद्रीय बस स्टैंड', sequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-museum', stopName: 'Heritage Museum & VOC Park', stopNameTa: 'பாரம்பரிய அருங்காட்சியகம்', stopNameHi: 'हेरिटेज म्यूजियम', sequence: 2, distanceFromStartKm: 1.5, scheduledMinutesFromStart: 6 },
      { stopId: 'stop-clocktower', stopName: 'Clock Tower & Town Hall', stopNameTa: 'மணிக்கூண்டு & டவுன் ஹால்', stopNameHi: 'क्लॉक टॉवर', sequence: 3, distanceFromStartKm: 3.4, scheduledMinutesFromStart: 14 },
      { stopId: 'stop-market', stopName: 'Flower Market & Big Bazaar', stopNameTa: 'பூ சந்தை & பெரிய கடைவீதி', stopNameHi: 'फूल बाजार', sequence: 4, distanceFromStartKm: 4.6, scheduledMinutesFromStart: 20 },
      { stopId: 'stop-temple', stopName: 'Perur Ancient Temple Ghats', stopNameTa: 'பேரூர் பழங்கால கோவில்', stopNameHi: 'पेरूर प्राचीन मंदिर', sequence: 5, distanceFromStartKm: 9.4, scheduledMinutesFromStart: 38 }
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
    id: 'route-24a',
    routeNumber: '24A',
    routeName: 'Central Bus Stand ⇄ Railway Station (Fast Express)',
    origin: 'Central Bus Stand (Gandhipuram)',
    destination: 'Railway Junction',
    operator: 'Metropolitan Fast City Service',
    totalDistanceKm: 4.5,
    estimatedDurationMin: 18,
    fareMin: 15,
    fareMax: 25,
    firstService: '06:15 AM',
    lastService: '10:45 PM',
    frequencyMin: 10,
    status: 'Normal',
    color: '#7c3aed',
    stops: [
      { stopId: 'stop-central', stopName: 'Central Bus Stand (Gandhipuram)', stopNameTa: 'மத்திய பேருந்து நிலையம்', stopNameHi: 'केंद्रीय बस स्टैंड', sequence: 1, distanceFromStartKm: 0, scheduledMinutesFromStart: 0 },
      { stopId: 'stop-hospital', stopName: 'Government Medical College Hospital', stopNameTa: 'அரசு மருத்துவக் கல்லூரி', stopNameHi: 'मेडिकल कॉलेज अस्पताल', sequence: 2, distanceFromStartKm: 2.8, scheduledMinutesFromStart: 10 },
      { stopId: 'stop-railway', stopName: 'Railway Junction', stopNameTa: 'ரயில்வே சந்திப்பு', stopNameHi: 'रेलवे जंक्शन', sequence: 3, distanceFromStartKm: 4.5, scheduledMinutesFromStart: 18 }
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
    routeName: 'Central ⇄ Railway Junction',
    operator: 'TNSTC Public Express',
    currentLocation: {
      latitude: 11.0080,
      longitude: 76.9698,
      timestamp: new Date().toISOString(),
      speedKmH: 26,
      headingDeg: 195
    },
    currentStopId: 'stop-central',
    nextStopId: 'stop-collectorate',
    nextStopName: 'District Collectorate',
    etaNextStopMin: 3,
    etaDestinationMin: 12,
    status: 'On time',
    delayMinutes: 0,
    occupancy: 'Medium',
    vehicleType: 'Low-Floor AC',
    features: {
      ac: true,
      lowFloor: true,
      wheelchairAccessible: true,
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
    routeName: 'Central ⇄ Lake Promenade',
    operator: 'City Circular Shuttle',
    currentLocation: {
      latitude: 11.0040,
      longitude: 76.9720,
      timestamp: new Date().toISOString(),
      speedKmH: 22,
      headingDeg: 175
    },
    currentStopId: 'stop-collectorate',
    nextStopId: 'stop-hospital',
    nextStopName: 'Government Medical College Hospital',
    etaNextStopMin: 4,
    etaDestinationMin: 15,
    status: 'On time',
    delayMinutes: 0,
    occupancy: 'Low',
    vehicleType: 'Standard City',
    features: {
      ac: false,
      lowFloor: false,
      wheelchairAccessible: true,
      cctv: true,
      emergencyButtons: true,
      womenSection: true
    },
    lastUpdatedSecondsAgo: 14
  },
  {
    id: 'bus-8a-01',
    registrationNumber: 'TN-38-N-2022',
    routeId: 'route-8a',
    routeNumber: '8A',
    routeName: 'Central ⇄ Perur Temple Heritage',
    operator: 'TNSTC Heritage Transit',
    currentLocation: {
      latitude: 11.0000,
      longitude: 76.9640,
      timestamp: new Date().toISOString(),
      speedKmH: 18,
      headingDeg: 230
    },
    currentStopId: 'stop-museum',
    nextStopId: 'stop-clocktower',
    nextStopName: 'Clock Tower & Town Hall',
    etaNextStopMin: 5,
    etaDestinationMin: 22,
    status: 'On time',
    delayMinutes: 0,
    occupancy: 'High',
    vehicleType: 'Deluxe Mini',
    features: {
      ac: true,
      lowFloor: false,
      wheelchairAccessible: false,
      cctv: true,
      emergencyButtons: true,
      womenSection: true
    },
    lastUpdatedSecondsAgo: 5
  },
  {
    id: 'bus-24a-01',
    registrationNumber: 'TN-38-N-3110',
    routeId: 'route-24a',
    routeNumber: '24A',
    routeName: 'Central ⇄ Railway Junction (Express)',
    operator: 'Metropolitan Fast City Service',
    currentLocation: {
      latitude: 11.0140,
      longitude: 76.9710,
      timestamp: new Date().toISOString(),
      speedKmH: 32,
      headingDeg: 190
    },
    currentStopId: 'stop-central',
    nextStopId: 'stop-hospital',
    nextStopName: 'Government Medical College Hospital',
    etaNextStopMin: 6,
    etaDestinationMin: 14,
    status: 'On time',
    delayMinutes: 0,
    occupancy: 'Low',
    vehicleType: 'Electric Express',
    features: {
      ac: true,
      lowFloor: true,
      wheelchairAccessible: true,
      cctv: true,
      emergencyButtons: true,
      womenSection: true
    },
    lastUpdatedSecondsAgo: 11
  }
]

export const mockAlerts: ServiceAlert[] = [
  {
    id: 'alert-01',
    title: 'Peak Hour Traffic Congestion on Cross Cut Road',
    description: 'Buses towards Railway Junction via Collectorate may experience 8-12 minute delays between 5:30 PM and 7:30 PM due to ongoing civic drainage works.',
    severity: 'Warning',
    affectedRoutes: ['12A', '14B'],
    affectedStops: ['CBS-01', 'COL-05'],
    recommendedAction: 'Plan 15 minutes ahead or take Express Route 24A.',
    suggestedAlternativeRoute: '24A',
    startTime: 'Today, 05:00 PM',
    status: 'Active',
    isDemo: true
  },
  {
    id: 'alert-02',
    title: 'Women Safety Desk Activated at Central Stand',
    description: 'Helpline desk and 24/7 dedicated Pink Police team stationed at Bay 4 of Gandhipuram Central Stand.',
    severity: 'Information',
    affectedRoutes: ['12A', '14B', '8A', '24A'],
    affectedStops: ['CBS-01'],
    recommendedAction: 'Direct assistance available at Bay 4 or call toll-free 1091.',
    startTime: 'Ongoing',
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
    description: 'An architectural marvel dating back to the Chola period known for the magnificent Kanaka Sabha (Golden Hall) with intricate stone sculptures.',
    nearestStopId: 'stop-temple',
    nearestStopName: 'Perur Ancient Temple Ghats',
    connectingRoutes: ['8A'],
    approxTravelTimeMin: 35,
    demoFare: 22,
    bestTime: '06:00 AM – 11:30 AM & 04:30 PM – 08:30 PM',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    tags: ['Chola Architecture', 'Historic Ghats', 'Spiritual']
  },
  {
    id: 'tourist-voc',
    name: 'VOC Park & Heritage Science Center',
    nameTa: 'வ.உ.சி பூங்கா மற்றும் அறிவியல் மையம்',
    nameHi: 'वीओसी पार्क एवं विज्ञान केंद्र',
    category: 'Family',
    description: 'Family amusement park featuring lush walking avenues, a mini zoo, toy train, and dedicated children play zones adjacent to the science center.',
    nearestStopId: 'stop-museum',
    nearestStopName: 'Heritage Museum & VOC Park',
    connectingRoutes: ['8A', '24A'],
    approxTravelTimeMin: 12,
    demoFare: 12,
    bestTime: '04:00 PM – 07:30 PM',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
    tags: ['Children Friendly', 'Green Park', 'Relaxation']
  },
  {
    id: 'tourist-valankulam',
    name: 'Valankulam Eco Lake & Promenade',
    nameTa: 'வாலாங்குளம் சூழல் ஏரி மற்றும் நடைபாதை',
    nameHi: 'वलनकुलम इको लेक और सैरगाह',
    category: 'Nature',
    description: 'Scenic urban wetland promenade featuring pedestrian boardwalks, sunset viewpoint platforms, boating facilities, and snack kiosks.',
    nearestStopId: 'stop-lake',
    nearestStopName: 'Valankulam Eco Lake Promenade',
    connectingRoutes: ['14B', '24A'],
    approxTravelTimeMin: 20,
    demoFare: 15,
    bestTime: '05:30 PM – 08:30 PM (Sunsets)',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    tags: ['Sunset Point', 'Boating', 'Evening Walks']
  },
  {
    id: 'tourist-bazaar',
    name: 'Heritage Big Bazaar & Flower Market',
    nameTa: 'பாரம்பரிய பெரிய கடைவீதி & பூ சந்தை',
    nameHi: 'हेरिटेज बिग बाजार एवं फूल मंडी',
    category: 'Food & Market',
    description: 'Historic vibrant retail and fragrant jasmine market dating back over a century. A hub for local crafts, street food, and traditional textiles.',
    nearestStopId: 'stop-market',
    nearestStopName: 'Flower Market & Big Bazaar',
    connectingRoutes: ['12A', '8A'],
    approxTravelTimeMin: 18,
    demoFare: 12,
    bestTime: '07:00 AM – 11:00 AM for fresh blooms',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
    tags: ['Shopping', 'Street Food', 'Fragrant Market']
  }
]

export const mockLegalRules: LegalInformationItem[] = [
  {
    id: 'rule-fare-display',
    title: 'Right to Correct Fare & Printed Ticket/Receipt',
    shortExplanation: 'Under Motor Vehicles Act provisions, every passenger paying a fare is entitled to an immediate authorized paper or digital electronic ticket reflecting the sanctioned fare stage. Overcharging by staff is a penal offense.',
    applicability: 'All Stage Carriage Public & Private City Buses',
    officialSource: 'Motor Vehicles Act, 1988 (Sec 178/179) & Tamil Nadu Motor Vehicles Rules, 1989',
    lastVerified: '2026-08-15',
    category: 'Fares & Tickets'
  },
  {
    id: 'rule-women-seats',
    title: 'Reserved Seating for Women, Elderly & Differently Abled',
    shortExplanation: 'State transport regulations mandate at least 33% seating reservation for women, plus dedicated front seats for senior citizens and persons with disabilities. Male passengers occupying reserved seats must vacate upon request.',
    applicability: 'All State Transport Undertaking & Permitted Urban Buses',
    officialSource: 'Tamil Nadu Motor Vehicles Rules (Rule 245-A) & Central Rights of Persons with Disabilities Act, 2016',
    lastVerified: '2026-07-20',
    category: 'Safety & Women'
  },
  {
    id: 'rule-safe-stopping',
    title: 'Mandatory Designated Bus Stop Halts',
    shortExplanation: 'Stage carriage drivers are legally required to stop at all officially designated bus stops along the route when signaled by waiting passengers, unless the bus has reached certified maximum standing capacity.',
    applicability: 'Stage Carriage Vehicles in Municipal Limits',
    officialSource: 'Central Motor Vehicles Rules, 1989 (Rule 21 - Driver Conduct)',
    lastVerified: '2026-08-01',
    category: 'Driver Conduct'
  },
  {
    id: 'rule-complaint-book',
    title: 'Right to Record Complaints & Grievance Escrow',
    shortExplanation: 'Every operational stage carriage must maintain an official Complaint Book accessible to passengers upon request to the conductor, and passengers are entitled to file digital grievances with mandatory timeline resolution.',
    applicability: 'Every licensed public bus conductor & transport depot',
    officialSource: 'Tamil Nadu Motor Vehicles Rules, 1989 (Rule 250 - Complaint Books in Stage Carriages)',
    lastVerified: '2026-08-10',
    category: 'Grievance Redressal'
  }
]
