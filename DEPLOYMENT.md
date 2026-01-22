# Deployment Guide

## Railway (Backend)

### 1. Railway'de Proje Oluştur

1. [Railway.app](https://railway.app) → New Project
2. "Deploy from GitHub repo" seç
3. `beymen-case` reposunu seç
4. Root directory: `mock-api` olarak ayarla

### 2. Environment Variables

Railway dashboard → Variables sekmesi:

```
NODE_ENV=production
USER_PANEL_URL=https://your-user-panel.vercel.app
ADMIN_PANEL_URL=https://your-admin-panel.vercel.app
```

### 3. Deploy

- Railway otomatik deploy eder
- Sonuçta bir URL alırsın: `https://your-app.railway.app`

---

## Vercel (Frontend)

### 1. User Panel Deploy

1. [Vercel.com](https://vercel.com) → Add New Project
2. Import `beymen-case` repository
3. Settings:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (boş bırak)
   - **Build Command**: `npm run build:shared && npm run build:user`
   - **Output Directory**: `user-panel/dist`
   - **Install Command**: `npm run install:all`

4. Environment Variables:

```
VITE_API_URL=https://your-app.railway.app
VITE_WS_URL=https://your-app.railway.app
```

### 2. Admin Panel Deploy

1. Vercel → Add New Project (aynı repo'dan ikinci proje)
2. Settings:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (boş bırak)
   - **Build Command**: `npm run build:shared && npm run build:admin`
   - **Output Directory**: `admin-panel/dist`
   - **Install Command**: `npm run install:all`

3. Environment Variables:

```
VITE_API_URL=https://your-app.railway.app
VITE_WS_URL=https://your-app.railway.app
```

---

## Post-Deployment

### Railway'deki URL'leri Güncelle

Railway deploy edince URL'i al ve Railway environment variables'ı güncelle:

```
USER_PANEL_URL=https://user-panel-abc123.vercel.app
ADMIN_PANEL_URL=https://admin-panel-xyz789.vercel.app
```

### Vercel'i Redeploy Et

Her iki Vercel projesinde de:

- Deployments → ... → Redeploy

---

## Test Users (Production)

Aynen development'taki gibi:

**Admin Panel**: `admin@test.com` / `admin123`
**User Panel**: `user1@test.com` / `user123`

---

## Troubleshooting

### CORS Hatası

- Railway environment variables doğru mu kontrol et
- Railway'i redeploy et

### Cookie Çalışmıyor

- Railway'de `NODE_ENV=production` set olmalı
- Browser'da 3rd party cookies enabled olmalı

### WebSocket Bağlanmıyor

- `VITE_WS_URL` Railway URL'sine point ediyor mu?
- Railway logs kontrol et

### Build Hatası (Vercel)

- Root directory `.` olmalı (boş bırak)
- `npm run install:all` çalıştığından emin ol
- Logs'da shared-ui build edildi mi kontrol et
