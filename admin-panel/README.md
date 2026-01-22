# Task Approval System - Admin Panel

Yönetici paneli - talepleri yönetmek, onaylamak/reddetmek ve kullanıcıları yönetmek için.

## 🚀 Başlangıç

```bash
npm install
npm run dev
```

Panel http://localhost:3001 adresinde açılacaktır.

## 🔑 Test Kullanıcıları

| Email              | Şifre     | Rol       | Yetkiler                                   |
| ------------------ | --------- | --------- | ------------------------------------------ |
| admin@test.com     | admin123  | Admin     | Tüm yetkiler + Kullanıcı yönetimi          |
| moderator@test.com | mod123    | Moderator | Talepleri görüntüleme ve onaylama/reddetme |
| viewer@test.com    | viewer123 | Viewer    | Sadece talepleri görüntüleme               |

## ✨ Özellikler

### Dashboard

- ✅ Bekleyen talep sayısı
- ✅ Toplam talep sayısı
- ✅ Onaylanan talep sayısı
- ✅ Reddedilen talep sayısı
- ✅ Real-time güncellemeler (WebSocket)

### Bekleyen Talepler

- ✅ Onay bekleyen talepleri listeleme
- ✅ Talep detaylarını görüntüleme
- ✅ Talep onaylama/reddetme
- ✅ Filtreleme (öncelik, başlık)
- ✅ Sayfalama

### Tüm Talepler

- ✅ Tüm talepleri listeleme
- ✅ Durum ve öncelik badge'leri
- ✅ Filtreleme ve arama
- ✅ Sayfalama

### Yönetici Kullanıcıları

- ✅ Admin kullanıcıları listeleme
- ✅ Yeni admin ekleme
- ✅ Admin silme
- ✅ Rol bazlı yetkilendirme

## 🛠 Teknolojiler

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Routing
- **SCSS Modules** - Styling
- **Vite** - Build tool
- **@task-approval/shared-ui** - Shared components

## 📁 Proje Yapısı

```
admin-panel/
├── src/
│   ├── app/
│   │   ├── store.ts              → Redux store
│   │   ├── hooks.ts              → Typed hooks
│   │   └── socketMiddleware.ts  → WebSocket middleware
│   ├── components/
│   │   ├── Layout.tsx            → Ana layout
│   │   └── Toast.tsx             → Toast notifications
│   ├── features/
│   │   ├── auth/                 → Login/logout
│   │   ├── dashboard/            → Dashboard
│   │   ├── tasks/                → Talep yönetimi
│   │   └── adminUsers/           → Admin kullanıcı yönetimi
│   ├── services/
│   │   └── api.ts                → API client
│   └── utils/
│       └── errorHandler.ts       → Error handling
└── ...
```

## 🔌 API Endpoints

Mock API (http://localhost:4000) ile çalışır:

- `GET /tasks` - Tüm talepler
- `GET /tasks?status=pending` - Bekleyen talepler
- `PATCH /tasks/:id` - Talep güncelleme (onay/red)
- `GET /adminUsers` - Admin kullanıcıları
- `POST /adminUsers` - Yeni admin ekleme
- `DELETE /adminUsers/:id` - Admin silme

## 📝 Geliştirme Notları

- Redux Toolkit ile state management
- WebSocket ile real-time updates
- Role-based authentication (admin/manager)
- SCSS Modules ile component-scoped styling
- TypeScript strict mode
- ESLint kuralları

## 🧪 Build

```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşur.

## 📚 Daha Fazla Bilgi

Ana README dosyasına bakın: [../README.md](../README.md)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
