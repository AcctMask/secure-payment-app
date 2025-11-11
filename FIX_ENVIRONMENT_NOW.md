# Fix Environment Variables NOW

## Current Error
```
FunctionsFetchError: Failed to send a request to the Edge Function
```

## Root Cause
Your Supabase environment variables are not being loaded. The app is using placeholder values:
- URL: `https://placeholder.supabase.co` (doesn't exist)
- Key: `placeholder-key` (invalid)

## Immediate Fix Steps

### 1. Check Your .env.local File
```bash
cat .env.local
```

You should see:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. If File is Missing or Empty
Create `.env.local` in your project root:
```bash
nano .env.local
```

Add your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Save and exit (Ctrl+X, Y, Enter)

### 3. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 4. Verify in Browser Console
Open browser console (F12) and look for:
```
=== SUPABASE DEBUG ===
URL: https://your-project.supabase.co
Key: eyJhbGc...
```

## Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → VITE_SUPABASE_URL
   - anon/public key → VITE_SUPABASE_ANON_KEY

## Still Not Working?

Try clearing Vite cache:
```bash
rm -rf node_modules/.vite
rm -rf dist
npm run dev
```
