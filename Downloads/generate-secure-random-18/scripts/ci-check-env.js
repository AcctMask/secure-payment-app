#!/usr/bin/env node

/**
 * CI/CD Environment Validation Script
 * Validates that required environment variables are present
 * Exits with error code if validation fails
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(color, symbol, message) {
  console.log(`${color}${symbol}${colors.reset} ${message}`);
}

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_STRIPE_PUBLIC_KEY'
];

const optionalVars = [
  'VITE_STRIPE_PREMIUM_PRICE_ID',
  'VITE_STRIPE_PRO_PRICE_ID'
];

console.log(`\n${colors.blue}=== CI/CD Environment Validation ===${colors.reset}\n`);

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log(`${colors.blue}Required Variables:${colors.reset}`);
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    log(colors.red, '❌', `${varName} is missing or empty`);
    hasErrors = true;
  } else {
    // Validate format
    if (varName === 'VITE_SUPABASE_URL' && !value.startsWith('https://')) {
      log(colors.red, '❌', `${varName} must start with https://`);
      hasErrors = true;
    } else if (varName === 'VITE_SUPABASE_ANON_KEY' && value.length < 20) {
      log(colors.red, '❌', `${varName} appears to be invalid (too short)`);
      hasErrors = true;
    } else if (varName === 'VITE_STRIPE_PUBLIC_KEY' && !value.startsWith('pk_')) {
      log(colors.red, '❌', `${varName} must start with pk_`);
      hasErrors = true;
    } else {
      log(colors.green, '✅', `${varName} is configured`);
    }
  }
});

// Check optional variables
console.log(`\n${colors.blue}Optional Variables:${colors.reset}`);
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    log(colors.yellow, '⚠️', `${varName} is not set (optional)`);
    hasWarnings = true;
  } else {
    log(colors.green, '✅', `${varName} is configured`);
  }
});

// Summary
console.log(`\n${colors.blue}=== Validation Summary ===${colors.reset}\n`);

if (hasErrors) {
  log(colors.red, '❌', 'Validation FAILED - Required variables are missing or invalid');
  console.log('\nPlease ensure all required GitHub Secrets are configured:');
  console.log('1. Go to GitHub repo → Settings → Secrets and variables → Actions');
  console.log('2. Add the missing secrets listed above');
  console.log('3. Re-run the workflow\n');
  process.exit(1);
} else if (hasWarnings) {
  log(colors.yellow, '⚠️', 'Validation PASSED with warnings');
  console.log('Optional variables are not set. Some features may be limited.\n');
  process.exit(0);
} else {
  log(colors.green, '✅', 'Validation PASSED - All variables configured correctly');
  console.log('');
  process.exit(0);
}
