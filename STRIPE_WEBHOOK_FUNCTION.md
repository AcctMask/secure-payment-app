# stripe-webhook Edge Function Code

Copy this entire code and paste it into your Supabase Edge Function editor:

```typescript
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
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables')
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')
    if (!signature) throw new Error('Missing Stripe signature')

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    console.log('Received webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.customer) {
          const customerId = session.customer as string
          const userEmail = session.customer_email || session.customer_details?.email || 'unknown'

          // Upsert member
          const { data: member, error: memberError } = await supabase
            .from('members')
            .upsert({
              user_id: userEmail,
              stripe_customer_id: customerId,
              membership_status: 'active',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'stripe_customer_id' })
            .select()
            .single()

          if (memberError) {
            console.error('Failed to upsert member:', memberError)
            break
          }

          console.log('Member activated:', member.id)

          // Immediately create virtual card
          try {
            const createCardResponse = await fetch(
              `${supabaseUrl}/functions/v1/create-issuing-card`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${supabaseServiceKey}`,
                },
                body: JSON.stringify({ memberId: member.id }),
              }
            )

            const cardResult = await createCardResponse.json()
            console.log('Virtual card created:', cardResult)
          } catch (cardError) {
            console.error('Failed to create virtual card:', cardError)
          }
        }
        break

      case 'issuing_authorization.created':
      case 'issuing_transaction.created':
        const auth = event.data.object as any
        const cardId = auth.card

        // Find member with this card
        const { data: card } = await supabase
          .from('virtual_cards')
          .select('*, members(*)')
          .eq('stripe_card_id', cardId)
          .eq('status', 'active')
          .single()

        if (card && card.members) {
          console.log('Card used, rotating...')

          // Mark old card as used
          await supabase
            .from('virtual_cards')
            .update({ status: 'used', updated_at: new Date().toISOString() })
            .eq('id', card.id)

          // Log transaction
          await supabase.from('transactions').insert({
            member_id: card.member_id,
            stripe_card_id: cardId,
            stripe_transaction_id: auth.id,
            amount: auth.amount,
            currency: auth.currency,
            merchant_name: auth.merchant_data?.name || 'Unknown',
          })

          // Create new card
          try {
            const response = await fetch(
              `${supabaseUrl}/functions/v1/create-issuing-card`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${supabaseServiceKey}`,
                },
                body: JSON.stringify({ memberId: card.member_id }),
              }
            )
            const newCard = await response.json()
            console.log('New card created:', newCard)
          } catch (err) {
            console.error('Failed to rotate card:', err)
          }
        }
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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
```
