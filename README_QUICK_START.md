# Quick Start Guide - Lock Screen

## 🚀 Get Started in 3 Steps

### Step 1: Configure Your Password
Edit `src/app/lock-screen/lock-screen.config.ts`:

```typescript
export const LOCK_SCREEN_CONFIG: LockScreenConfig = {
  passwordHash: 'YOUR_SHA1_HASH_HERE',  // Change this!
  expiryTime: 0,  // 0 = no expiry
  // ... other settings
};
```

**Generate SHA1 Hash:**
- Browser console: `LockScreenUtils.generateHash('your-password')`
- Or visit: https://emn178.github.io/online-tools/sha1.html

### Step 2: Run the Application
```bash
npm start
```

### Step 3: Test It
1. Open http://localhost:4200
2. You'll see the lock screen
3. Enter password: `password123` (default)
4. Click "Unlock"

## ✅ What's Already Set Up

✓ Lock screen component created  
✓ Authentication service implemented  
✓ Routes protected with guard  
✓ LocalStorage session management  
✓ Password hashing (SHA1)  
✓ Configurable expiry time  

## 🎯 Common Tasks

### Change Password
1. Generate hash: `LockScreenUtils.generateHash('newpassword')`
2. Copy the hash
3. Update `passwordHash` in `lock-screen.config.ts`
4. Restart app

### Set Session Expiry
In `lock-screen.config.ts`:
```typescript
expiryTime: 3600000,  // 1 hour
// or
expiryTime: 86400000,  // 24 hours
```

### Clear Session (Force Re-auth)
Open browser console:
```javascript
LockScreenUtils.clearAuth()
```

### Protect More Routes
In `app.routes.ts`:
```typescript
{
  path: 'my-route',
  component: MyComponent,
  canActivate: [lockGuard]  // Add this
}
```

### Customize UI Messages
In `lock-screen.config.ts`:
```typescript
ui: {
  title: 'Your Custom Title',
  message: 'Your custom message',
  // ... other UI settings
}
```

## 🧪 Testing Tools (Browser Console)

```javascript
// Generate password hash
LockScreenUtils.generateHash('mypassword')

// Check current session
LockScreenUtils.getStoredAuth()

// Clear session
LockScreenUtils.clearAuth()

// Test expiry (make session look 10 seconds old)
LockScreenUtils.testExpiry(10000)

// Get common password hashes
LockScreenUtils.getCommonHashes()
```

## 🔐 Security Notes

⚠️ **This is client-side authentication only!**

✅ **Good for:**
- Demos and prototypes
- Local development
- Basic UI protection
- Educational purposes

❌ **Not suitable for:**
- Production security
- Protecting sensitive data
- Replacing server-side auth

## 📖 More Information

See `LOCK_SCREEN_README.md` for complete documentation.

## 🐛 Troubleshooting

**Lock screen doesn't appear?**
- Check routes have `canActivate: [lockGuard]`
- Verify browser console for errors

**Password not working?**
- Verify SHA1 hash is correct
- Try `LockScreenUtils.generateHash('password123')`
- Clear localStorage and try again

**Session expires too quickly?**
- Check `expiryTime` in config
- Set to `0` for no expiry

## 📝 Default Configuration

- **Password:** `password123`
- **Hash:** `cbfdac6008f9cab4083784cbd1874f76618d2a97`
- **Expiry:** No expiry (0)
- **Storage Key:** `angular_lock_auth`

**Remember to change the default password!**
