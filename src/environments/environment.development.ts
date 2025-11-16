/**
 * Environment Configuration for Lock Screen
 * 
 * This file provides environment-specific configuration that can be
 * set during build time using environment variables or GitHub secrets.
 * 
 * HOW TO USE WITH GITHUB SECRETS:
 * 
 * 1. Add PASSWORD_HASH to your GitHub repository secrets:
 *    - Go to: Settings > Secrets and variables > Actions
 *    - Click "New repository secret"
 *    - Name: PASSWORD_HASH
 *    - Value: Your SHA1 hash (e.g., cbfdac6008f9cab4083784cbd1874f76618d2a97)
 * 
 * 2. In your GitHub Actions workflow (.github/workflows/build.yml):
 *    ```yaml
 *    - name: Build
 *      env:
 *        PASSWORD_HASH: ${{ secrets.PASSWORD_HASH }}
 *      run: npm run build
 *    ```
 * 
 * 3. For file replacement during build (Angular way):
 *    - Create environment.prod.ts with PASSWORD_HASH
 *    - Use Angular's fileReplacements in angular.json
 * 
 * ALTERNATIVE: Runtime Configuration
 * You can also inject the hash at runtime by setting window.__env:
 * 
 * In your index.html before scripts load:
 * ```html
 * <script>
 *   window.__env = {
 *     PASSWORD_HASH: 'your-hash-here'
 *   };
 * </script>
 * ```
 */

export const environment = {
  production: false,
  passwordHash: undefined as string | undefined, // Will be set by Angular environment replacement
};
