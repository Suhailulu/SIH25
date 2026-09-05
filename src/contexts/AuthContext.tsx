import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getSession, onAuthStateChange } from '../services/auth'
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
        const role = profileRes.data?.role
        setUser({ id, email: session.user.email || undefined, role })
      }
      setLoading(false)
    })

    const { subscription } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const id = session.user.id
        const profileRes = await getProfile(id)
        const role = profileRes.data?.role
        setUser({ id, email: session.user.email || undefined, role })
      } else {
        setUser(null)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password })
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
