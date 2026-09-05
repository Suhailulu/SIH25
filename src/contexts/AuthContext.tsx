import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getSession, onAuthStateChange, signInWithEmail, signUpWithEmail } from '../services/auth'
import { getProfile } from '../services/profiles'

type User = {
  id: string
  email?: string
  role?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getSession().then(async (res) => {
      const session = res.data.session
      if (mounted && session?.user) {
        const id = session.user.id
        const profileRes = await getProfile(id)
        if (mounted) setUser({ id, email: session.user.email || undefined, role: profileRes.data?.role })
      }
      if (mounted) setLoading(false)
    }).catch(() => {
      if (mounted) setLoading(false)
    })

    const authSub = onAuthStateChange(async (event, session) => {
      if (session?.user && mounted) {
        const id = session.user.id
        const profileRes = await getProfile(id)
        const role = profileRes.data?.role
        if (mounted) setUser({ id, email: session.user.email || undefined, role })
      } else if (mounted) {
        setUser(null)
      }
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      const sub = (authSub as any)?.data?.subscription || (authSub as any)?.subscription
      sub?.unsubscribe?.()
    }
  }, [])

  async function signIn(email: string, password: string) {
    return signInWithEmail(email, password)
  }

  async function signUp(email: string, password: string) {
    return signUpWithEmail(email, password)
  }

  async function signOutFn() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut: signOutFn }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
