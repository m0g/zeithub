# Zeithub

![](zeithub.png)

Zeithub is an open source invoicing app for freelancers: manage clients,
projects, bank accounts and addresses, write line-item invoices, and download
them as PDFs.

It is a single [Nuxt 4](https://nuxt.com) app (Vue 3 front end and API in one
Node server) backed by one SQLite file.

## Development

Requirements: Node 24 (`.nvmrc`) and Google Chrome or Chromium for invoice
PDFs. With Nix, `nix develop` provides everything.

```bash
npm install
cp example.env .env   # then set CHROME_BIN for your system
npm run dev           # http://localhost:3002
```

The database is created at `.data/zeithub.db` on first start, and migrations
run automatically. In development a session secret is generated for you.

| Command                   | What it does                                |
| ------------------------- | ------------------------------------------- |
| `npm run dev`             | Dev server with hot reload                  |
| `npm run build`           | Production build in `.output/`              |
| `npm start`               | Run the production build                    |
| `npm test`                | Unit tests and API tests (Vitest)           |
| `npm run lint`            | ESLint                                      |
| `npm run format`          | Prettier                                    |
| `npm run typecheck`       | `vue-tsc` over app, server and shared code  |
| `npm run db:generate`     | Create a migration after editing the schema |
| `npm run db:studio`       | Browse the database with Drizzle Studio     |
| `npm run db:import-mysql` | One-off import from the old MySQL version   |

### Changing the database schema

1. Edit `server/db/schema.ts`.
2. Run `npm run db:generate -- --name what-changed`. This writes SQL to
   `server/db/migrations/`. Commit it.
3. Restart the server: pending migrations are applied on startup.

## Self-hosting with Docker

```bash
export NUXT_APP_SECRET=$(openssl rand -base64 32)   # keep this value
docker compose up -d
```

Zeithub is now on http://localhost:8080. Data lives in the `zeithub-data`
volume (`/data/zeithub.db` in the container).

Keep `NUXT_APP_SECRET` the same across restarts, otherwise everyone gets signed
out. Session cookies are HTTPS-only (browsers make an exception for
localhost). If you serve Zeithub over plain HTTP on another address, set
`NUXT_SESSION_COOKIE_SECURE=false`.

### Configuration

| Variable                     | Default            | Notes                                     |
| ---------------------------- | ------------------ | ----------------------------------------- |
| `NUXT_APP_SECRET`            | none (required)    | 32+ characters, seals the session cookie  |
| `DATABASE_PATH`              | `.data/zeithub.db` | `/data/zeithub.db` in Docker              |
| `CHROME_BIN`                 | none               | Chromium binary for PDFs; set in Docker   |
| `PORT`                       | `3000`             |                                           |
| `NUXT_SESSION_COOKIE_SECURE` | `true`             | `false` only for plain HTTP off localhost |

### Backup and restore

Stop the app so the database file is complete, then copy it:

```bash
docker compose stop
docker compose cp zeithub:/data/zeithub.db ./zeithub-backup.db
docker compose start
```

To restore, follow the steps in the next section with your backup file.

## Upgrading from the MySQL version (0.5 and older)

Older versions stored data in MySQL/MariaDB. Import it once into a SQLite
file, from a checkout of this repository:

```bash
npm install
MYSQL_URL=mysql://zeithub:zeithub@localhost:3306/zeithub \
DATABASE_PATH=./zeithub.db \
npm run db:import-mysql
```

The script keeps all IDs, converts amounts to cents, and prints row counts per
table. Rows that pointed at deleted records (the old schema had no foreign
keys) are skipped or unlinked, and listed. Passwords keep working: old bcrypt
hashes are upgraded the next time each user signs in.

Then put the file into the Docker volume before the first start:

```bash
docker compose create
docker compose cp ./zeithub.db zeithub:/data/zeithub.db
docker compose run --rm --user root zeithub chown node:node /data/zeithub.db
docker compose up -d
```

Note: the new `docker-compose.yml` has no database service. Running it from
the same directory as the old setup replaces the old app container. The old
MariaDB data in `./docker/mysql` stays on disk.

Time tracking and expenses were dropped from the old version in 2020 and are
not part of this release.
