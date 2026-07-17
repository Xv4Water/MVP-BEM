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
  Clock,
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
/*  MOCK-DATENBANK                                                            */
/*  Realistische Beispieldaten für Geschäfte und Mitarbeiter (alles Deutsch) */
/* -------------------------------------------------------------------------- */

const GESCHAEFTE = [
  { id: 1, name: 'Filiale Mitte', city: 'Berlin' },
  { id: 2, name: 'Filiale Altstadt', city: 'München' },
  { id: 3, name: 'Filiale Hafencity', city: 'Hamburg' },
  { id: 4, name: 'Filiale Innenstadt', city: 'Köln' },
]

const MITARBEITER = [
  { id: 1, firstName: 'Anna', lastName: 'Schmidt', storeId: 1, position: 'Filialleiterin', salary: 4200, hours: 40 },
  { id: 2, firstName: 'Lukas', lastName: 'Müller', storeId: 1, position: 'Verkäufer', salary: 2800, hours: 38 },
  { id: 3, firstName: 'Sophie', lastName: 'Weber', storeId: 2, position: 'Filialleiterin', salary: 4100, hours: 40 },
  { id: 4, firstName: 'Jonas', lastName: 'Fischer', storeId: 2, position: 'Lagerist', salary: 2600, hours: 35 },
  { id: 5, firstName: 'Marie', lastName: 'Wagner', storeId: 2, position: 'Verkäuferin', salary: 2750, hours: 30 },
  { id: 6, firstName: 'Felix', lastName: 'Becker', storeId: 3, position: 'Filialleiter', salary: 4300, hours: 40 },
  { id: 7, firstName: 'Laura', lastName: 'Hoffmann', storeId: 3, position: 'Verkäuferin', salary: 2900, hours: 40 },
  { id: 8, firstName: 'Paul', lastName: 'Schäfer', storeId: 3, position: 'Aushilfe', salary: 1400, hours: 20 },
  { id: 9, firstName: 'Emma', lastName: 'Koch', storeId: 4, position: 'Filialleiterin', salary: 4000, hours: 40 },
  { id: 10, firstName: 'Tim', lastName: 'Richter', storeId: 4, position: 'Verkäufer', salary: 2850, hours: 38 },
  { id: 11, firstName: 'Lena', lastName: 'Klein', storeId: 4, position: 'Aushilfe', salary: 1300, hours: 18 },
  { id: 12, firstName: 'Max', lastName: 'Wolf', storeId: 1, position: 'Lagerist', salary: 2650, hours: 37 },
]

/* -------------------------------------------------------------------------- */
/*  HILFSFUNKTIONEN                                                           */
/* -------------------------------------------------------------------------- */

// Währung im deutschen Format formatieren (z. B. 4.200 €)
const formatEuro = (betrag) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(betrag)

// storeId einem Geschäft zuordnen
const getStoreName = (storeId, geschaefteListe) =>
  geschaefteListe.find((g) => g.id === storeId)?.name ?? 'Unbekannt'

// Aktuelles Datum auf Deutsch
const heutigesDatum = () =>
  new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

// Deutsche Monatsnamen (Index 0 = Januar)
const MONATE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

// Kurzform für Diagramm-Beschriftungen
const MONATE_KURZ = [
  'Jan',
  'Feb',
  'Mär',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez',
]

/* -------------------------------------------------------------------------- */
/*  NAVIGATION                                                                */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'geschaefte', label: 'Geschäfte', icon: Store },
  { key: 'personal', label: 'Personal', icon: Users },
  { key: 'statistik', label: 'Statistik', icon: BarChart3 },
  { key: 'einstellungen', label: 'Einstellungen', icon: Settings },
]

/* -------------------------------------------------------------------------- */
/*  ANMELDEDATEN (Demo-Login)                                                 */
/* -------------------------------------------------------------------------- */

const ANMELDEDATEN = {
  benutzername: 'Geschäft',
  passwort: 'Geschäft123',
}

