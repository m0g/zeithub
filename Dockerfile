# syntax=docker/dockerfile:1

# --- Build ---
FROM node:24-slim AS build
WORKDIR /app

COPY . .
# No install scripts needed: better-sqlite3 ships prebuilt binaries, and
# skipping scripts avoids its fallback node-gyp build (and a toolchain).
RUN npm ci --ignore-scripts && npm run build

# --- Run ---
FROM node:24-slim

# Chromium renders the invoice PDFs.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    fonts-dejavu-core \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    DATABASE_PATH=/data/zeithub.db \
    CHROME_BIN=/usr/bin/chromium

WORKDIR /app
COPY --from=build /app/.output ./.output

# The SQLite database lives in /data; mount a volume there.
RUN mkdir -p /data && chown node:node /data
USER node
VOLUME /data

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
