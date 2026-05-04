# HomePay - Capacitor Mobile App

## Stack
- React 18 + TypeScript + Vite
- Capacitor 8 for iOS/Android native wrappers
- React Router v6 for navigation
- Context API for state management (7 providers)
- localStorage for persistence (no backend)
- vite-plugin-pwa for PWA support (service worker + manifest)

## Build Commands
```bash
npm run dev                # Dev server with HMR
npm run build              # Compile web app (TypeScript + Vite + PWA)
npm run preview            # Preview production build locally
npx cap copy ios           # Sync web build to iOS
npx cap copy android       # Sync web build to Android
npx cap open ios           # Open iOS project in Xcode
npx cap open android       # Open Android project in Android Studio
```

## PWA Support
The app is fully installable as a PWA. After `npm run build`, the `dist/` folder contains:
- `manifest.webmanifest` — app metadata, icons, theme color
- `sw.js` + `workbox-*.js` — service worker for offline caching
- `registerSW.js` — auto-registers the service worker

### Deploy
Upload `dist/` to any static host (Vercel, Netlify, GitHub Pages). Users can "Add to Home Screen" on both iOS and Android.

### Platform Detection
`src/utils/platform.ts` provides:
- `isNativePlatform()` — returns `true` on iOS/Android native (Capacitor WebView)
- `isWebPlatform()` — returns `true` in browser/PWA

Used to conditionally enable/disable native-only features (notifications).

## Notification Behavior
| Platform | LocalNotifications | Reminder UI |
|---|---|---|
| **iOS/Android native** | Full support via `@capacitor/local-notifications` | Works normally |
| **Web/PWA** | Disabled (`permissionStatus: "unavailable"`) | Reminders save to localStorage but no native alerts. UI shows warning banners |

In `useNotifications.tsx`, all notification methods return immediately on web without attempting to import `LocalNotifications`. Settings and reminder pages display informative banners when `isWeb === true`.

## Service Payment Flow
A service has **4 visual states** in `ServiceCard`:

| Status | CSS Class | Color | Condition |
|---|---|---|---|
| **Pendiente** | `status-pending` | Orange (#FF9800) | `!isPaid` and not overdue |
| **Atrasado** | `status-overdue` | Red (#F44336) | `!isPaid` and `isOverdue(dueDate)` |
| **Pagado** | `status-paid` | Green (#4CAF50) | `isPaid` and no `nextDueDate` (one-time payment) |
| **Al corriente · Próximo: [fecha]** | `status-al-corriente` | Blue (#2196F3) | `isPaid` and `nextDueDate` exists (recurring, paid this cycle) |

### Recurring Services
When a recurring service (mensual/bimestral/trimestral) is marked as paid:
1. `isPaid` is set to `true`
2. `paidBy` and `paidDate` are recorded
3. `nextDueDate` is calculated (current `dueDate` + recurrence interval)
4. The card shows **"Al corriente"** with the next due date
5. A `Payment` record is created in the payments history

### Auto-Reset on App Load
In `useServicesCtx.tsx`, `autoResetRecurring()` runs on mount:
- Checks all services with `recurrence && isPaid && nextDueDate`
- If `nextDueDate < today`, the service resets to:
  - `dueDate = nextDueDate`
  - `isPaid = false`
  - `paidBy`, `paidDate`, `nextDueDate` cleared
- This means the service becomes "Pendiente" for the new cycle automatically

### Payment Without Members
`paidBy` is optional. If no member is selected, defaults to `"Yo"`. The payment form can be completed without adding members first.

## App Structure
```
src/
  pages/           # Route-level page components (10 pages)
  components/      # Shared UI components (Header, BottomTabs, ServiceCard, etc.)
  hooks/           # Context providers + custom hooks (7 providers)
  models/          # TypeScript interfaces (Service, Payment, Reminder, Member, etc.)
  utils/           # Helpers (formatCurrency, formatDate, isNativePlatform, etc.)
  data/            # Seed data and localStorage key constants
```

## State Management
7 Context providers wrap the app in `App.tsx` (outer to inner):
1. `SettingsProvider` — theme, notifications, currency
2. `ServicesProvider` — services CRUD, markAsPaid, autoResetRecurring
3. `PaymentsProvider` — payment history, getPaymentsByMonth
4. `MembersProvider` — household members CRUD
5. `RemindersProvider` — reminders CRUD, toggle
6. `NotificationsProvider` — native notification scheduling (web-aware)
7. `ToastProvider` — in-app toast messages

Data persists to `localStorage` on every mutation.

### Storage Keys
- `homepay_services`
- `homepay_payments`
- `homepay_members`
- `homepay_reminders`
- `homepay_settings`
- `homepay_initialized`

## Routes
| Path | Page | Description |
|---|---|---|
| `/` | `HomePage` | Dashboard with summary, filter chips, service list |
| `/add-service` | `AddServicePage` | Create new service |
| `/service/:id` | `ServiceDetailPage` | Service detail, mark as paid, delete |
| `/history` | `HistoryPage` | Payment history by month |
| `/stats` | `StatsPage` | Monthly statistics with bar chart |
| `/settings` | `SettingsPage` | General settings, notifications, theme |
| `/reminders` | `RemindersPage` | Reminder list with toggles |
| `/add-reminder` | `AddReminderPage` | Create reminder |
| `/edit-reminder/:id` | `EditReminderPage` | Edit reminder |
| `/members` | `MembersPage` | Manage household members |

## ServiceDetailPage Data Source
Uses `useParams().id` to look up the service from `useServicesCtx().services` (reactive context data), NOT from `location.state`. This ensures the detail page always shows the latest state after any update.

## Important: Icon Update Workflow

### Android Icons
1. Generate icons: `python3 scripts/generate-android-icons.py`
2. Copy to Android res: `cp -r android_icons/* android/app/src/main/res/`
3. The adaptive icon XML at `mipmap-anydpi-v26/ic_launcher.xml` uses:
   - Background: `@color/ic_launcher_background` (defined in `values/ic_launcher_background.xml`)
   - Foreground: `@mipmap/ic_launcher_foreground`
4. Delete any `drawable/` or `drawable-v24/` icon files that may override mipmaps
5. Clean and rebuild in Android Studio

### iOS Icons
- Icons go in `ios_icons/AppIcon.appiconset/`
- Update via Xcode: drag AppIcon.appiconset into Xcode project navigator

### PWA Icons
- `public/pwa-192x192.png` — generated from `public/icons/AppIcon-1024.png`
- `public/pwa-512x512.png` — generated from `public/icons/AppIcon-1024.png`
- Referenced in `vite.config.ts` VitePWA manifest config

## Key Constraints
- No server/backend — all data stored in localStorage
- Notifications via `@capacitor/local-notifications` with `scheduleMode: 'exact'`
- Notifications are native-only; web shows graceful degradation with banners
- App icon: house shape with `$` sign on blue (#2196F3) background
- Android adaptive icons require proper safe zone centering (66dp within 108dp canvas)
- `Service.nextDueDate` field added for recurring payment tracking
- `NotificationPermissionStatus` includes `"unavailable"` for web platform
- `paidBy` defaults to `"Yo"` when no member is selected
