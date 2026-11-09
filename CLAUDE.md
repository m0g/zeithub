# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Zeithub is an open source invoicing app for freelancers (clients, projects, bank accounts, addresses, line-item invoices with PDF export). It is a single Nuxt 4 app: a Vue 3.5 SPA in `app/` and a Nitro API in `server/`, backed by one SQLite file through Drizzle ORM.

## Commands

```bash
npm install                 # also runs `nuxt prepare` (generates .nuxt/ types)
npm run dev                 # http://localhost:3002, DB at .data/zeithub.db
npm run build && npm start  # production build in .output/
npm test                    # Vitest: unit + e2e projects
npm run lint                # ESLint (flat config from @nuxt/eslint)
npm run format              # Prettier
npm run typecheck           # nuxt typecheck (vue-tsc)
npm run db:generate -- --name my-change   # migration from schema changes
```

- Run one project: `npx vitest run --project unit` (fast, no server) or `--project e2e` (builds the app, runs it against a temp SQLite file). Filter with `-t "isolation"`.
- The e2e PDF test needs Chrome/Chromium: it uses `CHROME_BIN`, or Google Chrome's default macOS path. It is skipped if neither exists.
- Env vars: `DATABASE_PATH`, `NUXT_APP_SECRET` (required in production, 32+ chars; generated in dev), `CHROME_BIN`, `NUXT_SESSION_COOKIE_SECURE`. See `example.env`.
- Node 24 (`.nvmrc`, `flake.nix`, Dockerfile).

## Architecture

**Layout.** `app/` is the client (pages, components, layouts, stores, middleware). `server/` is Nitro (`api/`, `utils/`, `plugins/`, `db/`). `shared/` is imported by both. Nuxt auto-imports `app/{components,composables,utils,stores}`, `server/utils`, `shared/utils` and `shared/types`. Other files (e.g. `shared/invoice/document.ts`, `server/db/schema.ts`) are imported explicitly (`#shared/...` or relative paths).

**Database.** `server/db/schema.ts` is the source of truth. Drizzle uses `casing: 'snake_case'`, so code is camelCase and columns are snake_case with no aliasing. Money is integer cents (`unitPriceCents`, `discountCents`); `taxRate` is a percent (real); invoice dates are ISO `YYYY-MM-DD` text. Foreign keys are enforced. `server/utils/db.ts` exposes one shared connection via `useDb()` (WAL mode). `server/plugins/database.ts` runs migrations from `server/db/migrations/` and seeds currencies on startup. The build copies migrations to `.output/server/migrations`. The driver is synchronous (better-sqlite3): use `.get()`, `.all()`, `.run()`, and `.sync()` on relational `db.query.*` calls. Transaction callbacks must be synchronous.

**API (`server/api`).** File-based routes, one handler per file named by method (`index.get.ts`, `[id].put.ts`, …). Each handler:

1. calls `requireUser(event)` → `userId`,
2. validates input with `readBodyAs(event, schema)` / `getIdParam(event)` / `getParamsAs(...)` (`server/utils/validate.ts`),
3. queries with Drizzle, always filtering with `eq(table.userId, userId)`.

When a body references other rows (clientId, bankAccountId, projectId…), call `assertReferencesOwned` (`server/utils/ownership.ts`) so users can't attach each other's data. Errors use `createError({ statusCode })`. 400 responses carry `data.issues: [{ path, message }]`. Responses are plain data, with no `{ success }` envelope. Deleting a client, address or bank account used by an invoice returns 409.

**Validation schemas.** `shared/utils/schemas.ts` holds the zod schemas for every request body. The API validates with them, and forms run the same schema client-side (`validationMessages`) before submitting, so messages match.

**Auth.** `nuxt-auth-utils`: a sealed, httpOnly cookie session holding `{ user: { id, name } }` (type in `shared/types/auth.d.ts`). Passwords are scrypt (`hashPassword`). Legacy bcrypt hashes (imported from MySQL) are verified with bcryptjs and rehashed on sign-in (`server/utils/users.ts`). Client side: `useUserSession()`; `app/middleware/auth.global.ts` guards pages; `app/plugins/unauthorized.client.ts` sends the user to `/signin` on any API 401. Nothing auth-related lives in localStorage.

**Client.** Pages use `<script setup>` with top-level `await` on Pinia setup stores in `app/stores/` (one per resource; stores own all API calls via `$fetch`). Annotate `$fetch<T>()` when assigning to a typed ref: inferring through Nitro's typed routes can hit TS2321 "excessive stack depth". `InvoiceForm.vue` is shared by the new and edit pages, and saves a localStorage draft for new invoices. API errors go through `errorMessages()` into `<FormErrors>`. Styling is Tailwind v4 via `@tailwindcss/vite`; shared component classes (`.btn`, `.input`, `.select`, `.label`…) are in `app/assets/css/main.css`. Icons: `<Icon name="fa6-solid:…" />` (bundled locally).

**Invoice rendering.** `shared/invoice/document.ts` is the one invoice layout, written with `h()` and its own CSS scoped under `.invoice-page`. The invoice page renders it on screen, and `server/api/invoices/[id]/pdf.get.ts` renders it with `vue/server-renderer` and prints it with puppeteer-core, using one shared Chromium (`server/utils/browser.ts`). Data comes from `loadInvoiceDocument()` in `server/utils/invoices.ts`, one relational query. Totals come from `computeInvoiceTotals()` (`shared/utils/invoice-totals.ts`): lines rounded to cents, flat discount, then tax. Avoid class names in the document that clash with the app's global classes.

**Import from MySQL.** `scripts/import-mysql.ts` (`npm run db:import-mysql`, needs `MYSQL_URL`) is a one-off migration from the pre-0.6 MariaDB schema. `mysql2` is a dev dependency used only there.

## Style

Prettier 3: single quotes, semicolons, 2-space indent, 80 cols, `arrowParens: avoid`, `trailingComma: es5`. ESLint via `@nuxt/eslint` + `eslint-config-prettier`; prefix intentionally unused variables with `_`.
