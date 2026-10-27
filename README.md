# EnterpriseCore Dashboard

A responsive, multi-page enterprise administration dashboard built with strict **HTML5 semantic structure**, **WCAG 2.1 Level AA/AAA accessibility principles**, modern **CSS3**, and **Vanilla JavaScript** without external frameworks.

---

## 🌟 Key Features

* **Strict Semantic HTML5**: Uses proper semantic landmark elements (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<article>`, `<footer>`) and native controls (`<dialog>`, `<table>`, `<form>`, `<fieldset>`, `<legend>`). Avoids gratuitous `<div>` containers.
* **WCAG 2.1 AA/AAA Accessibility**:
  * Keyboard-only operability for all interactive elements with no keyboard traps.
  * Prominent skip-to-content links on every page (`<a href="#main-content" class="skip-link">`).
  * High-visibility `:focus-visible` indicators (`3px solid #1d4ed8` with `2px` offset).
  * Color contrast ratios exceeding 4.5:1 (up to 15.8:1) for all text surfaces.
  * Status badges that use icons, text, and color so information is never conveyed by color alone.
* **Native Accessible Modal**:
  * Utilizes the HTML5 `<dialog>` element and `.showModal()`.
  * Top-layer rendering, backdrop dimming, and native background inertness.
  * Auto-dismisses on `Escape` and outside backdrop click, with explicit focus return to opener trigger.
* **Accessible Form Validation**:
  * HTML5 Constraint Validation API integrated with custom accessible messaging.
  * Links error hints via `aria-describedby` and flags errors via `aria-invalid="true"`.
  * Interactive error summary banner with jump links to invalid inputs.
  * `aria-live="polite"` live announcements for screen readers.
* **Responsive Layout**:
  * Modern CSS Grid with collapsible mobile drawer navigation (`aria-expanded`).
  * Horizontally scrollable data tables equipped with `role="region"`, `tabindex="0"`, and `aria-label`.
  * Supports `prefers-reduced-motion` media queries.

---

## 📁 Project Structure

```
enterprise-dashboard/
├── index.html                  # Main executive overview dashboard
├── pages/
│   ├── users.html             # User management directory & RBAC
│   ├── reports.html           # Financial & telemetry reporting ledger
│   └── settings.html          # Profile & security configuration form
├── components/
│   ├── header.html            # Header blueprint with skip link & mobile toggle
│   ├── sidebar.html           # Sidebar blueprint with navigation links
│   ├── table.html             # Data table blueprint with caption & thead/tbody
│   ├── form.html              # Form blueprint with fieldset & validation
│   └── modal.html             # Accessible <dialog> modal blueprint
├── css/
│   └── style.css              # Unified CSS3 design system & responsive layout
├── js/
│   ├── navigation.js          # Mobile drawer toggle & active link indicator
│   ├── modal.js               # <dialog> lifecycle & focus restoration
│   └── validation.js          # HTML5 form constraint validation & live feedback
├── docs/
│   └── accessibility.md       # Comprehensive WCAG 2.1 compliance audit report
└── README.md                  # Project documentation & setup instructions
```

---

## 🚀 Getting Started

No build tools, bundlers, or package installations are required. You can run the dashboard in any modern browser directly.

### Method 1: Python Built-in Server (Recommended)
Open PowerShell or your terminal in the project directory:
```bash
cd "C:\Users\dhruv narayan\.gemini\antigravity\scratch\enterprise-dashboard"
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your web browser.

### Method 2: Node.js `serve` / `npx`
```bash
npx serve .
```

### Method 3: Direct File Opening
You can double-click or open `index.html` directly in Chrome, Firefox, Safari, or Edge.

---

## 🧪 Testing & Validation

### W3C HTML Validation
To run the automated HTML validator across all HTML documents:
```bash
npx html-validate index.html pages/*.html components/*.html
```

### Keyboard Navigation Testing
1. Press `Tab` upon page load: The skip-to-content link will appear in the top-left corner.
2. Press `Enter` to jump directly past navigation to `#main-content`.
3. Press `Tab` repeatedly to cycle through metric cards, toolbar actions, and table rows.
4. Press `Enter` or `Space` on any "Inspect", "Review", or "Deploy Security Policy" button to launch the confirmation `<dialog>`.
5. Press `Escape` to close the dialog and observe focus returning automatically to the button that opened it.

### Form Validation Testing (Settings Page)
1. Navigate to `pages/settings.html`.
2. Clear the "Full Name" or "Enterprise Email" fields and click "Save Configuration".
3. Notice that:
   - An accessible error summary banner appears at the top.
   - Jump links inside the summary immediately focus the invalid fields.
   - The field highlights with `aria-invalid="true"` and displays an inline `<span role="alert">` message.
   - Screen readers announce the error summary live.
4. Correct the input to observe real-time re-validation and error clearance.

---

## 📄 License & Accessibility Statement
Detailed WCAG 2.1 compliance specifications, landmark listings, and contrast ratio calculations are documented in [`docs/accessibility.md`](docs/accessibility.md).
