# Logger System

A pluggable logging system that can be enabled/disabled via localStorage. By default, all console logs are disabled.

## Features

- ✅ **Disabled by default** - All logs are off unless explicitly enabled
- ✅ **LocalStorage control** - Enable/disable via `localStorage['enableLog']`
- ✅ **Multiple log levels** - log, warn, error, info, debug
- ✅ **Advanced features** - table, time, group
- ✅ **Browser console utilities** - Easy enable/disable from console
- ✅ **Pluggable** - Easily injected into any component/service

## Quick Start

### Enable Logging (Browser Console)

```javascript
// Option 1: Enable and auto-reload
LoggerUtils.enableAndReload()

// Option 2: Enable manually
LoggerUtils.enable()
location.reload()

// Option 3: Set localStorage directly
localStorage.setItem('enableLog', 'ON')
location.reload()
```

### Disable Logging (Browser Console)

```javascript
// Option 1: Disable and auto-reload
LoggerUtils.disableAndReload()

// Option 2: Disable manually
LoggerUtils.disable()
location.reload()

// Option 3: Remove from localStorage
localStorage.removeItem('enableLog')
location.reload()
```

### Check Status

```javascript
LoggerUtils.status()
```

### Get Help

```javascript
LoggerUtils.help()
```

## Usage in Components/Services

### Basic Usage

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { LoggerService } from './logger/logger.service';

@Component({
  selector: 'app-example',
  template: `<h1>Example</h1>`
})
export class ExampleComponent implements OnInit {
  private logger = inject(LoggerService);

  ngOnInit() {
    // These will only log if enableLog = 'ON'
    this.logger.log('Component initialized');
    this.logger.info('Some info message');
    this.logger.warn('Warning message');
    this.logger.error('Error message');
  }

  someMethod() {
    this.logger.log('Method called', { data: 'example' });
  }
}
```

### Advanced Usage

```typescript
export class AdvancedComponent {
  private logger = inject(LoggerService);

  demonstrateFeatures() {
    // Regular logging
    this.logger.log('Simple log');
    this.logger.debug('Debug info', { userId: 123 });

    // Table output
    const users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ];
    this.logger.table(users);

    // Performance timing
    this.logger.time('operation');
    // ... do something
    this.logger.timeEnd('operation');

    // Grouped logs
    this.logger.group('User Details');
    this.logger.log('Name:', 'John');
    this.logger.log('Age:', 30);
    this.logger.groupEnd();

    // Collapsed group
    this.logger.groupCollapsed('Technical Details');
    this.logger.log('Version:', '1.0.0');
    this.logger.log('Build:', 'production');
    this.logger.groupEnd();
  }

  // Check if logging is enabled
  checkStatus() {
    if (this.logger.isLoggingEnabled()) {
      this.logger.log('Logging is active');
    }
  }

  // Programmatically enable/disable
  enableLogs() {
    this.logger.enableLogging();
  }

  disableLogs() {
    this.logger.disableLogging();
  }
}
```

## Configuration

The logger can be configured in `src/app/logger/logger.config.ts`:

```typescript
export const LOGGER_CONFIG: LoggerConfig = {
  // LocalStorage key to check
  storageKey: 'enableLog',
  
  // Value that enables logging (must match exactly)
  enableValue: 'ON',
  
  // Prefix for all log messages
  logPrefix: '[App]'
};
```

### Customize Settings

```typescript
// Change the storage key
storageKey: 'myAppDebug',

// Change the enable value
enableValue: 'ENABLED',

// Change the log prefix
logPrefix: '[MyApp]',
```

## How It Works

### Initialization

1. `LoggerService` is created as a singleton (`providedIn: 'root'`)
2. On initialization, it checks `localStorage[storageKey]`
3. If value equals `enableValue` ('ON'), logging is enabled
4. Otherwise, logging is disabled

### Runtime Check

Every log method checks `this.isEnabled` before calling `console.*`:

```typescript
log(...args: unknown[]): void {
  if (this.isEnabled) {
    console.log(this.config.logPrefix, ...args);
  }
}
```

This means zero console output when disabled!

### LocalStorage Structure

```javascript
{
  "enableLog": "ON"  // Logging enabled
}

// Or
{
  "enableLog": "OFF" // Logging disabled
}

// Or
{
  // No 'enableLog' key - Logging disabled
}
```

## Available Methods

### LoggerService Methods

| Method | Description | Example |
|--------|-------------|---------|
| `log(...args)` | Standard console.log | `logger.log('Message', data)` |
| `warn(...args)` | Warning message | `logger.warn('Warning!')` |
| `error(...args)` | Error message | `logger.error('Error!', err)` |
| `info(...args)` | Info message | `logger.info('Info')` |
| `debug(...args)` | Debug message | `logger.debug('Debug', obj)` |
| `table(data)` | Table output | `logger.table(users)` |
| `time(label)` | Start timer | `logger.time('fetch')` |
| `timeEnd(label)` | End timer | `logger.timeEnd('fetch')` |
| `group(label)` | Start group | `logger.group('Details')` |
| `groupCollapsed(label)` | Start collapsed group | `logger.groupCollapsed('Data')` |
| `groupEnd()` | End group | `logger.groupEnd()` |
| `isLoggingEnabled()` | Check if enabled | `logger.isLoggingEnabled()` |
| `enableLogging()` | Enable programmatically | `logger.enableLogging()` |
| `disableLogging()` | Disable programmatically | `logger.disableLogging()` |

### LoggerUtils Methods (Browser Console)

| Method | Description |
|--------|-------------|
| `LoggerUtils.enable()` | Enable logging |
| `LoggerUtils.disable()` | Disable logging |
| `LoggerUtils.status()` | Check current status |
| `LoggerUtils.toggle()` | Toggle on/off |
| `LoggerUtils.enableAndReload()` | Enable and reload page |
| `LoggerUtils.disableAndReload()` | Disable and reload page |
| `LoggerUtils.help()` | Show help message |

## File Structure

```
src/app/logger/
├── logger.config.ts       # Configuration
├── logger.service.ts      # Main service
├── logger.utils.ts        # Browser console utilities
└── index.ts              # Public API exports
```

## Integration

### In App Component

Already integrated in `src/app/app.ts`:

```typescript
export class App implements OnInit {
  private readonly logger = inject(LoggerService);

