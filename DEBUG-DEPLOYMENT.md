# 🐛 Debug 404 Greške na Vercel

## Trenutna situacija:
404: NOT_FOUND i dalje se javlja uprkos promenama

## Najčešći uzroci 404 na Vercel:

### 1. 🏗️ Build Problems
- Frontend se ne build-uje pravilno
- Backend se ne kompajlira
- Pogrešne putanje u vercel.json

### 2. 🔧 Environment Variables
- Nedostaju ili su pogrešne env varijable
- MongoDB connection string nije ispravan
- JWT_SECRET nije postavljen

### 3. 📁 Folder Structure
- Vercel ne može da pronađe fajlove
- Pogrešna `distDir` konfiguracija

## Quick Debug Steps:

### Korak 1: Provjeri Vercel Build Logs
1. Idi u Vercel Dashboard
2. Klikni na najnoviji deployment
3. Idi u "Functions" tab - provjeri backend errors
4. Idi u "Build Logs" - provjeri frontend build

### Korak 2: Test API direktno
Pokušaj da pristupiš API endpoint-u:
```
https://your-app.vercel.app/api/health
```

Ako ovo ne radi, problem je u backend-u.

### Korak 3: Provjeri Environment Variables
U Vercel dashboard, provjeri da li su sve env varijable postavljene:
- MONGODB_URI
- JWT_SECRET  
- NODE_ENV
- FRONTEND_URL

### Korak 4: Lokalni test
```bash
# Test frontend build
cd frontend
npm run build
ls -la dist/  # Treba da vidiš index.html i assets/

# Test backend build  
cd ../backend
npm run build
ls -la dist/  # Treba da vidiš server.js
```

## Alternativna rešenja:

### Option A: Separate Deployments
Deploy frontend i backend odvojeno:
- Frontend na Vercel (static)
- Backend na Railway/Heroku

### Option B: Monorepo Fix
Reorganizovati struktura da Vercel bolje razume

### Option C: Next.js Migration
Prebaciti na Next.js za lakši Vercel deployment

## Debugging Commands:
```bash
# Provjeri da li su svi package.json ispravni
cat frontend/package.json | grep vercel-build
cat backend/package.json | grep vercel-build

# Local build test
npm run build --prefix frontend
npm run build --prefix backend
```

## Sledeći korak:
1. Provjeri build logs u Vercel
2. Test API endpoint
3. Javi rezultate za dalje debugging
