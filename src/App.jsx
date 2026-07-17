import React, { useState, useMemo, useEffect } from 'react'
import {
  LayoutDashboard,
  Store,
  Users,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  Building2,
  Wallet,
  Crown,
  UserPlus,
  PlusCircle,
  Edit,
  Trash,
  ArrowLeft,
  Save,
  CalendarDays,
  LogOut,
  Lock,
  User,
  AlertCircle,
  BarChart3,
  TrendingUp,
} from 'lucide-react'

/* -------------------------------------------------------------------------- */
/*  MOCK DATABASE                                                             */
/*  Realistic sample data for stores and employees                           */
/* -------------------------------------------------------------------------- */

const STORES = [
  { id: 1, name: 'Central Branch', city: 'Berlin' },
  { id: 2, name: 'Old Town Branch', city: 'Munich' },
  { id: 3, name: 'Harbour City Branch', city: 'Hamburg' },
  { id: 4, name: 'Downtown Branch', city: 'Cologne' },
]

const EMPLOYEES = [
  { id: 1, firstName: 'Anna', lastName: 'Schmidt', storeId: 1, position: 'Store Manager', salary: 4200, hours: 40 },
  { id: 2, firstName: 'Lukas', lastName: 'Müller', storeId: 1, position: 'Sales Associate', salary: 2800, hours: 38 },
  { id: 3, firstName: 'Sophie', lastName: 'Weber', storeId: 2, position: 'Store Manager', salary: 4100, hours: 40 },
  { id: 4, firstName: 'Jonas', lastName: 'Fischer', storeId: 2, position: 'Warehouse Assistant', salary: 2600, hours: 35 },
  { id: 5, firstName: 'Marie', lastName: 'Wagner', storeId: 2, position: 'Sales Associate', salary: 2750, hours: 30 },
  { id: 6, firstName: 'Felix', lastName: 'Becker', storeId: 3, position: 'Store Manager', salary: 4300, hours: 40 },
  { id: 7, firstName: 'Laura', lastName: 'Hoffmann', storeId: 3, position: 'Sales Associate', salary: 2900, hours: 40 },
  { id: 8, firstName: 'Paul', lastName: 'Schäfer', storeId: 3, position: 'Part-Time Assistant', salary: 1400, hours: 20 },
  { id: 9, firstName: 'Emma', lastName: 'Koch', storeId: 4, position: 'Store Manager', salary: 4000, hours: 40 },
  { id: 10, firstName: 'Tim', lastName: 'Richter', storeId: 4, position: 'Sales Associate', salary: 2850, hours: 38 },
  { id: 11, firstName: 'Lena', lastName: 'Klein', storeId: 4, position: 'Part-Time Assistant', salary: 1300, hours: 18 },
  { id: 12, firstName: 'Max', lastName: 'Wolf', storeId: 1, position: 'Warehouse Assistant', salary: 2650, hours: 37 },
]

/* -------------------------------------------------------------------------- */
/*  HELPER FUNCTIONS                                                          */
/* -------------------------------------------------------------------------- */

// Format currency (e.g. €4,200)
const formatEuro = (amount) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

// Map a storeId to its store
const getStoreName = (storeId, storeList) =>
  storeList.find((s) => s.id === storeId)?.name ?? 'Unknown'

// Today's date, formatted
const todaysDate = () =>
  new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

// Month names (index 0 = January)
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// Short form for chart labels
const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/* -------------------------------------------------------------------------- */
/*  NAVIGATION                                                                */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'geschaefte', label: 'Stores', icon: Store },
  { key: 'personal', label: 'Employees', icon: Users },
  { key: 'statistik', label: 'Statistics', icon: BarChart3 },
  { key: 'einstellungen', label: 'Settings', icon: Settings },
]

/* -------------------------------------------------------------------------- */
/*  LOGIN CREDENTIALS (demo)                                                  */
/* -------------------------------------------------------------------------- */

const LOGIN_CREDENTIALS = {
  username: 'Business',
  password: 'Business123',
}

/* -------------------------------------------------------------------------- */
/*  LOGIN VIEW                                                                */
/* -------------------------------------------------------------------------- */

