import { supabase } from '../lib/supabase'

export async function createTicket(complaintId: string, ticketNumber?: string, bookingReference?: string, seatNumber?: string, ticketFilePath?: string) {
  const payload: any = {
    complaint_id: complaintId,
    ticket_number: ticketNumber,
    booking_reference: bookingReference,
    seat_number: seatNumber,
    ticket_file_path: ticketFilePath
  }
  const { data, error } = await supabase.from('tickets').insert(payload).select().single()
  return { data, error }
}
