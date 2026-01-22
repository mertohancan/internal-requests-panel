# Task Approval System - User Panel

Çalışanların görev talebi oluşturup takip ettiği panel.

## Teknolojiler

- React 19
- TypeScript
- Redux Toolkit
- React Router
- Axios
- React Hook Form + Zod
- SCSS Modules
- Vite

## Kurulum

```bash
cd user-panel
npm install
```

## Çalıştırma

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Özellikler

- ✅ Login/Logout
- ✅ Dashboard (istatistikler)
- ✅ Talep Oluşturma (form validation)
- ✅ Taleplerim (filtreleme, detay görüntüleme)
- ✅ Paylaşılan UI componentleri (`@task-approval/shared-ui`)

## Kullanılan Shared Components

```tsx
import {
  Badge,
  PriorityBadge,
  StatusBadge,
  Spinner,
  Toast,
  Tooltip,
} from "@task-approval/shared-ui";
```

## Test Kullanıcıları

- **Email:** user1@test.com | **Şifre:** 123456
- **Email:** user2@test.com | **Şifre:** 123456

## Mock API

Mock API'yi çalıştırmak için:

```bash
cd ../mock-api
npm run dev
```

API http://localhost:4000 adresinde çalışacaktır.
