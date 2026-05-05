# Technical Specification
## Ad Product Programmatic Verifier

---

## 1. Overview

The Ad Product Programmatic Verifier is a client-side web application with no backend. All logic, configuration, and state are handled in the browser using HTML, CSS, and Vanilla JavaScript. Configuration is persisted in `localStorage` so changes made in the admin panel survive page refreshes without requiring a server.

---

## 2. File Structure

```
ad-product-verifier/
├── context library/
│   ├── PRD.md                  # Product Requirements Document
│   └── TECH_SPEC.md            # This document
└── app/
    ├── index.html              # End-user app entry point
    ├── styles.css              # End-user app styles
    ├── script.js               # End-user decision flow logic
    ├── config.js               # Shared config schema, localStorage helpers, defaults
    ├── admin.html              # Admin panel entry point
    ├── admin.js                # Admin panel logic
    └── admin.css               # Admin panel styles
```

---

## 3. Data Architecture

### 3.1 Config Schema

All application data is stored as a single JSON object in `localStorage` under the key `adVerifier_config`. If no value is found, the app falls back to `DEFAULT_CONFIG` defined in `config.js`.

```json
{
  "ssps": [
    { "id": "string", "name": "string", "action": "proceed | external" }
  ],
  "dsps": [
    { "id": "string", "name": "string", "action": "proceed | direct", "platform": "string?" }
  ],
  "transactionTypes": [
    { "id": "string", "name": "string", "requiresGeography": "boolean" }
  ],
  "geographies": [
    { "id": "string", "name": "string" }
  ],
  "adProducts": [
    { "id": "string", "name": "string" }
  ],
  "platforms": ["string"],
  "recommendations": {
    "{dspId}|{transactionTypeId}|{adProductId}": "string (platform name)"
  }
}
```

### 3.2 Recommendation Keys

Recommendations are keyed by a pipe-delimited string of IDs:

```
{dspId}|{transactionTypeId}|{adProductId}
```

Using IDs (not names) ensures that renaming an item in the admin panel does not invalidate existing recommendation entries.

### 3.3 localStorage Keys

| Key | Purpose |
|---|---|
| `adVerifier_config` | Full application configuration |

---

## 4. config.js — Shared Utilities

Loaded by both `index.html` and `admin.html` before their respective JS files.

| Function | Description |
|---|---|
| `getConfig()` | Reads and parses `adVerifier_config` from `localStorage`. Falls back to a deep copy of `DEFAULT_CONFIG` if not set or invalid. |
| `saveConfig(config)` | Serializes and writes the config object to `localStorage`. |
| `generateId()` | Returns a unique string ID using `Date.now` + `Math.random`. Used when creating new items in the admin panel. |

---

## 5. End-User App (script.js)

### 5.1 State

A single in-memory `state` object tracks the user's selections as they progress through the flow:

```js
{
  ssp: null,         // selected SSP name
  dsp: null,         // selected DSP name
  transaction: null, // selected transaction type name
  geography: null,   // selected geography name (or null if not required)
  adProduct: null,   // selected ad product name
}
```

### 5.2 Render Loop

The app uses a single `render()` function that evaluates the current `state` top-to-bottom and outputs the appropriate step or terminal result. There is no routing library — each call to `render()` re-evaluates and re-renders the entire `#app` container.

**Render decision order:**

1. No SSP selected → show SSP selection step
2. SSP action is `external` → show "Please build externally" terminal
3. No DSP selected → show DSP selection step
4. DSP action is `direct` → show direct platform terminal
5. No transaction type selected → show transaction type step
6. Transaction type requires geography and no geography selected → show geography step
7. No ad product selected → show ad product step
8. All selections complete → look up recommendation and show result

### 5.3 Recommendation Lookup

```js
function getRecommendation() {
  const dspObj = config.dsps.find(d => d.name === state.dsp);
  const txObj  = config.transactionTypes.find(t => t.name === state.transaction);
  const apObj  = config.adProducts.find(p => p.name === state.adProduct);
  const key    = `${dspObj.id}|${txObj.id}|${apObj.id}`;
  return config.recommendations[key] || 'No recommendation found';
}
```

### 5.4 Event Handling

Option buttons use `data-key` and `data-val` attributes. A single delegated `click` listener on `#app` handles all selections, resets downstream state, and calls `render()`.

### 5.5 Progress Bar

Progress is calculated as a percentage based on how far through the flow the user has reached, and applied to the width of `#progressFill`.

---

## 6. Admin Panel (admin.js)

### 6.1 Working Config

The admin panel maintains a `workingConfig` variable — a deep copy of the saved config loaded on page init. All edits mutate `workingConfig` in memory only. Nothing is written to `localStorage` until the user explicitly clicks **Save Changes**.

```js
let workingConfig = JSON.parse(JSON.stringify(getConfig()));
let isDirty = false;
```

### 6.2 Save / Discard Flow

| Action | Behavior |
|---|---|
| Any edit | Sets `isDirty = true`, shows the unsaved changes bar |
| Save Changes | Calls `saveConfig(workingConfig)`, sets `isDirty = false`, hides the bar, flashes "✓ Saved" |
| Discard | Confirms with the user, resets `workingConfig` to `getConfig()`, re-renders all lists, hides the bar |

### 6.3 Recommendation Integrity

The admin panel automatically maintains recommendation entries when the decision tree changes:

| Admin Action | Side Effect |
|---|---|
| Add DSP (action: proceed) | Generates `dspId\|txId\|apId` entries for all existing transaction types × ad products, defaulting to Platform 2 |
| Add transaction type | Generates entries for all proceed-DSPs × ad products |
| Add ad product | Generates entries for all proceed-DSPs × transaction types |
| Delete DSP | Removes all recommendation entries where key starts with `{dspId}\|` |
| Delete transaction type | Removes all entries where `key.split('\|')[1] === txId` |
| Delete ad product | Removes all entries where `key.split('\|')[2] === apId` |
| Change DSP action to "direct" | Removes its recommendation entries |
| Change DSP action to "proceed" | Generates its recommendation entries |

### 6.4 Platform Rename Cascade

When a platform is renamed in the Settings tab, the admin panel updates all recommendation values and DSP `platform` fields that referenced the old name before saving.

### 6.5 Tab Navigation

Three tabs — Options, Recommendations, Settings — are toggled by adding/removing the `active` class on `.tab-pane` elements. The Recommendations matrix and Platforms list are rendered lazily (only when their tab is opened).

---

## 7. Styling

| File | Scope |
|---|---|
| `styles.css` | End-user app (card layout, progress bar, option buttons, result card, breadcrumbs, admin footer link) |
| `admin.css` | Admin panel (dark sidebar, topbar, section cards, item rows, matrix table, unsaved bar, buttons) |

The admin panel uses a fixed dark sidebar (`#16213e`) with a scrollable main content area. The end-user app uses a centered single-column card layout with a max-width of `560px`.

---

## 8. Browser Compatibility

Requires a modern browser with support for:

- `localStorage` / `sessionStorage`
- ES6+ (arrow functions, template literals, destructuring, `const`/`let`)
- CSS custom properties and flexbox

No polyfills are included. IE is not supported.

---

## 9. Known Constraints

- **No backend** — all data lives in the browser. Config is per-device and per-browser. Clearing `localStorage` resets the app to defaults.
- **No multi-user sync** — changes made in the admin panel on one device are not reflected on another.
- **No auth** — the admin panel is publicly accessible to anyone with the URL.