  ngOnInit(): void {
    this.logger.log('Application initialized');
    this.logger.info('Logging status:', 
      this.logger.isLoggingEnabled() ? 'ENABLED' : 'DISABLED');
  }
}
```

### In Other Components

Simply inject the `LoggerService`:

```typescript
import { inject } from '@angular/core';
import { LoggerService } from './logger/logger.service';

export class MyComponent {
  private logger = inject(LoggerService);

  doSomething() {
    this.logger.log('Doing something...');
  }
}
```

## Best Practices

### 1. Use Throughout Development

```typescript
ngOnInit() {
  this.logger.log('Component initialized');
  
  this.logger.time('data-load');
  this.loadData().subscribe(data => {
    this.logger.timeEnd('data-load');
    this.logger.log('Data loaded:', data);
  });
}
```

### 2. Group Related Logs

```typescript
processUser(user: User) {
  this.logger.group(`Processing User: ${user.id}`);
  this.logger.log('Name:', user.name);
  this.logger.log('Email:', user.email);
  this.logger.log('Roles:', user.roles);
  this.logger.groupEnd();
}
```

### 3. Use Appropriate Log Levels

```typescript
// Info for general information
this.logger.info('User logged in:', userId);

// Warn for non-critical issues
this.logger.warn('API deprecated, use new endpoint');

// Error for actual errors
this.logger.error('Failed to save:', error);

// Debug for detailed debugging
this.logger.debug('State before update:', this.state);
```

### 4. Conditional Logging

```typescript
// You can still check manually if needed
if (this.logger.isLoggingEnabled()) {
  // Expensive operation only when logging
  const debugData = this.computeExpensiveDebugInfo();
  this.logger.log('Debug data:', debugData);
}
```

## Production Usage

### Disable in Production

By default, logging is disabled. Users must explicitly enable it via localStorage.

This means:
- ✅ No logs in production by default
- ✅ Support/debugging can enable logs if needed
- ✅ No performance impact when disabled

### Enable for Debugging Production Issues

If a user reports an issue:

1. Ask them to open browser console
2. Run: `LoggerUtils.enableAndReload()`
3. Reproduce the issue
4. Check console logs
5. Run: `LoggerUtils.disableAndReload()`

## Security Considerations

- ✅ Logs are disabled by default
- ✅ No sensitive data logged (your responsibility)
- ✅ LocalStorage check is fail-safe (defaults to disabled)
- ⚠️ Don't log passwords, tokens, or sensitive user data

## Examples

### Example 1: API Calls

```typescript
fetchUsers() {
  this.logger.log('Fetching users...');
  this.logger.time('users-fetch');
  
  this.http.get<User[]>('/api/users').subscribe({
    next: (users) => {
      this.logger.timeEnd('users-fetch');
      this.logger.log('Users fetched:', users.length);
      this.logger.table(users);
    },
    error: (error) => {
      this.logger.error('Failed to fetch users:', error);
    }
  });
}
```

### Example 2: Form Validation

```typescript
onSubmit(form: FormGroup) {
  this.logger.group('Form Submission');
  this.logger.log('Form valid:', form.valid);
  this.logger.log('Form value:', form.value);
  this.logger.log('Form errors:', form.errors);
  this.logger.groupEnd();
  
  if (form.valid) {
    this.logger.info('Submitting form...');
    this.submitForm(form.value);
  } else {
    this.logger.warn('Form is invalid');
  }
}
```

### Example 3: Authentication Flow

```typescript
login(credentials: Credentials) {
  this.logger.group('Login Flow');
  this.logger.log('Starting login...');
  
  this.authService.login(credentials).subscribe({
    next: (response) => {
      this.logger.info('Login successful');
      this.logger.log('User:', response.user);
      // Don't log tokens!
      this.logger.groupEnd();
    },
    error: (error) => {
      this.logger.error('Login failed:', error);
      this.logger.groupEnd();
    }
  });
}
```

## Troubleshooting

### Logs not appearing?

1. Check localStorage: `LoggerUtils.status()`
2. Ensure value is exactly 'ON'
3. Refresh the page after enabling
4. Check browser console for errors

### Want to use different key/value?

Edit `src/app/logger/logger.config.ts`:

```typescript
export const LOGGER_CONFIG: LoggerConfig = {
  storageKey: 'yourKey',
  enableValue: 'yourValue',
  logPrefix: '[YourApp]'
};
```

### LoggerUtils not available in console?

Make sure you refreshed the page after the app loaded.

---

## Summary

The logger system provides a clean, pluggable way to control console logging in your Angular application:

- **Disabled by default** - No logs unless explicitly enabled
- **Easy control** - Enable/disable via localStorage or browser console
- **Full featured** - Supports all console methods
- **Zero overhead** - No performance impact when disabled
- **Developer friendly** - Easy utilities for quick enable/disable

**To enable logs:**
```javascript
LoggerUtils.enableAndReload()
```

**To disable logs:**
```javascript
LoggerUtils.disableAndReload()
```
