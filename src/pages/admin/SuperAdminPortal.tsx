import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  KeyRound,
  UserPlus,
  Bus,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  UserX,
  UserCheck,
  Trash2,
  ArrowRight,
  Shield,
  FileText
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { rbacService, ManagedUser, AuditLogItem, AppRole } from '../../services/rbacService'
import { useTransport } from '../../contexts/TransportContext'

export default function SuperAdminPortal() {
  const { user } = useAuth()
  const { buses, routes } = useTransport()

  const [usersList, setUsersList] = useState<ManagedUser[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([])
  const [activeTab, setActiveTab] = useState<'users' | 'provision_driver' | 'provision_admin' | 'audit'>('users')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statusNotice, setStatusNotice] = useState<string | null>(null)

  // Driver Form state
  const [driverName, setDriverName] = useState('')
  const [driverEmail, setDriverEmail] = useState('')
  const [driverPassword, setDriverPassword] = useState('Driver@12345')
  const [driverBus, setDriverBus] = useState('TN-38-N-1204')
  const [driverRoute, setDriverRoute] = useState('12A')
  const [driverDepot, setDriverDepot] = useState('Gandhipuram Central Depot')
  const [driverLicense, setDriverLicense] = useState('')
  const [driverPhone, setDriverPhone] = useState('')

  // Admin Form state
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('Admin@12345')
  const [adminDepot, setAdminDepot] = useState('Coimbatore Central Division (Gandhipuram)')
  const [adminPhone, setAdminPhone] = useState('')

  const loadData = () => {
    setUsersList(rbacService.getUsers())
    setAuditLogs(rbacService.getAuditLogs())
  }

  useEffect(() => {
    loadData()
  }, [])

  // Handle Driver Provisioning
  const handleProvisionDriver = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newUser = rbacService.provisionUser(user?.email || 'superadmin@transports.tn.gov.in', {
        name: driverName,
        email: driverEmail,
        role: 'driver',
        password: driverPassword,
        assignedBus: driverBus,
        assignedRoute: driverRoute,
        depot: driverDepot,
        licenseNumber: driverLicense,
        phone: driverPhone
      })

      setStatusNotice(`Driver "${newUser.name}" successfully provisioned! Credentials issued.`)
      // Reset form
      setDriverName('')
      setDriverEmail('')
      setDriverLicense('')
      setDriverPhone('')
      loadData()
      setActiveTab('users')
      setTimeout(() => setStatusNotice(null), 5000)
    } catch (err: any) {
      alert(err.message || 'Failed to provision driver')
    }
  }

  // Handle Admin Provisioning
  const handleProvisionAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newUser = rbacService.provisionUser(user?.email || 'superadmin@transports.tn.gov.in', {
        name: adminName,
        email: adminEmail,
        role: 'admin',
        password: adminPassword,
        depot: adminDepot,
        phone: adminPhone
      })

      setStatusNotice(`Depot Administrator "${newUser.name}" successfully provisioned!`)
      // Reset form
      setAdminName('')
      setAdminEmail('')
      setAdminPhone('')
      loadData()
      setActiveTab('users')
      setTimeout(() => setStatusNotice(null), 5000)
    } catch (err: any) {
      alert(err.message || 'Failed to provision admin')
    }
  }

  // Toggle user active / suspended
  const handleToggleStatus = (u: ManagedUser) => {
    const nextStatus = u.status === 'active' ? 'suspended' : 'active'
    try {
      rbacService.toggleUserStatus(user?.email || 'superadmin@transports.tn.gov.in', u.id, nextStatus)
      loadData()
      setStatusNotice(`User ${u.name} status updated to ${nextStatus}.`)
      setTimeout(() => setStatusNotice(null), 3000)
    } catch (err: any) {
      alert(err.message)
    }
  }

  // Delete user
  const handleDeleteUser = (u: ManagedUser) => {
    if (!window.confirm(`Are you sure you want to permanently revoke credentials for ${u.name}?`)) return
    try {
      rbacService.deleteUser(user?.email || 'superadmin@transports.tn.gov.in', u.id)
      loadData()
      setStatusNotice(`User account ${u.email} deleted.`)
      setTimeout(() => setStatusNotice(null), 3000)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const filteredUsers = usersList.filter((u) => {
    const matchesRole = filterRole === 'all' || u.role === filterRole
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.assignedBus && u.assignedBus.toLowerCase().includes(q)) ||
      (u.assignedRoute && u.assignedRoute.toLowerCase().includes(q))
    return matchesRole && matchesQuery
  })

  return (
    <div className="container py-8 pb-24 max-w-6xl">
      {/* Super Admin Top Banner */}
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 p-6 sm:p-8 text-white shadow-xl border border-purple-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/30">
                <KeyRound size={20} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                State Transport Authority • Master Access Console
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Super Admin User Governance</h1>
            <p className="text-xs text-purple-200/80 max-w-2xl leading-relaxed">
              Sole authority for provisioning Driver and Transport Administrator accounts. Manage vehicle route assignments, account statuses, and system audit trails.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('provision_driver')}
              className="button-primary bg-emerald-600 hover:bg-emerald-700 text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold shadow-sm"
            >
              <Bus size={15} />
              <span>+ Provision Driver</span>
            </button>
            <button
              onClick={() => setActiveTab('provision_admin')}
              className="button-primary bg-amber-600 hover:bg-amber-700 text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold shadow-sm"
            >
              <Building2 size={15} />
              <span>+ Provision Admin</span>
            </button>
          </div>
        </div>
      </div>

      {statusNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-2 flex items-center gap-1.5 border-b-2 transition ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users size={16} />
          <span>Provisioned Users Directory ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('provision_driver')}
          className={`pb-3 px-2 flex items-center gap-1.5 border-b-2 transition ${
            activeTab === 'provision_driver'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bus size={16} />
          <span>Enroll New Bus Driver</span>
        </button>

        <button
          onClick={() => setActiveTab('provision_admin')}
          className={`pb-3 px-2 flex items-center gap-1.5 border-b-2 transition ${
            activeTab === 'provision_admin'
              ? 'border-amber-600 text-amber-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 size={16} />
          <span>Enroll Depot Admin</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-2 flex items-center gap-1.5 border-b-2 transition ${
            activeTab === 'audit'
              ? 'border-purple-600 text-purple-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={16} />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="card p-4 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name, email, bus, or route..."
                className="w-full border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={14} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-600">Role:</span>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {['all', 'driver', 'admin', 'super_admin', 'passenger'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRole(r)}
                    className={`px-2.5 py-1 rounded-lg capitalize text-[11px] transition ${
                      filterRole === r
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card overflow-hidden border-slate-200 p-0 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">User & Contact</th>
                    <th className="py-3 px-4">Role & Access</th>
                    <th className="py-3 px-4">Vehicle / Depot Assignment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isDriver = u.role === 'driver'
                    const isAdmin = u.role === 'admin'
                    const isSuper = u.role === 'super_admin'
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                          {u.phone && <div className="text-[10px] text-slate-400">{u.phone}</div>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isDriver
                                ? 'bg-emerald-100 text-emerald-800'
                                : isAdmin
                                ? 'bg-amber-100 text-amber-800'
                                : isSuper
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isDriver && <Bus size={11} />}
                            {isAdmin && <Building2 size={11} />}
                            {isSuper && <KeyRound size={11} />}
                            {u.role.replace('_', ' ').toUpperCase()}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">
                            By: {u.provisionedBy || 'System'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {isDriver && (
                            <div className="space-y-0.5">
                              <div className="font-bold text-slate-800">
                                Bus: <span className="text-[#1261d6]">{u.assignedBus || 'None'}</span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Route: {u.assignedRoute || 'None'} • Depot: {u.depot || 'Coimbatore'}
                              </div>
                            </div>
                          )}
                          {isAdmin && (
                            <div className="text-slate-700 font-medium">
                              {u.depot || 'Coimbatore Central Division'}
                            </div>
                          )}
                          {isSuper && (
                            <div className="text-purple-700 font-semibold">
                              State-wide Transit Oversight
                            </div>
                          )}
                          {u.role === 'passenger' && (
                            <div className="text-slate-400 italic">Self-Registered Commuter</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {u.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          {u.role !== 'super_admin' && (
                            <>
                              <button
                                onClick={() => handleToggleStatus(u)}
                                className={`p-1.5 rounded-lg border text-xs font-semibold ${
                                  u.status === 'active'
                                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                }`}
                                title={u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                              >
                                {u.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                title="Delete / Revoke Credentials"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROVISION DRIVER */}
      {activeTab === 'provision_driver' && (
        <div className="card p-6 sm:p-8 max-w-2xl mx-auto border-emerald-200 bg-white shadow-md">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Bus size={22} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Provision Authorized Bus Driver</h2>
              <p className="text-xs text-slate-500">
                Create verified driver credentials and assign bus vehicle and route.
              </p>
            </div>
          </div>

          <form onSubmit={handleProvisionDriver} className="mt-6 space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Driver Full Name *</label>
                <input
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. P. Murugan"
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Driver Email *</label>
                <input
                  required
                  type="email"
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  placeholder="driver.name@tnstc.local"
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Vehicle Registration *</label>
                <select
                  value={driverBus}
                  onChange={(e) => setDriverBus(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium bg-white"
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.registrationNumber}>
                      {b.registrationNumber} (Route {b.routeNumber})
                    </option>
                  ))}
                  <option value="TN-38-N-2450">TN-38-N-2450 (Reserve Fleet)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Transit Route *</label>
                <select
                  value={driverRoute}
                  onChange={(e) => setDriverRoute(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium bg-white"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.routeNumber}>
                      Route {r.routeNumber} — {r.routeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Base Transit Depot</label>
                <input
                  value={driverDepot}
                  onChange={(e) => setDriverDepot(e.target.value)}
                  placeholder="Gandhipuram Central Depot"
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Temporary Password *</label>
                <input
                  required
                  value={driverPassword}
                  onChange={(e) => setDriverPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Commercial Driver License #</label>
                <input
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  placeholder="TN-38-2015-DR-xxxxx"
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Driver Phone Number</label>
                <input
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="+91 98xxx xxxxx"
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className="button-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button-primary bg-emerald-600 hover:bg-emerald-700 text-xs py-2.5 px-6 font-bold"
              >
                Issue Driver Credentials & Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: PROVISION ADMIN */}
      {activeTab === 'provision_admin' && (
        <div className="card p-6 sm:p-8 max-w-2xl mx-auto border-amber-200 bg-white shadow-md">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Building2 size={22} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Provision Depot Transport Administrator</h2>
              <p className="text-xs text-slate-500">
                Grant fleet oversight, service alert broadcasting, and complaint resolution rights.
              </p>
            </div>
          </div>

          <form onSubmit={handleProvisionAdmin} className="mt-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Administrator Full Name *</label>
              <input
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. A. Shanmugasundaram"
                className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Administrative Email *</label>
              <input
                required
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="depot.manager@tnstc.local"
                className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Depot / Operational Jurisdiction</label>
              <input
                value={adminDepot}
                onChange={(e) => setAdminDepot(e.target.value)}
                placeholder="Coimbatore Central Depot"
                className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Temporary Initial Password *</label>
                <input
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Contact Phone</label>
                <input
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="+91 98xxx xxxxx"
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className="button-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button-primary bg-amber-600 hover:bg-amber-700 text-xs py-2.5 px-6 font-bold"
              >
                Issue Admin Credentials & Grant Clearance
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="card p-6 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Security & RBAC Audit Log</h2>
              <p className="text-xs text-slate-500">
                Immutable trace of credential issuance, role changes, and vehicle assignments.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 px-3 py-1 bg-purple-50 rounded-full border border-purple-200">
              Tamper-evident
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900">{log.targetUser}</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">{log.details}</div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 sm:text-right shrink-0">
                  <Clock size={12} />
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
