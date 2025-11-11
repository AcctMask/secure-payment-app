# TERMINAL COMMANDS REQUIRED

## ✅ What I've Already Done

1. **Created `.env.local` file** with your exact Stripe keys:
   - Publishable Key: `pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru`
   - Premium Price ID: `price_1SEEYgCYgC6lPmKTgZSTYJMq`
   - Pro Price ID: `price_1SEEazCYgC6lPmKTc2wZ6yYM`
   - Secret Key: `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`

2. **Updated `src/lib/stripe.ts`** to:
   - Better debug logging
   - Live mode detection
   - Proper configuration checks

3. **Updated `src/components/RealMembershipModal.tsx`** to:
   - Use centralized Stripe configuration
   - Better error handling
   - Debug logging for troubleshooting

---

## 🚀 TERMINAL COMMANDS YOU NEED TO RUN

### Step 1: Verify the .env.local file exists
```bash
cat .env.local
```

You should see your Stripe keys. If not, the file didn't save properly.

### Step 2: Stop your current dev server
Press `Ctrl+C` in the terminal where `npm run dev` is running

### Step 3: Clear ALL caches
```bash
rm -rf node_modules/.vite
rm -rf dist
```

### Step 4: Restart the dev server
```bash
npm run dev
```

### Step 5: Force refresh your browser
- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`
- Or open an incognito/private window

---

## 🔍 CHECK THE BROWSER CONSOLE

After restarting, open your browser console (F12) and look for:

1. **✅ Stripe Configuration:** Should show:
   - `keyExists: true`
   - `isLive: true`
   - `premiumPriceId: price_1SEEYgCYgC6lPmKTgZSTYJMq`
   - `proPriceId: price_1SEEazCYgC6lPmKTc2wZ6yYM`

2. **✅ Stripe configured successfully**
   - `🔐 Mode: LIVE`

3. **🎯 RealMembershipModal Stripe Status:**
   - `isConfigured: true`
   - `isLiveMode: true`
   - `hasStripePromise: true`

---

## 🛠️ IF IT'S STILL NOT WORKING

### Option A: Check if .env.local is being loaded
```bash
# In your project root, run:
node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.VITE_STRIPE_PUBLISHABLE_KEY)"
```

### Option B: Try with explicit environment variable
```bash
# Stop the server first (Ctrl+C), then run:
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru VITE_STRIPE_PREMIUM_PRICE_ID=price_1SEEYgCYgC6lPmKTgZSTYJMq VITE_STRIPE_PRO_PRICE_ID=price_1SEEazCYgC6lPmKTc2wZ6yYM npm run dev
```

### Option C: Check Vite is reading the file
```bash
# Create a test script
cat > test-env.js << 'EOF'
import { loadEnv } from 'vite';
const env = loadEnv('development', process.cwd(), '');
console.log('Stripe Key:', env.VITE_STRIPE_PUBLISHABLE_KEY);
console.log('Premium Price:', env.VITE_STRIPE_PREMIUM_PRICE_ID);
console.log('Pro Price:', env.VITE_STRIPE_PRO_PRICE_ID);
EOF

# Run it
node test-env.js
```

---

## 📝 WHAT SHOULD HAPPEN

When everything is working correctly:

1. **No more "Test Mode" warning** - The payment form should not show the test card message
2. **Console shows "LIVE" mode** - Check browser console for confirmation
3. **Stripe checkout works** - Clicking subscribe should redirect to Stripe's checkout page
4. **Price IDs are loaded** - The console should show both price IDs

---

## 🚨 COMMON ISSUES & FIXES

### Issue: "Cannot find .env.local"
```bash
# Make sure you're in the project root
pwd
# Should show your project directory

# List files to confirm
ls -la | grep env
# Should show .env.local
```

### Issue: "Environment variables undefined"
```bash
# Install dotenv if missing
npm install dotenv

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Still showing test mode"
```bash
# Nuclear option - clear everything
rm -rf node_modules/.vite
rm -rf dist
rm -rf .parcel-cache
npm cache clean --force
npm install
npm run dev
```

---

## ✅ SUCCESS CHECKLIST

After running these commands, verify:

- [ ] `.env.local` file exists in project root
- [ ] Dev server restarted with `npm run dev`
- [ ] Browser console shows "Stripe configured successfully"
- [ ] Browser console shows "Mode: LIVE"
- [ ] No "Test Mode" warning appears in payment form
- [ ] Clicking "Subscribe" attempts to redirect to Stripe

---

## 🆘 LAST RESORT

If nothing above works, run this diagnostic:

```bash
# Create diagnostic script
cat > diagnose.js << 'EOF'
const fs = require('fs');
const path = require('path');

console.log('=== STRIPE DIAGNOSTIC ===\n');
console.log('Current Directory:', process.cwd());
console.log('\nChecking for .env.local...');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local exists');
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach(line => {
    if (line.includes('STRIPE')) {
      const [key] = line.split('=');
      console.log(`  - ${key} is set`);
    }
  });
} else {
  console.log('❌ .env.local NOT FOUND');
}

console.log('\nChecking package.json...');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('Vite version:', pkg.devDependencies?.vite || 'Not found');
EOF

# Run diagnostic
node diagnose.js
```

Then share the output with me so I can see exactly what's happening.