# TRUSTHIRE — COMPLETE UI/UX DESIGN BLUEPRINT

**Prepared for:** Frontend implementation handoff (Codex / coding AI)
**Prepared as:** Senior Product/UI-UX Design Specification
**Scope:** Information architecture, navigation, dashboards, page layouts, design system, component hierarchy, interactions, states, responsive behavior, and a full screen-by-screen blueprint.
**Out of scope (explicitly not covered):** code, database/Prisma schema, auth implementation, API contracts, business logic.

---

## 0. DESIGN PRINCIPLES RECAP

TrustHire must feel like: **Modern HR SaaS × Professional career platform × Referral management system × Recruitment dashboard.**

Every screen should answer one question immediately, without scrolling: *"What do I need to do right now?"* Dashboards lead with **status and action**, not decoration. Data density scales with role — Applicant is calmest, Admin is densest — but the visual language (spacing, type scale, card style, badges) stays identical across roles so the product never feels like four different apps stitched together.

---

## 1. INFORMATION ARCHITECTURE

### 1.1 Public (unauthenticated) pages

```
/                      Landing page
/how-it-works          How TrustHire Works
/jobs                  Public job browse (read-only, teaser)
/jobs/[id]             Public job detail (blurred/gated referral section)
/about                 About / Trust & Company info
/login                 Login
/register              Register (role selection: Applicant / Employee)
/register/recruiter    Recruiter register (may require org invite/approval)
/forgot-password        Password recovery
```

Recruiters and Admins are **not self-registered** from a public marketing page in the typical flow — they are provisioned/invited by an existing Admin (this is a UI/role note, not an auth implementation detail). The public register page therefore defaults to Applicant/Employee, with a smaller "Recruiting on TrustHire?" link that routes to a request-access page.

### 1.2 Authenticated — shared shell pages

These routes exist for every logged-in role, but their **content adapts** to the role:

```
/dashboard              Role-specific dashboard (root after login)
/profile                 Own profile (view/edit)
/profile/[id]             Another user's profile (employee profile view, applicant preview, etc.)
/jobs                     Job discovery (Applicant/Recruiter/Admin see different toolbars)
/jobs/[id]                Job details
/referrals                Referral hub (Applicant: requests sent · Employee: requests received/given)
/referrals/[id]           Referral request detail
/notifications            Full notifications page
/messages                 Contextual messaging (optional, tied to a referral thread — see 1.4)
/settings                 Account, notification, privacy, referral preferences
```

### 1.3 Role-specific pages

**Applicant only**
```
/dashboard                     → Applicant Dashboard
/jobs/[id]/employees            → "Find people who can refer me" list for a job
/my-referrals                   → All referral requests sent (alias/tab of /referrals)
/saved-jobs                      → Bookmarked jobs
```

**Employee only**
```
/dashboard                       → Employee Dashboard
/referral-requests                → Inbox of incoming requests (alias/tab of /referrals)
/my-referrals-given                → Referrals the employee has provided, historical
/referral-preferences               → Availability toggle, departments open to refer, capacity
```

**Recruiter only**
```
/dashboard                        → Recruiter Dashboard
/jobs/manage                       → Recruiter's job postings (CRUD list)
/jobs/manage/new                    → Create job
/jobs/manage/[id]/edit                → Edit job
/candidates                          → All candidates across recruiter's jobs
/candidates/[id]                      → Candidate detail (applicant profile + referral trail)
/pipeline                              → Kanban/stage view of hiring pipeline
```

**Manager/Admin only**
```
/admin                                 → Admin Dashboard (platform overview)
/admin/users                            → All users (all roles), management table
/admin/users/[id]                        → User detail/management drawer
/admin/jobs                               → All jobs, platform-wide
/admin/referrals                           → All referral requests, platform-wide
/admin/activity                             → Platform activity / audit feed
/admin/reports                               → Reports & analytics
/admin/settings                               → System-level configuration
```

### 1.4 Messaging note
Messaging is **contextual, not a general inbox** — it lives attached to a referral request thread (Applicant ↔ Employee) once a referral is accepted, to keep communication purposeful and on-record. It appears as a "Discussion" tab inside `/referrals/[id]`, not as a standalone chat app. This preserves TrustHire's "structured and transparent" principle rather than becoming a generic social/DM product.

### 1.5 Role → page access matrix

| Page | Applicant | Employee | Recruiter | Admin |
|---|---|---|---|---|
| Dashboard (own) | ✅ | ✅ | ✅ | ✅ (Admin Dashboard) |
| Jobs (browse) | ✅ | ✅ (view only) | ✅ (view + manage) | ✅ (view + oversee) |
| Job Details | ✅ | ✅ | ✅ | ✅ |
| Find Employees to refer | ✅ | — | — | — |
| Employee Profile (view) | ✅ | ✅ (own, editable) | ✅ (view) | ✅ (view) |
| Referral Requests | ✅ (sent) | ✅ (received/given) | ✅ (view, read-only) | ✅ (all, monitor) |
| Referral Preferences | — | ✅ | — | — |
| Job Management (CRUD) | — | — | ✅ | ✅ |
| Candidates / Pipeline | — | — | ✅ | ✅ (oversight) |
| Admin: Users | — | — | — | ✅ |
| Admin: Reports | — | — | ✅ (own job reports) | ✅ (platform-wide) |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| Settings | ✅ | ✅ | ✅ | ✅ (+ system settings) |

---

## 2. SIDEBAR / NAVIGATION

### 2.1 Structure (desktop)

A **fixed left sidebar**, 264px wide, full viewport height, persistent across all authenticated pages.

```
┌───────────────────────────┐
│ [Logo]  TrustHire          │  ← 64px header zone, logo + wordmark
├───────────────────────────┤
│ 🔍 Search (⌘K)              │  ← optional global quick-search trigger
├───────────────────────────┤
│ NAVIGATION (role-specific) │
│  ● Dashboard                │
│  ● Jobs                      │
│  ● Referrals                  │
│  ● (role-specific items)       │
│  ● Notifications                │
│  ● Messages                       │
├───────────────────────────┤
│ (spacer/flex-grow)              │
├───────────────────────────┤
│ ⚙ Settings                       │
│ [Avatar] Name                     │
│   Role label · Company (if any)    │
│ ⏻ Logout                            │
└───────────────────────────┘
```

