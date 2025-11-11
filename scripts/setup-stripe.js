#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupStripe() {
  console.log('🚀 Stripe Setup Wizard\n');
  console.log('This will help you configure Stripe for live payments.\n');

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  
  console.log('📋 You will need:');
  console.log('1. Your Stripe publishable key (pk_live_...)');
  console.log('2. Your Stripe secret key (sk_live_...)');
  console.log('3. Price IDs for your subscription plans\n');

  const useTestMode = await question('Do you want to use TEST mode first? (y/n): ');
  const isTest = useTestMode.toLowerCase() === 'y';

  console.log(`\n${isTest ? '🧪 TEST' : '💳 LIVE'} Mode Selected\n`);

  // Get keys
  const pubKey = await question(`Enter your ${isTest ? 'TEST' : 'LIVE'} publishable key: `);
  const secretKey = await question(`Enter your ${isTest ? 'TEST' : 'LIVE'} secret key: `);
  
  // Validate keys
  const pubPrefix = isTest ? 'pk_test_' : 'pk_live_';
  const secPrefix = isTest ? 'sk_test_' : 'sk_live_';

  if (!pubKey.startsWith(pubPrefix)) {
    console.error(`❌ Invalid publishable key. Must start with ${pubPrefix}`);
    process.exit(1);
  }

  if (!secretKey.startsWith(secPrefix)) {
    console.error(`❌ Invalid secret key. Must start with ${secPrefix}`);
    process.exit(1);
  }

  // Get price IDs
  console.log('\n📦 Product Setup\n');
  const premiumPrice = await question('Enter Premium plan price ID (price_...): ');
  const proPrice = await question('Enter Professional plan price ID (price_...): ');

  // Create .env.local content
  const envContent = `# Stripe Configuration - ${isTest ? 'TEST' : 'LIVE'} MODE
# Generated on ${new Date().toISOString()}

# Stripe Keys
VITE_STRIPE_PUBLISHABLE_KEY=${pubKey}
VITE_STRIPE_SECRET_KEY=${secretKey}

# Stripe Price IDs
VITE_STRIPE_PREMIUM_PRICE_ID=${premiumPrice}
VITE_STRIPE_PRO_PRICE_ID=${proPrice}

# Supabase Configuration (Already configured)
VITE_SUPABASE_URL=https://ygongssudngqrseklkah.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnb25nc3N1ZG5ncXJzZWtsa2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2ODQ1NzIsImV4cCI6MjA0MjI2MDU3Mn0.vFmE_ybMhVKCPZTXW3KQwAcGhv5v-Lq-wPFDx5LPTLY
`;

  // Write file
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env.local file created successfully!\n');

  // Instructions
  console.log('📝 Next Steps:\n');
  console.log('1. Stop your dev server (Ctrl+C)');
  console.log('2. Run: npm run dev');
  console.log('3. Hard refresh your browser (Ctrl+Shift+R)');
  console.log('4. Test a payment\n');

  if (isTest) {
    console.log('🧪 Test Card Numbers:');
    console.log('   Success: 4242 4242 4242 4242');
    console.log('   Declined: 4000 0000 0000 0002\n');
  }

  console.log('🚀 Setup complete!');
  rl.close();
}

setupStripe().catch(console.error);