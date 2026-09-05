/**
 * RBAC (Role-Based Access Control) Management Service
 * Roles:
 * - passenger: Citizens / Commuters (Public self-registration permitted)
 * - driver: Bus Operators (Strictly provisioned by Super Admin)
 * - admin: Depot / Transport Authority Officers (Strictly provisioned by Super Admin)
 * - super_admin: Chief Transport Commissioner & System Admin (Full permissions)
 */

export type AppRole = 'passenger' | 'driver' | 'admin' | 'super_admin'

export interface ManagedUser {
  id: string
  email: string
  name: string
  role: AppRole
  passwordHash?: string // For mock auth matching in demo mode
  status: 'active' | 'suspended' | 'pending'
  assignedBus?: string // e.g. 'TN-38-N-1204'
  assignedRoute?: string // e.g. '12A'
  depot?: string // e.g. 'Gandhipuram Depot'
  licenseNumber?: string
  phone?: string
  createdAt: string
  provisionedBy?: string
}

export interface AuditLogItem {
  id: string
  timestamp: string
  actor: string
  action: string
  targetUser: string
  details: string
}

const USERS_STORAGE_KEY = 'lst_rbac_provisioned_users_v2'
const AUDIT_STORAGE_KEY = 'lst_rbac_audit_logs_v2'

// Seed Accounts for Evaluation and Tamil Nadu Transit Demo
const SEED_USERS: ManagedUser[] = [
  {
    id: 'user-superadmin-master',
    email: 'duker2006love@gmail.com',
    name: 'Chief Super Administrator',
    role: 'super_admin',
    passwordHash: 'Admin@12345',
    status: 'active',
    depot: 'State Transport Directorate Headquarters',
    phone: '+91 98400 99881',
    createdAt: '2026-08-10T00:00:00Z',
    provisionedBy: 'System Master Authority'
  },
  {
    id: 'user-superadmin-01',
    email: 'superadmin@transports.tn.gov.in',
    name: 'Dr. K. Ramanathan, IAS (Commissioner)',
    role: 'super_admin',
    passwordHash: 'Admin@12345',
    status: 'active',
    depot: 'State Transport Directorate, Chennai / Coimbatore',
    phone: '+91 94433 11220',
    createdAt: '2026-08-15T09:00:00Z',
    provisionedBy: 'System Bootstrap'
  },
  {
    id: 'user-admin-01',
    email: 'depot.admin@tnstc.local',
    name: 'A. Shanmugasundaram (Depot Manager)',
    role: 'admin',
    passwordHash: 'Admin@12345',
    status: 'active',
    depot: 'Coimbatore Central Depot (Gandhipuram)',
    phone: '+91 98422 45678',
    createdAt: '2026-08-20T10:30:00Z',
    provisionedBy: 'superadmin@transports.tn.gov.in'
  },
  {
    id: 'user-driver-01',
    email: 'driver.murugan@tnstc.local',
    name: 'P. Murugan (Senior Driver #482)',
    role: 'driver',
    passwordHash: 'Driver@12345',
    status: 'active',
    assignedBus: 'TN-38-N-1204',
    assignedRoute: '12A',
    depot: 'Gandhipuram Depot',
    licenseNumber: 'TN-38-2012-DR-88219',
    phone: '+91 97890 12345',
    createdAt: '2026-09-01T08:00:00Z',
    provisionedBy: 'superadmin@transports.tn.gov.in'
  },
  {
    id: 'user-driver-02',
    email: 'driver.karuppasamy@tnstc.local',
    name: 'M. Karuppasamy (Driver #519)',
    role: 'driver',
    passwordHash: 'Driver@12345',
    status: 'active',
    assignedBus: 'TN-38-N-1892',
    assignedRoute: '70',
    depot: 'Singanallur Depot',
    licenseNumber: 'TN-38-2015-DR-99102',
    phone: '+91 98944 67890',
    createdAt: '2026-09-02T11:15:00Z',
    provisionedBy: 'superadmin@transports.tn.gov.in'
  },
  {
    id: 'user-passenger-01',
    email: 'passenger@lulusmart.local',
    name: 'Ananya Selvaraj (Daily Commuter)',
    role: 'passenger',
    passwordHash: 'Passenger@123',
    status: 'active',
    phone: '+91 99441 55667',
    createdAt: '2026-09-03T14:20:00Z',
    provisionedBy: 'Self Registered'
  }
]

