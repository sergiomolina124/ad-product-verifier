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
│   └── PRD.md              # Product Requirements Document
└── prototype/
    ├── index.html          # App entry point
    ├── styles.css          # Styles
    └── script.js           # Decision logic and rendering
```

---

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript

No frameworks, no dependencies, no backend.
