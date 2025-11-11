# Interactive Setup Wizard Guide

## Overview
The Setup Wizard provides a step-by-step interactive interface to configure your environment variables with real-time validation and automatic file generation.

## Access the Setup Wizard

1. **Navigate to System Configuration Page**
   - Click the orange "System Check" button in the navigation bar
   - Or visit: `http://localhost:5173/system-check`

2. **Select the "Setup Wizard" Tab**
   - The wizard tab is selected by default
   - Switch between "Setup Wizard" and "Validation" tabs as needed

## Using the Setup Wizard

### Step-by-Step Process

**Step 1: Supabase URL**
- Click "Open Dashboard" to go directly to your Supabase project
- Navigate: Dashboard → Select Project → Settings → API
- Copy the "Project URL" (format: https://xxxxx.supabase.co)
- Paste into the input field
- Green checkmark appears when format is valid

**Step 2: Supabase Anon Key**
- Same dashboard page as Step 1
- Scroll to "Project API keys" section
- Copy the "anon public" key (starts with "eyJ")
- Paste into the input field
- Validation confirms it's a valid JWT format

**Step 3: Stripe Publishable Key**
- Click "Open Dashboard" to go to Stripe
- Navigate: Developers → API keys
- Copy the "Publishable key" (starts with pk_test_ or pk_live_)
- Paste into the input field
- Use test keys (pk_test_) for development

### Real-Time Validation

Each field validates as you type:
- ✅ Green checkmark = Valid format
- ❌ Red X = Invalid format
- Gray = Not yet entered

You cannot proceed to the next step until the current field is valid.

### Generate .env.local File

After completing all steps:

1. **Review Your Configuration**
   - See all variables displayed in a code block
   - Verify all values are correct

2. **Copy to Clipboard**
   - Click the "Copy" button
   - Paste directly into your .env.local file

3. **Download File**
   - Click the "Download" button
   - Saves as ".env.local" ready to use
   - Place in your project root directory

4. **Edit Variables**
   - Click "Edit Variables" to go back and modify any value
   - Changes are preserved as you navigate

## After Setup

1. **Create .env.local file** in your project root
2. **Paste or save** the generated content
3. **Restart your dev server**: `npm run dev`
4. **Switch to "Validation" tab** to verify all connections work

## Validation Tab Features

- **Environment Variables Check**: Shows status of all required variables
- **Connection Tests**: Tests live Supabase and Stripe connections
- **Recheck Button**: Re-run all validations after making changes
- **Color-coded Status**:
  - 🟢 Green = Valid and working
  - 🟡 Yellow = Present but invalid format
  - 🔴 Red = Missing or failed

## Troubleshooting

### "Invalid format" error
- Double-check you copied the complete value
- Ensure no extra spaces at beginning or end
- Verify you're using the correct key type (test vs live)

### "Connection failed" in validation
- Verify .env.local file is in project root
- Restart dev server after creating/editing .env.local
- Check Supabase project is active and accessible
- Confirm Stripe keys match your account mode (test/live)

### Can't save code changes
- This is a frontend wizard - it generates the file content
- You must manually create/edit the .env.local file
- Use copy/download buttons to get the content
- .env files are not tracked in git (for security)

## Security Notes

- Never commit .env.local to git
- Use test keys during development
- Switch to live keys only in production
- The anon key is safe for browser use
- Keep secret keys (not used here) secure

## Need Help?

1. Check the "Setup Instructions" card in the Validation tab
2. Visit dashboard links provided in each step
3. Ensure you have admin access to Supabase and Stripe accounts
4. Verify your project is properly initialized
