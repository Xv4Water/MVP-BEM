import React, { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
  Trash,
  ArrowLeft,
  Save,
  LogOut,
  Lock,
  User,
  AlertCircle,
  BarChart3,
  TrendingUp,
  ChevronDown,
} from 'lucide-react'

/* -------------------------------------------------------------------------- */
/*  MOCK DATABASE                                                             */
/*  Realistic sample data for branches and employees                          */
/* -------------------------------------------------------------------------- */

const STORES = [
  { id: 1, name: 'Central Branch', city: 'Berlin', state: 'Berlin' },
  { id: 2, name: 'Old Town Branch', city: 'Munich', state: 'Bavaria' },
  { id: 3, name: 'Harbour City Branch', city: 'Hamburg', state: 'Hamburg' },
  { id: 4, name: 'Downtown Branch', city: 'Cologne', state: 'North Rhine-Westphalia' },
]

const EMPLOYEES = [
  { id: 1, firstName: 'Anna', lastName: 'Schmidt', storeId: 1, position: 'Branch Manager', salary: 4200, hours: 40 },
  { id: 2, firstName: 'Lukas', lastName: 'Müller', storeId: 1, position: 'Sales Associate', salary: 2800, hours: 38 },
  { id: 3, firstName: 'Sophie', lastName: 'Weber', storeId: 2, position: 'Branch Manager', salary: 4100, hours: 40 },
  { id: 4, firstName: 'Jonas', lastName: 'Fischer', storeId: 2, position: 'Warehouse Assistant', salary: 2600, hours: 35 },
  { id: 5, firstName: 'Marie', lastName: 'Wagner', storeId: 2, position: 'Sales Associate', salary: 2750, hours: 30 },
  { id: 6, firstName: 'Felix', lastName: 'Becker', storeId: 3, position: 'Branch Manager', salary: 4300, hours: 40 },
  { id: 7, firstName: 'Laura', lastName: 'Hoffmann', storeId: 3, position: 'Sales Associate', salary: 2900, hours: 40 },
  { id: 8, firstName: 'Paul', lastName: 'Schäfer', storeId: 3, position: 'Part-Time Assistant', salary: 1400, hours: 20 },
  { id: 9, firstName: 'Emma', lastName: 'Koch', storeId: 4, position: 'Branch Manager', salary: 4000, hours: 40 },
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

// Mock year-to-date payroll figures per branch, used for the Dashboard's
// "Payroll by Branches" chart. Falls back to a deterministic estimate for
// any branch beyond the four seeded ones.
const MOCK_YTD_PAYROLL = { 1: 108500, 2: 94200, 3: 121300, 4: 87600 }
const getMockYtdPayroll = (storeId) =>
  MOCK_YTD_PAYROLL[storeId] ?? 90000 + ((storeId * 4300) % 35000)

// Map a storeId to its branch
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
  { key: 'geschaefte', label: 'Branches', icon: Store },
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
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0b10]/80 p-8 shadow-2xl shadow-black/40">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-white shadow-lg shadow-lime-400/30">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-white">BEM Management</h1>
          <p className="mt-1 text-sm text-slate-400">
            Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Username
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="username"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-2xl bg-rose-500/10 px-4 py-2.5 text-sm text-rose-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-lime-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-lime-400/30 transition hover:bg-lime-300"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
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
        className={`fixed inset-y-0 left-0 z-40 m-4 flex h-[calc(100vh-2rem)] w-20 flex-shrink-0 flex-col items-center gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-3 backdrop-blur-2xl transition-transform duration-300 md:static md:h-[calc(100vh-2rem)] md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)]'
        }`}
      >
        <button
          className="absolute right-2 top-2 text-slate-500 hover:text-white md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lime-400 text-white shadow-lg shadow-lime-400/30">
          <Building2 className="h-5 w-5" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-2">
          {NAV_LINKS.map(({ key, label, icon: Icon }) => {
            const isActive = activeView === key
            return (
              <button
                key={key}
                onClick={() => handleClick(key)}
                title={label}
                aria-label={label}
                className={
                  isActive
                    ? 'flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.4)]'
                    : 'flex h-12 w-12 items-center justify-center rounded-2xl text-gray-400 transition-colors hover:bg-white/10'
                }
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-slate-900' : ''}`} />
              </button>
            )
          })}
        </nav>

        {/* User avatar at the bottom */}
        <div
          className="mt-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-xs font-bold text-white"
          title="Michael Krause · Management"
        >
          MK
        </div>
      </aside>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  DROPDOWN                                                                  */
/*  Custom-styled select replacement – native <select> popups always render  */
/*  with the OS/browser's own (light) theme, which clashes with the dark     */
/*  glass UI, so this renders the option list ourselves.                     */
/* -------------------------------------------------------------------------- */

