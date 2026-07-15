# #GlasŽrtev — Samostojna verzija

Anonimiziran števec žaljivk, sovražnega govora in groženj v Sloveniji.

## Namestitev

```bash
# 1. Namesti odvisnosti
npm install

# 2. Napolni bazo s testnimi podatki
npm run db:seed

# 3. Zaženi razvojni strežnik
npm run dev
```

Aplikacija teče na `http://localhost:5173`, API na `http://localhost:3001`.

## Produkcija

```bash
npm run build
npm start
```

Aplikacija teče na `http://localhost:3001` (ali `PORT` env spremenljivka).

## Gostovanje

Aplikacija deluje na vsakem Node.js gostovanju:

- **Railway**: `railway up`
- **Render**: nastavi build command `npm run build`, start command `npm start`
- **Fly.io**: `fly launch`
- **VPS**: `npm run build && npm start` (uporabi PM2 ali systemd za proces)
- **Docker**: dodaj Dockerfile z `node:20-slim`, eksponiraj port 3001

## Tehnologija

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Express.js
- **Baza**: SQLite (better-sqlite3) — datoteka `data/glaszrttev.db`
- **Brez Higgsfield odvisnosti** — popolnoma samostojno

## Funkcije

- Animirani dnevni števec od 0
- Piramida resnosti (grožnje → sovražni govor → žaljivke)
- Skladni ploščni graf in topli zemljevid 7×24
- Glasovi — avtomatski scroll feed anonimiziranih prijav
- Besede, ki ranijo — frekvenčna analiza
- Kartica tedna z deljenjem na X, Facebook, Instagram, TikTok, YouTube
- Obrazec za prijavo z anonimizacijo in motivom napada
- Analitika ozadja (spol, starost, otroci, motiv napada)
- Popolna anonimnost — noben identifikacijski podatek ni shranjen
