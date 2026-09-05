import { beforeEach, describe, expect, it } from 'vitest'
import { rbacService } from './rbacService'

describe('RBAC Service & Provisioning Governance', () => {
  beforeEach(() => {
    rbacService.resetToSeeds()
  })

  it('loads seed accounts including Super Admin, Admin, Driver, and Passenger', () => {
    const users = rbacService.getUsers()
    expect(users.length).toBeGreaterThanOrEqual(4)

    const superAdmin = users.find((u) => u.role === 'super_admin')
    const admin = users.find((u) => u.role === 'admin')
    const driver = users.find((u) => u.role === 'driver')
    const passenger = users.find((u) => u.role === 'passenger')

    expect(superAdmin).toBeDefined()
    expect(admin).toBeDefined()
    expect(driver).toBeDefined()
    expect(passenger).toBeDefined()

    const dukerAdmin = rbacService.findUserByEmail('duker2006love@gmail.com')
    expect(dukerAdmin).toBeDefined()
    expect(dukerAdmin?.role).toBe('super_admin')
    expect(dukerAdmin?.status).toBe('active')
  })

  it('allows passenger public self-registration', () => {
    const newUser = rbacService.registerPassenger('commuter.test@lulusmart.local', 'Test Commuter', '+91 98888 11111')
    expect(newUser.role).toBe('passenger')
    expect(newUser.provisionedBy).toBe('Self Registered')
    expect(newUser.status).toBe('active')

    const found = rbacService.findUserByEmail('commuter.test@lulusmart.local')
    expect(found).toBeDefined()
    expect(found?.name).toBe('Test Commuter')
  })

  it('prohibits duplicate email registration', () => {
    rbacService.registerPassenger('unique@lulusmart.local', 'User One')
    expect(() => {
      rbacService.registerPassenger('unique@lulusmart.local', 'User Two')
    }).toThrow(/already exists/)
  })

  it('allows Super Admin to provision a new Driver with vehicle and route', () => {
    const driver = rbacService.provisionUser('superadmin@transports.tn.gov.in', {
      name: 'V. Senthilkumar',
      email: 'driver.senthil@tnstc.local',
      role: 'driver',
      assignedBus: 'TN-38-N-1204',
      assignedRoute: '12A',
      depot: 'Gandhipuram Depot',
      licenseNumber: 'TN-38-2018-DR-44551'
    })

    expect(driver.role).toBe('driver')
    expect(driver.assignedBus).toBe('TN-38-N-1204')
    expect(driver.assignedRoute).toBe('12A')
    expect(driver.provisionedBy).toBe('superadmin@transports.tn.gov.in')

    // Verify audit log
    const logs = rbacService.getAuditLogs()
    const log = logs.find((l) => l.targetUser === 'driver.senthil@tnstc.local')
    expect(log).toBeDefined()
    expect(log?.action).toBe('PROVISION_DRIVER')
  })

  it('allows Super Admin to suspend and reactivate an account', () => {
    const user = rbacService.findUserByEmail('driver.murugan@tnstc.local')
    expect(user).toBeDefined()

    // Suspend
    const suspended = rbacService.toggleUserStatus('superadmin@transports.tn.gov.in', user!.id, 'suspended')
    expect(suspended.status).toBe('suspended')

    // Attempting auth on suspended account should throw error
    expect(() => {
      rbacService.authenticateUser('driver.murugan@tnstc.local', 'Driver@12345')
    }).toThrow(/suspended/)

    // Reactivate
    const active = rbacService.toggleUserStatus('superadmin@transports.tn.gov.in', user!.id, 'active')
    expect(active.status).toBe('active')
    expect(rbacService.authenticateUser('driver.murugan@tnstc.local', 'Driver@12345')).toBeDefined()
  })
})
