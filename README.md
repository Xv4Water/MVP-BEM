# BEM Dashboard – Unternehmensverwaltung (MVP)

Ein responsives Business-Management-Dashboard für die Verwaltung mehrerer
Standorte und Mitarbeiter. Die gesamte Benutzeroberfläche ist auf **Deutsch**.

Gebaut mit **React**, **Tailwind CSS** und **lucide-react**.

## Funktionen

- **Dashboard** – 4 KPI-Karten (dynamisch aus den Mock-Daten berechnet):
  - Aktive Standorte
  - Gesamt-Mitarbeiter
  - Personalkosten / Monat
  - Ø Arbeitsstunden
  - CSS-Balkendiagramm „Mitarbeiter pro Standort"
  - Schnellaktionen: „Neuer Mitarbeiter", „Neues Geschäft"
- **Standorte** – Übersichtskarten aller Filialen
- **Personalverwaltung** – moderne Datentabelle mit Hover-Effekten,
  Bearbeiten- und Löschen-Aktionen (Löschen ist funktional)
- **Einstellungen** – Formular für das Unternehmensprofil
- **Layout** – dunkle, auf Mobilgeräten einklappbare Sidebar + heller Header
  mit Suchleiste, aktuellem Datum und Profil-Platzhalter

## Projektstruktur

```
src/
  App.jsx      # Vollständige Single-File-Anwendung (Mock-Daten, Views, Layout)
  main.jsx     # React-Einstiegspunkt
  index.css    # Tailwind-Direktiven
```

Die komplette Anwendungslogik befindet sich in `src/App.jsx` – ideal, um sie
direkt in der Artifacts-Ansicht durchzuklicken.

## Lokal starten

```bash
npm install
npm run dev
```

Anschließend die angezeigte URL (Standard: http://localhost:5173) im Browser
öffnen.

## Produktions-Build

```bash
npm run build
npm run preview
```
