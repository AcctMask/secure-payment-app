import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables')
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the raw body and signature
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      throw new Error('Missing Stripe signature')
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    console.log('Received webhook event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Log successful payment
        const { error: logError } = await supabase
          .from('payment_logs')
          .insert({
            payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: 'succeeded',
            customer_email: paymentIntent.receipt_email,
            metadata: paymentIntent.metadata,
            created_at: new Date().toISOString()
          })

        if (logError) {
          console.error('Failed to log payment:', logError)
        }

        // Handle membership activation if this is a membership payment
        if (paymentIntent.metadata?.type === 'membership') {
          const { error: membershipError } = await supabase
            .from('memberships')
            .insert({
              payment_intent_id: paymentIntent.id,
              user_id: paymentIntent.metadata.user_id,
              plan: paymentIntent.metadata.plan || 'premium',
              status: 'active',
              activated_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
            })

          if (membershipError) {
            console.error('Failed to activate membership:', membershipError)
          }
        }

        console.log('Payment succeeded:', paymentIntent.id)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        
        // Log failed payment
        const { error: failLogError } = await supabase
          .from('payment_logs')
          .insert({
            payment_intent_id: failedPayment.id,
            amount: failedPayment.amount,
            currency: failedPayment.currency,
            status: 'failed',
            error_message: failedPayment.last_payment_error?.message,
            metadata: failedPayment.metadata,
            created_at: new Date().toISOString()
          })

        if (failLogError) {
          console.error('Failed to log payment failure:', failLogError)
        }

        console.log('Payment failed:', failedPayment.id)
        break

      case 'payment_method.attached':
        const paymentMethod = event.data.object as Stripe.PaymentMethod
        console.log('Payment method attached:', paymentMethod.id)
        break

      case 'customer.created':
        const customer = event.data.object as Stripe.Customer
        console.log('Customer created:', customer.id)
        break
      case 'customer.subscription.created':
        const newSubscription = event.data.object as Stripe.Subscription
        
        // Log subscription creation
        const { error: subCreateError } = await supabase
          .from('subscriptions')
          .insert({
            stripe_subscription_id: newSubscription.id,
            customer_id: newSubscription.customer as string,
            status: newSubscription.status,
            current_period_start: new Date(newSubscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(newSubscription.current_period_end * 1000).toISOString(),
            plan_id: newSubscription.items.data[0]?.price.id,
            created_at: new Date().toISOString()
          })

        if (subCreateError) {
          console.error('Failed to log subscription creation:', subCreateError)
        }

        console.log('Subscription created:', newSubscription.id)
        break

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription
        
        // Update subscription status
        const { error: subUpdateError } = await supabase
          .from('subscriptions')
          .update({
            status: updatedSubscription.status,
            current_period_start: new Date(updatedSubscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', updatedSubscription.id)

        if (subUpdateError) {
          console.error('Failed to update subscription:', subUpdateError)
        }

        console.log('Subscription updated:', updatedSubscription.id)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        
        // Mark subscription as cancelled
        const { error: subDeleteError } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', deletedSubscription.id)

        if (subDeleteError) {
          console.error('Failed to cancel subscription:', subDeleteError)
        }

        console.log('Subscription cancelled:', deletedSubscription.id)
        break

      case 'invoice.payment_succeeded':
        const successfulInvoice = event.data.object as Stripe.Invoice
        
        // Log successful invoice payment
        const { error: invoiceSuccessError } = await supabase
          .from('invoice_logs')
          .insert({
            stripe_invoice_id: successfulInvoice.id,
            subscription_id: successfulInvoice.subscription as string,
            amount_paid: successfulInvoice.amount_paid,
            currency: successfulInvoice.currency,
            status: 'paid',
            paid_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          })

        if (invoiceSuccessError) {
          console.error('Failed to log invoice payment:', invoiceSuccessError)
        }

        console.log('Invoice payment succeeded:', successfulInvoice.id)
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice
        
        // Log failed invoice payment
        const { error: invoiceFailError } = await supabase
          .from('invoice_logs')
          .insert({
            stripe_invoice_id: failedInvoice.id,
            subscription_id: failedInvoice.subscription as string,
            amount_due: failedInvoice.amount_due,
            currency: failedInvoice.currency,
            status: 'payment_failed',
            failure_reason: failedInvoice.last_finalization_error?.message,
            created_at: new Date().toISOString()
          })

        if (invoiceFailError) {
          console.error('Failed to log invoice failure:', invoiceFailError)
        }

        console.log('Invoice payment failed:', failedInvoice.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})