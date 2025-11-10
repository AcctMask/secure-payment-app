# Secure Payment Code System

A production-ready application for secure credit card payments using one-time codes. Add real credit cards, generate secure codes, and make purchases that automatically regenerate codes after each transaction.

## 🚀 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2FYOUR_REPO&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,STRIPE_SECRET_KEY,STRIPE_PUBLISHABLE_KEY,STRIPE_WEBHOOK_SECRET&envDescription=Required%20environment%20variables%20for%20Stripe%20and%20Supabase%20integration&envLink=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2FYOUR_REPO%2Fblob%2Fmain%2FQUICK_PRODUCTION_SETUP.md&project-name=secure-payment-codes&repository-name=secure-payment-codes)

**After clicking Deploy:**
1. Fork/clone the repository to your GitHub
2. Connect to Vercel
3. Add environment variables (see `.env.production.example`)
4. Deploy automatically!

See `QUICK_PRODUCTION_SETUP.md` for detailed environment variable setup.

---

## 🚀 Quick Start


### Development Mode (Test Payments)
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Add your Stripe TEST keys (pk_test_... and sk_test_...)
5. Run: `npm run dev`

See `QUICK_SETUP.md` for detailed development setup.

### Production Mode (Real Payments)
**Ready to go live?** Follow `QUICK_PRODUCTION_SETUP.md` (5 minutes)

Or see `PRODUCTION_DEPLOYMENT_GUIDE.md` for comprehensive instructions.

---

## ✨ Features

- **Real Credit Card Integration**: Add actual credit cards via Stripe
- **Secure Code Generation**: Generate unique codes linked to payment methods
- **One-Time Purchases**: Use codes to make real purchases
- **Auto Code Regeneration**: Codes automatically refresh after each purchase
- **PCI Compliant**: All card data handled securely by Stripe
- **Row Level Security**: User data protected with database-level security

---

## 🔒 Security

This app is production-ready with enterprise-level security:
- ✅ Row Level Security (RLS) on all database tables
- ✅ API keys secured in Supabase edge functions
- ✅ PCI DSS compliant via Stripe
- ✅ No sensitive data stored in frontend
- ✅ Webhook signature verification

See `SECURITY_CHECKLIST.md` for complete security details.

---

## 📚 Documentation

- **QUICK_SETUP.md** - Get started in development mode
- **QUICK_PRODUCTION_SETUP.md** - Deploy to production in 5 minutes
- **PRODUCTION_DEPLOYMENT_GUIDE.md** - Comprehensive deployment guide
- **SECURITY_CHECKLIST.md** - Security measures and best practices
- **STRIPE_SETUP_GUIDE.md** - Stripe configuration details

---

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase Edge Functions
- **Payments**: Stripe API
- **Database**: PostgreSQL (Supabase)
- **Hosting**: Vercel/Netlify (recommended)

---

## 💳 How It Works

1. **Add Card**: User adds real credit card (stored securely in Stripe)
2. **Generate Code**: System creates unique secure code linked to card
3. **Make Purchase**: User enters code to make purchase
4. **Auto Regenerate**: New code automatically generated after successful payment

---

## 📊 Cost Estimates

### Stripe
- 2.9% + $0.30 per successful transaction
- No monthly fees

### Supabase
- Free tier: 500MB database, 2GB bandwidth
- Pro ($25/mo): Recommended for production

### Hosting
- Vercel/Netlify free tier available

---

## 🤝 Support

- **Stripe Issues**: https://support.stripe.com
- **Supabase Issues**: https://supabase.com/support
- **Check Logs**: Supabase Dashboard → Edge Functions

---

## 📄 License

MIT License - See LICENSE file for details

---

**Ready to accept real payments? Start with `QUICK_PRODUCTION_SETUP.md`**
