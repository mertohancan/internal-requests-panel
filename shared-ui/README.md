# Task Approval System - Shared UI Components

Shared UI component library for both User Panel and Admin Panel.

## Components

- **Badge** - Generic badge component
- **PriorityBadge** - Task priority badge (low, normal, high, urgent)
- **StatusBadge** - Task status badge (pending, approved, rejected)
- **Spinner** - Loading spinner
- **Tooltip** - Tooltip component
- **StatCard** - Statistics/metric card for dashboards
- **TaskListItem** - Reusable task list item component
- **Modal** - Generic modal dialog
- **EmptyState** - Empty state placeholder

**Note:** Toast component is not included in shared-ui due to React hooks compatibility issues. Use `react-hot-toast` directly in each panel.

## Design System

All components follow a consistent design system with:

- **Color Palette** - Primary, gray, success, warning, error, info colors
- **Typography** - Font sizes, weights, and line heights
- **Spacing** - Consistent spacing scale (xs, sm, md, lg, xl, 2xl, 3xl)
- **Border Radius** - Consistent corner radius (sm, md, lg, xl, 2xl, full)
- **Shadows** - Elevation levels (xs, sm, md, lg, xl)
- **Z-index** - Layering system for modals, dropdowns, tooltips

### Using the Theme

```tsx
import { theme } from "@task-approval/shared-ui";

// Access colors
const primaryColor = theme.colors.primary[500];
const textColor = theme.colors.gray[800];

// Access spacing
const padding = theme.spacing.md;

// Access typography
const fontSize = theme.typography.fontSize.lg;
```

## Installation

This package is used as a local workspace package.

```bash
cd shared-ui
npm install
npm run build
```

## Usage

In user-panel or admin-panel:

```tsx
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

For toast notifications, use `react-hot-toast` directly:

```tsx
// src/components/Toast.tsx
import { Toaster } from "react-hot-toast";

const Toast = () => <Toaster position="top-right" />;
export default Toast;

// App.tsx
import Toast from "@/components/Toast";
import { toast } from "react-hot-toast";

function App() {
  return (
    <>
      <Toast />
      {/* routes */}
    </>
  );
}
```

## Development

Watch mode for development:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```