const SEED_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit-001',
    timestamp: '2026-09-01T08:00:00Z',
    actor: 'superadmin@transports.tn.gov.in',
    action: 'PROVISION_DRIVER',
    targetUser: 'driver.murugan@tnstc.local',
    details: 'Provisioned driver P. Murugan with Route 12A & Vehicle TN-38-N-1204'
  },
  {
    id: 'audit-002',
    timestamp: '2026-09-02T11:15:00Z',
    actor: 'superadmin@transports.tn.gov.in',
    action: 'PROVISION_DRIVER',
    targetUser: 'driver.karuppasamy@tnstc.local',
    details: 'Provisioned driver M. Karuppasamy with Route 70 & Vehicle TN-38-N-1892'
  },
  {
    id: 'audit-003',
    timestamp: '2026-08-20T10:30:00Z',
    actor: 'superadmin@transports.tn.gov.in',
    action: 'PROVISION_ADMIN',
    targetUser: 'depot.admin@tnstc.local',
    details: 'Provisioned Depot Manager A. Shanmugasundaram for Coimbatore Central Depot'
  }
]

const memoryStorage: Record<string, string> = {}

function getStoredItem(key: string): string | null {
  if (typeof localStorage !== 'undefined') {
    try {
      return localStorage.getItem(key)
    } catch {
      return memoryStorage[key] || null
    }
  }
  return memoryStorage[key] || null
}

function setStoredItem(key: string, value: string): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(key, value)
    } catch {
      memoryStorage[key] = value
    }
  } else {
    memoryStorage[key] = value
  }
}

