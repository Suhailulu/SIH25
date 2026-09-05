export type ComplaintStatus =
  | 'Submitted'
  | 'Received'
  | 'Under Review'
  | 'Evidence Verification'
  | 'Assigned to Officer'
  | 'Investigation in Progress'
  | 'Additional Information Required'
  | 'Action Taken'
  | 'Resolved'
  | 'Closed'

export type ComplaintRecord = {
  id: string
  complaint_number: string
  category: string
  subcategory: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  status: ComplaintStatus
  created_at: string
  transport_type: string
  operator_name: string
  service_number: string
  route: string
  boarding_point: string
  destination: string
  journey_date: string
  journey_time: string
}

export const demoComplaints: ComplaintRecord[] = [
  {
    id: 'c-1001',
    complaint_number: 'TJ-2026-000001',
    category: 'Overcharging & Fare Issue',
    subcategory: 'Refusal of Women Zero-Fare Ticket (Vidiyal Payanam)',
    priority: 'HIGH',
    description: 'Conductor on TNSTC white-board ordinary city bus refused to issue zero-fare ticket under Tamil Nadu Vidiyal Payanam Scheme and demanded full fare of ₹15 between Gandhipuram and Town Hall.',
    status: 'Under Review',
    created_at: '2026-09-01T08:00:00Z',
    transport_type: 'TNSTC City Ordinary',
    operator_name: 'TNSTC (Coimbatore Division)',
    service_number: 'TN-38-N-1204',
    route: 'Route 12A (Gandhipuram ⇄ Coimbatore Railway Junction)',
    boarding_point: 'Gandhipuram Central Stand',
    destination: 'Town Hall Clock Tower',
    journey_date: '2026-08-31',
    journey_time: '08:10'
  },
  {
    id: 'c-1002',
    complaint_number: 'TJ-2026-000002',
    category: 'Staff Misconduct & Skipping Halt',
    subcategory: 'Skipping Designated Lawley Road Stop',
    priority: 'HIGH',
    description: 'Driver deliberately did not halt at the designated Lawley Road (Agricultural University Gate) stop despite students and senior citizens waiting and signaling. Bus sped past causing 25 min delay.',
    status: 'Assigned to Officer',
    created_at: '2026-09-03T09:20:00Z',
    transport_type: 'TNSTC Express',
    operator_name: 'TNSTC (Marudhamalai Depot)',
    service_number: 'TN-38-N-2022',
    route: 'Route 70 (Gandhipuram ⇄ Marudhamalai Temple)',
    boarding_point: 'Lawley Road Junction (TNAU)',
    destination: 'Marudhamalai Adivaram',
    journey_date: '2026-09-02',
    journey_time: '18:45'
  },
  {
    id: 'c-1003',
    complaint_number: 'TJ-2026-000003',
    category: 'Denied Reserved Seat',
    subcategory: 'Refusal to vacate 33% Women Reserved Seat (Rule 245-A)',
    priority: 'MEDIUM',
    description: 'Male passengers refused to vacate front reserved seating for a pregnant commuter. Conductor was approached but refused to enforce Tamil Nadu Motor Vehicles Rule 245-A.',
    status: 'Resolved',
    created_at: '2026-09-04T15:10:00Z',
    transport_type: 'TNSTC City Bus',
    operator_name: 'TNSTC (Ukkadam Depot)',
    service_number: 'TN-38-N-1540',
    route: 'Route 14B (Gandhipuram ⇄ Valankulam Lake Promenade)',
    boarding_point: 'Collectorate East Gate',
    destination: 'Valankulam Eco Park',
    journey_date: '2026-09-02',
    journey_time: '07:45'
  },
  {
    id: 'c-1004',
    complaint_number: 'TJ-2026-000004',
    category: 'Safety & Rash Driving',
    subcategory: 'Overtaking on narrow Perur Temple approach road',
    priority: 'CRITICAL',
    description: 'Driver was operating vehicle in a rash manner with open doors along Perur Main Road during peak market hours. Emergency panic button was pressed by passengers.',
    status: 'Action Taken',
    created_at: '2026-09-05T11:30:00Z',
    transport_type: 'TNSTC Deluxe',
    operator_name: 'TNSTC (Perur Branch)',
    service_number: 'TN-38-N-3110',
    route: 'Route 8A (Gandhipuram ⇄ Perur Pateeswarar Temple)',
    boarding_point: 'Big Bazaar Flower Market',
    destination: 'Perur Temple Arch',
    journey_date: '2026-09-05',
    journey_time: '10:15'
  }
]

export const complaintTimeline = [
  { status: 'Submitted', note: 'Grievance submitted by passenger with digital ticket receipt', ts: '2026-09-01T08:05:00Z' },
  { status: 'Received', note: 'Logged into TNSTC Civic Grievance Escrow System', ts: '2026-09-01T08:20:00Z' },
  { status: 'Under Review', note: 'Awaiting depot branch manager review & crew duty-sheet inspection', ts: '2026-09-02T09:15:00Z' },
  { status: 'Assigned to Officer', note: 'Assigned to Depot Inspector K. Murugesan (Badge #CB-849)', ts: '2026-09-03T10:00:00Z' },
  { status: 'Action Taken', note: 'Conductor memo issued; ₹500 disciplinary penalty recorded under Sec 178 MVA', ts: '2026-09-04T16:00:00Z' },
  { status: 'Resolved', note: 'Resolution confirmed with complainant & passenger apology letter dispatched', ts: '2026-09-05T13:30:00Z' }
]
