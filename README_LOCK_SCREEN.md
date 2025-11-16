# Lock Screen System

A comprehensive lock screen authentication system for Angular applications.

## Features

- 🔒 Password-protected application access
- 🔐 SHA1 password hashing for client-side validation
- ⏱️ Configurable session expiry
- 💾 LocalStorage-based session persistence
- 🎨 Beautiful, responsive UI
- 🛡️ Route protection via Angular guards
- ⚙️ Fully configurable via config file

## Configuration

Edit `src/app/lock-screen/lock-screen.config.ts` to customize:

```typescript
export const LOCK_SCREEN_CONFIG: LockScreenConfig = {
  // SHA1 hash of your password
  passwordHash: 'cbfdac6008f9cab4083784cbd1874f76618d2a97', // Default: 'password123'
  
  // Session expiry in milliseconds (0 = no expiry)
  expiryTime: 0, // Examples: 3600000 (1 hour), 86400000 (24 hours)
  
  // LocalStorage key
  storageKey: 'angular_lock_auth',
  
  // UI Configuration
  ui: {
    title: 'Locked Screen',
    message: 'Please enter your password to unlock the application',
    successMessage: 'Access granted!',
    errorMessage: 'Invalid password. Please try again.',
    unlockButtonText: 'Unlock',
    passwordPlaceholder: 'Enter password'
  }
};
```

## Generating Password Hash

To generate a SHA1 hash for your password:

1. Visit: https://emn178.github.io/online-tools/sha1.html
2. Enter your desired password
3. Copy the generated hash
4. Update `passwordHash` in the config file

Or use the browser console:
```javascript
async function sha1(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Usage
sha1('your-password').then(console.log);
```

## How It Works

### 1. Authentication Flow
- User attempts to access protected route
- `lockGuard` checks authentication status
- If not authenticated, lock screen is shown
- User enters password
- Password is hashed and compared with stored hash
- On success, session is saved to localStorage
- Routes become accessible

### 2. Session Management
- Authenticated session stored in localStorage
- Each session includes:
  - Password hash
  - Timestamp
- On app reload, session is validated:
  - Check if password hash matches current config
  - Check if session hasn't expired (if expiry is set)
  - If validation fails, lock screen is shown again

### 3. Password Change Detection
- If `passwordHash` in config is updated
- Existing localStorage sessions are invalidated
- Users must re-authenticate with new password

## Usage

### Protecting Routes

Routes are protected by adding `canActivate: [lockGuard]` to route configuration:

```typescript
import { lockGuard } from './lock-screen/lock.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: Home, 
    canActivate: [lockGuard] // Protected route
  },
  { 
    path: 'about', 
    loadComponent: () => import('./pages/about/about').then(m => m.About),
    canActivate: [lockGuard] // Protected route
  }
];
```

### Programmatic Control

You can control the lock screen programmatically via `LockScreenService`:

```typescript
import { inject } from '@angular/core';
import { LockScreenService } from './lock-screen/lock-screen.service';

export class MyComponent {
  private lockService = inject(LockScreenService);

  // Check if authenticated
  isAuthenticated = this.lockService.isAuthenticated;

  // Manually lock the application
  lockApp() {
    this.lockService.lock();
  }

  // Check authentication status
  checkAuth() {
    return this.lockService.checkAuthentication();
  }

  // Show lock screen
  showLock() {
    this.lockService.showLock();
  }
}
```

## Default Password

The default password is: **`password123`**

**⚠️ Important:** Change this in production by:
1. Generating a new SHA1 hash for your password
2. Updating `passwordHash` in `lock-screen.config.ts`

## Session Expiry Examples

```typescript
// No expiry (default)
expiryTime: 0

// 30 minutes
expiryTime: 30 * 60 * 1000

// 1 hour
expiryTime: 3600000

// 24 hours
expiryTime: 86400000

// 7 days
expiryTime: 7 * 24 * 60 * 60 * 1000
```

## Security Notes

