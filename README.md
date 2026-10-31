# Tiệm

Vietnamese salon management website, marketing homepage and installable PWA.

## Local development

Use Node >=22.13.0. Install using the Sites plugin's install-dependencies helper. Run `npm run dev -- --port 4173 --hostname 127.0.0.1`. Open `/index.html` for the homepage and `/app.html` for management.

Local auth is simulated only by the portable Sites runtime: `/signin-with-chatgpt?return_to=/app.html`. Hosted authentication is owned by Sites; do not trust custom identity headers from a public deployment outside its authenticated proxy.

D1 migrations live in `drizzle/`. Generate with `npm run db:generate`; build with the Sites build-site helper before applying local migrations using the exact commands in the bundled starter documentation. Local and hosted databases are separate.

## Current scope

- Catalog, employees, skills, weekly workdays and shifts (09:00–19:00 envelope).
- Appointment creation, conflict checks, rescheduling, cancellation, no-show release.
- Customer profiles, notes and booking history.
- Cash receipts, simulated bank receipts, deposits, mixed payments, recorded refunds, tip allocation.
- Service price/duration and employee commission snapshots preserve past booking terms.
- Reports, CSV export, JSON backup/restore.
- Optional account-owned D1 workspace snapshots, authenticated by ChatGPT; optimistic revision checks stop silent overwrites between devices. Loading a remote copy requires explicit user action.
- Responsive light/dark UI, PWA shell and install instructions.

## Not connected / not production promises

Bank callbacks, payment QR generation, SMS/Zalo sending, automated calls, staff invitations/RBAC, subscriptions, multiple business memberships, multiple service lines per visit and automatic cash settlement are not implemented. Banking is explicitly simulated, and refund actions only record money returned outside the software. Platform pricing is proposed, not sold.

The workspace API intentionally supports one private workspace per signed-in user. Server-side validation rejects invalid ledgers and mismatched totals. Browser records and backups may contain customer information; no identity or personal data belongs in source control.
