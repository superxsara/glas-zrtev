# #GlasŽrtev — Samostojna verzija

Identična aplikacija kot na Higgsfieldu, brez Higgsfield odvisnosti.

## Zagon

```bash
npm install
npm run db:seed    # napolni bazo s testnimi podatki
npm run dev        # razvojni način (port 5173 + API na 3001)
```

## Produkcija

```bash
npm run build
npm start          # http://localhost:3001
```

## Gostovanje

- **Railway**: `railway up`
- **Render**: build=`npm run build`, start=`npm start`
- **Fly.io**: `fly launch`
- **VPS**: `npm run build && PORT=80 npm start` (uporabi PM2)

## Stack

- React 19 + Vite + Tailwind CSS
- Express.js + better-sqlite3 (SQLite)
- Brez Higgsfield, brez plačljivih odvisnosti
