import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/supabase', () => ({
  supabase: { auth: { signUp: vi.fn(), signInWithPassword: vi.fn(), signOut: vi.fn(), getSession: vi.fn(), onAuthStateChange: vi.fn() } }
}))

import { supabase } from '../lib/supabase'
import { getPasswordValidationError, getSession, isValidEmail, normalizeEmail, onAuthStateChange, signInWithEmail, signOut, signUpWithEmail } from './auth'

describe('auth service integration boundary', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('passes signup credentials to Supabase Auth', async () => {
    ;(supabase.auth.signUp as any).mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })
    await signUpWithEmail('passenger@example.com', 'password')
    expect(supabase.auth.signUp).toHaveBeenCalledWith({ email: 'passenger@example.com', password: 'password' })
  })

  it('delegates sign in, session, and sign out', async () => {
    await signInWithEmail('passenger@example.com', 'password')
    await getSession()
    await signOut()
    expect(supabase.auth.signInWithPassword).toHaveBeenCalled()
    expect(supabase.auth.getSession).toHaveBeenCalled()
    expect(supabase.auth.signOut).toHaveBeenCalled()
  })

  it('forwards auth state changes to the callback', () => {
    const callback = vi.fn()
    onAuthStateChange(callback)
    const registered = (supabase.auth.onAuthStateChange as any).mock.calls[0][0]
    registered('SIGNED_IN', { user: { id: 'u1' } })
    expect(callback).toHaveBeenCalledWith('SIGNED_IN', { user: { id: 'u1' } })
  })

  it('normalizes and validates email input', () => {
    expect(normalizeEmail('  PERSON@Example.COM ')).toBe('person@example.com')
    expect(isValidEmail('person@example.com')).toBe(true)
    expect(isValidEmail('not-an-email')).toBe(false)
  })

  it('enforces a strong password baseline', () => {
    expect(getPasswordValidationError('short')).toBe('Use at least 10 characters.')
    expect(getPasswordValidationError('longpassword')).toContain('uppercase')
    expect(getPasswordValidationError('Longpassword')).toContain('number')
    expect(getPasswordValidationError('Longpassword1')).toBeNull()
  })
})