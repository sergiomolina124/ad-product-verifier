# Ad Product Programmatic Verifier

A lightweight, web-based decision tool that guides advertising professionals through the selection of an SSP, DSP, transaction type, and ad product — and returns a precise build platform recommendation.

---

## How It Works

The tool walks the user through a step-by-step flow:

1. **SSP Selection** — Choose your Supply-Side Platform
2. **DSP Selection** — Choose your Demand-Side Platform
3. **Transaction Type** — PG or PMP (US Only)
4. **Geography** — US or International (PG only)
5. **Ad Product** — Select from available ad products

At the end of the flow, the tool displays a build recommendation and a summary of all selections made.

---

## Admin Panel

An **Admin Settings** button in the app footer links to a dedicated admin panel where all decision tree options and recommendations can be managed without touching code.

**Options tab** — Add, rename, or delete items at every step of the flow (SSPs, DSPs, transaction types, geographies, and ad products). Each SSP and DSP can be individually configured to either proceed through the flow or route directly to a terminal result.

**Recommendations tab** — A matrix view for setting the build platform recommendation for every DSP × Transaction Type × Ad Product combination.

**Settings tab** — Manage available build platforms and reset the configuration to defaults.

All changes are held in memory until explicitly saved or discarded via the persistent bar at the bottom of the screen.

---

## Getting Started

No installation or build step required. Open the prototype directly in a browser:

```
prototype/index.html
```

---

## Project Structure

```
ad-product-verifier/
├── context library/
│   └── PRD.md                  # Product Requirements Document
└── prototype/
    ├── index.html              # App entry point
    ├── styles.css              # App styles
    ├── script.js               # Decision flow logic
    ├── config.js               # Shared config, localStorage helpers, defaults
    ├── admin.html              # Admin panel
    ├── admin.js                # Admin panel logic
    └── admin.css               # Admin panel styles
```

---

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- `localStorage` for config persistence

No frameworks, no dependencies, no backend.