- **Logo placement:** top-left, 24px padding, TrustHire wordmark + mark icon. Clicking always returns to `/dashboard`.
- **Active state:** left accent bar (3px, primary color) + filled icon + medium-weight label + soft tinted background (primary at 6–8% opacity) on the active row. Inactive items use muted icon/text color; hover adds a subtle neutral background (no color shift, so it doesn't compete with active state).
- **Notification indicator:** small red/primary-accent dot or count badge on the "Notifications" nav item; also mirrored as a bell icon in the top header bar for quick access without leaving the current page context.
- **User profile section:** pinned at the bottom of the sidebar (not top), showing avatar, name, and role/company tag. Clicking opens a small popover: "View Profile," "Settings," "Log out." This keeps identity/logout muscle-memory at the bottom like most modern SaaS (Linear, Notion, Vercel).
- **Settings & Logout:** always present at the bottom, same position regardless of role, so muscle memory transfers across roles (important since Admin is "a type of User").

### 2.2 Role-specific nav items

- **Applicant:** Dashboard · Jobs · Referral Requests · Saved Jobs · Notifications · Messages
- **Employee:** Dashboard · Referral Requests · My Referrals Given · Jobs (view) · Referral Preferences · Notifications · Messages
- **Recruiter:** Dashboard · Jobs (Manage) · Candidates · Pipeline · Referrals (monitor) · Notifications
- **Admin/Manager:** Dashboard (Admin) · Users · Jobs · Referrals · Activity · Reports · Settings

A subtle **section label** ("MAIN," "MANAGE," "INSIGHTS") can group nav items for Recruiter/Admin where there are more items, using a small uppercase muted label — not for Applicant/Employee, whose nav is short enough to stay flat.

### 2.3 Top header bar (persists beside sidebar)

64px height, contains: page title/breadcrumb (left), global search (center-left, optional), notification bell + avatar quick menu (right, mirrors sidebar footer for convenience on wide screens where the sidebar might be scrolled or collapsed).

### 2.4 Mobile navigation behavior

- Sidebar collapses entirely below 768px.
- Replaced by a **top app bar** (logo + hamburger + notification bell + avatar) and a **bottom tab bar** for the 4–5 most-used destinations per role (e.g., Applicant: Dashboard, Jobs, Referrals, Notifications, Profile).
- Hamburger opens a **full-height slide-over drawer** from the left containing the complete nav list (same items/order as desktop sidebar), with the profile/settings/logout footer preserved at the bottom of the drawer.
- Secondary/rare items (Settings, Referral Preferences, Saved Jobs) live inside the drawer, not the bottom tab bar, to keep the tab bar to 5 icons max.

---

## 3. APPLICANT DASHBOARD

**Answers:** What opportunities are available to me? Who can refer me? What's my request status? What should I do next?

### Layout (top to bottom, single scrolling column with a 2-column grid on desktop ≥1280px)

**Row 1 — Welcome header (full width)**
- Left: "Welcome back, {FirstName} 👋" + one-line contextual sub-text (e.g., "You have 2 referral requests awaiting a response.")
- Right: Primary CTA button "Discover Jobs" (always visible, since job discovery is the core loop).

**Row 2 — Profile completion banner (full width, dismissible once 100%)**
- Horizontal progress bar + percentage ("Your profile is 70% complete") + short list of missing items as small chips ("Add skills," "Add experience") + "Complete profile" link. Uses a calm surface color, not an alarming red, to stay professional/non-nagging.

**Row 3 — Stat strip (4 StatCards, full width, equal columns; stacks to 2×2 on tablet, 1 column on mobile)**
1. Active Referral Requests (count + pending sub-count)
2. Accepted Referrals (count)
3. Jobs Saved (count)
4. Profile Views (count) — optional signal of visibility/trust

**Row 4 — Two-column split (desktop): Left 65% / Right 35%**

*Left column:*
- **Recommended Jobs** section header + "View all" link → horizontally scrollable or 2-column grid of 3–4 JobCards (title, company, location, referral-available badge, skills match tag, Save icon, "View" CTA).
- **Recent/Continue where you left off** — smaller row of 2 recently viewed jobs.

*Right column:*
- **Referral Requests Summary** card: mini-list of the 3 most recent requests with status badges (Pending / Accepted / Rejected / Completed), each row clickable to `/referrals/[id]`. "View all requests" link at bottom.
- **Notifications preview** card: last 3 notifications, "View all" link.
- **Quick Actions** card: buttons — "Find employees to refer me," "Update profile," "Browse saved jobs."

**Row 5 — Activity/history (full width, collapsible)**
- Simple timeline/list: "You applied to X," "Your request to {Employee} was accepted," etc. Chronological, muted style, de-emphasized visually (this is a log, not a priority section).

### Visual hierarchy priority (most to least prominent)
Welcome + CTA → Profile completion (if incomplete) → Stat strip → Recommended Jobs → Referral summary → Notifications/Quick actions → Activity log.

---

## 4. EMPLOYEE DASHBOARD

**Answers:** Who is requesting my referral? What needs my attention? Which referrals have I given, and their status?

### Layout

**Row 1 — Welcome header**
- "Welcome back, {FirstName}" + availability toggle chip inline in header ("Open to refer" / "Not available right now") so the employee's single most important preference is one click away, not buried in settings.

**Row 2 — Stat strip (4 StatCards)**
1. Pending Requests (needs action) — visually emphasized (primary-tinted background) since this is the "needs attention" number.
2. Referrals Given (total)
3. Acceptance Rate (%) — builds a sense of the employee's own track record/trust
4. This Month's Activity (count)

**Row 3 — Priority queue (full width, most important section on this dashboard)**
- **"Requests needing your attention"** — a table/list of RequestCards, each showing: applicant avatar+name, job title + company, requested date, a 1-line applicant headline (current role/skills match), and two inline actions: **Accept** (primary button) / **Reject** (secondary/outline button) directly from the dashboard for the fastest possible triage — clicking the row (not the buttons) opens full detail instead.
- Sorted by oldest-first by default, with a small "Sort" control.
- Empty state when zero pending: calm confirmation, not a blank table (see Section 15).

**Row 4 — Two-column split**

*Left:*
- **Recent Referrals Given** — list of ReferralCards with status badges (Accepted → In progress → Completed/Hired, or Rejected), each row links to `/referrals/[id]`.

*Right:*
- **Relevant Job Openings at your company** — small list surfacing jobs at the employee's own company that they could proactively refer people to, with a "Share/Refer someone" CTA.
- **Notifications preview** card.

**Row 5 — Quick actions bar**
- "Update referral preferences," "View all requests," "Browse applicants."

### Interaction priority
The dashboard is designed so an employee can process a request **without leaving the dashboard** for the common case (Accept/Reject), while still allowing full review via click-through — this directly serves the stated goal "make it easy for an employee to process a referral request quickly."

---

## 5. RECRUITER DASHBOARD

**Answers:** Which jobs are active? How many candidates? How many via referral? What needs attention?

### Layout

**Row 1 — Header**
- "Recruiting overview" + Primary CTA "Post a new job."

**Row 2 — Stat strip (5 StatCards, wraps to 3+2 on tablet)**
1. Active Jobs
2. Total Candidates
3. Referral Candidates (with % of total, e.g., "38% via referral" — a headline metric proving the platform's value)
4. Interviews Scheduled
5. Jobs Needing Attention (e.g., closing soon, zero applicants, stale)

**Row 3 — Two-column split (60/40)**

*Left — Hiring Pipeline (ChartCard + mini kanban preview):*
- A horizontal stage bar chart or simple kanban preview (Applied → Screening → Interview → Offer → Hired) showing candidate counts per stage, with a "View full pipeline" link to `/pipeline`.

*Right — Jobs needing attention (list):*
- Job rows with a small warning badge (e.g., "0 applicants," "Closing in 2 days," "No referrals yet") and a "Manage" link.

**Row 4 — Recent applicants (table, full width)**
- Columns: Candidate name/avatar, Job applied to, Source (Direct / Referral — with referrer name if applicable, shown as a small linked chip), Stage, Applied date, Actions (view).
- Referral-sourced rows get a subtle badge/icon distinguishing them, reinforcing the referral-tracking value prop.

**Row 5 — Two-column split**
*Left:* Active Jobs list (compact table: title, applicants count, referral count, status, edit/close actions).
*Right:* Recent recruitment activity feed (status changes, new applications, referral conversions).

---

## 6. ADMIN/MANAGER DASHBOARD

**Answers:** Platform-wide health, at a glance, with drill-down.

This is the densest dashboard but organized into **clear zones** so density doesn't become clutter — generous section spacing (32px between zones) compensates for the higher data volume per zone.

### Layout

**Row 1 — Header**
- "Platform Overview" + date-range selector (Today / 7d / 30d / Custom) — the only dashboard that needs a global time filter, since it's analytics-first.

**Row 2 — Primary stat strip (6 StatCards in 2 rows of 3, or 1 row of 6 on very wide screens)**
1. Total Users (with new-this-period delta, e.g., "+42 this week")
2. Applicants
3. Employees
4. Recruiters
5. Active Jobs
6. Pending Referral Requests

**Row 3 — Secondary stat strip (3 StatCards)**
1. Successful Referrals (accepted → hired conversion)
2. Referral Success Rate (%)
3. Platform Activity Score / Daily Active Users

**Row 4 — Analytics row (2 ChartCards, 50/50)**
- Left: **Growth chart** — line chart, user signups over time, segmented by role (stacked or multi-line).
- Right: **Referral funnel chart** — bar/funnel: Requests Sent → Accepted → In Progress → Hired.

**Row 5 — Two-column split (60/40)**

*Left — Recent Users (table):*
- Name, role badge, company (if applicable), joined date, status (Active/Suspended), action menu.

*Right — Administrative Alerts (card list):*
- Flags like "5 referral requests pending >7 days," "3 jobs reported/flagged," "2 accounts pending verification." Each with a severity indicator (info/warning) and a direct link to resolve.

**Row 6 — Recent Referrals (table, full width)**
- Applicant, Employee, Job, Status badge, Date, quick view action — same visual badge system as elsewhere in the product (consistency across Admin and Employee views of "the same data" reduces cognitive load).

**Row 7 — Platform activity feed (collapsible, full width)**
- Chronological audit-style feed of significant events (new job posted, referral accepted, user suspended, etc.) — muted styling, monospace-ish timestamp, this is a log not a hero section.

---

## 7. JOB DISCOVERY (`/jobs`)

### Layout
- **Header row:** Page title "Discover Jobs" (Applicant) or "All Jobs" (Recruiter/Admin) + search bar (title/company/keyword) + "Post a Job" CTA (Recruiter/Admin only, hidden for Applicant/Employee).
- **Filter bar (sticky under header):** horizontally laid-out filter chips/dropdowns: Location · Company · Skills · Job Type (Full-time/Part-time/Contract/Internship) · Experience Level · **Referral Available (toggle — important, unique to TrustHire)** · Sort (Newest / Best Match / Most Referrals Available).
- On mobile, filters collapse into a single "Filters" button opening a bottom-sheet/drawer (see Section 13).
- **Results area:** grid of JobCards, 3-column desktop / 2-column tablet / 1-column mobile. Left rail (desktop, optional, 240px) can hold the same filters in persistent form instead of a sticky bar, for power users (Recruiter/Admin view) — Applicant view favors the simpler sticky-chip-bar version to stay "clean enough for applicants."
- **Pagination or infinite scroll** with a visible "Load more" button (avoid silent infinite scroll so users retain a sense of place — supports "transparency" principle).

### Ideal Job Card
```
┌───────────────────────────────┐
│ [Company Logo]      [🔖 Save]  │
│ Job Title (bold, 16px)          │
│ Company Name · Location          │
│ [Full-time] [Mid-level] [Remote]   │  ← type/level/location tag chips
│ 🤝 4 employees can refer you        │  ← referral availability, signature element
│ Skills: React, Node, SQL (+2)         │
│ Posted 3 days ago        [View →]      │
└───────────────────────────────┘
```
The **"X employees can refer you"** line is the single most important differentiator on the card — it should use a distinct icon (handshake/people) and a subtle tinted pill so it visually reads as *the reason to click*, without using alarming colors (a calm secondary/teal accent, not red/orange).

---

## 8. JOB DETAILS PAGE (`/jobs/[id]`)

### Layout — 2-column: Main content (68%) + Sticky sidebar (32%)

**Main content (top to bottom):**
1. Breadcrumb (Jobs / Company / Job title)
2. Header block: Job title (H1), Company name + logo, Location, Employment type, Experience level, Posted date — laid out as a clean meta row of small labeled chips, not a wall of text.
3. Salary (if available) — shown prominently near the header, in its own short line, not buried.
4. Tabs or stacked sections: **Description** → **Responsibilities** → **Requirements** → **Skills** (as chip list) → **Benefits**.
5. Company info card (mini, expandable): logo, one-line description, employee count, link to see all jobs at this company.

**Sticky sidebar (right, stays in view while scrolling main content):**
1. **Primary CTA block** — the most visually important element on the page:
   - "🤝 4 employees can refer you" headline
   - "Request a Referral" primary button (large, filled, primary color)
   - Below it, secondary "Apply Directly" button (outline style — present but visually subordinate, since referral is the differentiator)
2. Mini preview of 2–3 relevant employees (avatar, name, title) with "See all 4" link → `/jobs/[id]/employees`.
3. Save/bookmark icon-button.
4. Share job (copy link) icon-button.

This split keeps the **referral CTA "visually important without cluttering the page"** exactly as required: it's isolated in its own sticky zone rather than mixed inline with the description text.

---

## 9. EMPLOYEE PROFILE (as seen by an Applicant)

**Goal: create a sense of trust before an applicant commits to sending a request.**

### Layout — single column, centered, generous whitespace (this is a "trust" page, not a data page)

1. **Header block:** Large circular profile photo, Name (H1), Job Title @ Company (subtitle), Department, small "✅ Verified Employee" trust badge (if verified), Referral availability status ("🟢 Open to referrals" / "🟡 Limited availability" / "🔴 Not available").
2. **Professional summary:** 2–4 sentence bio in a calm, readable serif-adjacent or clean sans block — this is the emotional/trust-building copy.
3. **Experience snapshot:** years at company, years of total experience, previous notable companies (small logo row, optional).
4. **Skills:** chip list, matched skills (relevant to the job the applicant came from) visually highlighted/bolded vs. other skills in a muted style — helps the applicant instantly see relevance.
5. **Referral stats (builds trust through transparency):** "12 referrals given · 9 hired · 92% response rate within 3 days" as a small stat row — real signal, not vanity metrics.
6. **Relevant open roles at their company** — small list, links back into Job Details.
7. **Primary CTA (bottom, and also floating/sticky on mobile):** "Request Referral" button, large, primary. Disabled/relabeled ("Currently unavailable") if the employee's availability is off, with an explanatory tooltip rather than hiding the button entirely (transparency > false hope, but also no dead ends — show why).

---

## 10. REFERRAL REQUEST SYSTEM

### Status/Badge system (used consistently everywhere — dashboards, tables, cards, detail pages)

| Status | Badge color style | Meaning |
|---|---|---|
| **Pending** | Neutral/amber outline badge, small clock icon | Sent, awaiting employee response |
| **Accepted** | Green/success filled-soft badge, check icon | Employee agreed to refer |
| **Rejected** | Red/danger soft badge, x icon | Employee declined |
| **In Progress** | Blue/info soft badge | Referral submitted to recruiter, application moving |
| **Completed / Hired** | Solid primary or gold-accent badge, star icon | Successful outcome — the "win" state, deserves the most celebratory (but still professional) styling |
| **Withdrawn/Expired** | Muted gray badge | Applicant withdrew or request expired unanswered |

Badges are always **pill-shaped, soft-filled (10–15% opacity of the status color) with matching text color**, never solid loud fills — keeps the dense tables calm.

### Referral Request List (`/referrals`)
- Tab/segmented control at top: **All / Pending / Accepted / Rejected / Completed** (Applicant: "sent" framing; Employee: "received" + separate "given" tab).
- Each row = **Request Card** (list-row style, not grid, since scanability matters more than visual richness here):
  - Avatar (of the other party) + Name
  - Job title + Company
  - Status badge
  - Requested/updated date
  - Chevron to open detail

### Request Detail (`/referrals/[id]`)
- **Header:** Status badge (large), job title/company, requested date, last updated date.
- **Two-column:** Left = Applicant preview card (photo, headline, skills, link to full profile) + Job preview card (title, company, key requirements). Right = Timeline of status changes ("Requested → Viewed → Accepted") as a small vertical stepper, plus the optional "Discussion" tab (see 1.4).
- **Action zone (Employee, only when Pending):** Two large buttons — **Accept Request** (primary) and **Decline** (outline/secondary). Declining opens a small optional-reason modal (not required, keeps friction low) before confirming.
- **Action zone (Applicant, only when Pending):** "Withdraw Request" (text/ghost button, low visual weight — this is a rare, slightly negative action).

---

## 11. PROFILE (`/profile`)

Single profile page template that **adapts sections by role**, rather than four separate designs — keeps the codebase and mental model simple.

### Shared structure (all roles)
1. **Header card:** Photo, name, headline/title, edit button, profile completion ring (small circular %, top-right of the header card).
2. **Tabs:** Personal Info · Professional Info · (role-specific tab) · Preferences/Visibility.

### Role-adaptive "Professional Info" tab content
- **Applicant:** Skills (chip editor), Education (repeatable entries: school, degree, year), Experience (repeatable: title, company, dates, description), Resume/CV upload.
- **Employee:** Company (locked/verified field, not free text if possible), Department, Role/Title, Years at company, Skills, Bio, **Referral capacity** (max active requests they'll take at once — a number stepper).
- **Recruiter:** Company, Department (Talent/HR), Title, Regions/teams they recruit for.
- **Admin:** Minimal — name, title, contact — since Admin's "profile" is not customer-facing.

### Preferences/Visibility tab
- Applicant: profile visibility to employees (On/Off), notification preferences.
- Employee: **Referral availability toggle** (also surfaced on dashboard for speed), auto-decline after X days, preferred applicant seniority/skills.
- All roles: notification channel preferences (in-app/email), password/security link.

Editing uses **inline edit-in-place per section** (pencil icon → fields become editable → Save/Cancel row appears) rather than a single giant "Edit Profile" form-page — reduces overwhelm and matches modern SaaS profile patterns (e.g., LinkedIn-style section editing).

---

## 12. NOTIFICATIONS

### Notification types (all roles)
- New referral request received (Employee)
- Referral accepted / rejected (Applicant)
- Job recommendation matched to profile (Applicant)
- Referral status updated — in progress / hired (both parties)
- New relevant candidate for a job (Recruiter)
- Job closing soon / needs attention (Recruiter)
- New user signup / flagged activity (Admin)
- System/administrative notice (all)

### Notification dropdown/panel (from header bell)
- Compact panel, ~360px wide, max ~6 items visible with internal scroll.
- Each item: small icon (type-coded), 1–2 line message, relative timestamp, unread = subtle left accent bar + bold text; read = fully muted.
- Footer: "Mark all as read" (left) · "View all" (right, → `/notifications`).
- Grouped loosely by recency ("Today," "Earlier") when the list is long.

### Full Notifications Page (`/notifications`)
- Same visual item style as the dropdown but full list, paginated/infinite-scroll.
- Filter tabs: All / Unread / Referrals / Jobs / System (tabs shown only where relevant to the role — Admin gets a "System" tab, Applicant doesn't).
- Bulk "Mark all as read" action at top.

---

## 13. SEARCH / FILTERING

### Search bar
- Persistent, rounded input with a search icon, placeholder text specific to context ("Search jobs, companies, skills…" / "Search users…" / "Search referral requests…").
- Debounced live results where feasible; otherwise explicit submit-on-enter with a loading spinner in the input's trailing position.

### Filter drawer (mobile / dense filter sets)
- Slide-up bottom sheet (mobile) or right-side slide-over (desktop, for Admin tables with many filters).
- Grouped filter sections with clear labels, each collapsible.
- Sticky footer inside the drawer: "Reset" (ghost, left) · "Apply Filters (12)" (primary, right, shows live result count before closing).

### Filter chips (desktop, jobs page)
- Applied filters render as removable chips below the filter bar ("Remote ✕," "Referral Available ✕") so the current filter state is always visible/transparent — supporting the "transparency" principle even in UI mechanics.

### Sorting
- Simple dropdown, top-right of results area: context-specific options (Newest, Best Match, Most Referrals Available for jobs; Most Recent, Status for referral tables).

### Empty results state
- Icon/illustration (simple line-art, on-brand, not cartoonish) + "No jobs match your filters" + "Try removing some filters" + a "Reset filters" button.

### Loading state
- Skeleton cards/rows matching the exact shape of the real content (not spinners) for job cards, tables, and dashboard stat cards — reduces layout shift and feels faster/more premium.

### Reset filters
- Always available as a visible text-link ("Clear all") next to the filter chip row, not hidden inside a menu.

---

## 14. ADMIN MANAGEMENT UI

Applies to `/admin/users`, `/admin/jobs`, `/admin/referrals`, `/admin/activity`, `/admin/reports`.

### Shared table pattern
- **Toolbar:** Search + filter drawer trigger + column-visibility toggle (optional, for power users) + primary action (e.g., "Invite User," "Post Job") aligned right.
- **Table:** sticky header row, zebra-free (use border-bottom row dividers, not alternating background, for a calmer premium look), row hover = subtle background tint, checkbox column for bulk select when bulk actions exist (e.g., bulk suspend, bulk export).
- **Status/role badges:** same pill system as Section 10, reused for user status (Active/Suspended/Pending) and role labels (Applicant/Employee/Recruiter/Admin — each role gets a consistent color across the whole app, e.g., Applicant = blue, Employee = teal, Recruiter = purple, Admin = slate/dark).
- **Row action menu:** kebab (⋮) icon at row end → dropdown: View, Edit, Suspend/Activate, Delete (destructive item visually separated with a divider and red text).
- **Pagination:** numbered pagination at table footer with page-size selector (25/50/100), since Admin tables can be large and need precise navigation (unlike the "load more" pattern on consumer-facing Jobs page).

### Detail drawers vs. detail pages
- **Users, Referrals:** open in a **right-side slide-over drawer** on top of the table (quick glance without losing table context/scroll position) — includes a "View full page" link for deep editing.
- **Jobs:** open as a **full detail page** (`/admin/jobs/[id]`) since job records are content-heavy (description, requirements, etc.) and deserve full-page real estate.

### Confirmation dialogs
- Any destructive/irreversible action (Suspend user, Delete job, Reject in bulk) triggers a centered modal: clear headline ("Suspend this user?"), one sentence of consequence, Cancel (ghost) + Confirm (danger-colored solid) buttons, Confirm never pre-focused/auto-triggerable by Enter to avoid accidental confirms.

### Reports/Analytics (`/admin/reports`)
- Grid of ChartCards: user growth, referral funnel, referral success rate by department/company, time-to-hire via referral vs. direct application (a key value-prop metric), top-referring employees leaderboard.
- Date range + export (CSV/PDF) controls in the page header.

---

## 15. EMPTY / LOADING / ERROR / SUCCESS STATES

Every state below uses a centered icon/illustration + headline + one supporting sentence + (optional) action button — never a bare blank area.

| Context | Loading | Empty | Error | Success |
|---|---|---|---|---|
| Job list | Skeleton job cards (3–6) | "No jobs match yet" + "Check back soon or adjust your filters" + Reset button | "We couldn't load jobs right now" + Retry button | — (list itself is the success state) |
| Referral requests (Applicant, none sent) | Skeleton rows | "You haven't requested a referral yet" + "Find someone who can refer you" CTA → Jobs | Retry banner | Toast: "Referral request sent!" |
| Referral requests (Employee, inbox empty) | Skeleton rows | "You're all caught up 🎉 No pending requests" (calm, positive framing — reward the zero-state) | Retry banner | Toast: "Request accepted — {Applicant} has been notified." |
| Notifications | Skeleton list items | "No notifications yet" + short reassurance line | Retry banner | — |
| Admin table (e.g., zero users match filter) | Skeleton table rows | "No results for these filters" + Clear filters button | Full-width error banner atop table + Retry | Toast confirmations for every admin action (e.g., "User suspended.") |
| Profile completion | — | N/A (banner itself is the "incomplete" state) | Inline field-level error text (red, under the specific input) | Toast: "Profile updated." |
| Job details (job removed/closed) | Skeleton page | "This job is no longer accepting applications" + "Browse similar jobs" CTA | 404-style page: "Job not found" + Back to Jobs | — |

General rules:
- Toasts (bottom-right desktop, bottom-center mobile) confirm every state-changing action (accept/reject referral, save profile, post job, suspend user) — 4-second auto-dismiss, manually dismissible, non-blocking.
- Inline form errors appear directly under the offending field in red, plus a red left-border on the input — never only a top-of-page generic banner for form validation.
- Full-page errors (failed data fetch) use the same icon/headline/action pattern as empty states but in a muted red/neutral tone, never alarming red backgrounds.

---

## 16. RESPONSIVE DESIGN

| Element | Desktop (≥1280px) | Tablet (768–1279px) | Mobile (<768px) |
|---|---|---|---|
| Sidebar | Fixed, 264px, always visible | Collapsible to icon-only rail (64px, icons only, tooltip on hover) or hidden behind toggle | Hidden; replaced by top bar + bottom tab bar + slide-over drawer |
| Dashboard cards | Multi-column grid (2–4 cols) per row zone | 2 columns, stat strip wraps 2×2 | Single column, stat strip 2×2 or stacked, sections reorder to put priority queue (Employee)/recommended jobs (Applicant) highest |
| Tables (Admin) | Full table, all columns | Horizontal scroll within a bounded container, sticky first column (name/title) | Convert to **stacked card rows** (each row becomes a mini-card with label:value pairs) instead of a scrolling table — tables are unusable on narrow phones |
| Job cards | 3-column grid | 2-column grid | 1-column, full-width cards, larger tap targets |
| Referral requests | List rows, inline actions visible | List rows, actions in row but slightly condensed | List rows collapse to card style; Accept/Reject become full-width stacked buttons revealed on tap-to-expand or on the detail page rather than inline in a cramped row |
| Navigation | Sidebar + header | Icon-rail sidebar or hidden with menu button | Bottom tab bar (5 items) + drawer |
| Filters | Inline sticky bar / left rail | Sticky bar, condensed chips, "More filters" overflow | Bottom-sheet filter drawer (Section 13) |
| Sticky job-details CTA sidebar | True sticky right column | Becomes a sticky **bottom bar** with condensed "Request Referral" button once scrolled past hero | Same sticky bottom bar pattern, full-width button |

General responsive principle: **content reflow, not content removal** — nothing important is hidden on mobile, it's re-prioritized and re-shaped (cards instead of tables, bottom sheets instead of side drawers, sticky bottom CTA instead of sticky sidebar).

---

## 17. DESIGN SYSTEM

### Overall aesthetic
Clean, confident, "quiet SaaS" — closer to Linear/Notion/Vercel/Ashby than to a consumer social app. Generous whitespace, restrained color, information communicated primarily through **type hierarchy and spacing**, with color reserved for status/action meaning (not decoration).

### Color palette
- **Primary:** A deep, trustworthy blue (e.g., `#2451E0`-family) — used for primary buttons, active nav state, key links, primary CTA ("Request Referral," "Post a Job").
- **Secondary/accent:** A muted teal/green (e.g., `#0F9D8C`-family) reserved specifically for **referral-related signals** ("X employees can refer you," Accepted badges) — this creates a consistent visual language where "teal = referral/trust" across the entire product.
- **Neutral/background:** Off-white background (`#F7F8FA`), not stark white, to reduce eye strain across dense dashboards.
- **Surface/card color:** Pure white (`#FFFFFF`) cards on the off-white background, creating gentle elevation without heavy shadows.
- **Text hierarchy:**
  - Primary text: near-black slate (`#151922`)
  - Secondary text: mid-gray (`#5B6472`)
  - Tertiary/muted text (timestamps, helper text): light gray (`#9AA2AF`)
- **Status colors:** Success green, Warning amber, Danger red, Info blue — all used only as **soft/tinted badge fills** (10–15% opacity) with matching darker text, never as large solid blocks.
- **Role colors (for badges only, not backgrounds):** Applicant = blue, Employee = teal, Recruiter = purple, Admin = slate.

### Typography
- **Font recommendation:** Inter or a similar humanist grotesque (e.g., "Inter," fallback "Segoe UI," "system-ui") for all UI text — highly legible at small sizes, professional, widely available, free.
- Optional: a slightly warmer secondary font (e.g., "Lora" or "Source Serif") reserved *only* for marketing/landing page headlines, to differentiate the public "trust-building" pages from the utilitarian app — not used inside the dashboard/app shell.
- **Type scale:** 
  - Display/H1 (landing, page titles): 32–40px, semi-bold
  - H2 (section headers): 24px, semi-bold
  - H3 (card titles): 18px, semi-bold
  - Body: 14–15px, regular
  - Small/meta: 12–13px, regular, muted color

### Borders, radius, shadows
- Border color: very light gray (`#E6E8EC`), 1px, used generously to separate cards/table rows instead of heavy shadows.
- **Border radius:** consistent 8px for buttons/inputs/small chips, 12px for cards, 16px for modals — never fully-rounded "pill" cards (reserve full-pill radius for badges/status chips only, to keep a visual distinction between "container" and "status label").
- **Shadows:** minimal — a single soft, low-opacity shadow (`0 1px 3px rgba(0,0,0,0.06)`) for cards at rest; a slightly larger shadow on hover/dropdown/modal (`0 8px 24px rgba(0,0,0,0.10)`). No colored/glow shadows.

### Components — visual spec
- **Buttons:** Primary = solid primary color, white text, 8px radius, medium weight label, subtle darken-on-hover (no scale/bounce animation). Secondary = outline, primary-colored border/text, transparent fill. Ghost/tertiary = text-only, no border, used for low-emphasis actions (Withdraw, Cancel). Danger = solid red, reserved for destructive confirms only.
- **Inputs:** 1px neutral border, 8px radius, 40px height, focus state = 2px primary-colored border + faint primary glow ring, label always above the field (not floating placeholder-as-label, for accessibility/clarity).
- **Badges:** pill-shaped (full radius), soft-fill background at status/role color, matching darker text, small icon optional, 12px text, used exactly as defined in Section 10.
- **Cards:** white surface, 12px radius, 1px border + minimal shadow, 20–24px internal padding, consistent header/body/footer zoning (title + optional action top-right, content middle, meta/CTA bottom).
- **Tables:** row-divider style (no zebra), sticky header, 48–56px row height for comfortable tap/click targets, right-aligned numeric columns, left-aligned text columns.
- **Modals:** centered, 16px radius, max-width ~480–560px for confirmations, up to 720px for content-heavy modals (e.g., job preview), dimmed/blurred backdrop, close (✕) top-right, primary action bottom-right, cancel bottom-left of the same footer row.
- **Dropdowns/menus:** 8px radius, soft shadow, 4px internal item padding, hover = light neutral background, destructive items in red with a divider above.
- **Toasts:** 8px radius, colored left border only (not full colored fill) matching the toast type (success/error/info), icon + message + optional action link, auto-dismiss with a subtle progress underline.

Avoid: gradients (except perhaps a very subtle one on the landing page hero only), glassmorphism/blur panels, bouncy/elastic animations, drop-shadow "neumorphism," playful rounded mascot-style illustration, or saturated multi-color palettes — all of which would undercut the "professional HR SaaS" positioning.

---

## 18. COMPONENT SYSTEM

### Layout
- `Sidebar` — role-aware nav list, active state logic, profile footer. Shared across all roles (content/items differ, structure identical).
- `Header` — page title/breadcrumb, search, notification bell, avatar menu. Shared.
- `MobileNav` — bottom tab bar + slide-over drawer. Shared, role-aware item set.
- `PageContainer` — consistent max-width, padding, and page-title/subtitle slot wrapping every route's content. Shared.

### Dashboard
- `StatCard` — icon, label, value, optional delta/trend. Shared across all 4 dashboards (styling identical; only data/icon differs).
- `ActivityCard` / `ActivityFeed` — timestamped log item list. Shared (Applicant activity log, Admin platform activity, Recruiter recent activity all reuse this).
- `JobCard` — used in Jobs page, Recommended Jobs (Applicant dashboard), Recruiter's job list (in a denser table-row variant). One component, a "density" prop switches between card and row rendering.
- `ReferralCard` / `RequestCard` — used in referral lists across Applicant, Employee, Recruiter (read-only), Admin (read-only) — a `role`/`mode` prop toggles which actions render (Accept/Reject only for Employee-pending view).
- `NotificationCard` — used in dropdown and full notifications page (a `compact` prop toggles size).
- `ChartCard` — wraps any chart (line/bar/funnel) with a consistent card header + optional date-range control; used by Recruiter and Admin dashboards/reports.

### Forms
- `Input`, `Select`, `SearchInput`, `FileUpload` (resume/photo), `FormSection` (label + grouped fields + optional edit/save toggle for the inline profile-editing pattern in Section 11). All shared, all roles.

### Feedback
- `Badge` — the single status/role pill component used everywhere (Section 10 badge table + Admin role badges are the *same* component with a different color-token prop, not separate components).
- `Toast`, `EmptyState`, `LoadingState` (skeletons), `ErrorState` — shared, each accepting `icon`, `title`, `message`, `action` props so every context in Section 15's table is the same component with different content.
- `ConfirmDialog` — shared modal for all destructive confirmations (Admin suspend/delete, Employee reject-with-reason, Applicant withdraw).

### Role-specific (not shared)
- `AvailabilityToggle` (Employee only) — dashboard header + profile preferences.
- `PipelineBoard` (Recruiter only) — kanban-style hiring stage view.
- `AdminTable` (Admin only, though it may internally reuse `Badge`/row primitives) — the toolbar+table+drawer pattern from Section 14.
- `EmployeeFinder` (Applicant only) — the "find people who can refer me" list/grid used at `/jobs/[id]/employees`.

**Guiding rule for the coding AI:** any component that displays a *status, count, person, or job* should be built once and parameterized by role/mode — TrustHire's UI consistency (and thus its "trustworthy, structured" feel) depends on the same visual object (e.g., a referral status badge) looking identical whether it's seen by the Applicant, the Employee, or the Admin.

---

## 19. INTERACTIONS & MICRO-UX

All motion should be **fast and subtle** (150–200ms ease-out standard; no bounce/elastic/spring easing) — professional, not playful.

- **Hover states:** cards lift with the "hover shadow" token (Section 17) + 1px border color darkens slightly; buttons darken 8–10%; table rows get a flat neutral background tint (no lift, to avoid visual noise in dense tables).
- **Button feedback:** on click, brief opacity dip (0.9) + existing hover darken; on async actions (Accept/Reject/Save), button shows an inline spinner replacing the label text and becomes disabled until resolution, then flashes to a checkmark for ~600ms before reverting or navigating away.
- **Status changes:** when a badge changes state (e.g., Pending → Accepted) live in view, cross-fade the badge (150ms) rather than an abrupt swap; pair with a toast confirmation.
- **Confirmation dialogs:** fade+scale-in from 96%→100% opacity/scale, centered, backdrop fades in simultaneously; closing reverses the same motion.
- **Toast notifications:** slide-in from the edge (bottom-right desktop / bottom mobile) + fade, auto-dismiss with a shrinking underline progress bar.
- **Dropdowns/menus:** fade + 4px slide from the trigger, anchored, closes on outside click or Escape.
- **Slide-over panels (Admin detail drawers, mobile nav drawer, filter drawer):** slide in from the appropriate edge (right for detail drawers, left for nav, bottom for mobile filter sheet) over 200ms with a simultaneous backdrop fade; dragging/swipe-to-dismiss supported on mobile bottom sheets.
- **Profile previews:** hovering an avatar/name in a table or list (desktop only) can show a lightweight preview popover (photo, title, company) after a short delay (400ms), to speed up scanning without requiring full navigation — optional enhancement, not required for MVP.
- **Job bookmarking:** bookmark icon fills solid + brief scale-pulse (1 → 1.15 → 1) on click, no confirmation toast needed for such a low-stakes action (icon state change is enough feedback).
- **Referral request actions (Accept/Reject):** immediate optimistic UI update (badge and row update instantly) + toast confirmation; on Reject, an optional lightweight reason modal appears **after** the click but **before** the final state commit, so the action still feels fast.
- **Loading transitions:** skeleton-to-content should cross-fade (150ms), never a hard pop-in, to reduce perceived layout jank.

---

## 20. FINAL SCREEN-BY-SCREEN BLUEPRINT

> Format per screen: PURPOSE · USER ROLE · LAYOUT · HEADER · SIDEBAR · MAIN CONTENT · CARDS · TABLES · BUTTONS · ACTIONS · EMPTY STATE · IMPORTANT INTERACTIONS

### SCREEN: Landing Page (`/`)
- **PURPOSE:** Convert visitors (applicants & employees) by explaining the referral value prop; route to register/login.
- **USER ROLE:** Public.
- **LAYOUT:** Full-width marketing sections, single column, centered max-width 1200px content.
- **HEADER:** Public top nav (logo left, "How it works," "Jobs," "Login," "Get Started" CTA right) — no sidebar.
- **SIDEBAR:** None.
- **MAIN CONTENT:** Hero (headline + subhead + dual CTA "Find a Referral" / "Give a Referral") → How it works 3-step strip → Trust/stats band ("X referrals made," "Y% acceptance rate") → Role-based value prop cards (Applicant/Employee/Recruiter) → Testimonial/logos band → Final CTA band → Footer.
- **CARDS:** Role value-prop cards (3, icon+title+2-line description).
- **TABLES:** None.
- **BUTTONS:** Primary "Get Started," Secondary "See Open Jobs."
- **ACTIONS:** Navigate to register/login/jobs.
- **EMPTY STATE:** N/A (static marketing content).
- **IMPORTANT INTERACTIONS:** Smooth-scroll anchor nav; subtle fade-in-on-scroll for sections (single, restrained animation, not per-element).

### SCREEN: Login (`/login`)
- **PURPOSE:** Authenticate existing users.
- **USER ROLE:** Public.
- **LAYOUT:** Centered single card (max 420px) on a subtly branded background (soft off-white, small logo mark).
- **HEADER:** Minimal — logo only, top-left, links back to landing.
- **SIDEBAR:** None.
- **MAIN CONTENT:** Email + password inputs, "Forgot password?" link, primary "Log In" button, divider, "Don't have an account? Register" link.
- **CARDS:** Single auth card.
- **TABLES:** None.
- **BUTTONS:** Primary "Log In."
- **ACTIONS:** Submit → redirect to `/dashboard` (routed by role post-auth).
- **EMPTY STATE:** N/A.
- **IMPORTANT INTERACTIONS:** Inline field validation errors; button shows spinner during submit.

### SCREEN: Register (`/register`)
- **PURPOSE:** Create account as Applicant or Employee.
- **USER ROLE:** Public.
- **LAYOUT:** Centered card, same shell as Login; first field is a role selector (segmented control: "I'm looking for a job" / "I work at a company and want to refer").
- **HEADER:** Same minimal header as Login.
- **SIDEBAR:** None.
- **MAIN CONTENT:** Role selector → name/email/password fields → (if Employee) company + role fields appear conditionally → Terms checkbox → primary "Create Account."
- **CARDS:** Single auth card.
- **TABLES:** None.
- **BUTTONS:** Primary "Create Account."
- **ACTIONS:** Submit → onboarding flow or directly to `/dashboard`.
- **EMPTY STATE:** N/A.
- **IMPORTANT INTERACTIONS:** Conditional field reveal (Employee company fields) animates in with a simple height/opacity transition, not an abrupt layout jump.

### SCREEN: Applicant Dashboard (`/dashboard`)
- Covered fully in **Section 3**. PURPOSE: surface opportunities, referral status, next actions. ROLE: Applicant. LAYOUT/HEADER/SIDEBAR: standard shell (Section 2). CARDS: StatCard×4, JobCard×3–4, ReferralCard preview, NotificationCard preview. TABLES: none (card/list based). BUTTONS: "Discover Jobs" (primary), "Complete profile," "View all." ACTIONS: navigate to Jobs, Referrals, Profile. EMPTY STATE: "No recommended jobs yet — complete your profile to get matches" with CTA. INTERACTIONS: profile-completion banner dismiss animation; stat cards link through on click.

### SCREEN: Employee Dashboard (`/dashboard`)
- Covered fully in **Section 4**. PURPOSE: triage incoming requests fast. ROLE: Employee. CARDS: StatCard×4, RequestCard priority queue, ReferralCard history. TABLES: priority queue can be table-styled rows. BUTTONS: inline "Accept"/"Reject," "Update preferences." ACTIONS: accept/reject directly from dashboard or click into detail. EMPTY STATE: "You're all caught up 🎉." INTERACTIONS: optimistic accept/reject with toast + row removal/fade.

### SCREEN: Recruiter Dashboard (`/dashboard`)
- Covered fully in **Section 5**. PURPOSE: hiring/referral funnel overview. ROLE: Recruiter. CARDS: StatCard×5, ChartCard (pipeline), job-attention list. TABLES: recent applicants table. BUTTONS: "Post a new job" (primary), "Manage" per job row. ACTIONS: navigate to Jobs Manage, Candidates, Pipeline. EMPTY STATE: "No active jobs yet — post your first job" CTA. INTERACTIONS: chart tooltips on hover; table row click → candidate detail.

### SCREEN: Admin Dashboard (`/admin`)
- Covered fully in **Section 6**. PURPOSE: platform-wide monitoring. ROLE: Admin/Manager. CARDS: StatCard×6+3, ChartCard×2, alert cards. TABLES: recent users, recent referrals. BUTTONS: date-range selector, "Resolve" links on alerts. ACTIONS: drill into Users/Jobs/Referrals/Reports. EMPTY STATE: rare (platform data assumed non-empty); if a new install, "No activity yet — invite your team to get started." INTERACTIONS: date range change re-fetches charts with skeleton-to-content cross-fade.

### SCREEN: Jobs — Discover (`/jobs`)
- Covered fully in **Section 7**. PURPOSE: browse/filter jobs. ROLE: all (content varies — Applicant "discover," Recruiter/Admin "all jobs" with manage affordances). LAYOUT: sticky filter bar + grid. CARDS: JobCard grid. TABLES: none (Recruiter can switch to `/jobs/manage` table view). BUTTONS: "Post a Job" (Recruiter/Admin only), "Save" per card, filter chips. ACTIONS: open job, save job, apply filters. EMPTY STATE: "No jobs match your filters" + Reset. INTERACTIONS: filter chip removal instantly refetches; skeleton cards while loading.

### SCREEN: Job Details (`/jobs/[id]`)
- Covered fully in **Section 8**. PURPOSE: full job info + referral/apply CTA. ROLE: all. LAYOUT: main + sticky sidebar. CARDS: company info card, employee preview mini-cards. TABLES: none. BUTTONS: "Request a Referral" (primary), "Apply Directly" (secondary), Save/Share icons. ACTIONS: navigate to `/jobs/[id]/employees`, open referral request flow. EMPTY STATE: "No employees currently available to refer for this role" (sidebar area, if zero) with "Apply Directly" emphasized instead. INTERACTIONS: sticky sidebar becomes sticky bottom bar on mobile scroll.

### SCREEN: Find Employees to Refer (`/jobs/[id]/employees`)
- **PURPOSE:** Let an applicant browse/filter employees at the hiring company who can refer them for this specific job.
- **USER ROLE:** Applicant.
- **LAYOUT:** Standard shell, breadcrumb back to job, grid/list of EmployeeCard.
- **HEADER:** "Employees who can refer you for {Job Title}" + small filter (department, seniority).
- **SIDEBAR:** Standard app sidebar.
- **MAIN CONTENT:** Grid of employee mini-cards (photo, name, title, department, availability status, "View Profile" / quick "Request" button).
- **CARDS:** EmployeeCard (photo, name, title@company, 2–3 matched skills, availability badge).
- **TABLES:** None.
- **BUTTONS:** "View Profile," "Request Referral" (direct, skips profile view for confident users).
- **ACTIONS:** Navigate to Employee Profile, or open Request Referral modal directly.
- **EMPTY STATE:** "No employees currently open to refer for this job — check back later or apply directly" + link back to job.
- **IMPORTANT INTERACTIONS:** Availability-filtered by default (only "open" employees shown first, toggle to "show all").

### SCREEN: Employee Profile View (`/profile/[id]`)
- Covered fully in **Section 9**. PURPOSE: build trust before requesting. ROLE: viewed by Applicant (also viewable read-only by Recruiter/Admin). LAYOUT: single centered column. CARDS: none needed beyond the profile block itself; stat row inline. BUTTONS: "Request Referral" (primary, sticky on mobile). ACTIONS: open Request Referral modal/flow. EMPTY STATE: N/A (profile assumed populated; if minimal, show "This employee hasn't added a bio yet" gracefully instead of blank space). INTERACTIONS: disabled-with-tooltip CTA when unavailable.

### SCREEN: Request Referral (modal/flow, triggered from Job Details or Employee Profile)
- **PURPOSE:** Capture the applicant's request with optional personal note.
- **USER ROLE:** Applicant.
- **LAYOUT:** Centered modal, ~520px wide.
- **HEADER:** "Request a referral from {Employee Name}" + job context line.
- **SIDEBAR:** N/A (modal).
- **MAIN CONTENT:** Optional message textarea ("Add a note explaining why you're a good fit — optional but recommended"), read-only preview of job + employee being requested.
- **CARDS:** Small preview cards for job + employee (read-only, confirmatory).
- **TABLES:** None.
- **BUTTONS:** "Send Request" (primary), "Cancel" (ghost).
- **ACTIONS:** Submit → creates Pending referral request, closes modal, shows toast, updates Referrals list.
- **EMPTY STATE:** N/A.
- **IMPORTANT INTERACTIONS:** Character-count hint on note field; primary button disabled until modal fully loads employee/job context (avoid submitting against stale data).

### SCREEN: Referral Requests List (`/referrals`)
- Covered fully in **Section 10**. PURPOSE: track sent/received requests. ROLE: Applicant (sent) / Employee (received+given) / Recruiter & Admin (read-only monitor). LAYOUT: tabs + list rows. CARDS: RequestCard rows. TABLES: can render as a table for Recruiter/Admin monitor view (denser, more columns: applicant, employee, job, status, date). BUTTONS: Accept/Reject (Employee, pending only), Withdraw (Applicant, pending only). ACTIONS: open detail, accept/reject inline. EMPTY STATE: role-specific (Section 15 table). INTERACTIONS: status-change cross-fade, optimistic updates.

### SCREEN: Referral Request Detail (`/referrals/[id]`)
- Covered fully in **Section 10**. PURPOSE: full context + action + history. ROLE: Applicant/Employee (participants), Recruiter/Admin (read-only). LAYOUT: header + two-column (preview cards + timeline/discussion). CARDS: Applicant preview, Job preview. TABLES: none. BUTTONS: Accept/Decline (Employee), Withdraw (Applicant). ACTIONS: status change, optional discussion message. EMPTY STATE: N/A (record always exists to reach this page). INTERACTIONS: stepper timeline animates newly-added steps in.

### SCREEN: Profile (`/profile`)
- Covered fully in **Section 11**. PURPOSE: manage personal/professional info. ROLE: all (adaptive content). LAYOUT: header card + tabs. CARDS: header card, per-section FormSection blocks. TABLES: none. BUTTONS: inline "Edit"/"Save"/"Cancel" per section. ACTIONS: update profile fields, toggle availability/visibility. EMPTY STATE: "Add your experience to help employees find you" prompts inside empty sections (e.g., no experience entries yet). INTERACTIONS: inline edit-in-place expand/collapse.

### SCREEN: Notifications (`/notifications`)
- Covered fully in **Section 12**. PURPOSE: full notification history. ROLE: all. LAYOUT: filter tabs + list. CARDS: NotificationCard (full variant). TABLES: none. BUTTONS: "Mark all as read." ACTIONS: click-through to related object (job/referral/user). EMPTY STATE: "No notifications yet — we'll let you know when something needs your attention." INTERACTIONS: unread → read fade on click/view.

### SCREEN: Recruiter — Manage Jobs (`/jobs/manage`)
- **PURPOSE:** CRUD list of the recruiter's own job postings.
- **USER ROLE:** Recruiter (Admin sees all via `/admin/jobs`).
- **LAYOUT:** Toolbar (search + "Create Job") + table.
- **HEADER:** "Manage Jobs" + create CTA.
- **SIDEBAR:** Standard.
- **MAIN CONTENT:** Table — Title, Status (Open/Closed/Draft badge), Applicants count, Referral count, Posted date, actions kebab.
- **CARDS:** N/A (table-first for management).
- **TABLES:** Primary content, as described.
- **BUTTONS:** "Create Job" (primary), row actions (Edit, Close, Duplicate, Delete).
- **ACTIONS:** Create/edit/close/delete a job.
- **EMPTY STATE:** "You haven't posted any jobs yet" + "Create your first job" CTA.
- **IMPORTANT INTERACTIONS:** Close/Delete trigger ConfirmDialog; Draft jobs visually muted (lower-opacity row) until published.

### SCREEN: Create / Edit Job (`/jobs/manage/new`, `/jobs/manage/[id]/edit`)
- **PURPOSE:** Structured job-posting form.
- **USER ROLE:** Recruiter/Admin.
- **LAYOUT:** Multi-section single-page form (not a wizard — all sections visible, grouped by FormSection) with a sticky "Save/Publish" action bar at the bottom.
- **HEADER:** "Create Job" / "Edit Job" + Save Draft / Publish buttons (top-right, mirrored in sticky footer).
- **SIDEBAR:** Standard.
- **MAIN CONTENT:** Sections: Basics (title, company/dept, location, type), Compensation (salary range, optional), Description (rich text), Requirements/Responsibilities/Benefits (repeatable bullet lists), Skills (chip input), Referral settings (allow referrals toggle, target departments).
- **CARDS:** Each FormSection rendered as a card.
- **TABLES:** None.
- **BUTTONS:** "Save Draft" (secondary), "Publish" (primary).
- **ACTIONS:** Save/publish job.
- **EMPTY STATE:** N/A (form).
- **IMPORTANT INTERACTIONS:** Autosave draft indicator ("Saved" with timestamp) so recruiters don't fear losing work; inline validation before Publish is enabled.

### SCREEN: Candidates (`/candidates`)
- **PURPOSE:** All candidates across the recruiter's jobs.
- **USER ROLE:** Recruiter (Admin: platform-wide via `/admin`).
- **LAYOUT:** Toolbar (search/filter by job, stage, source) + table.
- **HEADER:** "Candidates."
- **SIDEBAR:** Standard.
- **MAIN CONTENT:** Table — Candidate, Job, Source (Direct/Referral + referrer chip), Stage badge, Applied date, action.
- **CARDS:** N/A.
- **TABLES:** Primary.
- **BUTTONS:** Row "View" action, bulk stage-update (if multi-select enabled).
- **ACTIONS:** Open candidate detail, change stage.
- **EMPTY STATE:** "No candidates yet — share your job postings to attract applicants."
- **IMPORTANT INTERACTIONS:** Referral-sourced rows show a small teal referral icon + referrer name as a clickable chip → opens referrer's profile.

### SCREEN: Candidate Detail (`/candidates/[id]`)
- **PURPOSE:** Full candidate view + referral trail + stage control.
- **USER ROLE:** Recruiter/Admin.
- **LAYOUT:** Two-column — profile/resume left, pipeline stage + referral trail right.
- **HEADER:** Candidate name + current stage badge + job applied to.
- **SIDEBAR:** Standard.
- **MAIN CONTENT:** Resume/skills/experience (reuses Profile display components), stage-change dropdown/stepper, referral trail card (if referred: "Referred by {Employee}" with link + date + accept timeline).
- **CARDS:** Referral trail card, resume/skills card.
- **TABLES:** None.
- **BUTTONS:** "Advance stage," "Reject," "Schedule interview" (if applicable).
- **ACTIONS:** Update pipeline stage, view referrer profile.
- **EMPTY STATE:** N/A (candidate record exists to view).
- **IMPORTANT INTERACTIONS:** Stage change confirms via ConfirmDialog if moving to Rejected; otherwise instant with toast.

### SCREEN: Pipeline (`/pipeline`)
- **PURPOSE:** Visual kanban of hiring stages across jobs.
- **USER ROLE:** Recruiter/Admin.
- **LAYOUT:** Horizontal kanban board, columns = stages (Applied/Screening/Interview/Offer/Hired), cards = candidates, job filter dropdown at top to scope the board to one job or "All jobs."
- **HEADER:** "Hiring Pipeline" + job selector.
- **SIDEBAR:** Standard.
- **MAIN CONTENT:** `PipelineBoard` component — draggable candidate cards between stage columns (drag-and-drop optional/progressive enhancement; a stage-change dropdown on each card is the accessible fallback/primary action).
- **CARDS:** Compact candidate card (avatar, name, job, referral icon if applicable).
- **TABLES:** None.
- **BUTTONS:** Per-card stage-change control.
- **ACTIONS:** Move candidate between stages.
- **EMPTY STATE:** "No candidates in the pipeline for this job yet."
- **IMPORTANT INTERACTIONS:** Drag-and-drop with drop-zone highlight; card count badge per column header.

### SCREEN: Employee — Referral Preferences (`/referral-preferences`)
- **PURPOSE:** Configure availability and capacity for referrals.
- **USER ROLE:** Employee.
- **LAYOUT:** Single settings-style page, grouped FormSections.
- **HEADER:** "Referral Preferences."
- **SIDEBAR:** Standard.
- **MAIN CONTENT:** Availability toggle (large, top), max concurrent requests (stepper), auto-decline-after-X-days setting, preferred applicant seniority/skills (optional matching filters), department/roles willing to refer for.
- **CARDS:** Grouped FormSection cards.
- **TABLES:** None.
- **BUTTONS:** "Save Preferences" (primary).
- **ACTIONS:** Update availability/capacity.
- **EMPTY STATE:** N/A.
- **IMPORTANT INTERACTIONS:** Toggling availability off surfaces an inline confirmation note ("You won't receive new requests until you turn this back on") rather than a modal — low-stakes, reversible action.

### SCREEN: Admin — Users (`/admin/users`)
- Covered by **Section 14** pattern. PURPOSE: manage all platform users. ROLE: Admin. LAYOUT: toolbar+table+drawer. CARDS: none (table-first). TABLES: primary (Name, Role badge, Company, Status badge, Joined date, action kebab). BUTTONS: "Invite User," row actions (View, Suspend/Activate, Delete). ACTIONS: manage user lifecycle. EMPTY STATE: "No users match these filters." INTERACTIONS: right-side drawer for quick view/edit, ConfirmDialog for suspend/delete.

### SCREEN: Admin — Jobs (`/admin/jobs`)
- Same pattern as Recruiter's Manage Jobs but platform-wide, with an added "Company/Recruiter" column and oversight actions (feature/unpublish/flag). Full detail page (not drawer) per Section 14.

### SCREEN: Admin — Referrals (`/admin/referrals`)
- Same pattern as `/referrals` but platform-wide monitor table (read-only status, no accept/reject — Admin observes, doesn't act on individual referrals) with drawer-based detail view.

### SCREEN: Admin — Activity (`/admin/activity`)
- **PURPOSE:** Audit/activity feed across the platform.
- **USER ROLE:** Admin.
- **LAYOUT:** Filterable chronological feed, full width, no sidebar-table split needed.
- **HEADER:** "Platform Activity" + filter by event type + date range.
- **MAIN CONTENT:** Timeline list, each entry: actor, action verb, target, timestamp — monospace timestamp, muted styling throughout (this is a log, deliberately low-emphasis visually).
- **BUTTONS:** Filter controls only.
- **ACTIONS:** Filter/search the feed; click an entry to jump to the related record.
- **EMPTY STATE:** "No activity recorded for this period."
- **IMPORTANT INTERACTIONS:** Infinite scroll with "load more" fallback.

### SCREEN: Admin — Reports (`/admin/reports`)
- Covered in **Section 14**. PURPOSE: analytics/export. ROLE: Admin (Recruiter sees a scoped version at their own dashboard/reports). LAYOUT: ChartCard grid + toolbar. CARDS: multiple ChartCards. TABLES: leaderboard table (top referrers). BUTTONS: date range, export (CSV/PDF). ACTIONS: view/export analytics. EMPTY STATE: "Not enough data yet for this period." INTERACTIONS: chart hover tooltips, export triggers a toast on completion.

### SCREEN: Settings (`/settings`)
- **PURPOSE:** Account-level configuration distinct from profile content.
- **USER ROLE:** all (Admin gets an extra "System" tab).
- **LAYOUT:** Tabbed settings page — Account (email/password), Notifications (channel toggles), Privacy (visibility), and Admin-only "System" tab.
- **HEADER:** "Settings."
- **MAIN CONTENT:** Grouped FormSections per tab.
- **BUTTONS:** "Save changes" per section.
- **ACTIONS:** Update account/security/notification settings.
- **EMPTY STATE:** N/A.
- **IMPORTANT INTERACTIONS:** Password change requires current-password confirmation inline; save actions show inline "Saved" confirmation next to the button rather than only a toast, for settings specifically (higher-trust action deserves persistent-visible confirmation).

---

## CLOSING NOTES FOR IMPLEMENTATION

1. Build the **shared shell (Sidebar, Header, MobileNav, PageContainer)** and the **shared component library (Section 18)** first — every screen depends on them, and TrustHire's trustworthy feel comes from their absolute consistency across roles.
2. Build the **Badge/status system (Section 10)** as one parameterized component before any dashboard, since it appears everywhere.
3. Implement the four dashboards (Sections 3–6) after the shell/components exist, in this priority order: Employee (simplest, highest-frequency action loop) → Applicant → Recruiter → Admin (most complex, benefits from the other three's components already existing).
4. Treat Sections 15 (states) and 19 (micro-UX) as **non-optional polish** — a referral platform's core value is trust, and trust is communicated as much by calm, confident empty/loading/error states as by the primary flows.
