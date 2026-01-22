# Task Approval System

İki ayrı panel içeren görev onay sistemi: User Panel (çalışan talebi) ve Admin Panel (yönetici onayı).

## 🌐 Live Demo

- **User Panel**: [https://internal-requests-user-panel.vercel.app](https://internal-requests-user-panel.vercel.app)
- **Admin Panel**: [https://internal-requests-panel-admin-panel.vercel.app](https://internal-requests-panel-admin-panel.vercel.app)
- **Backend API**: https://internal-requests-panel-production.up.railway.app

Test kullanıcıları aşağıda listelenmiştir.

## 📁 Proje Yapısı

```
task-approval-system/
├── user-panel/          → Çalışan paneli (port: 3000)
├── admin-panel/         → Yönetici paneli (port: 3001)
├── shared-ui/           → Paylaşılan UI component kütüphanesi
├── mock-api/            → JSON Server mock API (port: 4000)
└── README.md            → Bu dosya
```

## 🚀 Hızlı Başlangıç

### 1. Mock API'yi Başlatın

```bash
cd mock-api
npm install
npm run dev
```

Mock API http://localhost:4000 adresinde çalışacaktır.

### 2. User Panel'i Başlatın

```bash
cd user-panel
npm install
npm run dev
```

User Panel http://localhost:3000 adresinde çalışacaktır.

### 3. Admin Panel'i Başlatın

```bash
cd admin-panel
npm install
npm run dev
```

Admin Panel http://localhost:3001 adresinde çalışacaktır.

## 🔑 Test Kullanıcıları

### User Panel

- **Email:** user1@test.com | **Şifre:** 123456
- **Email:** user2@test.com | **Şifre:** 123456

### Admin Panel

| Email              | Şifre     | Rol       |
| ------------------ | --------- | --------- |
| admin@test.com     | admin123  | Admin     |
| moderator@test.com | mod123    | Moderator |
| viewer@test.com    | viewer123 | Viewer    |

## 🛠️ Teknoloji Stack

### Frontend (Her İki Panel)

- **React 19** - UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **Redux Toolkit** - State yönetimi
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form + Zod** - Form yönetimi ve validation
- **SCSS Modules** - Stil yönetimi
- **Vite** - Build tool

### Shared UI

- **@task-approval/shared-ui** - Paylaşılan component kütüphanesi
  - Badge, PriorityBadge, StatusBadge
  - Spinner, Tooltip
  - Toast: Her panelde `react-hot-toast` kullanılıyor (hooks uyumluluğu için)

### Mock API

- **Express.js** - RESTful API server
- **Socket.io** - Real-time WebSocket communication

## 📋 Özellikler

### User Panel ✅

- ✅ Login/Logout
- ✅ Dashboard (istatistikler)
- ✅ Talep Oluşturma (form validation ile)
- ✅ Taleplerim (filtreleme, detay görüntüleme)
- ✅ Status badge'leri (pending, approved, rejected)
- ✅ Priority badge'leri (low, normal, high, urgent)
- ✅ Real-time updates (Socket.io)

### Admin Panel ✅

- ✅ Login/Logout (rol bazlı)
- ✅ Dashboard (bekleyen talep istatistikleri)
- ✅ Bekleyen Talepler (onay/red işlemleri, filtreleme, arama)
- ✅ Tüm Talepler (filtreleme, pagination)
- ✅ Kullanıcı Yönetimi (CRUD, sadece Admin rolü)
- ✅ Rol bazlı erişim kontrolü
- ✅ Real-time updates (Socket.io)
- ✅ Dark/Light theme

## 🎨 Shared UI Kullanımı

```tsx
// user-panel veya admin-panel içinde
import {
  Badge,
  PriorityBadge,
  StatusBadge,
  Spinner,
  Tooltip,
} from "@task-approval/shared-ui";

function MyComponent() {
  return (
    <div>
      <PriorityBadge priority="high" />
      <StatusBadge status="pending" />
      <Spinner />
    </div>
  );
}
```

## 🔄 Shared UI Güncelleme

Shared UI'da değişiklik yaptıysanız:

```bash
cd shared-ui
npm run build

# Sonra panellerde yeniden yükleyin
cd ../user-panel
npm install

cd ../admin-panel
npm install
```

## API Endpoints

### Mock API (http://localhost:4000)

- `GET /users` - Kullanıcı listesi
- `GET /tasks` - Görev listesi
- `POST /tasks` - Yeni görev oluştur
- `PATCH /tasks/:id` - Görev güncelle
- `GET /adminUsers` - Admin kullanıcı listesi
- `POST /adminUsers` - Yeni admin kullanıcı ekle

### Örnek Task Objesi

```json
{
  "id": "t1",
  "title": "VPN bağlantısı kopuyor",
  "description": "Evden çalışırken VPN sürekli kopuyor",
  "priority": "high",
  "category": "Teknik Destek",
  "status": "pending",
  "createdBy": "u1",
  "createdAt": "2026-01-18T08:10:00.000Z",
  "rejectionReason": null
}
```

## Mimari Kararlar

### 1. Monorepo Yapısı

- Her panel bağımsız çalışabilir
- Shared UI components ile kod tekrarı önlendi
- Local workspace packages kullanıldı (`file:../shared-ui`)

### 2. State Yönetimi

- Redux Toolkit ile merkezi state yönetimi
- `createAsyncThunk` ile async işlemler
- Slice pattern ile modüler yapı

### 3. Form Yönetimi

- React Hook Form performans için
- Zod schema validation
- Type-safe form handling

### 4. Stil Yönetimi

- SCSS Modules ile scope'lu stiller
- Paylaşılan componentlerde inline styles (portability)

### 5. API Katmanı

- Axios instance ile merkezi config
- Express.js ve Socket.io ile real-time API
- Frontend'de auth state yönetimi

## 📦 Build

### User Panel

```bash
cd user-panel
npm run build
```

Build dosyaları `user-panel/dist` klasöründe oluşur.

### Admin Panel

```bash
cd admin-panel
npm run build
```

Build dosyaları `admin-panel/dist` klasöründe oluşur.

## 🚧 Bilinen Eksiklikler

- 🌍 Localization (i18n) desteği

## 📄 Lisans

MIT License - Open source olarak kullanıma açıktır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.
