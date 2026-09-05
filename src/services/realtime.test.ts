import { beforeEach, describe, expect, it, vi } from 'vitest'

const channel = { on: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn().mockResolvedValue({}) }
vi.mock('../lib/supabase', () => ({ supabase: { channel: vi.fn(() => channel) } }))

import { supabase } from '../lib/supabase'
import { subscribeToEvidence } from './complaints'
import { subscribeToMessages } from './messages'
import { subscribeToNotifications } from './notifications'

describe('Supabase realtime integration boundaries', () => {
  beforeEach(() => { vi.clearAllMocks(); channel.on.mockReturnValue(channel); channel.subscribe.mockReturnValue(channel) })

  it('subscribes to complaint messages with an INSERT filter', () => {
    subscribeToMessages('c1', vi.fn())
    expect(supabase.channel).toHaveBeenCalledWith('public:complaint_messages:complaint=c1')
    expect(channel.on).toHaveBeenCalledWith('postgres_changes', expect.objectContaining({ table: 'complaint_messages', filter: 'complaint_id=eq.c1' }), expect.any(Function))
  })

  it('subscribes to evidence and notifications and can unsubscribe', async () => {
    const evidence = subscribeToEvidence('c1', vi.fn())
    const notifications = subscribeToNotifications('u1', vi.fn())
    await evidence?.unsubscribe()
    await notifications?.unsubscribe()
    expect(channel.on).toHaveBeenCalledTimes(2)
    expect(channel.unsubscribe).toHaveBeenCalledTimes(2)
  })

  it('does not create a channel for empty identifiers', () => {
    subscribeToMessages('', vi.fn())
    subscribeToEvidence('', vi.fn())
    subscribeToNotifications('', vi.fn())
    expect(supabase.channel).not.toHaveBeenCalled()
  })
})