⚠️ **Client-Side Only**: This is a client-side lock screen for basic protection. It should NOT be used for securing sensitive data or production applications without proper server-side authentication.

✅ **Best Practices**:
- Use this for demos, prototypes, or local development
- Combine with server-side authentication for production
- Don't store sensitive data in localStorage
- Consider using environment variables for configuration in production

## File Structure

```
src/app/lock-screen/
├── lock-screen.config.ts       # Configuration file
├── lock-screen.service.ts      # Authentication logic & storage
├── lock-screen.component.ts    # Lock screen UI component
├── lock-screen.component.html  # Template
├── lock-screen.component.scss  # Styles
└── lock.guard.ts              # Route guard
```

## Customization

### Styling
Edit `lock-screen.component.scss` to customize appearance:
- Colors
- Animations
- Layouts
- Responsive breakpoints

### Messages
Update UI messages in `lock-screen.config.ts` under the `ui` object.

### Storage
Change `storageKey` in config to use a different localStorage key.

## Testing

Default test password: `password123`

To test:
1. Start the application
2. You'll see the lock screen
3. Enter: `password123`
4. Click "Unlock"
5. Application will be accessible

To test expiry:
1. Set `expiryTime: 10000` (10 seconds)
2. Unlock the app
3. Wait 10 seconds
4. Navigate to another route
5. Lock screen should appear again

## Troubleshooting

### Lock screen doesn't appear
- Check that routes have `canActivate: [lockGuard]`
- Verify `LockScreenComponent` is imported in `App`
- Check browser console for errors

### Password not working
- Verify the SHA1 hash is correct
- Check for typos in the password
- Clear localStorage and try again

### Session not persisting
- Check browser localStorage is enabled
- Verify `storageKey` in config
- Check browser console for storage errors

## FAQ

### Q: Will the lock screen block routes if I don't add any guards?

**A: No.** If you don't add `canActivate: [lockGuard]` to any routes, the lock screen will never appear. Routes are only protected when you explicitly add the guard.

**To block all access without adding guards to each route:**

The lock screen system is designed to work with Angular's routing system, so you need to use guards. However, if you want to block the entire app without configuring individual routes, you can:

**Option 1: Add guard to root/parent routes**

```typescript
export const routes: Routes = [
  {
    path: '',
    canActivate: [lockGuard],  // Applies to all children
    children: [
      { path: '', component: Home },
      { path: 'about', component: About },
      { path: 'settings', component: Settings }
    ]
  }
];
```

**Option 2: Show lock screen on app init (without routing)**

If you have no routes or want to lock regardless of routing:

```typescript
// app.ts
export class App implements OnInit {
  private readonly lockService = inject(LockScreenService);
  protected readonly showLockScreen = this.lockService.showLockScreen;

  ngOnInit() {
    // Always check on init
    const isAuth = this.lockService.checkAuthentication();
    if (!isAuth) {
      this.lockService.showLock();
    }
  }
}
```

Then the lock screen will appear immediately when app loads, even without route navigation.

### Q: How do I generate a SHA1 hash?

**Option 1 - Browser Console:**
```javascript
LockScreenUtils.generateHash('your-password')
```

**Option 2 - Online Tool:**
https://emn178.github.io/online-tools/sha1.html

**Option 3 - Command Line:**
```bash
echo -n "your-password" | shasum -a 1
```

**Option 4 - Node.js:**
```javascript
const crypto = require('crypto');
const hash = crypto.createHash('sha1').update('your-password').digest('hex');
console.log(hash);
```

### Q: Can I use a different hashing algorithm?

Yes! You can modify `lock-screen.service.ts` to use SHA256, bcrypt, or any other algorithm. Just update the `sha1()` method:

```typescript
// Example: SHA256
private async sha256(str: string): Promise<string> {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

## Browser Compatibility

Uses modern Web APIs:
- Web Crypto API (for SHA1 hashing)
- LocalStorage API
- ES2020+ JavaScript features

Supported browsers:
- Chrome 37+
- Firefox 34+
- Safari 11+
- Edge 79+
