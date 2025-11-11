# Start the Development Server

## Quick Start

1. **Install dependencies** (if you haven't already):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Access the app**:
   Open your browser to: **http://localhost:8080**

## The server is now configured to run on port 8080

## Troubleshooting

### If you see "Can't connect to server":
- Make sure you've run `npm run dev` in your terminal
- Check that no other application is using port 8080
- Look for any error messages in the terminal

### If port 8080 is already in use:
The terminal will show an error. You can either:
- Stop the other application using port 8080
- Or the dev server will automatically try the next available port (8081, 8082, etc.)

### Environment Variables:
Make sure your `.env` file exists with all the live Stripe and Supabase keys configured.

## Live Mode Checklist
✅ VITE_STRIPE_PUBLISHABLE_KEY set to pk_live_...
✅ VITE_SUPABASE_URL configured
✅ VITE_SUPABASE_ANON_KEY configured
✅ VITE_DEMO_MODE=false
✅ Price IDs configured for membership tiers
