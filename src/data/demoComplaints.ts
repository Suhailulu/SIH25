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
    category: 'Denied Seat',
    subcategory: 'Seat denial on a crowded bus',
    priority: 'MEDIUM',
    description: 'I had a valid ticket but was refused a seat and asked to stand.',
    status: 'Under Review',
    created_at: '2026-09-01T08:00:00Z',
    transport_type: 'Bus',
    operator_name: 'Metro Transit',
    service_number: 'B-12',
    route: 'City Centre to North Station',
    boarding_point: 'City Centre',
    destination: 'North Station',
    journey_date: '2026-08-31',
    journey_time: '08:10'
  },
  {
    id: 'c-1002',
    complaint_number: 'TJ-2026-000002',
    category: 'Staff Misconduct',
    subcategory: 'Unprofessional conduct',
    priority: 'HIGH',
    description: 'Conductor behaved rudely and refused to address my ticket query.',
    status: 'Assigned to Officer',
    created_at: '2026-09-03T09:20:00Z',
    transport_type: 'Train',
    operator_name: 'Rapid Rail',
    service_number: 'R-5',
    route: 'West End to Airport',
    boarding_point: 'West End',
    destination: 'Airport',
    journey_date: '2026-09-02',
    journey_time: '18:45'
  },
  {
    id: 'c-1003',
    complaint_number: 'TJ-2026-000003',
    category: 'Ticketing Issue',
    subcategory: 'Incorrect fare charge',
    priority: 'LOW',
    description: 'I was charged more than the displayed fare without explanation.',
    status: 'Resolved',
    created_at: '2026-09-04T15:10:00Z',
    transport_type: 'Metro',
    operator_name: 'Urban Metro',
    service_number: 'M-8',
    route: 'Old Town to Riverside',
    boarding_point: 'Old Town',
    destination: 'Riverside',
    journey_date: '2026-09-02',
    journey_time: '07:45'
  }
]

export const complaintTimeline = [
  { status: 'Submitted', note: 'Complaint filed by passenger', ts: '2026-09-01T08:05:00Z' },
  { status: 'Received', note: 'Complaint accepted by the system', ts: '2026-09-01T08:20:00Z' },
  { status: 'Under Review', note: 'Awaiting review by the authority', ts: '2026-09-02T09:15:00Z' },
  { status: 'Assigned to Officer', note: 'Officer assigned for investigation', ts: '2026-09-03T10:00:00Z' },
  { status: 'Resolved', note: 'Issue reviewed and response shared', ts: '2026-09-05T13:30:00Z' }
]
