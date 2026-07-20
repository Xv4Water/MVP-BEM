# BEM Dashboard – Business Management (MVP)

A responsive business management dashboard for overseeing multiple stores
and employees, styled as a dark glassmorphism UI with a neon-lime accent.
The entire user interface is in **English**.

Built with **React**, **Tailwind CSS** and **lucide-react**.

## Features

- **Login** – demo sign-in screen (Username: `Business`, Password: `Business123`)
- **Dashboard** – KPI cards computed dynamically from the data:
  - Active Stores
  - Total Employees
  - Staff Costs for the current year
  - Most Expensive employee
  - "Employees per Store" bar list – click any store to open a modal with
    that store's employees (add/delete, and a per-employee detail view to
    record up to four salary payments and hours worked per month, plus a
    salary history chart)
  - Quick Actions: "New Store", "New Employee", and "Update Salary", each
    opening its own glass modal
- **Stores** – overview cards for every branch (each showing its city and
  German federal state/Bundesland), add/delete stores
- **Statistics** – yearly/monthly payroll overview with a year picker
- **Settings** – form for the company profile
- **Layout** – floating icon-only navigation rail + a bordered glass panel
  containing the header (search bar, current date, profile) and page content
- **Background** – a plain dark backdrop across the whole app, including
  the login screen. A one-time "power-up" transition (white flash + an
  expanding lime-green energy burst) plays right after a successful login.

## Project Structure

```
src/
  App.jsx    # Complete single-file application (mock data, views, layout)
  main.jsx   # React entry point
  index.css  # Tailwind directives
```

The entire application logic lives in `src/App.jsx`.

## Run Locally

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (default: http://localhost:5173) in
your browser.

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

Pushes to `main` automatically build and deploy the app to GitHub Pages via
`.github/workflows/deploy-pages.yml`.