/* -------------------------------------------------------------------------- */
/*  LOGIN-ANSICHT                                                             */
/* -------------------------------------------------------------------------- */

function LoginView({ onAnmelden }) {
  const [benutzername, setBenutzername] = useState('')
  const [passwort, setPasswort] = useState('')
  const [fehler, setFehler] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (
      benutzername === ANMELDEDATEN.benutzername &&
      passwort === ANMELDEDATEN.passwort
    ) {
      setFehler('')
      onAnmelden()
    } else {
      setFehler('Benutzername oder Passwort ist falsch.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">BEM Verwaltung</h1>
          <p className="mt-1 text-sm text-slate-500">
            Bitte melden Sie sich an, um fortzufahren
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Benutzername
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={benutzername}
                onChange={(e) => setBenutzername(e.target.value)}
                placeholder="Benutzername"
                autoComplete="username"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Passwort
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={passwort}
                onChange={(e) => setPasswort(e.target.value)}
                placeholder="Passwort"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {fehler && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {fehler}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
          >
            Anmelden
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo-Zugangsdaten – Benutzername: „Geschäft" · Passwort: „Geschäft123"
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
      {/* Overlay für Mobilgeräte */}
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
              <p className="text-base font-bold text-white">BEM Verwaltung</p>
              <p className="text-xs text-slate-400">Business Management</p>
            </div>
          </div>
          <button
            className="text-slate-400 hover:text-white md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Menü schließen"
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

        {/* Nutzerkarte unten */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white">
              MK
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Michael Krause</p>
              <p className="truncate text-xs text-slate-400">Geschäftsführung</p>
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

function Header({ title, onMenuClick, onAbmelden }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-4 md:px-8">
      {/* Menü-Button (mobil) */}
      <button
        className="text-slate-600 hover:text-slate-900 md:hidden"
        onClick={onMenuClick}
        aria-label="Menü öffnen"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="hidden md:block">
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-500">{heutigesDatum()}</p>
      </div>

      {/* Suchleiste */}
      <div className="relative ml-auto w-full max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Suchen …"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Benachrichtigungen */}
      <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50">
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
      </button>

      {/* Profil-Platzhalter */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white">
          MK
        </div>
        <div className="hidden text-sm lg:block">
          <p className="font-semibold text-slate-900">Michael Krause</p>
          <p className="text-xs text-slate-500">Administrator</p>
        </div>
      </div>

      {/* Abmelden */}
      <button
        onClick={onAbmelden}
        className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
        aria-label="Abmelden"
        title="Abmelden"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  KPI-KARTE                                                                 */
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
/*  DASHBOARD-ANSICHT                                                         */
/* -------------------------------------------------------------------------- */

function DashboardView({ geschaefte, mitarbeiter, onNeuerMitarbeiter, onNeuesGeschaeft }) {
  // KPIs dynamisch aus den Daten berechnen
  const kpis = useMemo(() => {
    const aktiveGeschaefte = geschaefte.length
    const gesamtMitarbeiter = mitarbeiter.length
    const personalkosten = mitarbeiter.reduce((summe, m) => summe + m.salary, 0)
    const durchschnittStunden =
      gesamtMitarbeiter > 0
        ? Math.round(
            mitarbeiter.reduce((summe, m) => summe + m.hours, 0) / gesamtMitarbeiter,
          )
        : 0
    return { aktiveGeschaefte, gesamtMitarbeiter, personalkosten, durchschnittStunden }
  }, [geschaefte, mitarbeiter])

  // Mitarbeiter pro Geschäft für das Balkendiagramm
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
      {/* KPI-Karten */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Store}
          label="Aktive Geschäfte"
          value={kpis.aktiveGeschaefte}
          hint="Filialen bundesweit"
          accent="bg-indigo-50 text-indigo-600"
        />
        <KpiCard
          icon={Users}
          label="Gesamt-Mitarbeiter"
          value={kpis.gesamtMitarbeiter}
          hint="Aktive Beschäftigte"
          accent="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          icon={Wallet}
          label="Personalkosten / Monat"
          value={formatEuro(kpis.personalkosten)}
          hint="Bruttogehälter gesamt"
          accent="bg-amber-50 text-amber-600"
        />
        <KpiCard
          icon={Clock}
          label="Ø Arbeitsstunden"
          value={`${kpis.durchschnittStunden} Std.`}
          hint="pro Woche und Mitarbeiter"
          accent="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Diagramm: Mitarbeiter pro Geschäft */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Mitarbeiter pro Geschäft
              </h2>
              <p className="text-sm text-slate-500">Verteilung nach Filiale</p>
            </div>
          </div>

          <div className="space-y-5">
            {mitarbeiterProGeschaeft.daten.length === 0 && (
              <p className="text-sm text-slate-400">Noch keine Geschäfte angelegt.</p>
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

        {/* Schnellaktionen */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Schnellaktionen</h2>
          <p className="text-sm text-slate-500">Häufig genutzte Funktionen</p>

          <div className="mt-6 space-y-3">
            <button
              onClick={onNeuerMitarbeiter}
              className="flex w-full items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
            >
              <UserPlus className="h-5 w-5" />
              Neuer Mitarbeiter
            </button>
            <button
              onClick={onNeuesGeschaeft}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <PlusCircle className="h-5 w-5 text-indigo-600" />
              Neues Geschäft
            </button>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Tipp</p>
            <p className="mt-1 text-xs text-slate-500">
              Über die Personalverwaltung können Sie Mitarbeiterdaten jederzeit
              bearbeiten und aktualisieren.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  PERSONALVERWALTUNG-ANSICHT                                                */
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
          <h2 className="text-lg font-bold text-slate-900">Personalverwaltung</h2>
          <p className="text-sm text-slate-500">
            {mitarbeiter.length} Mitarbeiter insgesamt
          </p>
        </div>
        <button
          onClick={() => setFormularOffen((offen) => !offen)}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
        >
          <UserPlus className="h-4 w-4" />
          Neuer Mitarbeiter
        </button>
      </div>

      {/* Formular: Neuen Mitarbeiter anlegen */}
      {formularOffen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-base font-bold text-slate-900">Neuen Mitarbeiter anlegen</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Vorname
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="z. B. Julia"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Nachname
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="z. B. Bauer"
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
                placeholder="z. B. Verkäuferin"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Geschäft
              </label>
              <select
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                {geschaefte.length === 0 && <option value="">Kein Geschäft vorhanden</option>}
                {geschaefte.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} · {g.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Gehalt (€)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="z. B. 2800"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Stunden/Woche
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="z. B. 38"
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
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={geschaefte.length === 0}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Mitarbeiter speichern
            </button>
          </div>
        </form>
      )}

      {/* Tabelle */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Position</th>
                <th className="px-6 py-4 font-semibold">Geschäft</th>
                <th className="px-6 py-4 font-semibold">Gehalt</th>
                <th className="px-6 py-4 font-semibold">Stunden/Woche</th>
                <th className="px-6 py-4 text-right font-semibold">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mitarbeiter.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onView(m.id)}
                      className="flex items-center gap-3 text-left"
                      title="Details ansehen"
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
                  <td className="px-6 py-4 text-slate-600">{m.hours} Std.</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(m.id)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                        aria-label={`${m.firstName} ${m.lastName} – Monatsdaten erfassen`}
                        title="Monatsdaten erfassen"
                      >
                        <CalendarDays className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                        aria-label={`${m.firstName} ${m.lastName} bearbeiten`}
                        title="Bearbeiten"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(m.id)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`${m.firstName} ${m.lastName} löschen`}
                        title="Löschen"
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
                    Keine Mitarbeiter vorhanden.
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
/*  MITARBEITER-DETAILANSICHT                                                 */
/*  Monat/Jahr auswählen und Gehalt + Arbeitsstunden dafür erfassen           */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  GEHALTSVERLAUF-DIAGRAMM                                                   */
/*  Balkendiagramm: Gehalt je Monat (Y: 0–5.000 €, X: Januar–Dezember)        */
/* -------------------------------------------------------------------------- */

const GEHALT_Y_MAX = 5000
const GEHALT_Y_SCHRITTE = [5000, 4000, 3000, 2000, 1000, 0]

function GehaltVerlaufChart({ mitarbeiter, eintraege, jahr }) {
  const [hoverIndex, setHoverIndex] = useState(null)

  // Ohne konkreten Monatseintrag wird von dem Basisgehalt des Mitarbeiters
  // ausgegangen – dieselbe Annahme wie im Formular und in der Statistik.
  const gehaltProMonat = useMemo(
    () =>
      MONATE.map((_, index) => {
        const eintrag = eintraege.find((e) => e.jahr === jahr && e.monat === index)
        return eintrag ? eintrag.gehalt : mitarbeiter.salary
      }),
    [eintraege, jahr, mitarbeiter.salary],
  )

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900">Gehaltsverlauf {jahr}</h3>
      <p className="text-sm text-slate-500">
        Monatliches Gehalt von {mitarbeiter.firstName} {mitarbeiter.lastName}
      </p>

      <div className="mt-6 flex gap-3">
        {/* Y-Achse */}
        <div className="flex h-56 flex-col justify-between text-right text-xs tabular-nums text-slate-400">
          {GEHALT_Y_SCHRITTE.map((wert) => (
            <span key={wert}>{wert.toLocaleString('de-DE')} €</span>
          ))}
        </div>

        {/* Plotfläche */}
        <div className="flex-1">
          <div className="relative h-56">
            {/* Gitterlinien */}
            {GEHALT_Y_SCHRITTE.map((wert) => (
              <div
                key={wert}
                className="absolute inset-x-0 border-t border-slate-100"
                style={{ top: `${100 - (wert / GEHALT_Y_MAX) * 100}%` }}
              />
            ))}

            {/* Balken */}
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

          {/* X-Achse */}
          <div className="mt-2 flex justify-between gap-1.5 text-xs text-slate-400 sm:gap-2.5">
            {MONATE_KURZ.map((name) => (
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

function MitarbeiterDetailView({ mitarbeiter, geschaefte, eintraege, onSpeichern, onLoeschen, onZurueck }) {
  const heute = new Date()
  const [jahr, setJahr] = useState(heute.getFullYear())
  const [monat, setMonat] = useState(heute.getMonth())
  const [gehaltInput, setGehaltInput] = useState(String(mitarbeiter.salary))
  const [stundenInput, setStundenInput] = useState(String(mitarbeiter.hours))
  const [gespeichertHinweis, setGespeichertHinweis] = useState(false)

  // Beim Wechsel von Monat/Jahr die Felder mit einem bestehenden Eintrag
  // vorbefüllen – andernfalls mit den Basiswerten des Mitarbeiters.
  useEffect(() => {
    const bestehenderEintrag = eintraege.find(
      (e) => e.jahr === jahr && e.monat === monat,
    )
    setGehaltInput(String(bestehenderEintrag ? bestehenderEintrag.gehalt : mitarbeiter.salary))
    setStundenInput(String(bestehenderEintrag ? bestehenderEintrag.stunden : mitarbeiter.hours))
    setGespeichertHinweis(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jahr, monat])

  // Bestätigungshinweis nach dem Speichern automatisch wieder ausblenden
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
    onSpeichern(mitarbeiter.id, jahr, monat, Number(gehaltInput), Number(stundenInput))
    setGespeichertHinweis(true)
  }

  return (
    <div className="space-y-6">
      {/* Zurück-Button + Mitarbeiterkopf */}
      <div>
        <button
          onClick={onZurueck}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Personalverwaltung
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
              <p className="text-slate-400">Basisgehalt</p>
              <p className="font-semibold text-slate-900">{formatEuro(mitarbeiter.salary)}</p>
            </div>
            <div>
              <p className="text-slate-400">Basisstunden</p>
              <p className="font-semibold text-slate-900">{mitarbeiter.hours} Std./Woche</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Formular: Monatsdaten erfassen */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Monatsdaten erfassen</h3>
          <p className="text-sm text-slate-500">
            Kalendermonat und Jahr auswählen, um Gehalt und Arbeitsstunden einzutragen.
          </p>

          <form onSubmit={handleSpeichern} className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Monat
                </label>
                <select
                  value={monat}
                  onChange={(e) => setMonat(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  {MONATE.map((name, index) => (
                    <option key={name} value={index}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Jahr
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
                Gehalt (€)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                required
                value={gehaltInput}
                onChange={(e) => setGehaltInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Arbeitsstunden
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
                Eintrag speichern
              </button>
              {gespeichertHinweis && (
                <span className="text-sm font-medium text-emerald-600">
                  ✓ Gespeichert für {MONATE[monat]} {jahr}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Verlauf der erfassten Monatsdaten */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Erfasste Monatsdaten</h3>
          <p className="text-sm text-slate-500">Verlauf für {mitarbeiter.firstName} {mitarbeiter.lastName}</p>

          <div className="mt-5 space-y-3">
            {verlaufSortiert.length === 0 && (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                Noch keine Monatsdaten erfasst.
              </p>
            )}

            {verlaufSortiert.map((e) => (
              <div
                key={`${e.jahr}-${e.monat}`}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {MONATE[e.monat]} {e.jahr}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatEuro(e.gehalt)} · {e.stunden} Std.
                  </p>
                </div>
                <button
                  onClick={() => onLoeschen(mitarbeiter.id, e.jahr, e.monat)}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Eintrag ${MONATE[e.monat]} ${e.jahr} löschen`}
                  title="Eintrag löschen"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GehaltVerlaufChart mitarbeiter={mitarbeiter} eintraege={eintraege} jahr={jahr} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  GESCHÄFTE-ANSICHT                                                         */
/*  Geschäfte anzeigen sowie modular hinzufügen und löschen                   */
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
          <h2 className="text-lg font-bold text-slate-900">Geschäfte</h2>
          <p className="text-sm text-slate-500">{geschaefte.length} aktive Geschäfte</p>
        </div>
        <button
          onClick={() => setFormularOffen((offen) => !offen)}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4" />
          Neues Geschäft
        </button>
      </div>

      {/* Formular: Neues Geschäft anlegen */}
      {formularOffen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-base font-bold text-slate-900">Neues Geschäft anlegen</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z. B. Filiale Süd"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Stadt
              </label>
              <input
                type="text"
                value={stadt}
                onChange={(e) => setStadt(e.target.value)}
                placeholder="z. B. Stuttgart"
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
              Abbrechen
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
            >
              Geschäft speichern
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
                    aria-label={`${g.name} – Umsatz erfassen`}
                    title="Umsatz erfassen"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onLoeschen(g.id)}
                    disabled={anzahl > 0}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                    aria-label={`${g.name} löschen`}
                    title={
                      anzahl > 0
                        ? 'Zuerst Mitarbeiter einem anderen Geschäft zuordnen'
                        : 'Geschäft löschen'
                    }
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500">Mitarbeiter</span>
                <span className="text-sm font-semibold text-slate-900">{anzahl}</span>
              </div>
            </div>
          )
        })}

        {geschaefte.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
            Keine Geschäfte vorhanden. Legen Sie über „Neues Geschäft" das erste an.
          </p>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  GESCHÄFT-DETAILANSICHT                                                    */
/*  Monat/Jahr auswählen und Umsatz dafür erfassen                           */
/* -------------------------------------------------------------------------- */

function GeschaeftDetailView({ geschaeft, mitarbeiterAnzahl, eintraege, onSpeichern, onLoeschen, onZurueck }) {
  const heute = new Date()
  const [jahr, setJahr] = useState(heute.getFullYear())
  const [monat, setMonat] = useState(heute.getMonth())
  const [umsatzInput, setUmsatzInput] = useState('')
  const [gespeichertHinweis, setGespeichertHinweis] = useState(false)

  // Beim Wechsel von Monat/Jahr das Feld mit einem bestehenden Eintrag
  // vorbefüllen – andernfalls leer lassen.
  useEffect(() => {
    const bestehenderEintrag = eintraege.find(
      (e) => e.jahr === jahr && e.monat === monat,
    )
    setUmsatzInput(bestehenderEintrag ? String(bestehenderEintrag.umsatz) : '')
    setGespeichertHinweis(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jahr, monat])

  // Bestätigungshinweis nach dem Speichern automatisch wieder ausblenden
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
      {/* Zurück-Button + Geschäftskopf */}
      <div>
        <button
          onClick={onZurueck}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zu Geschäfte
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
            <p className="text-slate-400">Mitarbeiter</p>
            <p className="font-semibold text-slate-900">{mitarbeiterAnzahl}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Formular: Umsatz erfassen */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Umsatz erfassen</h3>
          <p className="text-sm text-slate-500">
            Kalendermonat und Jahr auswählen, um den Umsatz einzutragen.
          </p>

          <form onSubmit={handleSpeichern} className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Monat
                </label>
                <select
                  value={monat}
                  onChange={(e) => setMonat(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  {MONATE.map((name, index) => (
                    <option key={name} value={index}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Jahr
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
                Umsatz (€)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={umsatzInput}
                onChange={(e) => setUmsatzInput(e.target.value)}
                placeholder="z. B. 24000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
              >
                <Save className="h-4 w-4" />
                Eintrag speichern
              </button>
              {gespeichertHinweis && (
                <span className="text-sm font-medium text-emerald-600">
                  ✓ Gespeichert für {MONATE[monat]} {jahr}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Verlauf des erfassten Umsatzes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Erfasster Umsatz</h3>
          <p className="text-sm text-slate-500">Verlauf für {geschaeft.name}</p>

          <div className="mt-5 space-y-3">
            {verlaufSortiert.length === 0 && (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                Noch kein Umsatz erfasst.
              </p>
            )}

            {verlaufSortiert.map((e) => (
              <div
                key={`${e.jahr}-${e.monat}`}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {MONATE[e.monat]} {e.jahr}
                  </p>
                  <p className="text-xs text-slate-500">{formatEuro(e.umsatz)}</p>
                </div>
                <button
                  onClick={() => onLoeschen(geschaeft.id, e.jahr, e.monat)}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Eintrag ${MONATE[e.monat]} ${e.jahr} löschen`}
                  title="Eintrag löschen"
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
/*  STATISTIK-ANSICHT                                                         */
/*  Umsätze, Löhne und Arbeitsstunden je Jahr und Monat berechnet             */
/* -------------------------------------------------------------------------- */

function StatistikView({ geschaefte, mitarbeiter, monatsDaten, umsatzDaten }) {
  const heute = new Date()
  const [jahr, setJahr] = useState(heute.getFullYear())

  const jahresOptionen = useMemo(() => {
    const startJahr = heute.getFullYear() - 3
    return Array.from({ length: 6 }, (_, i) => startJahr + i)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Für jeden Monat des gewählten Jahres Umsatz, Löhne und Arbeitsstunden
  // aus den erfassten Daten berechnen. Ohne konkreten Monatseintrag wird
  // beim Gehalt/Stunden auf die Basiswerte des Mitarbeiters zurückgegriffen.
  const monatsStatistik = useMemo(() => {
    return MONATE.map((name, monatIndex) => {
      const umsatz = geschaefte.reduce((summe, g) => {
        const eintrag = (umsatzDaten[g.id] ?? []).find(
          (e) => e.jahr === jahr && e.monat === monatIndex,
        )
        return summe + (eintrag ? eintrag.umsatz : 0)
      }, 0)

      const loehne = mitarbeiter.reduce((summe, m) => {
        const eintrag = (monatsDaten[m.id] ?? []).find(
          (e) => e.jahr === jahr && e.monat === monatIndex,
        )
        return summe + (eintrag ? eintrag.gehalt : m.salary)
      }, 0)

      const arbeitsstunden = mitarbeiter.reduce((summe, m) => {
        const eintrag = (monatsDaten[m.id] ?? []).find(
          (e) => e.jahr === jahr && e.monat === monatIndex,
        )
        return summe + (eintrag ? eintrag.stunden : m.hours)
      }, 0)

      return { monat: monatIndex, name, umsatz, loehne, arbeitsstunden, gewinn: umsatz - loehne }
    })
  }, [geschaefte, mitarbeiter, monatsDaten, umsatzDaten, jahr])

  const jahresSumme = useMemo(
    () =>
      monatsStatistik.reduce(
        (summe, m) => ({
          umsatz: summe.umsatz + m.umsatz,
          loehne: summe.loehne + m.loehne,
          arbeitsstunden: summe.arbeitsstunden + m.arbeitsstunden,
          gewinn: summe.gewinn + m.gewinn,
        }),
        { umsatz: 0, loehne: 0, arbeitsstunden: 0, gewinn: 0 },
      ),
    [monatsStatistik],
  )

  const maxUmsatz = Math.max(...monatsStatistik.map((m) => m.umsatz), 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Statistik</h2>
          <p className="text-sm text-slate-500">
            Umsätze, Löhne und Arbeitsstunden je Monat
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

      {/* Jahres-KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={TrendingUp}
          label={`Umsatz ${jahr}`}
          value={formatEuro(jahresSumme.umsatz)}
          hint="Summe aller Geschäfte"
          accent="bg-indigo-50 text-indigo-600"
        />
        <KpiCard
          icon={Wallet}
          label={`Löhne ${jahr}`}
          value={formatEuro(jahresSumme.loehne)}
          hint="Bruttogehälter gesamt"
          accent="bg-amber-50 text-amber-600"
        />
        <KpiCard
          icon={Clock}
          label={`Arbeitsstunden ${jahr}`}
          value={`${jahresSumme.arbeitsstunden.toLocaleString('de-DE')} Std.`}
          hint="Summe pro Woche × Monate"
          accent="bg-rose-50 text-rose-600"
        />
        <KpiCard
          icon={BarChart3}
          label={`Gewinn ${jahr}`}
          value={formatEuro(jahresSumme.gewinn)}
          hint="Umsatz abzüglich Löhne"
          accent={
            jahresSumme.gewinn >= 0
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-rose-50 text-rose-600'
          }
        />
      </div>

      {/* Monatsübersicht */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4 font-semibold">Monat</th>
                <th className="px-6 py-4 font-semibold">Umsatz</th>
                <th className="px-6 py-4 font-semibold">Löhne</th>
                <th className="px-6 py-4 font-semibold">Arbeitsstunden</th>
                <th className="px-6 py-4 text-right font-semibold">Gewinn</th>
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
                  <td className="px-6 py-4 tabular-nums text-slate-700">
                    {formatEuro(m.loehne)}
                  </td>
                  <td className="px-6 py-4 tabular-nums text-slate-700">
                    {m.arbeitsstunden.toLocaleString('de-DE')} Std.
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-medium tabular-nums ${
                      m.gewinn >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {formatEuro(m.gewinn)}
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
/*  EINSTELLUNGEN-ANSICHT                                                     */
/* -------------------------------------------------------------------------- */

function EinstellungenView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Einstellungen</h2>
        <p className="text-sm text-slate-500">Verwalten Sie Ihre Konto- und Systemeinstellungen</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Unternehmensprofil</h3>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Firmenname
            </label>
            <input
              type="text"
              defaultValue="BEM Verwaltung GmbH"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              defaultValue="verwaltung@bem-gmbh.de"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Geschäft (Hauptsitz)
            </label>
            <input
              type="text"
              defaultValue="Berlin"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Währung
            </label>
            <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100">
              <option>Euro (€)</option>
              <option>US-Dollar ($)</option>
              <option>Schweizer Franken (CHF)</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Abbrechen
          </button>
          <button className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700">
            Änderungen speichern
          </button>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  HAUPTKOMPONENTE                                                           */
/* -------------------------------------------------------------------------- */

const VIEW_TITEL = {
  dashboard: 'Dashboard',
  geschaefte: 'Geschäfte',
  personal: 'Personalverwaltung',
  statistik: 'Statistik',
  einstellungen: 'Einstellungen',
}

export default function App() {
  const [istAngemeldet, setIstAngemeldet] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mitarbeiter, setMitarbeiter] = useState(MITARBEITER)
  const [geschaefte, setGeschaefte] = useState(GESCHAEFTE)
  const [selectedMitarbeiterId, setSelectedMitarbeiterId] = useState(null)
  const [selectedGeschaeftId, setSelectedGeschaeftId] = useState(null)

  // Monatsdaten je Mitarbeiter: { [mitarbeiterId]: [{ jahr, monat, gehalt, stunden }] }
  const [monatsDaten, setMonatsDaten] = useState({})

  // Umsatzdaten je Geschäft: { [geschaeftId]: [{ jahr, monat, umsatz }] }
  const [umsatzDaten, setUmsatzDaten] = useState({})

  const handleAbmelden = () => {
    setIstAngemeldet(false)
    setActiveView('dashboard')
  }

  if (!istAngemeldet) {
    return <LoginView onAnmelden={() => setIstAngemeldet(true)} />
  }

  // Mitarbeiter löschen (aus dem State entfernen)
  const handleDelete = (id) => {
    setMitarbeiter((prev) => prev.filter((m) => m.id !== id))
  }

  // Neuen Mitarbeiter anlegen
  const handleMitarbeiterHinzufuegen = (daten) => {
    setMitarbeiter((prev) => {
      const neueId = Math.max(0, ...prev.map((m) => m.id)) + 1
      return [...prev, { id: neueId, ...daten }]
    })
  }

  // Neues Geschäft anlegen
  const handleGeschaeftHinzufuegen = (name, city) => {
    setGeschaefte((prev) => {
      const neueId = Math.max(0, ...prev.map((g) => g.id)) + 1
      return [...prev, { id: neueId, name, city }]
    })
  }

  // Geschäft löschen (aus dem State entfernen)
  const handleGeschaeftLoeschen = (id) => {
    setGeschaefte((prev) => prev.filter((g) => g.id !== id))
  }

  const handleGeschaeftAnsehen = (id) => {
    setSelectedGeschaeftId(id)
    setActiveView('geschaeft-detail')
  }

  // Umsatzeintrag für ein Geschäft speichern oder – falls für den
  // Monat/Jahr bereits vorhanden – aktualisieren
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

  // Monatseintrag (Gehalt + Arbeitsstunden) für einen Mitarbeiter speichern
  // oder – falls für den Monat/Jahr bereits vorhanden – aktualisieren
  const handleMonatSpeichern = (mitarbeiterId, jahr, monat, gehalt, stunden) => {
    setMonatsDaten((prev) => {
      const bestehendeEintraege = prev[mitarbeiterId] ?? []
      const ohneAktuellenMonat = bestehendeEintraege.filter(
        (e) => !(e.jahr === jahr && e.monat === monat),
      )
      return {
        ...prev,
        [mitarbeiterId]: [...ohneAktuellenMonat, { jahr, monat, gehalt, stunden }],
      }
    })
  }

  const handleMonatLoeschen = (mitarbeiterId, jahr, monat) => {
    setMonatsDaten((prev) => ({
      ...prev,
      [mitarbeiterId]: (prev[mitarbeiterId] ?? []).filter(
        (e) => !(e.jahr === jahr && e.monat === monat),
      ),
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
            onLoeschen={handleMonatLoeschen}
            onZurueck={() => setActiveView('personal')}
          />
        )
      case 'statistik':
        return (
          <StatistikView
            geschaefte={geschaefte}
            mitarbeiter={mitarbeiter}
            monatsDaten={monatsDaten}
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
          onAbmelden={handleAbmelden}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{renderView()}</main>
      </div>
    </div>
  )
}
