import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}))

vi.mock('./notifications', () => ({
  createNotification: vi.fn()
}))

import { supabase } from '../lib/supabase'
import { createNotification } from './notifications'
import { getMessagesForComplaint, sendMessage } from './messages'

describe('messages service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('getMessagesForComplaint returns messages', async () => {
    const fakeData = [{ id: 'm1', message: 'hello', is_internal: false, created_at: new Date().toISOString() }]
    const orderMock = vi.fn().mockResolvedValue({ data: fakeData, error: null })
    const eqMock = vi.fn(() => ({ order: orderMock }))
    const selectMock = vi.fn(() => ({ eq: eqMock }))

    ;(supabase.from as any).mockReturnValue({ select: selectMock })

    const res = await getMessagesForComplaint('complaint-1')
    expect(res.data).toEqual(fakeData)
    expect(selectMock).toHaveBeenCalledWith('*')
    expect(eqMock).toHaveBeenCalledWith('complaint_id', 'complaint-1')
  })

  it('sendMessage inserts message and creates notifications', async () => {
    const inserted = { id: 'm2', message: 'hi' }
    const insertMock = vi.fn().mockResolvedValue({ data: inserted, error: null })
    const selectMock = vi.fn().mockReturnValue({ insert: insertMock })

    // mock complaint select
    const complaintSingle = { id: 'c1', passenger_id: 'p1', assigned_officer_id: 'o1', complaint_number: 'TJ-2026-000001' }
    const singleMock = vi.fn().mockResolvedValue({ data: complaintSingle })
    const eqForComplaint = vi.fn(() => ({ single: singleMock }))
    const selectForComplaint = vi.fn(() => ({ eq: eqForComplaint }))

    ;(supabase.from as any).mockImplementation((table: string) => {
      if (table === 'complaint_messages') return { insert: insertMock }
      if (table === 'complaints') return { select: selectForComplaint }
      return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ order: vi.fn().mockResolvedValue({ data: [], error: null }) }) }) }
    })

    const result = await sendMessage('c1', 'p1', 'hello', false)
    expect(result.data).toEqual(inserted)
    expect(createNotification).toHaveBeenCalled()
  })
})