function Dropdown({ value, onChange, options, className = '', buttonClassName = '' }) {
  const [offen, setOffen] = useState(false)
  const [rect, setRect] = useState(null)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)

  // The option list is portaled to <body> and fixed-positioned against the
  // button's rect, so it can float above modals instead of being clipped by
  // their overflow-y-auto scroll container.
  useEffect(() => {
    if (!offen) return
    const updateRect = () => {
      if (buttonRef.current) setRect(buttonRef.current.getBoundingClientRect())
    }
    updateRect()
    window.addEventListener('scroll', updateRect, true)
    window.addEventListener('resize', updateRect)
    return () => {
      window.removeEventListener('scroll', updateRect, true)
      window.removeEventListener('resize', updateRect)
    }
  }, [offen])

  useEffect(() => {
    const handleClickAway = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        !(panelRef.current && panelRef.current.contains(event.target))
      ) {
        setOffen(false)
      }
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') setOffen(false)
    }
    document.addEventListener('mousedown', handleClickAway)
    window.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickAway)
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  const selected = options.find((o) => String(o.value) === String(value))

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOffen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-left text-sm font-medium text-slate-200 outline-none transition focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20 ${buttonClassName}`}
      >
        <span className="truncate">{selected ? selected.label : ''}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${offen ? 'rotate-180' : ''}`}
        />
      </button>

      {offen &&
        rect &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: 'fixed', top: rect.bottom + 8, left: rect.left, width: rect.width }}
            className="z-[100] max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-[#1a1c23] p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value)
                  setOffen(false)
                }}
                className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                  String(o.value) === String(value)
                    ? 'bg-lime-400/10 font-semibold text-lime-400'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  HEADER                                                                    */
/* -------------------------------------------------------------------------- */

