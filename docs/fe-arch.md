# Frontend Architecture Guide

## Tech Stack

| Technology   | Version | Purpose           |
| ------------ | ------- | ----------------- |
| React        | 19.x    | UI Library        |
| TypeScript   | 5.x     | Type Safety       |
| Vite         | 7.x     | Build Tool        |
| React Router | 7.x     | Routing           |
| Tailwind CSS | 4.x     | Styling           |
| Shadcn UI    | Latest  | Component Library |
| Axios        | 1.x     | HTTP Client       |
| Lucide React | Latest  | Icons             |

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── layout/          # Layout components (Navbar, Sidebar, Layout)
│   ├── theme/           # Theme-related components
│   └── ui/              # Shadcn UI primitives (button, avatar, etc.)
├── pages/               # Route page components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── constants/           # Static values (strings, routes)
├── lib/                 # Utilities (axios, cn helper)
├── styles/              # Global CSS
├── assets/              # Static assets
├── App.tsx              # Root component with routing
└── main.tsx             # Entry point
```

## Design System

### Color Tokens

All colors are defined as CSS variables in `src/styles/globals.css`. Never hardcode colors.

| Category        | Variable Pattern                           | Example                                              |
| --------------- | ------------------------------------------ | ---------------------------------------------------- |
| Brand Primary   | `--brand-primary-*`                        | `--brand-primary-main`, `--brand-primary-shade-1`    |
| Brand Secondary | `--brand-secondary-*`                      | `--brand-secondary-main`                             |
| Brand Accents   | `--brand-accent01-*`, `--brand-accent02-*` | `--brand-accent01-main`                              |
| Neutral BG      | `--neutral-bg-*`                           | `--neutral-bg-base`, `--neutral-bg-surface`          |
| Neutral Text    | `--neutral-text-*`                         | `--neutral-text-primary`, `--neutral-text-secondary` |
| Neutral Border  | `--neutral-border-*`                       | `--neutral-border-main`, `--neutral-border-subtle`   |
| State           | `--state-*`                                | `--state-focus-ring`, `--state-overlay-hover`        |

**Usage in Tailwind (canonical syntax):**

```tsx
// Correct
className = "bg-(--neutral-bg-base) text-(--neutral-text-primary)";

// Incorrect - don't use var()
className = "bg-[var(--neutral-bg-base)]";
```

### Typography

- **Font**: Poppins (all weights 100-900)
- **Loading**: Deferred with `font-display: swap`

### Spacing & Sizing

| Element      | Padding     | Notes                          |
| ------------ | ----------- | ------------------------------ |
| Navbar       | `h-16 px-4` | 64px height                    |
| Sidebar      | `w-64`      | 256px width                    |
| Nav Links    | `py-3 px-4` | 12px vertical, 16px horizontal |
| Page Content | `p-6`       | 24px all sides                 |
| Button Icon  | `size-9`    | 36px                           |
| Avatar       | `size-9`    | 36px                           |

### Dark Mode

- Implemented via `.dark` class on `<html>`
- CSS variables automatically switch values
- Toggle persisted in `localStorage`

## Patterns

### 1. Component Organization

```tsx
// components/feature/FeatureName.tsx
import { ... } from "react";
import { ... } from "@/components/ui/button";
import { ... } from "@/hooks/useFeature";
import { ... } from "@/constants/strings";
import { cn } from "@/lib/utils";

export function FeatureName() {
  // hooks
  // state
  // effects
  // handlers
  // render
}
```

### 2. String Constants

Never hardcode user-facing strings. Add to `src/constants/strings.ts`:

```tsx
export const APP_STRINGS = {
  FEATURE_NAME: {
    TITLE: "Feature Title",
    DESCRIPTION: "Feature description",
    BUTTON_LABEL: "Click me",
  },
} as const;
```

### 3. Route Constants

Define routes in `src/constants/routes.ts`:

```tsx
export const ROUTES = {
  HOME: "/",
  FEATURE: "/feature",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { path: ROUTES.HOME, label: APP_STRINGS.NAV.HOME, icon: Home },
];
```

### 4. Context Pattern

```tsx
// context/FeatureContext.tsx
const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);

  // Memoize functions to prevent re-render cascades
  const action = useCallback(() => { ... }, []);

  const value = useMemo(() => ({ state, action }), [state, action]);

  return (
    <FeatureContext.Provider value={value}>
      {children}
    </FeatureContext.Provider>
  );
}
```

### 5. Custom Hook Pattern

```tsx
// hooks/useFeature.ts
export function useFeature() {
  const context = useContext(FeatureContext);

  if (context === undefined) {
    throw new Error("useFeature must be used within a FeatureProvider");
  }

  return context;
}
```

### 6. Page Component Pattern

```tsx
// pages/Feature.tsx
import { APP_STRINGS } from "@/constants/strings";

export function Feature() {
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-4xl font-bold text-(--neutral-text-primary)">
        {APP_STRINGS.PAGES.FEATURE.TITLE}
      </h1>
    </div>
  );
}
```

### 7. Adding New Routes

1. Add route constant to `src/constants/routes.ts`
2. Add strings to `src/constants/strings.ts`
3. Create page component in `src/pages/`
4. Export from `src/pages/index.ts`
5. Add route in `src/App.tsx`
6. Optionally add to `NAV_ITEMS` for sidebar

## API Integration

### Axios Instance

Use the configured instance from `src/lib/axios.ts`:

```tsx
import { apiClient } from "@/lib/axios";

const response = await apiClient.get("/endpoint");
const data = await apiClient.post("/endpoint", payload);
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## UI Components

### Shadcn Components

Located in `src/components/ui/`. Add new components via:

```bash
pnpm dlx shadcn@latest add <component-name>
```

### Button Variants

```tsx
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Icons

Use Lucide React icons:

```tsx
import { Home, Settings, Menu } from "lucide-react";

<Home className="size-5" />;
```

## Responsive Design

| Breakpoint | Class Prefix | Width     |
| ---------- | ------------ | --------- |
| Mobile     | (default)    | < 1024px  |
| Desktop    | `lg:`        | >= 1024px |

```tsx
// Mobile-first approach
className = "hidden lg:flex"; // Hidden on mobile, flex on desktop
className = "lg:hidden"; // Visible on mobile, hidden on desktop
```

## Checklist for New Features

- [ ] No hardcoded colors (use CSS variables)
- [ ] No hardcoded strings (use constants)
- [ ] Routes defined in constants
- [ ] Context functions memoized with `useCallback`
- [ ] Context values memoized with `useMemo`
- [ ] Responsive design considered
- [ ] Dark mode support verified
- [ ] Accessibility labels added (`aria-label`)
- [ ] TypeScript types defined
- [ ] Exported from index files
