# HomePay - Capacitor Mobile App

## Stack
- React 18 + TypeScript + Vite
- Capacitor 8 for iOS/Android native wrappers
- React Router v6 for navigation
- Context API for state management
- localStorage for persistence (no backend)

## Build Commands
```bash
npm run build              # Compile web app (TypeScript + Vite)
npx cap copy ios           # Sync to iOS
npx cap copy android       # Sync to Android
npx cap open ios           # Open iOS project in Xcode
npx cap open android       # Open Android project in Android Studio
```

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

## App Structure
```
src/
  pages/         # Route-level page components
  components/    # Shared UI components
  hooks/         # Custom hooks (useServices, usePayments, etc.)
  context/       # Context providers for global state
  models/         # TypeScript interfaces
  utils/          # Helpers (formatCurrency, formatDate, etc.)
  data/          # Static data or initial state
```

## State Management
Context providers (ServicesContext, PaymentsContext, MembersContext, RemindersContext, SettingsContext, NotificationsContext, ToastContext) wrap the app in App.tsx. Data persists to localStorage on every change.

## Key Constraints
- No server/backend - all data stored in localStorage
- Notifications via @capacitor/local-notifications with `scheduleMode: 'exact'`
- App icon: house shape with `$` sign on blue (#2196F3) background
- Android adaptive icons require proper safe zone centering (66dp within 108dp canvas)