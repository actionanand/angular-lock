# Lock Screen System Architecture

## Component Hierarchy

```
App Component (app.ts)
├── Lock Screen Component (conditional)
│   ├── Password Input Form
│   ├── Error Messages
│   └── Unlock Button
└── Router Outlet
    ├── Home Page (protected by lockGuard)
    ├── About Page (protected by lockGuard)
    └── Other Routes (protected by lockGuard)
```

## Data Flow

```
User Navigation
    ↓
lockGuard (Route Guard)
    ↓
LockScreenService.checkAuthentication()
    ↓
Check localStorage
    ↓
┌─────────────────────────────┐
│ Is authenticated?           │
├─────────────────────────────┤
│ YES → Allow navigation      │
│ NO → Show lock screen       │
└─────────────────────────────┘
    ↓
Lock Screen Component
    ↓
User enters password
    ↓
LockScreenService.validatePassword()
    ↓
Generate SHA1 hash
    ↓
Compare with config hash
    ↓
┌─────────────────────────────┐
│ Match?                      │
├─────────────────────────────┤
│ YES → Save to localStorage  │
│     → Hide lock screen      │
│     → Allow access          │
│                             │
│ NO → Show error message     │
│    → Stay on lock screen    │
└─────────────────────────────┘
```

## File Dependencies

```
main.ts
└── imports lock-screen.utils.ts (for browser console)

app.ts
├── imports LockScreenComponent
├── imports LockScreenService
└── renders lock screen conditionally

app.routes.ts
└── imports lockGuard

lock.guard.ts
└── uses LockScreenService

lock-screen.component.ts
├── uses LockScreenService
└── uses lock-screen.config.ts

lock-screen.service.ts
└── uses lock-screen.config.ts

index.ts (Public API)
├── exports LockScreenComponent
├── exports LockScreenService
├── exports lockGuard
├── exports LOCK_SCREEN_CONFIG
└── exports LockScreenUtils
```

## State Management

```
LockScreenService (Singleton)
├── isAuthenticated: Signal<boolean>
│   └── Read-only signal tracking auth state
│
├── showLockScreen: Signal<boolean>
│   └── Read-only signal controlling lock screen visibility
│
└── Methods:
    ├── checkAuthentication(): boolean
    ├── validatePassword(password): Promise<boolean>
    ├── showLock(): void
    ├── hideLock(): void
    ├── lock(): void
    └── getConfig(): LockScreenConfig
```

## LocalStorage Structure

```json
{
  "angular_lock_auth": {
    "passwordHash": "cbfdac6008f9cab4083784cbd1874f76618d2a97",
    "timestamp": 1700000000000
  }
}
```

## Configuration Interface

```typescript
interface LockScreenConfig {
  passwordHash: string;      // SHA1 hash of password
  expiryTime: number;        // Milliseconds (0 = no expiry)
  storageKey: string;        // localStorage key name
  ui: {
    title: string;
    message: string;
    successMessage: string;
    errorMessage: string;
    unlockButtonText: string;
    passwordPlaceholder: string;
  };
}
```

## Authentication Decision Tree

```
Start: User navigates to route
    ↓
Check localStorage for auth data
    ↓
┌─────────────────────────────────┐
│ Auth data exists?               │
├─────────────────────────────────┤
│ NO → Show lock screen           │
│                                 │
│ YES ↓                           │
└─────────────────────────────────┘
    ↓
Password hash matches config?
    ↓
┌─────────────────────────────────┐
│ NO → Clear storage              │
│    → Show lock screen           │
│                                 │
│ YES ↓                           │
└─────────────────────────────────┘
    ↓
Expiry time set (> 0)?
    ↓
┌─────────────────────────────────┐
│ NO → Grant access               │
│                                 │
│ YES ↓                           │
└─────────────────────────────────┘
    ↓
Session expired?
    ↓
┌─────────────────────────────────┐
│ YES → Clear storage             │
│     → Show lock screen          │
│                                 │
│ NO → Grant access               │
└─────────────────────────────────┘
```

## Password Validation Flow

```
User enters password
    ↓
Convert to UTF-8 bytes
    ↓
Generate SHA-1 hash
(using Web Crypto API)
    ↓
Convert to hex string
    ↓
Compare with config.passwordHash
    ↓
┌─────────────────────────────────┐
│ Match?                          │
├─────────────────────────────────┤
│ YES → Create auth object        │
│     → {                         │
│         passwordHash: hash,     │
│         timestamp: Date.now()   │
│       }                         │
│     → Save to localStorage      │
│     → Set isAuthenticated = true│
│     → Hide lock screen          │
│                                 │
│ NO → Set error message          │
│    → Clear password input       │
│    → Stay on lock screen        │
└─────────────────────────────────┘
```

## Session Lifecycle

```
1. Initial Load
   ├── App starts
   ├── LockScreenService initializes
   ├── checkAuthentication() called
   └── Lock screen shown if not authenticated

2. Authentication
   ├── User enters password
   ├── Password validated
   ├── Session saved to localStorage
   └── isAuthenticated set to true

3. Navigation
   ├── User navigates to route
   ├── lockGuard checks authentication
   └── Access granted or denied

4. Page Reload
   ├── App restarts
   ├── checkAuthentication() reads localStorage
   ├── Validates password hash
   ├── Checks expiry
   └── Grants or denies access

5. Session Expiry (if configured)
   ├── Time elapsed > expiryTime
   ├── localStorage cleared
   ├── isAuthenticated set to false
   └── Lock screen shown

6. Password Change
   ├── Config updated with new hash
   ├── checkAuthentication() detects mismatch
   ├── localStorage cleared
   ├── isAuthenticated set to false
   └── Lock screen shown
```

## Error Handling

```
Password Validation
├── Empty password → "Password is required"
├── Wrong password → Config error message
└── Network/crypto error → Caught and logged

LocalStorage
├── Storage disabled → Caught, returns null
├── Quota exceeded → Caught and logged
└── Invalid JSON → Caught, returns null

Route Guard
├── Not authenticated → Returns false, shows lock
└── Authenticated → Returns true, allows access
```

## Browser Console Utilities

```
LockScreenUtils (Global Object)
├── generateHash(password)
│   └── Returns SHA1 hash of password
│
├── clearAuth(storageKey?)
│   └── Clears localStorage auth data
│
├── getStoredAuth(storageKey?)
│   └── Displays current auth data
│
├── setAuth(hash, storageKey?)
│   └── Manually set auth (for testing)
│
├── testExpiry(ageMs, storageKey?)
│   └── Backdate timestamp to test expiry
│
├── getCommonHashes()
│   └── Generate hashes for common passwords
│
└── checkSessionValidity(expiryMs, storageKey?)
    └── Check if session would be valid
```

## Key Design Decisions

1. **Client-Side Only**
   - Simple implementation
   - No server required
   - LocalStorage persistence

2. **SHA1 Hashing**
   - Web Crypto API (native)
   - No external dependencies
   - Sufficient for client-side validation

3. **Signal-Based State**
   - Angular modern patterns
   - Reactive updates
   - Clean, predictable state

4. **Route Guard Pattern**
   - Standard Angular security
   - Declarative protection
   - Easy to apply to routes

5. **Standalone Components**
   - Angular best practices
   - No NgModules needed
   - Better tree-shaking

6. **Configurable via File**
   - Single source of truth
   - Type-safe configuration
   - Easy to customize
