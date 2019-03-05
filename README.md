<!-- [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy) -->

# Zeithub

## Installation

```bash
cp example.env .env
docker-compose up -d
npm install
npm run db:up
```

To run locally:

`npm run dev`

The app is now available at http://localhost:3000

## How to create a new migration

```bash
npx db-migrate create --config config/database.json my-fancy-migration --sql-file
```