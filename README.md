# BEM Dashboard – Business Management (MVP)

A responsive business management dashboard for overseeing multiple stores
and employees. The entire user interface is in **English**.

Built with **React**, **Tailwind CSS** and **lucide-react**.

## Features

- **Login** – demo sign-in screen (Username: `Business`, Password: `Business123`)
- **Dashboard** – KPI cards computed dynamically from the data:
  - Active Stores
  - Total Employees
  - Staff Costs for the current year
  - Most Expensive employee
  - CSS bar chart "Employees per Store"
  - Quick actions: "New Employee", "New Store"
- **Stores** – overview cards for every branch, add/delete stores, and a
  per-store revenue entry view (month/year picker + history)
- **Employee Management** – data table with hover effects, add/delete
  employees, and a per-employee detail view where you can record up to four
  salary payments and hours worked per month, plus a salary history chart
- **Statistics** – yearly/monthly revenue overview with a year picker
- **Settings** – form for the company profile
- **Layout** – dark, mobile-collapsible sidebar + light header with search
  bar, current date, and a profile placeholder

## Project Structure

```
src/
  App.jsx      # Complete single-file application (mock data, views, layout)
  main.jsx     # React entry point
  index.css    # Tailwind directives
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