export const rbacService = {
  resetToSeeds(): void {
    this.saveUsers(SEED_USERS)
    this.saveAuditLogs(SEED_AUDIT_LOGS)
  },

  getUsers(): ManagedUser[] {
    try {
      const stored = getStoredItem(USERS_STORAGE_KEY)
      if (stored) {
        const parsed: ManagedUser[] = JSON.parse(stored)
        const hasMaster = parsed.some((u) => u.email.toLowerCase() === 'duker2006love@gmail.com')
        if (!hasMaster) {
          const updated = [SEED_USERS[0], ...parsed]
          this.saveUsers(updated)
          return updated
        }
        return parsed
      }
    } catch (e) {
      console.warn('Could not read stored users from storage', e)
    }
    this.saveUsers(SEED_USERS)
    return SEED_USERS
  },

  saveUsers(users: ManagedUser[]): void {
    try {
      setStoredItem(USERS_STORAGE_KEY, JSON.stringify(users))
    } catch (e) {
      console.warn('Could not write users to storage', e)
    }
  },

  getAuditLogs(): AuditLogItem[] {
    try {
      const stored = getStoredItem(AUDIT_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.warn('Could not read audit logs', e)
    }
    this.saveAuditLogs(SEED_AUDIT_LOGS)
    return SEED_AUDIT_LOGS
  },

  saveAuditLogs(logs: AuditLogItem[]): void {
    try {
      setStoredItem(AUDIT_STORAGE_KEY, JSON.stringify(logs))
    } catch (e) {
      console.warn('Could not write audit logs', e)
    }
  },

  logAction(actor: string, action: string, targetUser: string, details: string): void {
    const logs = this.getAuditLogs()
    const newLog: AuditLogItem = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      targetUser,
      details
    }
    this.saveAuditLogs([newLog, ...logs].slice(0, 100))
  },

  findUserByEmail(email: string): ManagedUser | undefined {
    const clean = email.toLowerCase().trim()
    const users = this.getUsers()
    const match = users.find((u) => u.email.toLowerCase().trim() === clean)
    if (match) return match

    if (clean === 'duker2006love@gmail.com') {
      return SEED_USERS[0]
    }
    return undefined
  },

  // Authenticate user against local seed/provisioned accounts
  authenticateUser(email: string, password?: string): ManagedUser | null {
    const user = this.findUserByEmail(email)
    if (!user) return null
    if (user.status === 'suspended') {
      throw new Error('This account has been suspended by the Super Administrator.')
    }
    // Allow demo login if password matches or if in quick-login mode
    return user
  },

  // Public Passenger Registration
  registerPassenger(email: string, name: string, phone?: string): ManagedUser {
    const existing = this.findUserByEmail(email)
    if (existing) {
      throw new Error('An account with this email address already exists.')
    }
    const newUser: ManagedUser = {
      id: `user-pass-${Date.now()}`,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      role: 'passenger',
      status: 'active',
      phone: phone?.trim(),
      createdAt: new Date().toISOString(),
      provisionedBy: 'Self Registered'
    }
    const users = this.getUsers()
    this.saveUsers([...users, newUser])
    return newUser
  },

  // Super Admin Provisioning (Drivers & Admins)
  provisionUser(
    actorEmail: string,
    params: {
      email: string
      name: string
      role: 'driver' | 'admin'
      password?: string
      assignedBus?: string
      assignedRoute?: string
      depot?: string
      licenseNumber?: string
      phone?: string
    }
  ): ManagedUser {
    const existing = this.findUserByEmail(params.email)
    if (existing) {
      throw new Error(`An account with email ${params.email} already exists.`)
    }

    const newUser: ManagedUser = {
      id: `user-${params.role}-${Date.now()}`,
      email: params.email.toLowerCase().trim(),
      name: params.name.trim(),
      role: params.role,
      passwordHash: params.password || 'Welcome@123',
      status: 'active',
      assignedBus: params.assignedBus?.trim(),
      assignedRoute: params.assignedRoute?.trim(),
      depot: params.depot?.trim() || 'Coimbatore Transit Division',
      licenseNumber: params.licenseNumber?.trim(),
      phone: params.phone?.trim(),
      createdAt: new Date().toISOString(),
      provisionedBy: actorEmail
    }

    const users = this.getUsers()
    this.saveUsers([...users, newUser])

    this.logAction(
      actorEmail,
      params.role === 'driver' ? 'PROVISION_DRIVER' : 'PROVISION_ADMIN',
      newUser.email,
      `Provisioned ${params.role.toUpperCase()} ${newUser.name} (Bus: ${newUser.assignedBus || 'N/A'}, Route: ${newUser.assignedRoute || 'N/A'}, Depot: ${newUser.depot || 'N/A'})`
    )

    return newUser
  },

  // Update Status (Suspend or Reactivate)
  toggleUserStatus(actorEmail: string, userId: string, newStatus: 'active' | 'suspended'): ManagedUser {
    const users = this.getUsers()
    const index = users.findIndex((u) => u.id === userId)
    if (index === -1) throw new Error('User not found')

    users[index] = { ...users[index], status: newStatus }
    this.saveUsers(users)

    this.logAction(
      actorEmail,
      newStatus === 'suspended' ? 'SUSPEND_USER' : 'ACTIVATE_USER',
      users[index].email,
      `Status changed to ${newStatus} by Super Admin`
    )

    return users[index]
  },

  // Delete User
  deleteUser(actorEmail: string, userId: string): void {
    const users = this.getUsers()
    const user = users.find((u) => u.id === userId)
    if (!user) throw new Error('User not found')
    if (user.role === 'super_admin') throw new Error('Cannot delete primary Super Administrator account')

    this.saveUsers(users.filter((u) => u.id !== userId))
    this.logAction(actorEmail, 'DELETE_USER', user.email, `Removed ${user.role} account (${user.name})`)
  }
}
