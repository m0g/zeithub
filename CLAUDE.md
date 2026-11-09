# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Zeithub is an open source time tracking, invoicing and expenses app for freelancers. It is a single Node app: an Express API (`src/server`) that also serves a Vue 3 SPA (`src/client`), backed by MySQL/MariaDB.

## Commands

```bash
cp example.env .env           # local env (DB_USER, DB_PASSWD, DB_NAME, JWT_SECRET, NODE_ENV)
docker-compose up -d          # starts MariaDB on :3306 (and a prod-style app container on :8080)
npm install
npm run db:up                 # apply migrations (db-migrate, config/database.json, "dev" env)
npm run dev                   # nodemon + ts-node on src/server/index.ts → http://localhost:3000
npm run build                 # webpack prod bundle to dist/ + tsc server to build/
npm start                     # run compiled server (build/server/index.js)
npm run lint                  # eslint src/
npm test                      # migrates the "test" DB, runs mocha, then resets the test DB
```

- Run a single test: `NODE_ENV=test npx mocha -r ts-node/register src/server/index.test.ts --grep "Sign up"` (run `npx db-migrate up --config config/database.json -e test` first). Tests need `DB_NAME_TEST` set and a reachable MySQL.
- New migration: `npx db-migrate create --config config/database.json my-migration --sql-file` (writes a JS stub in `migrations/` plus up/down SQL in `migrations/sqls/`).
- Invoice PDF generation needs a Chromium binary at `CHROME_BIN` (puppeteer-core does not download one).
- Node version: `.nvmrc` / Dockerfile use 18.12.1.

## Architecture

**Single server, dev bundling in-process.** `src/server/index.ts` builds the Express app. When `NODE_ENV !== 'production'` it mounts `webpack-dev-middleware` with `webpack.dev.js`, writing the client bundle to `dist/`. `public/index.html` loads `/dist/index.bundle.js`, and `express-history-api-fallback` serves `index.html` for all non-API routes so vue-router history mode works. `vite.config.ts` and the commented-out Vite block in `index.ts` are unused — the client is built by webpack (`webpack.common.js`, vue-loader + ts-loader + postcss/tailwind).

**API (`src/server/routes`).** Mounted under `/api/*` (projects, sign, me, invoices, bank-accounts, addresses, clients, currencies). Newer resources are folders with an `index.ts` router wiring one handler file per action (`list.ts`, `create.ts`, `update.ts`, `remove.ts`, …). Older routes (`me.js`, `projects.js`, `sign.js`, `bank-accounts/*.js`) are plain CommonJS JS; `npm run tsc` copies `.js` files into `build/` via `posttsc`, so both coexist. Responses follow the shape `{ success: boolean, message?, ...data }`.

**Auth.** `/api/sign/up` and `/api/sign/in` issue an HS256 JWT signed with `JWT_SECRET`. `verify-token.ts` middleware reads `Authorization: Bearer <token>` and sets `req.userId` / `req.username`; every query must be scoped by `user_id = req.userId`. On the client the token lives in `localStorage` (`src/client/auth.ts`), and `src/client/http.ts` is a `fetch` wrapper that attaches it — use it for all API calls.

**Database.** `src/server/db.ts` wraps a `mysql2/promise` pool (`query`, `queryOne`, `execute` → returns `insertId`). Each route module instantiates its own `new DB()`. Uses `CLEARDB_DATABASE_URL` if set (Heroku), otherwise `DB_*` vars; switches to `DB_NAME_TEST` when `NODE_ENV=test`. Columns are snake_case and are aliased to camelCase in SQL (`due_date as 'dueDate'`). Much existing code interpolates values directly into SQL strings; prefer `db.execute(sql, params)` with placeholders for new code. Schema history lives only in `migrations/sqls/*.sql`.

**Client (`src/client`).** Vue 3 + vue-router 4 + Pinia. Page components are in `routes/` (route table and `requireAuth`/`requireUnauth` guards in `routes/index.ts`), reusable pieces in `components/`, and Pinia setup-style stores in `stores/` (API calls are being moved from components into stores). Styling is Tailwind via PostCSS.

**Shared code.** `src/models.ts` (classes with defaults) and `src/types.ts` (interfaces) are used by both client and server. `src/lib/` holds formatting filters (`filters.ts`: currency, iban, dates, invoice numbers) and render-function/template Vue components (`invoice-info`, `items-table`) that are rendered server-side.

**Invoice PDFs.** `GET /api/invoices/:id/pdf` (`routes/invoices/pdf.ts`) loads invoice, items, client, address and bank account, renders a Vue app to HTML with `@vue/server-renderer` using the `src/lib/components`, then prints it to A4 with puppeteer-core. Invoices are now line-item based (`items` table; `activities` was dropped in a 2020 migration). Changes to invoice layout may need updating in both `src/client/components/*.vue` and `src/lib/components/*.ts`.

## Style

Prettier: single quotes, semicolons, 2-space indent, 80 cols, `arrowParens: avoid`. ESLint extends `eslint:recommended`.
