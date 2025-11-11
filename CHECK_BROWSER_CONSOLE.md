# Check Browser Console for Env Vars

## Quick Steps

1. **Open Browser Console**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Press `Cmd+Option+I` (Mac)

2. **Look for Debug Logs**
   Search console for:
   ```
   === SUPABASE DEBUG ===
   ```

3. **Check What You See**

   ### ✅ GOOD (Configured):
   ```
   === SUPABASE DEBUG ===
   URL: https://abcdefgh.supabase.co
   Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Configured: true
   ```

   ### ❌ BAD (Not Configured):
   ```
   === SUPABASE DEBUG ===
   URL: https://placeholder.supabase.co
   Key: placeholder-key
   Configured: false
   ```
   OR
   ```
   === SUPABASE DEBUG ===
   URL: 
   Key: 
   Configured: false
   ```

## If You See Placeholder or Empty Values

Your environment variables are NOT loaded. Follow these steps:

1. **Check .env.local exists**
   ```bash
   ls -la .env.local
   ```

2. **Verify contents**
   ```bash
   cat .env.local
   ```

3. **Restart dev server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Hard refresh browser**
   - Windows/Linux: `Ctrl+Shift+R`
   - Mac: `Cmd+Shift+R`

## Add Debug Logging

Add this to `src/lib/supabase.ts` after the imports:
```typescript
console.log('=== SUPABASE DEBUG ===');
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Configured:', isSupabaseConfigured);
```