function Header({ title, onMenuClick, onLogout }) {
  return (
    <header className="flex shrink-0 items-center gap-4 border-b border-white/10 px-4 py-4 md:px-8">
      {/* Menu button (mobile) */}
      <button
        className="text-slate-300 hover:text-white md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="hidden md:block">
        <h1 className="text-lg font-bold text-white">{title}</h1>
        <p className="text-xs text-slate-400">{todaysDate()}</p>
      </div>

      {/* Search bar */}
      <div className="relative ml-auto w-full max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search …"
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
        />
      </div>

      {/* Notifications */}
      <button className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-2.5 text-slate-300 transition hover:bg-white/10">
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
      </button>

      {/* Profile placeholder */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-sm font-bold text-white">
          MK
        </div>
        <div className="hidden text-sm lg:block">
          <p className="font-semibold text-white">Michael Krause</p>
          <p className="text-xs text-slate-400">Administrator</p>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={onLogout}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-2.5 text-slate-300 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
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

function KpiCard({ icon: Icon, label, value, hint, accent, variant = 'standard' }) {
  const isPrimary = variant === 'primary'
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-2xl md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-3 text-sm font-medium text-gray-400">{label}</p>
          <p className={`text-3xl font-semibold tracking-tight lg:text-4xl ${isPrimary ? 'text-lime-400' : 'text-white'}`}>
            {value}
          </p>
          {hint && (
            <p className={`mt-1 text-xs ${isPrimary ? 'text-slate-500' : 'text-lime-400'}`}>{hint}</p>
          )}
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  DASHBOARD VIEW                                                            */
/* -------------------------------------------------------------------------- */

function DashboardView({ geschaefte, mitarbeiter, monatsDaten, onQuickAction }) {
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

  // YTD payroll per branch for the bar chart (illustrative mock figures)
  const ytdPayrollProGeschaeft = useMemo(
    () =>
      geschaefte.map((g) => ({
        id: g.id,
        name: g.name,
        betrag: getMockYtdPayroll(g.id),
      })),
    [geschaefte],
  )
  const PAYROLL_ACHSE_MAX = 150000

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Store}
          label="Active Branches"
          value={kpis.aktiveGeschaefte}
          hint="Branches nationwide"
          accent="bg-lime-400/10 text-lime-400"
        />
        <KpiCard
          icon={Users}
          label="Total Employees"
          value={kpis.gesamtMitarbeiter}
          hint="Active staff"
          accent="bg-emerald-500/10 text-emerald-400"
        />
        <KpiCard
          icon={Wallet}
          label={`Staff Costs ${currentYear}`}
          value={formatEuro(kpis.personalkosten)}
          hint="Gross salaries for the current year"
          accent="bg-amber-500/10 text-amber-400"
          variant="primary"
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
          accent="bg-rose-500/10 text-rose-400"
          variant="primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart: YTD payroll per branch */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                Payroll by Branches
              </h2>
              <p className="text-sm text-slate-400">Total wages paid this year, by branch</p>
            </div>
          </div>

          {ytdPayrollProGeschaeft.length === 0 && (
            <p className="text-sm text-slate-500">No branches created yet.</p>
          )}
          {ytdPayrollProGeschaeft.length > 0 && (
            <div className="flex items-end justify-between gap-3 sm:gap-6">
              {ytdPayrollProGeschaeft.map((d) => (
                <div key={d.id} className="flex flex-1 flex-col items-center">
                  <span className="mb-2 text-xs font-semibold text-white">
                    {formatEuro(d.betrag)}
                  </span>
                  <div className="flex h-48 w-full items-end justify-center">
                    <div
                      className="w-10 rounded-t-xl bg-gradient-to-t from-lime-400 to-emerald-500 transition-all duration-500 sm:w-14"
                      style={{
                        height: `${Math.max(
                          Math.min((d.betrag / PAYROLL_ACHSE_MAX) * 100, 100),
                          4,
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="mt-3 text-center text-xs font-medium text-slate-400">
                    {d.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20">
          <h2 className="text-base font-bold text-white">Quick Actions</h2>
          <p className="text-sm text-slate-400">Frequently used functions</p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => onQuickAction('store')}
              className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <PlusCircle className="h-5 w-5 text-lime-400" />
              New Branch
            </button>
            <button
              onClick={() => onQuickAction('employee')}
              className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <UserPlus className="h-5 w-5 text-lime-400" />
              New Employee
            </button>
            <button
              onClick={() => onQuickAction('salary')}
              className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <Wallet className="h-5 w-5 text-lime-400" />
              Update Salary
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-white/5 p-4">
            <p className="text-sm font-medium text-slate-200">Tip</p>
            <p className="mt-1 text-xs text-slate-400">
              Click any branch on the Branches page to view, add, or manage
              its staff.
            </p>
          </div>
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
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20">
      <h3 className="text-base font-bold text-white">Salary History {jahr}</h3>
      <p className="text-sm text-slate-400">
        Monthly salary for {mitarbeiter.firstName} {mitarbeiter.lastName}
      </p>

      <div className="mt-6 flex gap-3">
        {/* Y axis */}
        <div className="flex h-56 flex-col justify-between text-right text-xs tabular-nums text-slate-500">
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
                className="absolute inset-x-0 border-t border-white/5"
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
                      <div className="pointer-events-none absolute -top-8 z-10 whitespace-nowrap rounded-xl bg-lime-400 px-2 py-1 text-xs font-bold text-white shadow-lg shadow-black/40">
                        {formatEuro(wert)}
                      </div>
                    )}
                    <div
                      className={`w-full max-w-[28px] rounded-t-[4px] transition-colors ${
                        hoverIndex === index ? 'bg-lime-400' : 'bg-lime-500'
                      }`}
                      style={{ height: `${hoehe}%` }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* X axis */}
          <div className="mt-2 flex justify-between gap-1.5 text-xs text-slate-500 sm:gap-2.5">
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

function MitarbeiterDetailView({
  mitarbeiter,
  geschaefte,
  eintraege,
  onSpeichern,
  onGehaltLoeschen,
  onZurueck,
  backLabel = 'Back to Employee Management',
}) {
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
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-lime-400"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>

        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-lg font-bold text-white">
            {mitarbeiter.firstName[0]}
            {mitarbeiter.lastName[0]}
          </div>
          <div className="mr-auto">
            <h2 className="text-lg font-bold text-white">
              {mitarbeiter.firstName} {mitarbeiter.lastName}
            </h2>
            <p className="text-sm text-slate-400">
              {mitarbeiter.position} · {getStoreName(mitarbeiter.storeId, geschaefte)}
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-slate-500">Base Salary</p>
              <p className="font-semibold text-white">{formatEuro(mitarbeiter.salary)}</p>
            </div>
            <div>
              <p className="text-slate-500">Base Hours</p>
              <p className="font-semibold text-white">{mitarbeiter.hours} hrs/week</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form: enter monthly data */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20">
          <h3 className="text-base font-bold text-white">Enter Monthly Data</h3>
          <p className="text-sm text-slate-400">
            Select a calendar month and year to enter salary and hours worked.
          </p>

          <form onSubmit={handleSpeichern} className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-200">
                  Month
                </label>
                <Dropdown
                  value={monat}
                  onChange={(v) => setMonat(Number(v))}
                  options={MONTHS.map((name, index) => ({ value: index, label: name }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-200">
                  Year
                </label>
                <Dropdown
                  value={jahr}
                  onChange={(v) => setJahr(Number(v))}
                  options={jahresOptionen.map((j) => ({ value: j, label: String(j) }))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">
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
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">
                Hours Worked
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={stundenInput}
                onChange={(e) => setStundenInput(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-lime-400/30 transition hover:bg-lime-300"
              >
                <Save className="h-4 w-4" />
                Save Entry
              </button>
              {gespeichertHinweis && (
                <span className="text-sm font-medium text-emerald-400">
                  ✓ Saved for {MONTHS[monat]} {jahr}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Recorded monthly data: salaries for the selected month/year */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20">
          <h3 className="text-base font-bold text-white">Recorded Monthly Data</h3>
          <p className="text-sm text-slate-400">
            Salaries for {MONTHS[monat]} {jahr}
          </p>

          <div className="mt-5 space-y-3">
            {(!aktuellerEintrag || aktuellerEintrag.gehaelter.length === 0) && (
              <p className="rounded-2xl bg-white/5 px-4 py-6 text-center text-sm text-slate-500">
                No salary data recorded yet for {MONTHS[monat]} {jahr}.
              </p>
            )}

            {aktuellerEintrag?.gehaelter.map((betrag, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-200">Salary {index + 1}</p>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-white">{formatEuro(betrag)}</p>
                  <button
                    onClick={() => onGehaltLoeschen(mitarbeiter.id, jahr, monat, index)}
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                    aria-label={`Delete Salary ${index + 1} for ${MONTHS[monat]} ${jahr}`}
                    title="Delete payment"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {aktuellerEintrag && aktuellerEintrag.gehaelter.length > 0 && (
              <div className="flex items-center justify-between border-t border-white/10 px-4 pt-4">
                <p className="text-sm font-bold text-white">Total</p>
                <p className="text-sm font-bold text-white">{formatEuro(gehaltGesamt)}</p>
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
/*  BRANCHES VIEW                                                            */
/*  Show branches, and add or delete them                                    */
/* -------------------------------------------------------------------------- */

function GeschaefteView({ geschaefte, mitarbeiter, onHinzufuegen, onLoeschen, onSelectStore }) {
  const [formularOffen, setFormularOffen] = useState(false)
  const [name, setName] = useState('')
  const [stadt, setStadt] = useState('')
  const [bundesland, setBundesland] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  const handleAbbrechen = () => {
    setFormularOffen(false)
    setName('')
    setStadt('')
    setBundesland('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!name.trim() || !stadt.trim() || !bundesland.trim()) return
    onHinzufuegen(name.trim(), stadt.trim(), bundesland.trim())
    handleAbbrechen()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Branches</h2>
          <p className="text-sm text-slate-400">{geschaefte.length} active branches</p>
        </div>
        <button
          onClick={() => setFormularOffen((offen) => !offen)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          <PlusCircle className="h-4 w-4 text-lime-400" />
          New Branch
        </button>
      </div>

      {/* Form: add new branch */}
      {formularOffen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20"
        >
          <h3 className="text-base font-bold text-white">Add New Branch</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Southside Branch"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">
                City
              </label>
              <input
                type="text"
                value={stadt}
                onChange={(e) => setStadt(e.target.value)}
                placeholder="e.g. Stuttgart"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">
                State
              </label>
              <input
                type="text"
                value={bundesland}
                onChange={(e) => setBundesland(e.target.value)}
                placeholder="e.g. Bavaria"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleAbbrechen}
              className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-lime-400/30 transition hover:bg-lime-300"
            >
              Save Branch
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
              onClick={() => onSelectStore(g.id)}
              className="group cursor-pointer rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20 transition hover:border-lime-400/30 hover:shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{g.name}</p>
                    <p className="text-sm text-slate-400">
                      {g.city} · {g.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      setPendingDelete({ id: g.id, name: g.name, anzahl })
                    }}
                    className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                    aria-label={`Delete ${g.name}`}
                    title="Delete branch"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-sm text-slate-400">Employees</span>
                <span className="text-sm font-semibold text-white">{anzahl}</span>
              </div>
            </div>
          )
        })}

        {geschaefte.length === 0 && (
          <p className="col-span-full rounded-3xl border border-dashed border-white/10 bg-white/[0.06] px-6 py-12 text-center text-sm text-slate-500">
            No branches yet. Use "New Branch" to create your first one.
          </p>
        )}
      </div>

      {pendingDelete && (
        <ModalOverlay onClose={() => setPendingDelete(null)} maxWidthClass="max-w-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
            <Trash className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-white">Delete branch?</h2>
          <p className="mt-2 text-sm text-slate-400">
            Are you sure you want to delete <span className="font-semibold text-slate-200">{pendingDelete.name}</span>?
            {pendingDelete.anzahl > 0
              ? ` This will also permanently remove its ${pendingDelete.anzahl} employee${pendingDelete.anzahl === 1 ? '' : 's'}.`
              : ' This cannot be undone.'}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onLoeschen(pendingDelete.id)
                setPendingDelete(null)
              }}
              className="rounded-2xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-400"
            >
              Delete
            </button>
          </div>
        </ModalOverlay>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  STATISTICS VIEW                                                          */
/*  Payroll by year and month                                                */
/* -------------------------------------------------------------------------- */

function StatistikView({ mitarbeiter, monatsDaten }) {
  const heute = new Date()
  const currentYear = heute.getFullYear()
  const currentMonthIndex = heute.getMonth()
  const [jahr, setJahr] = useState(currentYear)

  const jahresOptionen = useMemo(() => {
    const startJahr = heute.getFullYear() - 3
    return Array.from({ length: 6 }, (_, i) => startJahr + i)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // How many months of the selected year have already happened – the basis
  // for the year-end run-rate forecast below. A past year is fully elapsed,
  // a future year has no elapsed months yet.
  const elapsedMonths =
    jahr < currentYear ? 12 : jahr > currentYear ? 0 : currentMonthIndex + 1

  // Total wages paid for each month of the selected year, from the recorded
  // salary entries – falling back to each employee's base salary for months
  // without an explicit entry, same logic as the Dashboard's Staff Costs KPI
  const monatsStatistik = useMemo(() => {
    return MONTHS.map((name, monatIndex) => {
      const lohn = mitarbeiter.reduce((summe, m) => {
        const eintrag = (monatsDaten[m.id] ?? []).find(
          (e) => e.jahr === jahr && e.monat === monatIndex,
        )
        const gehalt = eintrag
          ? eintrag.gehaelter.reduce((teilsumme, betrag) => teilsumme + betrag, 0)
          : m.salary
        return summe + gehalt
      }, 0)

      return { monat: monatIndex, name, lohn, istZukunft: monatIndex >= elapsedMonths }
    })
  }, [mitarbeiter, monatsDaten, jahr, elapsedMonths])

  const jahresSumme = useMemo(
    () => monatsStatistik.reduce((summe, m) => summe + m.lohn, 0),
    [monatsStatistik],
  )

  const durchschnittProMonat = Math.round(jahresSumme / 12)

  // Year-end run-rate forecast: extrapolate the average of the elapsed
  // months across the full year. For a year with no elapsed months yet
  // (fully in the future) there's no YTD basis, so fall back to the flat
  // full-year estimate instead of dividing by zero.
  const ytdSumme = monatsStatistik
    .slice(0, elapsedMonths)
    .reduce((summe, m) => summe + m.lohn, 0)
  const runRate =
    elapsedMonths > 0 ? Math.round((ytdSumme / elapsedMonths) * 12) : jahresSumme

  const runRateHint =
    jahr > currentYear
      ? `Full-year estimate for ${jahr} (no data yet)`
      : jahr < currentYear
        ? `${jahr} is complete`
        : `Run rate based on ${elapsedMonths} month${elapsedMonths === 1 ? '' : 's'} of ${jahr} YTD`

  const maxLohn = Math.max(...monatsStatistik.map((m) => m.lohn), 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Statistics</h2>
          <p className="text-sm text-slate-400">
            Monthly payroll overview
          </p>
        </div>
        <div>
          <Dropdown
            value={jahr}
            onChange={(v) => setJahr(Number(v))}
            options={jahresOptionen.map((j) => ({ value: j, label: String(j) }))}
            className="w-36"
          />
        </div>
      </div>

      {/* Yearly KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          icon={Wallet}
          label={`Wages Paid ${jahr}`}
          value={formatEuro(jahresSumme)}
          hint="Sum across all employees"
          accent="bg-lime-400/10 text-lime-400"
          variant="primary"
        />
        <KpiCard
          icon={BarChart3}
          label="Average per Month"
          value={formatEuro(durchschnittProMonat)}
          hint={`Average monthly wages paid in ${jahr}`}
          accent="bg-emerald-500/10 text-emerald-400"
        />
        <KpiCard
          icon={TrendingUp}
          label="Year-End Forecast (Run Rate)"
          value={formatEuro(runRate)}
          hint={runRateHint}
          accent="bg-purple-500/10 text-purple-400"
          variant="primary"
        />
      </div>

      {/* Monthly overview */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Monthly Wages Paid</h3>
            <p className="text-sm text-slate-400">
              {jahr === currentYear
                ? 'Solid bars are recorded so far, faded bars are projected'
                : `Wages paid per month in ${jahr}`}
            </p>
          </div>
          {jahr === currentYear && (
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-lime-400" /> Actual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-lime-400/30" /> Projected
              </span>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-1.5 overflow-x-auto sm:gap-3">
          {monatsStatistik.map((m) => (
            <div key={m.monat} className="flex min-w-[52px] flex-1 flex-col items-center">
              <span
                className={`mb-2 text-xs font-semibold ${m.istZukunft ? 'text-slate-500' : 'text-white'}`}
              >
                {formatEuro(m.lohn)}
              </span>
              <div className="flex h-48 w-full items-end justify-center">
                <div
                  className={`w-6 rounded-t-xl transition-all duration-500 sm:w-9 ${
                    m.istZukunft
                      ? 'bg-gradient-to-t from-lime-400/25 to-emerald-500/25'
                      : 'bg-gradient-to-t from-lime-400 to-emerald-500'
                  }`}
                  style={{
                    height: `${Math.max((m.lohn / maxLohn) * 100, 4)}%`,
                  }}
                />
              </div>
              <span className="mt-3 text-center text-xs font-medium text-slate-400">
                {m.name.slice(0, 3)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  SETTINGS VIEW                                                            */
/* -------------------------------------------------------------------------- */

const CURRENCY_OPTIONS = [
  { value: 'Euro (€)', label: 'Euro (€)' },
  { value: 'US Dollar ($)', label: 'US Dollar ($)' },
  { value: 'Swiss Franc (CHF)', label: 'Swiss Franc (CHF)' },
  { value: 'Ghanaian Cedi (₵)', label: 'Ghanaian Cedi (₵)' },
]

const EINSTELLUNGEN_DEFAULT = {
  companyName: 'BEM Management GmbH',
  email: 'info@bem-gmbh.de',
  storeHq: 'Berlin',
  waehrung: 'Euro (€)',
}

function EinstellungenView() {
  const [gespeichert, setGespeichert] = useState(EINSTELLUNGEN_DEFAULT)
  const [entwurf, setEntwurf] = useState(EINSTELLUNGEN_DEFAULT)
  const [zeigeGespeichert, setZeigeGespeichert] = useState(false)

  // Briefly confirm the save, then hide the confirmation again
  useEffect(() => {
    if (!zeigeGespeichert) return
    const timeout = setTimeout(() => setZeigeGespeichert(false), 2500)
    return () => clearTimeout(timeout)
  }, [zeigeGespeichert])

  const handleFeldAendern = (feld, wert) => {
    setEntwurf((prev) => ({ ...prev, [feld]: wert }))
  }

  const handleAbbrechen = () => {
    setEntwurf(gespeichert)
    setZeigeGespeichert(false)
  }

  const handleSpeichern = (event) => {
    event.preventDefault()
    setGespeichert(entwurf)
    setZeigeGespeichert(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Settings</h2>
        <p className="text-sm text-slate-400">Manage your account and system settings</p>
      </div>

      <form
        onSubmit={handleSpeichern}
        className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20"
      >
        <h3 className="text-base font-bold text-white">Company Profile</h3>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Company Name
            </label>
            <input
              type="text"
              value={entwurf.companyName}
              onChange={(e) => handleFeldAendern('companyName', e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Email Address
            </label>
            <input
              type="email"
              value={entwurf.email}
              onChange={(e) => handleFeldAendern('email', e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Branch (Headquarters)
            </label>
            <input
              type="text"
              value={entwurf.storeHq}
              onChange={(e) => handleFeldAendern('storeHq', e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Currency
            </label>
            <Dropdown
              value={entwurf.waehrung}
              onChange={(v) => handleFeldAendern('waehrung', v)}
              options={CURRENCY_OPTIONS}
              className="w-full"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          {zeigeGespeichert && (
            <span className="mr-auto flex items-center gap-1.5 text-sm font-medium text-lime-400">
              <Save className="h-4 w-4" /> Changes saved
            </span>
          )}
          <button
            type="button"
            onClick={handleAbbrechen}
            className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-lime-400/30 transition hover:bg-lime-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  BRANCH EMPLOYEES MODAL                                                    */
/*  Opened from the Branches page – shows only the employees for the clicked */
/*  branch, with add/delete and per-employee monthly salary entry, all       */
/*  inside a glass modal overlay.                                            */
/* -------------------------------------------------------------------------- */

function ModalOverlay({ onClose, maxWidthClass = 'max-w-2xl', children }) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`max-h-[85vh] w-full ${maxWidthClass} overflow-y-auto rounded-[2rem] border border-white/10 bg-[#1a1c23]/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function StoreEmployeesModal({
  store,
  mitarbeiter,
  monatsDaten,
  onClose,
  onHinzufuegen,
  onDelete,
  onMonatSpeichern,
  onGehaltLoeschen,
}) {
  const [formularOffen, setFormularOffen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [position, setPosition] = useState('')
  const [salary, setSalary] = useState('')
  const [hours, setHours] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)

  const storeEmployees = mitarbeiter.filter((m) => m.storeId === store.id)
  const selectedEmployee = storeEmployees.find((m) => m.id === selectedEmployeeId)

  const resetForm = () => {
    setFormularOffen(false)
    setFirstName('')
    setLastName('')
    setPosition('')
    setSalary('')
    setHours('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !position.trim()) return
    onHinzufuegen({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      position: position.trim(),
      storeId: store.id,
      salary: Number(salary) || 0,
      hours: Number(hours) || 0,
    })
    resetForm()
  }

  return (
    <ModalOverlay onClose={onClose}>
      {selectedEmployee ? (
          <MitarbeiterDetailView
            mitarbeiter={selectedEmployee}
            geschaefte={[store]}
            eintraege={monatsDaten[selectedEmployee.id] ?? []}
            onSpeichern={onMonatSpeichern}
            onGehaltLoeschen={onGehaltLoeschen}
            onZurueck={() => setSelectedEmployeeId(null)}
            backLabel={`Back to ${store.name}`}
          />
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">{store.name}</h2>
                <p className="text-sm text-slate-400">
                  {store.city}, {store.state} · {storeEmployees.length} employees
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => setFormularOffen((offen) => !offen)}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  <UserPlus className="h-4 w-4 text-lime-400" />
                  Add Employee
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {formularOffen && (
              <form
                onSubmit={handleSubmit}
                className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <h3 className="text-sm font-bold text-white">Add New Employee</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-200">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Julia"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-200">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Bauer"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-200">
                      Position
                    </label>
                    <input
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="e.g. Sales Associate"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-200">
                      Salary (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. 2800"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-200">
                      Hours/Week
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="e.g. 38"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-2xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-lime-400/30 transition hover:bg-lime-300"
                  >
                    Save Employee
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 divide-y divide-white/5">
              {storeEmployees.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedEmployeeId(m.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl px-2 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-xs font-bold text-white">
                      {m.firstName[0]}
                      {m.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {m.firstName} {m.lastName}
                      </p>
                      <p className="truncate text-xs text-slate-500">{m.position}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-white">
                      {formatEuro(m.salary)}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation()
                        onDelete(m.id)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.stopPropagation()
                          onDelete(m.id)
                        }
                      }}
                      aria-label={`Delete ${m.firstName} ${m.lastName}`}
                      title="Delete"
                      className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <Trash className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))}

              {storeEmployees.length === 0 && (
                <p className="rounded-xl bg-white/5 px-4 py-8 text-center text-sm text-slate-500">
                  No employees at this branch yet.
                </p>
              )}
            </div>
          </>
        )}
    </ModalOverlay>
  )
}

/* -------------------------------------------------------------------------- */
/*  QUICK ACTION MODALS (Dashboard)                                           */
/* -------------------------------------------------------------------------- */

function NewStoreModal({ onClose, onHinzufuegen }) {
  const [name, setName] = useState('')
  const [stadt, setStadt] = useState('')
  const [bundesland, setBundesland] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!name.trim() || !stadt.trim() || !bundesland.trim()) return
    onHinzufuegen(name.trim(), stadt.trim(), bundesland.trim())
    onClose()
  }

  return (
    <ModalOverlay onClose={onClose} maxWidthClass="max-w-lg">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold text-white">New Branch</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-200">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Southside Branch"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-200">City</label>
          <input
            type="text"
            value={stadt}
            onChange={(e) => setStadt(e.target.value)}
            placeholder="e.g. Stuttgart"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-200">State</label>
          <input
            type="text"
            value={bundesland}
            onChange={(e) => setBundesland(e.target.value)}
            placeholder="e.g. Bavaria"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
          />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-lime-400/30 transition hover:bg-lime-300"
          >
            Save Branch
          </button>
        </div>
      </form>
    </ModalOverlay>
  )
}

function NewEmployeeModal({ geschaefte, onClose, onHinzufuegen }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [position, setPosition] = useState('')
  const [storeId, setStoreId] = useState(geschaefte[0]?.id ?? '')
  const [salary, setSalary] = useState('')
  const [hours, setHours] = useState('')

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
    onClose()
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold text-white">New Employee</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Julia"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Bauer"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Position
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Sales Associate"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Branch
            </label>
            <Dropdown
              value={storeId}
              onChange={(v) => setStoreId(v)}
              options={
                geschaefte.length === 0
                  ? [{ value: '', label: 'No branch available' }]
                  : geschaefte.map((g) => ({ value: g.id, label: `${g.name} · ${g.city}` }))
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Salary (€)
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 2800"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Hours/Week
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 38"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-lime-400/50 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={geschaefte.length === 0}
            className="rounded-2xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-lime-400/30 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save Employee
          </button>
        </div>
      </form>
    </ModalOverlay>
  )
}

function UpdateSalaryModal({ mitarbeiter, geschaefte, monatsDaten, onClose, onMonatSpeichern, onGehaltLoeschen }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const selectedEmployee = mitarbeiter.find((m) => m.id === Number(selectedEmployeeId))

  return (
    <ModalOverlay onClose={onClose}>
      {selectedEmployee ? (
        <MitarbeiterDetailView
          mitarbeiter={selectedEmployee}
          geschaefte={geschaefte}
          eintraege={monatsDaten[selectedEmployee.id] ?? []}
          onSpeichern={onMonatSpeichern}
          onGehaltLoeschen={onGehaltLoeschen}
          onZurueck={() => setSelectedEmployeeId('')}
          backLabel="Back to employee selection"
        />
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Update Salary</h2>
              <p className="text-sm text-slate-400">
                Select an employee to record their monthly salary.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {mitarbeiter.length === 0 ? (
            <p className="mt-5 rounded-xl bg-white/5 px-4 py-8 text-center text-sm text-slate-500">
              No employees yet.
            </p>
          ) : (
            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium text-slate-200">
                Employee
              </label>
              <Dropdown
                value={selectedEmployeeId}
                onChange={(v) => setSelectedEmployeeId(v)}
                options={[
                  { value: '', label: 'Select an employee…' },
                  ...mitarbeiter.map((m) => ({
                    value: m.id,
                    label: `${m.firstName} ${m.lastName} · ${getStoreName(m.storeId, geschaefte)}`,
                  })),
                ]}
                className="w-full"
              />
            </div>
          )}
        </>
      )}
    </ModalOverlay>
  )
}

/* -------------------------------------------------------------------------- */
/*  POWER-UP TRANSITION                                                       */
/*  Plays once right after a successful login: a white flash and an          */
/*  expanding green energy burst.                                            */
/* -------------------------------------------------------------------------- */

function PowerUpBurst() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      <style>{`
        @keyframes powerUpFlash {
          0% { opacity: 0; }
          10% { opacity: 0.9; }
          100% { opacity: 0; }
        }
        @keyframes powerUpBurst {
          0% { transform: translate(-50%, -50%) scale(0.15); opacity: 0.95; }
          55% { opacity: 0.55; }
          100% { transform: translate(-50%, -50%) scale(3.4); opacity: 0; }
        }
        @keyframes powerUpBurstSlow {
          0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
      `}</style>
      <div
        className="absolute inset-0 bg-white"
        style={{ animation: 'powerUpFlash 850ms ease-out forwards' }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(circle, rgba(163,230,53,0.55) 0%, rgba(163,230,53,0.25) 40%, rgba(163,230,53,0) 70%)',
          animation: 'powerUpBurstSlow 1200ms 80ms cubic-bezier(0.15,0.8,0.3,1) forwards',
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[38vmax] w-[38vmax] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(190,242,100,0.95) 0%, rgba(163,230,53,0.6) 45%, rgba(163,230,53,0) 72%)',
          animation: 'powerUpBurst 1000ms cubic-bezier(0.15,0.8,0.3,1) forwards',
        }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  MAIN COMPONENT                                                            */
/* -------------------------------------------------------------------------- */

const VIEW_TITEL = {
  dashboard: 'Dashboard',
  geschaefte: 'Branches',
  statistik: 'Statistics',
  einstellungen: 'Settings',
}

export default function App() {
  const [istAngemeldet, setIstAngemeldet] = useState(false)
  const [poweringUp, setPoweringUp] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mitarbeiter, setMitarbeiter] = useState(EMPLOYEES)
  const [geschaefte, setGeschaefte] = useState(STORES)
  const [selectedStoreId, setSelectedStoreId] = useState(null)
  // Which Dashboard "Quick Actions" modal is open: 'store' | 'employee' | 'salary' | null
  const [quickModal, setQuickModal] = useState(null)

  // Monthly data per employee: { [employeeId]: [{ jahr, monat, gehaelter: number[] (max. 4), stunden }] }
  const [monatsDaten, setMonatsDaten] = useState({})

  const handleAbmelden = () => {
    setIstAngemeldet(false)
    setActiveView('dashboard')
  }

  // Power-up transition into the app after a successful login: a brief
  // white flash and green energy-burst.
  const handleAnmelden = () => {
    setIstAngemeldet(true)
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) {
      setPoweringUp(true)
      setTimeout(() => setPoweringUp(false), 1200)
    }
  }

  if (!istAngemeldet) {
    return <LoginView onLogin={handleAnmelden} />
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

  // Add a new branch
  const handleGeschaeftHinzufuegen = (name, city, state) => {
    setGeschaefte((prev) => {
      const neueId = Math.max(0, ...prev.map((g) => g.id)) + 1
      return [...prev, { id: neueId, name, city, state }]
    })
  }

  // Remove a branch, along with its employees and their recorded monthly data
  const handleGeschaeftLoeschen = (id) => {
    const entfernteMitarbeiterIds = mitarbeiter
      .filter((m) => m.storeId === id)
      .map((m) => m.id)

    setGeschaefte((prev) => prev.filter((g) => g.id !== id))
    setMitarbeiter((prev) => prev.filter((m) => m.storeId !== id))
    setMonatsDaten((prev) => {
      const next = { ...prev }
      entfernteMitarbeiterIds.forEach((mitarbeiterId) => {
        delete next[mitarbeiterId]
      })
      return next
    })
    setSelectedStoreId((prev) => (prev === id ? null : prev))
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

  const selectedStore = geschaefte.find((g) => g.id === selectedStoreId)

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            geschaefte={geschaefte}
            mitarbeiter={mitarbeiter}
            monatsDaten={monatsDaten}
            onQuickAction={(type) => setQuickModal(type)}
          />
        )
      case 'geschaefte':
        return (
          <GeschaefteView
            geschaefte={geschaefte}
            mitarbeiter={mitarbeiter}
            onHinzufuegen={handleGeschaeftHinzufuegen}
            onLoeschen={handleGeschaeftLoeschen}
            onSelectStore={(id) => setSelectedStoreId(id)}
          />
        )
      case 'statistik':
        return (
          <StatistikView
            mitarbeiter={mitarbeiter}
            monatsDaten={monatsDaten}
          />
        )
      case 'einstellungen':
        return <EinstellungenView />
      default:
        return null
    }
  }

  const headerTitel = VIEW_TITEL[activeView]

  return (
    <div className="relative isolate flex h-screen items-stretch overflow-hidden bg-slate-950">
      {poweringUp && <PowerUpBurst />}

      <div className="relative z-40">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>

      <div className="relative z-10 m-4 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 md:ml-0">
        <Header
          title={headerTitel}
          onMenuClick={() => setMobileOpen(true)}
          onLogout={handleAbmelden}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{renderView()}</main>
      </div>

      {selectedStore && (
        <StoreEmployeesModal
          store={selectedStore}
          mitarbeiter={mitarbeiter}
          monatsDaten={monatsDaten}
          onClose={() => setSelectedStoreId(null)}
          onHinzufuegen={handleMitarbeiterHinzufuegen}
          onDelete={handleDelete}
          onMonatSpeichern={handleMonatSpeichern}
          onGehaltLoeschen={handleGehaltLoeschen}
        />
      )}

      {quickModal === 'store' && (
        <NewStoreModal
          onClose={() => setQuickModal(null)}
          onHinzufuegen={handleGeschaeftHinzufuegen}
        />
      )}

      {quickModal === 'employee' && (
        <NewEmployeeModal
          geschaefte={geschaefte}
          onClose={() => setQuickModal(null)}
          onHinzufuegen={handleMitarbeiterHinzufuegen}
        />
      )}

      {quickModal === 'salary' && (
        <UpdateSalaryModal
          mitarbeiter={mitarbeiter}
          geschaefte={geschaefte}
          monatsDaten={monatsDaten}
          onClose={() => setQuickModal(null)}
          onMonatSpeichern={handleMonatSpeichern}
          onGehaltLoeschen={handleGehaltLoeschen}
        />
      )}
    </div>
  )
}
