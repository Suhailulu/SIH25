import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getSession, onAuthStateChange, signInWithEmail, signUpWithEmail } from '../services/auth'
import { getProfile } from '../services/profiles'
import { rbacService, AppRole, ManagedUser } from '../services/rbacService'

export interface User {
  id: string
  email?: string
  name?: string
  role?: AppRole
  status?: string
  assignedBus?: string
  assignedRoute?: string
  depot?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password?: string) => Promise<any>
  signUp: (email: string, password: string, name?: string) => Promise<any>
  signOut: () => Promise<any>
  switchDemoRole: (role: AppRole) => void
  currentRole: AppRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const CURRENT_USER_STORAGE_KEY = 'lst_current_active_user_v2'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch {
      // ignore
    }
    return null
  })
  const [loading, setLoading] = useState(true)

  const saveActiveUser = (u: User | null) => {
    setUser(u)
    try {
      if (u) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(u))
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    let mounted = true

    // Check Supabase session first
    getSession()
      .then(async (res) => {
        const session = res.data.session
        if (mounted && session?.user) {
          const id = session.user.id
          const profileRes = await getProfile(id)
          const matchedManaged = rbacService.findUserByEmail(session.user.email || '')

          saveActiveUser({
            id,
            email: session.user.email || undefined,
            name: matchedManaged?.name || profileRes.data?.full_name || 'Transit Commuter',
            role: (matchedManaged?.role || profileRes.data?.role || 'passenger') as AppRole,
            assignedBus: matchedManaged?.assignedBus,
            assignedRoute: matchedManaged?.assignedRoute,
            depot: matchedManaged?.depot,
            phone: matchedManaged?.phone || profileRes.data?.phone
          })
        }
        if (mounted) setLoading(false)
      })
      .catch(() => {
        if (mounted) setLoading(false)
      })

    const authSub = onAuthStateChange(async (event, session) => {
      if (session?.user && mounted) {
        const id = session.user.id
        const profileRes = await getProfile(id)
        const matchedManaged = rbacService.findUserByEmail(session.user.email || '')

        saveActiveUser({
          id,
          email: session.user.email || undefined,
          name: matchedManaged?.name || profileRes.data?.full_name || 'Transit Commuter',
          role: (matchedManaged?.role || profileRes.data?.role || 'passenger') as AppRole,
          assignedBus: matchedManaged?.assignedBus,
          assignedRoute: matchedManaged?.assignedRoute,
          depot: matchedManaged?.depot,
          phone: matchedManaged?.phone || profileRes.data?.phone
        })
      } else if (mounted && event === 'SIGNED_OUT') {
        saveActiveUser(null)
      }
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      const sub = (authSub as any)?.data?.subscription || (authSub as any)?.subscription
      sub?.unsubscribe?.()
    }
  }, [])

  async function signIn(email: string, password?: string) {
    const cleanEmail = email.toLowerCase().trim()

    // 1. Check in managed RBAC directory first
    try {
      const managedUser = rbacService.authenticateUser(cleanEmail, password)
      if (managedUser) {
        const activeUser: User = {
          id: managedUser.id,
          email: managedUser.email,
          name: managedUser.name,
          role: managedUser.role,
          status: managedUser.status,
          assignedBus: managedUser.assignedBus,
          assignedRoute: managedUser.assignedRoute,
          depot: managedUser.depot,
          phone: managedUser.phone
        }
        saveActiveUser(activeUser)

        // Attempt optional supabase sync in background
        if (password) {
          signInWithEmail(cleanEmail, password).catch(() => {})
        }

        return { data: { user: activeUser, session: { user: activeUser } }, error: null }
      }
    } catch (err: any) {
      return { data: null, error: { message: err.message || 'Authentication failed' } }
    }

    // 2. Fallback to Supabase Auth
    if (password) {
      const res = await signInWithEmail(cleanEmail, password)
      if (res.data?.user) {
        const profileRes = await getProfile(res.data.user.id)
        const activeUser: User = {
          id: res.data.user.id,
          email: res.data.user.email || cleanEmail,
          name: profileRes.data?.full_name || 'Transit Commuter',
          role: (profileRes.data?.role || 'passenger') as AppRole
        }
        saveActiveUser(activeUser)
      }
      return res
    }

    return { data: null, error: { message: 'User not found. Please check credentials or contact Super Admin.' } }
  }

  async function signUp(email: string, password: string, name?: string) {
    const cleanEmail = email.toLowerCase().trim()

    // Passanger registration in RBAC storage
    let managed: ManagedUser | null = null
    try {
      managed = rbacService.registerPassenger(cleanEmail, name || 'Citizen Commuter')
    } catch (e: any) {
      return { data: null, error: { message: e.message } }
    }

    // Also attempt Supabase sign up
    const res = await signUpWithEmail(cleanEmail, password)

    const newUser: User = {
      id: res.data?.user?.id || managed.id,
      email: cleanEmail,
      name: managed.name,
      role: 'passenger',
      status: 'active'
    }

    saveActiveUser(newUser)
    return { data: { user: newUser, session: res.data?.session || { user: newUser } }, error: null }
  }

  async function signOutFn() {
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    saveActiveUser(null)
  }

  function switchDemoRole(role: AppRole) {
    const users = rbacService.getUsers()
    const target = users.find((u) => u.role === role && u.status === 'active')
    if (target) {
      saveActiveUser({
        id: target.id,
        email: target.email,
        name: target.name,
        role: target.role,
        status: target.status,
        assignedBus: target.assignedBus,
        assignedRoute: target.assignedRoute,
        depot: target.depot,
        phone: target.phone
      })
    }
  }

  const currentRole: AppRole = user?.role || 'passenger'

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut: signOutFn,
        switchDemoRole,
        currentRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
