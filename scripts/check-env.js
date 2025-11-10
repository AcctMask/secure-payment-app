#!/usr/bin/env node

/**
 * Environment Configuration Checker
 * Run: node scripts/check-env.js
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, symbol, message) {
  console.log(`${color}${symbol}${colors.reset} ${message}`);
}

function checkEnvFile() {
  const envPath = join(rootDir, '.env.local');
  
  if (!existsSync(envPath)) {
    log(colors.red, '❌', '.env.local file not found');
    log(colors.yellow, '💡', 'Run: cp .env.example .env.local');
    return null;
  }
  
  const content = readFileSync(envPath, 'utf-8');
  const vars = {};
  
  content.split('\n').forEach(line => {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      vars[match[1]] = match[2].trim();
    }
  });
  
  return vars;
}

function validateConfig(vars) {
  console.log(`\n${colors.cyan}=== Environment Configuration Status ===${colors.reset}\n`);
  
  // Check Supabase
  console.log(`${colors.blue}Supabase Configuration:${colors.reset}`);
  if (vars.VITE_SUPABASE_URL && vars.VITE_SUPABASE_URL.startsWith('https://')) {
    log(colors.green, '✅', `URL configured: ${vars.VITE_SUPABASE_URL}`);
  } else {
    log(colors.yellow, '⚠️', 'Supabase URL not configured (using fallback)');
  }
  
  if (vars.VITE_SUPABASE_ANON_KEY && vars.VITE_SUPABASE_ANON_KEY.length > 20) {
    log(colors.green, '✅', 'Anon key configured');
  } else {
    log(colors.yellow, '⚠️', 'Supabase anon key not configured');
  }
  
  // Check Stripe
  console.log(`\n${colors.blue}Stripe Configuration:${colors.reset}`);
  if (vars.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_')) {
    log(colors.green, '✅', 'Test publishable key configured');
  } else if (vars.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_')) {
    log(colors.green, '✅', 'LIVE publishable key configured');
    log(colors.red, '⚠️', 'WARNING: Using live keys in development!');
  } else {
    log(colors.red, '❌', 'Stripe key not configured');
    log(colors.yellow, '💡', 'Premium/Pro features will be disabled');
  }
  
  // Check Price IDs
  console.log(`\n${colors.blue}Stripe Products:${colors.reset}`);
  if (vars.VITE_STRIPE_PREMIUM_PRICE_ID?.startsWith('price_')) {
    log(colors.green, '✅', 'Premium price ID configured');
  } else {
    log(colors.yellow, '⚠️', 'Premium price ID not set');
  }
  
  if (vars.VITE_STRIPE_PRO_PRICE_ID?.startsWith('price_')) {
    log(colors.green, '✅', 'Pro price ID configured');
  } else {
    log(colors.yellow, '⚠️', 'Pro price ID not set');
  }
  
  console.log(`\n${colors.cyan}=== Summary ===${colors.reset}\n`);
  log(colors.green, '✓', 'Free tier: Fully functional');
  
  const stripeConfigured = vars.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_');
  if (stripeConfigured) {
    log(colors.green, '✓', 'Paid tiers: Ready');
  } else {
    log(colors.yellow, '!', 'Paid tiers: Needs Stripe configuration');
  }
  
  console.log('');
}

const vars = checkEnvFile();
if (vars) {
  validateConfig(vars);
}
