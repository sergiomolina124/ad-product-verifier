# Product Requirements Document (PRD)
## Ad Product Programmatic Verifier

---

## 1. Introduction

This document outlines the consolidated requirements for a tool that guides users through the selection of an SSP, DSP, and specific ad products. The tool provides clear, step-by-step instructions and build recommendations based on the user's choices.

---

## 2. Product Description

The **Ad Product Programmatic Verifier** is a web-based tool designed to streamline the decision-making process for advertising professionals. By presenting a series of choices, the tool offers precise build recommendations (e.g., "build in Platform 1," "build in Platform 2," "build in Platform 3," or "build in Platform 4") tailored to the specific combination of SSP, DSP, transaction type, and ad product selected.

---

## 3. User Flow & Requirements

### Step 1: SSP Selection

The user will be prompted to select one of the following SSPs:

- SSP 1
- SSP 2
- SSP 3

### Step 2: Conditional Logic & DSP Selection

| SSP Selected | Result |
|---|---|
| SSP 2 or SSP 3 | Display: **"Please build externally."** |
| SSP 1 | Proceed to DSP selection |

**DSP Options (SSP 1 only):**
- DSP 1
- DSP 2
- DSP 3

### Step 3: DSP-Specific Paths

| DSP Selected | Result |
|---|---|
| DSP 3 | Display: **"Please build in Platform 1."** |
| DSP 1 or DSP 2 | Ask: **"Is the transaction type PG or PMP (US Only)?"** |

---

## 4. DSP 1 User Flow

### 4a. DSP 1 — PMP (US Only)

**Ad Product Options:**

- Ad Product 1
- Ad Product 2
- Ad Product 3
- Ad Product 4
- Ad Product 5

**Build Recommendations:**

| Ad Product | Recommendation |
|---|---|
| Ad Product 1, Ad Product 2, Ad Product 3, Ad Product 4, Ad Product 5 | Please build in **Platform 2** |

---

### 4b. DSP 1 — PG

Ask: **"Is the Geography US or International?"**

#### DSP 1 PG — US

**Ad Product Options:**

- Ad Product 1
- Ad Product 2
- Ad Product 3
- Ad Product 4
- Ad Product 5

**Build Recommendations:**

| Ad Product | Recommendation |
|---|---|
| Ad Product 1, Ad Product 2, Ad Product 3, Ad Product 4, Ad Product 5 | Please build in **Platform 2** |

#### DSP 1 PG — International

**Ad Product Options:**

- Ad Product 1
- Ad Product 2
- Ad Product 3
- Ad Product 4
- Ad Product 5

**Build Recommendations:**

| Ad Product | Recommendation |
|---|---|
| Ad Product 1, Ad Product 2, Ad Product 3, Ad Product 4, Ad Product 5 | Please build in **Platform 2** |

---

## 5. DSP 2 User Flow

### 5a. DSP 2 — PMP (US Only)

**Ad Product Options:**

- Ad Product 1
- Ad Product 2
- Ad Product 3
- Ad Product 4
- Ad Product 5

**Build Recommendations:**

| Ad Product | Recommendation |
|---|---|
| Ad Product 1, Ad Product 4, Ad Product 5 | Please build in **Platform 2** |
| Ad Product 2, Ad Product 3 | Please build in **Platform 1** |

---

### 5b. DSP 2 — PG

Ask: **"Is the Geography US or International?"**

#### DSP 2 PG — US

**Ad Product Options:**

- Ad Product 1
- Ad Product 2
- Ad Product 3
- Ad Product 4
- Ad Product 5

**Build Recommendations:**

| Ad Product | Recommendation |
|---|---|
| Ad Product 1, Ad Product 2, Ad Product 3, Ad Product 4, Ad Product 5 | Please build in **Platform 2** |

#### DSP 2 PG — International

**Ad Product Options:**

- Ad Product 1
- Ad Product 2
- Ad Product 3
- Ad Product 4
- Ad Product 5

**Build Recommendations:**

| Ad Product | Recommendation |
|---|---|
| Ad Product 1, Ad Product 2, Ad Product 3, Ad Product 4, Ad Product 5 | Please build in **Platform 2** |

---

## 6. Technical Requirements

- **Frontend:** HTML, CSS, JavaScript
- **Logic:** JavaScript to handle the complex, multi-layered user flow
- **Responsiveness:** Simple, responsive web page for a clean, intuitive UX
- **Backend:** None required — no database or user authentication
- **Navigation:** The UI will guide the user through each step without dead ends, except for clearly-defined terminal recommendation points

---

## 7. Success Metrics

| Metric | Description |
|---|---|
| Completed sessions | Number of users who reach a final build recommendation |
| Time to completion | Average time to complete the guided flow |
| User feedback | Clarity and accuracy of recommendations as reported by users |
