import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    storage: { from: vi.fn() }
  }
}))

import { supabase } from '../lib/supabase'
import { createComplaint, getComplaintByNumber, uploadEvidence } from './complaints'

describe('complaint workflow integration boundary', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('creates a complaint and returns the database record', async () => {
    const record = { id: 'c1', complaint_number: 'TJ-2026-000001' }
    const single = vi.fn().mockResolvedValue({ data: record, error: null })
    const select = vi.fn(() => ({ single }))
    const insert = vi.fn(() => ({ select }))
    ;(supabase.from as any).mockReturnValue({ insert })

    const result = await createComplaint({ passenger_id: 'u1', category: 'Delay' })
    expect(result.data).toEqual(record)
    expect(insert).toHaveBeenCalledWith({ passenger_id: 'u1', category: 'Delay' })
  })

  it('looks up a complaint by public complaint number', async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: 'c1' }, error: null })
    const eq = vi.fn(() => ({ single }))
    const select = vi.fn(() => ({ eq }))
    ;(supabase.from as any).mockReturnValue({ select })

    await getComplaintByNumber('TJ-2026-000001')
    expect(eq).toHaveBeenCalledWith('complaint_number', 'TJ-2026-000001')
  })

  it('uploads evidence before creating its database record', async () => {
    const file = new File(['evidence'], 'ticket.txt', { type: 'text/plain' })
    const upload = vi.fn().mockResolvedValue({ data: { path: 'c1/file.txt' }, error: null })
    const getPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.test/file.txt' } })
    ;(supabase.storage.from as any).mockReturnValue({ upload, getPublicUrl })

    const single = vi.fn().mockResolvedValue({ data: { id: 'e1' }, error: null })
    const select = vi.fn(() => ({ single }))
    const insert = vi.fn(() => ({ select }))
    ;(supabase.from as any).mockReturnValue({ insert })

    const result = await uploadEvidence(file, 'c1', 'u1')
    expect(result.data).toEqual({ id: 'e1' })
    expect(upload).toHaveBeenCalled()
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ complaint_id: 'c1', uploaded_by: 'u1', file_name: 'ticket.txt' }))
  })
})
