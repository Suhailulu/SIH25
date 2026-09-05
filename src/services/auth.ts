import { supabase } from '../lib/supabase'

export const GENERIC_AUTH_ERROR = 'Unable to sign in with those credentials.'

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email))
}

export function getPasswordValidationError(password: string) {
  if (password.length < 10) return 'Use at least 10 characters.'
  if (!/[a-z]/.test(password)) return 'Include at least one lowercase letter.'
  if (!/[A-Z]/.test(password)) return 'Include at least one uppercase letter.'
  if (!/[0-9]/.test(password)) return 'Include at least one number.'
  return null
}

export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email: normalizeEmail(email), password })
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email: normalizeEmail(email), password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  return supabase.auth.getSession()
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => callback(event, session))
}