function LoginView({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (
      username === LOGIN_CREDENTIALS.username &&
      password === LOGIN_CREDENTIALS.password
    ) {
      setError('')
      onLogin()
    } else {
      setError('Incorrect username or password.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">BEM Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Username
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="username"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo credentials – Username: "Business" · Password: "Business123"
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  SIDEBAR                                                                   */
/* -------------------------------------------------------------------------- */

function Sidebar({ activeView, setActiveView, mobileOpen, setMobileOpen }) {
  const handleClick = (key) => {
    setActiveView(key)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-300 md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-bold text-white">BEM Management</p>
              <p className="text-xs text-slate-400">Business Management</p>
            </div>
          </div>
          <button
            className="text-slate-400 hover:text-white md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-4">
          {NAV_LINKS.map(({ key, label, icon: Icon }) => {
            const isActive =
              activeView === key ||
              (key === 'personal' && activeView === 'personal-detail') ||
              (key === 'geschaefte' && activeView === 'geschaeft-detail')
            return (
              <button
                key={key}
                onClick={() => handleClick(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            )
          })}
        </nav>

        {/* User card at the bottom */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white">
              MK
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Michael Krause</p>
              <p className="truncate text-xs text-slate-400">Management</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  HEADER                                                                    */
/* -------------------------------------------------------------------------- */

function Header({ title, onMenuClick, onLogout }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-4 md:px-8">
      {/* Menu button (mobile) */}
      <button
        className="text-slate-600 hover:text-slate-900 md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="hidden md:block">
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-500">{todaysDate()}</p>
      </div>

      {/* Search bar */}
      <div className="relative ml-auto w-full max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search …"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Notifications */}
      <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50">
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
      </button>

      {/* Profile placeholder */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white">
          MK
        </div>
        <div className="hidden text-sm lg:block">
          <p className="font-semibold text-slate-900">Michael Krause</p>
          <p className="text-xs text-slate-500">Administrator</p>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={onLogout}
        className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  KPI CARD                                                                  */
/* -------------------------------------------------------------------------- */

function KpiCard({ icon: Icon, label, value, hint, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  DASHBOARD VIEW                                                            */
/* -------------------------------------------------------------------------- */

function DashboardView({ geschaefte, mitarbeiter, monatsDaten, onNeuerMitarbeiter, onNeuesGeschaeft }) {
  const currentYear = new Date().getFullYear()

  // KPIs computed dynamically from the data
  const kpis = useMemo(() => {
    const aktiveGeschaefte = geschaefte.length
    const gesamtMitarbeiter = mitarbeiter.length

    // Staff costs for the current year: for each of the 12 months, sum each
    // employee's recorded salary payments, falling back to their base salary
    // for months without an explicit entry (same assumption used everywhere
    // else in the app).
    const personalkosten = MONTHS.reduce((jahresSumme, _, monatIndex) => {
      const monatsSumme = mitarbeiter.reduce((summe, m) => {
        const eintrag = (monatsDaten[m.id] ?? []).find(
          (e) => e.jahr === currentYear && e.monat === monatIndex,
        )
        const gehalt = eintrag
          ? eintrag.gehaelter.reduce((teilsumme, betrag) => teilsumme + betrag, 0)
          : m.salary
        return summe + gehalt
      }, 0)
      return jahresSumme + monatsSumme
    }, 0)

    const teuersterMitarbeiter =
      gesamtMitarbeiter > 0
        ? mitarbeiter.reduce((top, m) => (m.salary > top.salary ? m : top))
        : null

    return { aktiveGeschaefte, gesamtMitarbeiter, personalkosten, teuersterMitarbeiter }
  }, [geschaefte, mitarbeiter, monatsDaten, currentYear])

  // Employees per store for the bar chart
  const mitarbeiterProGeschaeft = useMemo(() => {
    const daten = geschaefte.map((g) => ({
      name: g.name,
      city: g.city,
      anzahl: mitarbeiter.filter((m) => m.storeId === g.id).length,
    }))
    const max = Math.max(...daten.map((d) => d.anzahl), 1)
    return { daten, max }
  }, [geschaefte, mitarbeiter])

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Store}
          label="Active Stores"
          value={kpis.aktiveGeschaefte}
          hint="Stores nationwide"
          accent="bg-indigo-50 text-indigo-600"
        />
        <KpiCard
          icon={Users}
          label="Total Employees"
          value={kpis.gesamtMitarbeiter}
          hint="Active staff"
          accent="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          icon={Wallet}
          label={`Staff Costs ${currentYear}`}
          value={formatEuro(kpis.personalkosten)}
          hint="Gross salaries for the current year"
          accent="bg-amber-50 text-amber-600"
        />
        <KpiCard
          icon={Crown}
          label="Most Expensive"
          value={
            kpis.teuersterMitarbeiter
              ? `${kpis.teuersterMitarbeiter.firstName} ${kpis.teuersterMitarbeiter.lastName}`
              : '–'
          }
          hint={
            kpis.teuersterMitarbeiter
              ? `${formatEuro(kpis.teuersterMitarbeiter.salary)} · ${kpis.teuersterMitarbeiter.position}`
              : 'No employees yet'
          }
          accent="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart: employees per store */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Employees per Store
              </h2>
              <p className="text-sm text-slate-500">Distribution by branch</p>
            </div>
          </div>

          <div className="space-y-5">
            {mitarbeiterProGeschaeft.daten.length === 0 && (
              <p className="text-sm text-slate-400">No stores created yet.</p>
            )}
            {mitarbeiterProGeschaeft.daten.map((d) => (
              <div key={d.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {d.name}{' '}
                    <span className="text-slate-400">· {d.city}</span>
                  </span>
                  <span className="font-semibold text-slate-900">{d.anzahl}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{
                      width: `${(d.anzahl / mitarbeiterProGeschaeft.max) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
          <p className="text-sm text-slate-500">Frequently used functions</p>

          <div className="mt-6 space-y-3">
            <button
              onClick={onNeuerMitarbeiter}
              className="flex w-full items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
            >
              <UserPlus className="h-5 w-5" />
              New Employee
            </button>
            <button
              onClick={onNeuesGeschaeft}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <PlusCircle className="h-5 w-5 text-indigo-600" />
              New Store
            </button>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Tip</p>
            <p className="mt-1 text-xs text-slate-500">
              You can edit and update employee data anytime in Employee
              Management.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  EMPLOYEE MANAGEMENT VIEW                                                  */
/* -------------------------------------------------------------------------- */

function PersonalView({ mitarbeiter, geschaefte, onDelete, onView, onHinzufuegen }) {
  const [formularOffen, setFormularOffen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [position, setPosition] = useState('')
  const [storeId, setStoreId] = useState(geschaefte[0]?.id ?? '')
  const [salary, setSalary] = useState('')
  const [hours, setHours] = useState('')

  const handleAbbrechen = () => {
    setFormularOffen(false)
    setFirstName('')
    setLastName('')
    setPosition('')
    setStoreId(geschaefte[0]?.id ?? '')
    setSalary('')
    setHours('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !position.trim() || !storeId) return
    onHinzufuegen({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      position: position.trim(),
      storeId: Number(storeId),
      salary: Number(salary) || 0,
      hours: Number(hours) || 0,
    })
    handleAbbrechen()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Employee Management</h2>
          <p className="text-sm text-slate-500">
            {mitarbeiter.length} employees in total
          </p>
        </div>
        <button
          onClick={() => setFormularOffen((offen) => !offen)}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
        >
          <UserPlus className="h-4 w-4" />
          New Employee
        </button>
      </div>

      {/* Form: add new employee */}
      {formularOffen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-base font-bold text-slate-900">Add New Employee</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Julia"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Bauer"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Position
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Sales Associate"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Store
              </label>
              <select
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                {geschaefte.length === 0 && <option value="">No store available</option>}
                {geschaefte.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} · {g.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Salary (€)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. 2800"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Hours/Week
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g. 38"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleAbbrechen}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={geschaefte.length === 0}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save Employee
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Position</th>
                <th className="px-6 py-4 font-semibold">Store</th>
                <th className="px-6 py-4 font-semibold">Salary</th>
                <th className="px-6 py-4 font-semibold">Hours/Week</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mitarbeiter.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onView(m.id)}
                      className="flex items-center gap-3 text-left"
                      title="View details"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
                        {m.firstName[0]}
                        {m.lastName[0]}
                      </div>
                      <span className="font-medium text-slate-900 hover:text-indigo-600 hover:underline">
                        {m.firstName} {m.lastName}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{m.position}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {getStoreName(m.storeId, geschaefte)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {formatEuro(m.salary)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{m.hours} hrs</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(m.id)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                        aria-label={`Enter monthly data for ${m.firstName} ${m.lastName}`}
                        title="Enter monthly data"
                      >
                        <CalendarDays className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                        aria-label={`Edit ${m.firstName} ${m.lastName}`}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(m.id)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Delete ${m.firstName} ${m.lastName}`}
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {mitarbeiter.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-slate-400"
                  >
                    No employees yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  EMPLOYEE DETAIL VIEW                                                      */
/*  Select month/year and enter salary + hours worked                        */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  SALARY HISTORY CHART                                                     */
/*  Bar chart: salary per month (Y: €0–5,000, X: January–December)           */
/* -------------------------------------------------------------------------- */

const GEHALT_Y_MAX = 5000
const GEHALT_Y_SCHRITTE = [5000, 4000, 3000, 2000, 1000, 0]

function GehaltVerlaufChart({ mitarbeiter, eintraege, jahr }) {
  const [hoverIndex, setHoverIndex] = useState(null)

  // Without an explicit monthly entry, the employee's base salary is
  // assumed – the same assumption used in the form and in Statistics.
  // An entry can contain up to four separate salary payments, which are
  // summed to a monthly total for the chart.
  const gehaltProMonat = useMemo(
    () =>
      MONTHS.map((_, index) => {
        const eintrag = eintraege.find((e) => e.jahr === jahr && e.monat === index)
        return eintrag
          ? eintrag.gehaelter.reduce((summe, betrag) => summe + betrag, 0)
          : mitarbeiter.salary
      }),
    [eintraege, jahr, mitarbeiter.salary],
  )

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900">Salary History {jahr}</h3>
      <p className="text-sm text-slate-500">
        Monthly salary for {mitarbeiter.firstName} {mitarbeiter.lastName}
      </p>

      <div className="mt-6 flex gap-3">
        {/* Y axis */}
        <div className="flex h-56 flex-col justify-between text-right text-xs tabular-nums text-slate-400">
          {GEHALT_Y_SCHRITTE.map((wert) => (
            <span key={wert}>€{wert.toLocaleString('en-GB')}</span>
          ))}
        </div>

        {/* Plot area */}
        <div className="flex-1">
          <div className="relative h-56">
            {/* Gridlines */}
            {GEHALT_Y_SCHRITTE.map((wert) => (
              <div
                key={wert}
                className="absolute inset-x-0 border-t border-slate-100"
                style={{ top: `${100 - (wert / GEHALT_Y_MAX) * 100}%` }}
              />
            ))}

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-between gap-1.5 sm:gap-2.5">
              {gehaltProMonat.map((wert, index) => {
                const hoehe = Math.min(wert / GEHALT_Y_MAX, 1) * 100
                return (
                  <div
                    key={index}
                    className="relative flex h-full flex-1 items-end justify-center"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    {hoverIndex === index && (
                      <div className="pointer-events-none absolute -top-8 z-10 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow-lg">
                        {formatEuro(wert)}
                      </div>
                    )}
                    <div
                      className={`w-full max-w-[28px] rounded-t-[4px] transition-colors ${
                        hoverIndex === index ? 'bg-indigo-600' : 'bg-indigo-500'
                      }`}
                      style={{ height: `${hoehe}%` }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* X axis */}
          <div className="mt-2 flex justify-between gap-1.5 text-xs text-slate-400 sm:gap-2.5">
            {MONTHS_SHORT.map((name) => (
              <span key={name} className="flex-1 text-center">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const GEHALT_SLOTS = 4

function MitarbeiterDetailView({ mitarbeiter, geschaefte, eintraege, onSpeichern, onGehaltLoeschen, onZurueck }) {
  const heute = new Date()
  const [jahr, setJahr] = useState(heute.getFullYear())
  const [monat, setMonat] = useState(heute.getMonth())
  const [gehaltInputs, setGehaltInputs] = useState([
    String(mitarbeiter.salary),
    '',
    '',
    '',
  ])
  const [stundenInput, setStundenInput] = useState(String(mitarbeiter.hours))
  const [gespeichertHinweis, setGespeichertHinweis] = useState(false)

  const aktuellerEintrag = useMemo(
    () => eintraege.find((e) => e.jahr === jahr && e.monat === monat),
    [eintraege, jahr, monat],
  )

  // When month/year changes, prefill the fields with an existing entry –
  // otherwise use the employee's base salary in the first field and leave
  // the remaining fields empty.
  useEffect(() => {
    if (aktuellerEintrag) {
      setGehaltInputs(
        Array.from({ length: GEHALT_SLOTS }, (_, i) =>
          aktuellerEintrag.gehaelter[i] !== undefined
            ? String(aktuellerEintrag.gehaelter[i])
            : '',
        ),
      )
      setStundenInput(String(aktuellerEintrag.stunden))
    } else {
      setGehaltInputs([String(mitarbeiter.salary), '', '', ''])
      setStundenInput(String(mitarbeiter.hours))
    }
    setGespeichertHinweis(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jahr, monat, aktuellerEintrag])

  // Automatically hide the confirmation message after saving
  useEffect(() => {
    if (!gespeichertHinweis) return
    const timer = setTimeout(() => setGespeichertHinweis(false), 2500)
    return () => clearTimeout(timer)
  }, [gespeichertHinweis])

  const jahresOptionen = useMemo(() => {
    const startJahr = heute.getFullYear() - 2
    return Array.from({ length: 5 }, (_, i) => startJahr + i)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGehaltInputChange = (index, wert) => {
    setGehaltInputs((prev) => prev.map((v, i) => (i === index ? wert : v)))
  }

  const handleSpeichern = (event) => {
    event.preventDefault()
    const gehaelter = gehaltInputs
      .map((wert) => Number(wert))
      .filter((wert) => wert > 0)
    if (gehaelter.length === 0) return
    onSpeichern(mitarbeiter.id, jahr, monat, gehaelter, Number(stundenInput))
    setGespeichertHinweis(true)
  }

  const gehaltGesamt = aktuellerEintrag
    ? aktuellerEintrag.gehaelter.reduce((summe, betrag) => summe + betrag, 0)
    : 0

  return (
    <div className="space-y-6">
      {/* Back button + employee header */}
      <div>
        <button
          onClick={onZurueck}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Employee Management
        </button>

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-lg font-bold text-white">
            {mitarbeiter.firstName[0]}
            {mitarbeiter.lastName[0]}
          </div>
          <div className="mr-auto">
            <h2 className="text-lg font-bold text-slate-900">
              {mitarbeiter.firstName} {mitarbeiter.lastName}
            </h2>
            <p className="text-sm text-slate-500">
              {mitarbeiter.position} · {getStoreName(mitarbeiter.storeId, geschaefte)}
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-slate-400">Base Salary</p>
              <p className="font-semibold text-slate-900">{formatEuro(mitarbeiter.salary)}</p>
            </div>
            <div>
              <p className="text-slate-400">Base Hours</p>
              <p className="font-semibold text-slate-900">{mitarbeiter.hours} hrs/week</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form: enter monthly data */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Enter Monthly Data</h3>
          <p className="text-sm text-slate-500">
            Select a calendar month and year to enter salary and hours worked.
          </p>

          <form onSubmit={handleSpeichern} className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Month
                </label>
                <select
                  value={monat}
                  onChange={(e) => setMonat(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  {MONTHS.map((name, index) => (
                    <option key={name} value={index}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Year
                </label>
                <select
                  value={jahr}
                  onChange={(e) => setJahr(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  {jahresOptionen.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Salary (€) – up to {GEHALT_SLOTS} payments per month
              </label>
              <div className="grid grid-cols-2 gap-3">
                {gehaltInputs.map((wert, index) => (
                  <input
                    key={index}
                    type="number"
                    min="0"
                    step="10"
                    required={index === 0}
                    placeholder={`Salary ${index + 1}`}
                    value={wert}
                    onChange={(e) => handleGehaltInputChange(index, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Hours Worked
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={stundenInput}
                onChange={(e) => setStundenInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
              >
                <Save className="h-4 w-4" />
                Save Entry
              </button>
              {gespeichertHinweis && (
                <span className="text-sm font-medium text-emerald-600">
                  ✓ Saved for {MONTHS[monat]} {jahr}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Recorded monthly data: salaries for the selected month/year */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Recorded Monthly Data</h3>
          <p className="text-sm text-slate-500">
            Salaries for {MONTHS[monat]} {jahr}
          </p>

          <div className="mt-5 space-y-3">
            {(!aktuellerEintrag || aktuellerEintrag.gehaelter.length === 0) && (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                No salary data recorded yet for {MONTHS[monat]} {jahr}.
              </p>
            )}

            {aktuellerEintrag?.gehaelter.map((betrag, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-700">Salary {index + 1}</p>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-slate-900">{formatEuro(betrag)}</p>
                  <button
                    onClick={() => onGehaltLoeschen(mitarbeiter.id, jahr, monat, index)}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Delete Salary ${index + 1} for ${MONTHS[monat]} ${jahr}`}
                    title="Delete payment"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {aktuellerEintrag && aktuellerEintrag.gehaelter.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-4 pt-4">
                <p className="text-sm font-bold text-slate-900">Total</p>
                <p className="text-sm font-bold text-slate-900">{formatEuro(gehaltGesamt)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <GehaltVerlaufChart mitarbeiter={mitarbeiter} eintraege={eintraege} jahr={jahr} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  STORES VIEW                                                              */
/*  Show stores, and add or delete them                                      */
/* -------------------------------------------------------------------------- */

function GeschaefteView({ geschaefte, mitarbeiter, onHinzufuegen, onLoeschen, onAnsehen }) {
  const [formularOffen, setFormularOffen] = useState(false)
  const [name, setName] = useState('')
  const [stadt, setStadt] = useState('')

  const handleAbbrechen = () => {
    setFormularOffen(false)
    setName('')
    setStadt('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!name.trim() || !stadt.trim()) return
    onHinzufuegen(name.trim(), stadt.trim())
    handleAbbrechen()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Stores</h2>
          <p className="text-sm text-slate-500">{geschaefte.length} active stores</p>
        </div>
        <button
          onClick={() => setFormularOffen((offen) => !offen)}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4" />
          New Store
        </button>
      </div>

      {/* Form: add new store */}
      {formularOffen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-base font-bold text-slate-900">Add New Store</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Southside Branch"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                City
              </label>
              <input
                type="text"
                value={stadt}
                onChange={(e) => setStadt(e.target.value)}
                placeholder="e.g. Stuttgart"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleAbbrechen}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
            >
              Save Store
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {geschaefte.map((g) => {
          const anzahl = mitarbeiter.filter((m) => m.storeId === g.id).length
          return (
            <div
              key={g.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{g.name}</p>
                    <p className="text-sm text-slate-500">{g.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAnsehen(g.id)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    aria-label={`Enter revenue for ${g.name}`}
                    title="Enter revenue"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onLoeschen(g.id)}
                    disabled={anzahl > 0}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                    aria-label={`Delete ${g.name}`}
                    title={
                      anzahl > 0
                        ? 'Reassign employees to another store first'
                        : 'Delete store'
                    }
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500">Employees</span>
                <span className="text-sm font-semibold text-slate-900">{anzahl}</span>
              </div>
            </div>
          )
        })}

        {geschaefte.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
            No stores yet. Use "New Store" to create your first one.
          </p>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  STORE DETAIL VIEW                                                        */
/*  Select month/year and enter revenue for it                               */
/* -------------------------------------------------------------------------- */

function GeschaeftDetailView({ geschaeft, mitarbeiterAnzahl, eintraege, onSpeichern, onLoeschen, onZurueck }) {
  const heute = new Date()
  const [jahr, setJahr] = useState(heute.getFullYear())
  const [monat, setMonat] = useState(heute.getMonth())
  const [umsatzInput, setUmsatzInput] = useState('')
  const [gespeichertHinweis, setGespeichertHinweis] = useState(false)

  // When month/year changes, prefill the field with an existing entry –
  // otherwise leave it empty.
  useEffect(() => {
    const bestehenderEintrag = eintraege.find(
      (e) => e.jahr === jahr && e.monat === monat,
    )
    setUmsatzInput(bestehenderEintrag ? String(bestehenderEintrag.umsatz) : '')
    setGespeichertHinweis(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jahr, monat])

  // Automatically hide the confirmation message after saving
  useEffect(() => {
    if (!gespeichertHinweis) return
    const timer = setTimeout(() => setGespeichertHinweis(false), 2500)
    return () => clearTimeout(timer)
  }, [gespeichertHinweis])

  const jahresOptionen = useMemo(() => {
    const startJahr = heute.getFullYear() - 2
    return Array.from({ length: 5 }, (_, i) => startJahr + i)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verlaufSortiert = useMemo(
    () =>
      [...eintraege].sort((a, b) => b.jahr - a.jahr || b.monat - a.monat),
    [eintraege],
  )

  const handleSpeichern = (event) => {
    event.preventDefault()
    if (umsatzInput === '') return
    onSpeichern(geschaeft.id, jahr, monat, Number(umsatzInput))
    setGespeichertHinweis(true)
  }

  return (
    <div className="space-y-6">
      {/* Back button + store header */}
      <div>
        <button
          onClick={onZurueck}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Stores
        </button>

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Store className="h-7 w-7" />
          </div>
          <div className="mr-auto">
            <h2 className="text-lg font-bold text-slate-900">{geschaeft.name}</h2>
            <p className="text-sm text-slate-500">{geschaeft.city}</p>
          </div>
          <div className="text-sm">
            <p className="text-slate-400">Employees</p>
            <p className="font-semibold text-slate-900">{mitarbeiterAnzahl}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form: enter revenue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Enter Revenue</h3>
          <p className="text-sm text-slate-500">
            Select a calendar month and year to enter revenue.
          </p>

          <form onSubmit={handleSpeichern} className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Month
                </label>
                <select
                  value={monat}
                  onChange={(e) => setMonat(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  {MONTHS.map((name, index) => (
                    <option key={name} value={index}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Year
                </label>
                <select
                  value={jahr}
                  onChange={(e) => setJahr(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  {jahresOptionen.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Revenue (€)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={umsatzInput}
                onChange={(e) => setUmsatzInput(e.target.value)}
                placeholder="e.g. 24000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
              >
                <Save className="h-4 w-4" />
                Save Entry
              </button>
              {gespeichertHinweis && (
                <span className="text-sm font-medium text-emerald-600">
                  ✓ Saved for {MONTHS[monat]} {jahr}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Recorded revenue history */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Recorded Revenue</h3>
          <p className="text-sm text-slate-500">History for {geschaeft.name}</p>

          <div className="mt-5 space-y-3">
            {verlaufSortiert.length === 0 && (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                No revenue recorded yet.
              </p>
            )}

            {verlaufSortiert.map((e) => (
              <div
                key={`${e.jahr}-${e.monat}`}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {MONTHS[e.monat]} {e.jahr}
                  </p>
                  <p className="text-xs text-slate-500">{formatEuro(e.umsatz)}</p>
                </div>
                <button
                  onClick={() => onLoeschen(geschaeft.id, e.jahr, e.monat)}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Delete entry for ${MONTHS[e.monat]} ${e.jahr}`}
                  title="Delete entry"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  STATISTICS VIEW                                                          */
/*  Revenue by year and month                                                */
/* -------------------------------------------------------------------------- */

function StatistikView({ geschaefte, umsatzDaten }) {
  const heute = new Date()
  const [jahr, setJahr] = useState(heute.getFullYear())

  const jahresOptionen = useMemo(() => {
    const startJahr = heute.getFullYear() - 3
    return Array.from({ length: 6 }, (_, i) => startJahr + i)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Total revenue for each month of the selected year, from the recorded data
  const monatsStatistik = useMemo(() => {
    return MONTHS.map((name, monatIndex) => {
      const umsatz = geschaefte.reduce((summe, g) => {
        const eintrag = (umsatzDaten[g.id] ?? []).find(
          (e) => e.jahr === jahr && e.monat === monatIndex,
        )
        return summe + (eintrag ? eintrag.umsatz : 0)
      }, 0)

      return { monat: monatIndex, name, umsatz }
    })
  }, [geschaefte, umsatzDaten, jahr])

  const jahresSumme = useMemo(
    () => monatsStatistik.reduce((summe, m) => summe + m.umsatz, 0),
    [monatsStatistik],
  )

  const durchschnittProMonat = Math.round(jahresSumme / 12)

  const maxUmsatz = Math.max(...monatsStatistik.map((m) => m.umsatz), 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Statistics</h2>
          <p className="text-sm text-slate-500">
            Monthly revenue overview
          </p>
        </div>
        <div>
          <select
            value={jahr}
            onChange={(e) => setJahr(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {jahresOptionen.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Yearly KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <KpiCard
          icon={TrendingUp}
          label={`Revenue ${jahr}`}
          value={formatEuro(jahresSumme)}
          hint="Sum across all stores"
          accent="bg-indigo-50 text-indigo-600"
        />
        <KpiCard
          icon={BarChart3}
          label="Average per Month"
          value={formatEuro(durchschnittProMonat)}
          hint={`Average monthly revenue in ${jahr}`}
          accent="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Monthly overview */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4 font-semibold">Month</th>
                <th className="px-6 py-4 font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monatsStatistik.map((m) => (
                <tr key={m.monat} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{m.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-24 shrink-0 tabular-nums text-slate-700">
                        {formatEuro(m.umsatz)}
                      </span>
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${(m.umsatz / maxUmsatz) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  SETTINGS VIEW                                                            */
/* -------------------------------------------------------------------------- */

function EinstellungenView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500">Manage your account and system settings</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Company Profile</h3>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Company Name
            </label>
            <input
              type="text"
              defaultValue="BEM Management GmbH"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="info@bem-gmbh.de"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Store (Headquarters)
            </label>
            <input
              type="text"
              defaultValue="Berlin"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Currency
            </label>
            <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100">
              <option>Euro (€)</option>
              <option>US Dollar ($)</option>
              <option>Swiss Franc (CHF)</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Cancel
          </button>
          <button className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  MAIN COMPONENT                                                            */
/* -------------------------------------------------------------------------- */

const VIEW_TITEL = {
  dashboard: 'Dashboard',
  geschaefte: 'Stores',
  personal: 'Employee Management',
  statistik: 'Statistics',
  einstellungen: 'Settings',
}

export default function App() {
  const [istAngemeldet, setIstAngemeldet] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mitarbeiter, setMitarbeiter] = useState(EMPLOYEES)
  const [geschaefte, setGeschaefte] = useState(STORES)
  const [selectedMitarbeiterId, setSelectedMitarbeiterId] = useState(null)
  const [selectedGeschaeftId, setSelectedGeschaeftId] = useState(null)

  // Monthly data per employee: { [employeeId]: [{ jahr, monat, gehaelter: number[] (max. 4), stunden }] }
  const [monatsDaten, setMonatsDaten] = useState({})

  // Revenue data per store: { [storeId]: [{ jahr, monat, umsatz }] }
  const [umsatzDaten, setUmsatzDaten] = useState({})

  const handleAbmelden = () => {
    setIstAngemeldet(false)
    setActiveView('dashboard')
  }

  if (!istAngemeldet) {
    return <LoginView onLogin={() => setIstAngemeldet(true)} />
  }

  // Remove an employee from state
  const handleDelete = (id) => {
    setMitarbeiter((prev) => prev.filter((m) => m.id !== id))
  }

  // Add a new employee
  const handleMitarbeiterHinzufuegen = (daten) => {
    setMitarbeiter((prev) => {
      const neueId = Math.max(0, ...prev.map((m) => m.id)) + 1
      return [...prev, { id: neueId, ...daten }]
    })
  }

  // Add a new store
  const handleGeschaeftHinzufuegen = (name, city) => {
    setGeschaefte((prev) => {
      const neueId = Math.max(0, ...prev.map((g) => g.id)) + 1
      return [...prev, { id: neueId, name, city }]
    })
  }

  // Remove a store from state
  const handleGeschaeftLoeschen = (id) => {
    setGeschaefte((prev) => prev.filter((g) => g.id !== id))
  }

  const handleGeschaeftAnsehen = (id) => {
    setSelectedGeschaeftId(id)
    setActiveView('geschaeft-detail')
  }

  // Save a revenue entry for a store, or update it if one already exists
  // for that month/year
  const handleUmsatzSpeichern = (geschaeftId, jahr, monat, umsatz) => {
    setUmsatzDaten((prev) => {
      const bestehendeEintraege = prev[geschaeftId] ?? []
      const ohneAktuellenMonat = bestehendeEintraege.filter(
        (e) => !(e.jahr === jahr && e.monat === monat),
      )
      return {
        ...prev,
        [geschaeftId]: [...ohneAktuellenMonat, { jahr, monat, umsatz }],
      }
    })
  }

  const handleUmsatzLoeschen = (geschaeftId, jahr, monat) => {
    setUmsatzDaten((prev) => ({
      ...prev,
      [geschaeftId]: (prev[geschaeftId] ?? []).filter(
        (e) => !(e.jahr === jahr && e.monat === monat),
      ),
    }))
  }

  const handleMitarbeiterAnsehen = (id) => {
    setSelectedMitarbeiterId(id)
    setActiveView('personal-detail')
  }

  // Save a monthly entry (up to four salary payments + hours worked) for
  // an employee, or update it if one already exists for that month/year
  const handleMonatSpeichern = (mitarbeiterId, jahr, monat, gehaelter, stunden) => {
    setMonatsDaten((prev) => {
      const bestehendeEintraege = prev[mitarbeiterId] ?? []
      const ohneAktuellenMonat = bestehendeEintraege.filter(
        (e) => !(e.jahr === jahr && e.monat === monat),
      )
      return {
        ...prev,
        [mitarbeiterId]: [...ohneAktuellenMonat, { jahr, monat, gehaelter, stunden }],
      }
    })
  }

  // Remove a single salary payment from a monthly entry – if that empties
  // the entry, remove it entirely
  const handleGehaltLoeschen = (mitarbeiterId, jahr, monat, index) => {
    setMonatsDaten((prev) => ({
      ...prev,
      [mitarbeiterId]: (prev[mitarbeiterId] ?? [])
        .map((e) => {
          if (e.jahr !== jahr || e.monat !== monat) return e
          return { ...e, gehaelter: e.gehaelter.filter((_, i) => i !== index) }
        })
        .filter((e) => e.gehaelter.length > 0),
    }))
  }

  const selectedMitarbeiter = mitarbeiter.find((m) => m.id === selectedMitarbeiterId)
  const selectedGeschaeft = geschaefte.find((g) => g.id === selectedGeschaeftId)

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            geschaefte={geschaefte}
            mitarbeiter={mitarbeiter}
            monatsDaten={monatsDaten}
            onNeuerMitarbeiter={() => setActiveView('personal')}
            onNeuesGeschaeft={() => setActiveView('geschaefte')}
          />
        )
      case 'geschaefte':
        return (
          <GeschaefteView
            geschaefte={geschaefte}
            mitarbeiter={mitarbeiter}
            onHinzufuegen={handleGeschaeftHinzufuegen}
            onLoeschen={handleGeschaeftLoeschen}
            onAnsehen={handleGeschaeftAnsehen}
          />
        )
      case 'geschaeft-detail':
        if (!selectedGeschaeft) {
          setActiveView('geschaefte')
          return null
        }
        return (
          <GeschaeftDetailView
            geschaeft={selectedGeschaeft}
            mitarbeiterAnzahl={
              mitarbeiter.filter((m) => m.storeId === selectedGeschaeft.id).length
            }
            eintraege={umsatzDaten[selectedGeschaeft.id] ?? []}
            onSpeichern={handleUmsatzSpeichern}
            onLoeschen={handleUmsatzLoeschen}
            onZurueck={() => setActiveView('geschaefte')}
          />
        )
      case 'personal':
        return (
          <PersonalView
            mitarbeiter={mitarbeiter}
            geschaefte={geschaefte}
            onDelete={handleDelete}
            onView={handleMitarbeiterAnsehen}
            onHinzufuegen={handleMitarbeiterHinzufuegen}
          />
        )
      case 'personal-detail':
        if (!selectedMitarbeiter) {
          setActiveView('personal')
          return null
        }
        return (
          <MitarbeiterDetailView
            mitarbeiter={selectedMitarbeiter}
            geschaefte={geschaefte}
            eintraege={monatsDaten[selectedMitarbeiter.id] ?? []}
            onSpeichern={handleMonatSpeichern}
            onGehaltLoeschen={handleGehaltLoeschen}
            onZurueck={() => setActiveView('personal')}
          />
        )
      case 'statistik':
        return (
          <StatistikView
            geschaefte={geschaefte}
            umsatzDaten={umsatzDaten}
          />
        )
      case 'einstellungen':
        return <EinstellungenView />
      default:
        return null
    }
  }

  const headerTitel =
    activeView === 'personal-detail' && selectedMitarbeiter
      ? `${selectedMitarbeiter.firstName} ${selectedMitarbeiter.lastName}`
      : activeView === 'geschaeft-detail' && selectedGeschaeft
        ? selectedGeschaeft.name
        : VIEW_TITEL[activeView]

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={headerTitel}
          onMenuClick={() => setMobileOpen(true)}
          onLogout={handleAbmelden}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{renderView()}</main>
      </div>
    </div>
  )
}
