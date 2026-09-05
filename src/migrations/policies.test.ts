import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const policies = readFileSync(resolve(process.cwd(), 'src/migrations/policies.sql'), 'utf8')

describe('RLS policy contract', () => {
  it('enables RLS for user-owned and complaint data', () => {
    expect(policies).toContain('ALTER TABLE IF EXISTS complaints ENABLE ROW LEVEL SECURITY')
    expect(policies).toContain('ALTER TABLE IF EXISTS evidence ENABLE ROW LEVEL SECURITY')
    expect(policies).toContain('ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY')
  })

  it('keeps evidence and notifications scoped to authorized users', () => {
    expect(policies).toContain('evidence_passenger_or_authority')
    expect(policies).toContain('notifications_own')
    expect(policies).toContain('user_id = auth.uid()')
  })

  it('protects internal messages from passenger reads', () => {
    expect(policies).toContain('messages_passenger_public')
    expect(policies).toContain('is_internal = false')
  })
})
