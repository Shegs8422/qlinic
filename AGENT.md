# Qlinic — Agent Onboarding & Improvement Guide

This document helps any agent (or developer) quickly understand the Qlinic repository, the current state of the app, and the prioritized roadmap for improvements. It covers product strategy, animation/transition upgrades, theming, edge cases, deployment, and the agile workflow.

---

## 1. Repo Overview (For Agents)

### What this app is
Qlinic is a patient-facing web app for managing clinic visits in Kenya. Core features:

- **Clinic discovery** — search public clinics by name, area, service, distance, wait time
- **Digital queue** — join a remote queue, get a ticket number, see patients ahead
- **Appointment booking** — 3-step booking flow (clinic → date/time → confirm)
- **Visit prep** — checklist (ID, medication, records, transport) with progress indicator
- **Profile & settings** — personal details, language (EN/SW), accessibility toggles, notifications
- **Modals** — QR ticket pass, directions, language, accessibility, help, sign-out confirmations

### Tech stack (current)
| Layer | Tool | Version |
|---|---|---|
| Framework | React | 19 |
| Build tool | Vite | 8 |
| Styling | Tailwind CSS v4 | 4.x |
| Icons | @hugeicons/react + @hugeicons/core-free-icons | latest |
| Language | TypeScript | 5.7 |
| Package manager | pnpm | via .mise.toml |
| Maps | Google Maps JS API | embedded key in frontend |

### Key files & directories
```
/
├── AGENTS.md              # Original project scaffold guide (keep)
├── AGENT.md               # This file
├── index.html             # Vite HTML shell, #root mount point
├── package.json           # Deps + scripts (dev, build, preview, format)
├── vite.config.ts         # Vite config + Figma Make plugins + @ alias
├── .mise.toml             # Node/pnpm toolchain versions
├── .gitignore             # Standard + Figma/agent plat ignore rules
├── public/                # Static assets (e.g. qlinic-onboarding.jpeg)
└── src/
    ├── main.tsx           # React entrypoint, imports index.css, mounts App
    ├── index.css          # Global CSS, Tailwind v4 import, design tokens
    ├── App.tsx            # ~3000 lines — ALL screens, state, logic in one file
    └── vite-env.d.ts      # Vite types
```

### How the app is structured (current)
- Single `App.tsx` file contains everything: data mocks, UI components, all 20+ screens, routing logic, and state.
- Routing is a React `useState<Screen>` string union (`splash`, `home`, `clinics`, `queue`, `booking`, etc.) — no URL state, no deep linking.
- State is lifted entirely into `App()` with `useState` — no external state library.
- Styling is Tailwind utility classes + CSS custom properties in `:root` (Apple HIG monochrome theme).
- No backend — all clinic, appointment, and wait-time data is hardcoded arrays in `App.tsx`.

---

## 2. Agile Workflow Phase

### 2.1 Cadence
| Ceremony | Frequency | Duration | Purpose |
|---|---|---|---|
| Sprint Planning | Every 2 weeks | 60–90 min | Select backlog items, define sprint goal |
| Daily Standup | Every weekday | 15 min | Sync progress, blockers, today's plan |
| Backlog Grooming | Mid-sprint | 30–45 min | Refine upcoming stories, estimate, split |
| Sprint Review | End of sprint | 30–60 min | Demo completed work to stakeholders |
| Sprint Retrospective | End of sprint | 45–60 min | Improve process, identify action items |

### 2.2 Roles
- **Product Owner (PO):** Owns the backlog, prioritizes stories, defines acceptance criteria, accepts/rejects done work.
- **Scrum Master:** Facilitates ceremonies, removes blockers, protects team focus, tracks burndown.
- **Dev Team:** Estimates stories, implements, tests, demos, and owns quality.

### 2.3 User Story Format
```
As a [user role],
I want [goal/feature],
So that [benefit/value].

Acceptance Criteria:
- [ ] Given [context], when [action], then [outcome]
- [ ] ...
```

### 2.4 Definition of Done (DoD)
A story is considered done only when:
- Code is implemented in a feature branch (not `main`)
- PR is opened and approved by at least one peer
- CI/build passes (lint, typecheck, build)
- Manual QA on mobile + desktop browsers
- Accessibility checked (aria-labels, keyboard navigation, reduced motion)
- Edge cases handled (offline, error states, empty states)
- Merged to `main` and deployed to staging/Nobus FCS
- Documented in AGENT.md if architecture or theming changed

### 2.5 Issue & PR Workflow
1. Create issue from backlog → assign to sprint
2. Create feature branch: `git checkout -b feature/issue-number-short-description`
3. Implement + write tests (if applicable)
4. Open PR with: linked issue, screenshot/video of UI changes, test steps
5. Peer review → address comments → approve
6. Merge via squash-merge into `main`
7. Tag release if it's a user-facing feature

