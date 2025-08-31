# 🔧 API 404 Fix - Backend Serverless

## Problem:
API pozivi vraćaju 404 greške na Vercel

## Uzrok:
Vercel serverless funkcije rade drugačije od običnog Express servera

## Rešenje:

### 1. ✅ Kreiran `/api` folder struktura
- `api/index.ts` - glavni handler za Vercel
- `api/package.json` - dependencies za API

### 2. ✅ Modifikovan `backend/src/server.ts`
- Dodao `export default` handler za Vercel
- Zadržao local development funkcionalnost

### 3. ✅ Updateovana `vercel.json`
- Routing sada pokazuje na `/api/index.ts`
- Pojednostavljena build konfiguracija

## Struktura:
```
api/
  ├── index.ts          # Vercel serverless handler
  └── package.json      # API dependencies

backend/
  └── src/
      └── server.ts     # Express app + Vercel export
```

## Test nakon deployment:
- `https://your-app.vercel.app/api/health` - treba da vrati JSON
- Registration i login treba da rade

## Sledeći koraci:
1. Commit i push promene
2. Redeploy na Vercel
3. Test API endpoints