### 2.6 Release Process
- **Patch:** Bugfix → increment patch version (`1.0.1`), deploy immediately
- **Minor:** New feature → increment minor version (`1.1.0`), announce in sprint review
- **Major:** Breaking change → increment major version (`2.0.0`), coordinate with PO and stakeholders

### 2.7 Backlog Prioritization (MoSCoW)
| Priority | Meaning | Example |
|---|---|---|
| **Must have** | Critical for release | Queue ticket, clinic search, auth flow |
| **Should have** | Important but not blocking | WhatsApp share, Kiswahili UI |
| **Could have** | Nice to have | Animations, dark mode toggle |
| **Won't have** | Deferred | m-Pesa, B2B dashboard |

---

## 3. Product Improvements

### 3.1 Narrow the value proposition
**Current:** App does clinic discovery, queue, booking, records, visit prep — too much for one patient app.
**Recommended:** Position as the **"digital queue pass" layer** — reduce physical waiting time at public clinics. Patients show a QR/ticket at triage. Complement (don't replace) clinic EMR systems.

### 3.2 Monetization (do not charge patients first)
| Model | Description |
|---|---|
| B2B Clinic SaaS | Sell clinics a dashboard to manage queues, update wait times, send SMS alerts. Patient app stays free. |
| SMS revenue share | Route turn alerts through your platform; take a per-SMS margin. |
| Featured placement | Clinics pay to appear top of search or in "nearby open now." |
| Pharmacy/lab referrals | Suggest partnered pharmacies near the clinic after booking. |

### 3.3 Retention loops (make it a daily utility, not just sick-day tool)
- Visit history + follow-up reminders ("6 months since last immunisation")
- Medication adherence push reminders
- Family profiles (add dependents under one account — common in Kenyan households)
- "Leave home at" estimator (wait time + transit + current time)

### 3.4 Partnerships (create moats)
- **Clinics & dispensaries** — they control wait-time data
- **NHIF / SHIF** — insurance eligibility + covered-service listings
- **Matatu / boda associations** — transit info for clinic cards
- **Pharmacies** — "Prescription ready nearby" cross-promotion

### 3.5 Localization & trust (Kenya context)
- Full Kiswahili UI (not just a settings toggle)
- Emergency line 1199 one-tap dial (already in help modal)
- m-Pesa STK push for any clinic fees (Daraja API)
- Kenya Data Protection Act compliance — encrypt patient data, don't store IDs in localStorage
- Clear disclaimer: app is for logistics/queue only, not medical advice

### 3.6 Immediate wins (can do in current Vite build)
1. WhatsApp ticket share (Web Share API)
2. "Leave home at" time estimator
3. Crowdsourced wait confirmation ("I'm here / I've been seen")
4. SMS reminder flow stub (ready for Africa's Talking / Twilio)
5. Analytics events (screen views, queue joins, booking funnel drop-offs)

---

## 4. Animation & Transition Improvements

### 4.1 Current animation state (weak)
- CSS `transition: all 0.16s ease` on buttons
- `active:scale-95` on press
- Nav item `translateY(-1px)` when active
- Snackbar/modal appear via conditional rendering (no enter/exit motion)
- Progress bar width transition (`width 0.2s ease`)
- No shared-element transitions, no page transitions, no staggered reveals

### 4.2 Recommended transition upgrades (transitions-dev skill patterns)
Use these when implementing motion in the app:

| Pattern | Where to apply | transitions-dev reference |
|---|---|---|
| **Modal open/close** | Dialog backdrops (leave queue, sign out, QR ticket) | "open / close transition", "modal open smoothly" |
| **Page transitions** | Screen switches (home → clinics → queue) | "page slide", "fade between" |
| **Queue ticket reveal** | After "Confirm and issue ticket" | "reveal text", "card resize", "pop-in" |
| **Patients-ahead counter** | Queue screen number updates | "spinning counter", "odometer", "slot machine digits" |
| **Skeleton loaders** | Clinic results, map preview | "skeleton loader", "loading shimmer" |
| **Snackbar/toast** | Notify messages at bottom | "toast", "snackbar", "stacked toasts" |
| **Success check** | Ticket issued, booking confirmed | "success checks", "check animation" |
| **Error shake** | Invalid OTP, form validation | "error state shakes", "shake on invalid" |
| **Toggle/switch** | Settings, accessibility, notifications | "toggle", "switch" |
| **Segmented control** | Appointments upcoming/past | "sliding tabs", "segmented control" |
| **Search clear** | Clinic search field | "search/input clear" |
| **AI thinking** | Future: queue status polling, SMS sending | "AI thinking states", "reasoning stream" |

### 4.3 Implementation approach
1. Replace hardcoded durations with motion tokens (e.g., `--duration-fast: 150ms`, `--duration-normal: 300ms`)
2. Use `transition-dev` patterns for consistent easing and timing
3. Add `AnimatedSwitcher`-equivalent behavior via CSS keyframes or React transition groups
4. Respect `prefers-reduced-motion` for accessibility

---

## 5. Theming Improvements

### 5.1 Current theme (Apple HIG monochrome)
- Black (`#000000`), white, grays
- One destructive red (`#d70015`)
- CSS custom properties in `:root`, applied via Tailwind classes
- Dark-by-default (black system bg, white cards) — not a true light/dark system

### 5.2 Recommended theming upgrades
- Define a proper `ColorScheme` (light + dark themes)
- Support true dark mode toggle (currently hardcoded)
- Use component theming (`ButtonThemeData` equivalent — in web: CSS variables + Tailwind variants)
- Typography: Urbanist + JetBrains Mono already loaded via Google Fonts; formalize in a font stack
- Accessibility themes: high contrast, large text (already partially implemented via `qlinic-large-text` class)
- Consider dynamic color (Material You) as fallback on supported browsers

---

## 6. Edge Cases to Handle (Critical)

### Connectivity & network
- **No internet on load:** Show cached clinic list or offline banner, not blank screen
- **Connection drops mid-booking:** Persist booking step to `localStorage`/IndexedDB, resume on reconnect
- **Slow 3G:** Map tiles may fail — always show text fallback + directions button
- **Google Maps quota exceeded:** Fallback to static map image or text directions

### Queue & booking logic
- **Clinic closes while patient has active ticket:** Notify, offer transfer/rebook
- **Patient misses their number:** Define auto-skip vs requeue policy in UI
- **Double-tap submit:** Debounce booking buttons to prevent duplicate tickets
- **Concurrent tickets:** Prevent holding queue tickets at two clinics simultaneously
- **Expired OTP:** TTL (e.g., 10 min), show resend timer
- **Wrong clinic mid-booking:** Allow editing without restarting flow

### Mobile browser & device
- **iOS Safari standalone mode:** Handle safe-area insets (already partially done)
- **Dynamic Island / Notch:** Status bar content shouldn't collide
- **Battery saver:** May throttle background polling/geolocation
- **Screen rotation:** Layout shouldn't break (portrait-locked conceptually)
- **Android hardware back:** Should navigate screens, not exit app
- **Text overflow:** Kiswahili words can be long — ensure cards don't break

### Accessibility & inclusion
- **Screen readers:** Every button needs `aria-label`; icons alone aren't enough
- **Color blindness:** Don't rely only on color for status (use icons + text)
- **Motor impairment:** Touch targets ≥44px
- **Reduced motion:** Respect `prefers-reduced-motion`

### Data & privacy (Kenya DPA)
- Don't store clinic IDs or phone numbers unencrypted in `localStorage`
- Logout must clear all state (queue ticket, OTP, clinic selection, personal details)
- No medical advice — clear disclaimer that app is logistics only

---

## 7. Architecture Improvements (Code Health)

### 7.1 Split the monolith (`App.tsx` → modular structure)
```
src/
  main.tsx
  index.css
  App.tsx                  # Router shell only
  routes/                  # Screen routing (TanStack Router or React Router)
  screens/                 # One file per screen
    HomeScreen.tsx
    ClinicScreen.tsx
    QueueScreen.tsx
    BookingScreen.tsx
    ...
  components/              # Shared UI
    Button.tsx
    ClinicCard.tsx
    TicketPass.tsx
    BottomNav.tsx
    Dialog.tsx
  store/                   # State management (Zustand or Redux Toolkit)
    authStore.ts
    queueStore.ts
    clinicStore.ts
    settingsStore.ts
  lib/                     # API client, validators, utils
    api.ts
    validators.ts (Zod)
  theme/                   # Design tokens, CSS variables
    tokens.css
    colorScheme.ts
```

### 7.2 State management
Replace scattered `useState` in `App()` with a store:
- `AuthStore` — phone, OTP, token, sign-out
- `QueueStore` — active ticket, patients ahead, refresh
- `ClinicStore` — list, filters, search, selected clinic
- `SettingsStore` — language, contrast, text size, audio

### 7.3 Routing
Add URL-based routing (TanStack Router or React Router) for:
- Deep linking to clinic pages
- Shareable booking references
- Browser back button support

### 7.4 API layer
Replace hardcoded mocks with fetch calls to a backend. Hide the Google Maps API key behind a backend proxy (currently exposed in frontend).

---

## 8. Docker & Deployment (Nobus FCS)

Nobus FCS is IaaS (VM-based), similar to EC2. You launch an Ubuntu instance, SSH in, and run Docker yourself.

### Files to create
```
Dockerfile              # Multi-stage: Vite build + nginx serve
nginx.conf              # SPA fallback, security headers, gzip
docker-compose.yml      # Service definition, port 80
.dockerignore           # Exclude node_modules, dist, .figma, etc.
```

### Nobus FCS launch steps
1. Log in to [dashboard.nobus.io](https://dashboard.nobus.io)
2. **Project → Compute → Instances → Launch Instance**
3. **Details:** Name `qlinic-web`, AZ `nova`
4. **Boot source:** Ubuntu-22.04-64bit, 30 GB volume
5. **Instance type:** `si.2.4.30l` (4 vCPU, 8 GB RAM)
6. **Security groups:** Open TCP 22 (your IP only), TCP 80 (HTTP), TCP 443 (HTTPS if using SSL)
7. **Key pair:** Create/download `.pem` — this is your only chance
8. Launch

### Deploy commands (on instance)
```bash
# Connect
ssh -i ~/Downloads/qlinic-key.pem ubuntu@<INSTANCE_IP>

# Install Docker
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker

# Deploy
cd ~/qlinic
docker compose up -d --build

# Verify
curl -I http://localhost/
```

### Production checklist
| Item | Action |
|---|---|
| Floating IP | Attach a Nobus Flexible IP so IP doesn't change on reboot |
| DNS | Point domain A record to instance IP |
| SSL | Install Certbot + nginx, or put load balancer in front |
| Auto-restart | `restart: unless-stopped` in compose + `systemctl enable docker` |
| Backups | Instance snapshot before major changes |
| Security | Close all ports except 22 (your IP), 80, 443 |

---

## 9. Flutter Migration Notes (If Revisited)

If the team later migrates to Flutter, here's what carries over and what changes:

| React/Vite concept | Flutter equivalent |
|---|---|
| `useState<Screen>` router | GoRouter with named routes |
| `useState` in `App()` | Riverpod/Bloc providers |
| Tailwind classes | `ThemeData` + `ColorScheme` |
| CSS transitions | `AnimatedContainer`, `AnimatedSwitcher`, `Hero` |
| Google Maps JS API | `google_maps_flutter` plugin |
| `speechSynthesis` | `flutter_tts` package |
| `localStorage` | `hive` or `shared_preferences` |
| Push notifications | Firebase Cloud Messaging |

Keep the product logic (queue flow, booking steps, visit prep checklist) — only the implementation layer changes.

---

## 10. Quick Reference for New Agents

| Task | Where to look | What to do |
|---|---|---|
| Understand app structure | `src/App.tsx` | Read top to bottom — screens, state, mock data |
| Change styling | `src/index.css` | Tailwind v4 + CSS variables in `:root` |
| Add a new screen | `src/App.tsx` | Add to `Screen` union, create component, add render branch |
| Add state | `src/App.tsx` | Currently all in `App()` — consider extracting to a store |
| Run dev server | `package.json` | `pnpm dev` (port 8443 by default) |
| Build for production | `package.json` | `pnpm build` → outputs to `dist/` |
| Preview production | `package.json` | `pnpm preview` |
| Deploy to Nobus FCS | `Dockerfile`, `docker-compose.yml` | Build image, push to instance, run compose |
| Add animations | transitions-dev patterns | See Section 4.2 table |
| Fix theming | `src/index.css` `:root` variables | Update color tokens, add light/dark support |
| Plan a sprint | AGENT.md Section 2 | Follow sprint cadence, user story format, DoD |

---

## 11. Prioritized Roadmap

### Phase 1: Stabilize (this sprint)
- [ ] Split `App.tsx` into screens + components
- [ ] Add Zustand store for auth + queue state
- [ ] Add URL-based routing (TanStack Router)
- [ ] Add skeleton loaders + loading states
- [ ] Fix edge cases: offline banner, double-tap debounce, OTP TTL

### Phase 2: Polish (next sprint)
- [ ] Add transitions-dev animation patterns (modals, toasts, counters)
- [ ] Proper light/dark theming
- [ ] WhatsApp ticket share
- [ ] "Leave home at" estimator
- [ ] Analytics events

### Phase 3: Scale (backend required)
- [ ] Real API + backend (hide Google Maps key)
- [ ] Push notifications (Firebase)
- [ ] Offline-first with service worker
- [ ] m-Pesa integration
- [ ] B2B clinic dashboard

---

**Last updated:** Wed Nov 25 2026  
**Maintained by:** Engineering team  
**Questions:** Tag @platform or create an issue in the repo