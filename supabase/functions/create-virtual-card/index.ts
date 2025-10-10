import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { accountName, accountType, userId } = await req.json()

    // Create or retrieve Stripe cardholder
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Check if user already has a cardholder
    const { data: existingCardholder } = await supabase
      .from('stripe_cardholders')
      .select('stripe_cardholder_id')
      .eq('user_id', userId)
      .single()

    let cardholderId: string

    if (existingCardholder) {
      cardholderId = existingCardholder.stripe_cardholder_id
    } else {
      // Create new cardholder
      const cardholder = await stripe.issuing.cardholders.create({
        type: 'individual',
        name: accountName,
        email: `user_${userId}@securepay.app`,
        status: 'active',
        billing: {
          address: {
            line1: '123 Secure Street',
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
            postal_code: '94111'
          }
        }
      })

      cardholderId = cardholder.id

      // Store cardholder ID
      await supabase
        .from('stripe_cardholders')
        .insert({
          user_id: userId,
          stripe_cardholder_id: cardholderId
        })
    }

    // Create virtual card
    const card = await stripe.issuing.cards.create({
      cardholder: cardholderId,
      type: 'virtual',
      currency: 'usd',
      status: 'active',
      spending_controls: {
        spending_limits: [
          {
            amount: accountType === 'premium' ? 500000 : 100000, // $5000 or $1000
            interval: 'daily'
          }
        ],
        allowed_categories: null // Allow all categories
      },
      metadata: {
        account_name: accountName,
        account_type: accountType,
        user_id: userId
      }
    })

    return new Response(
      JSON.stringify({
        success: true,
        cardId: card.id,
        last4: card.last4,
        brand: card.brand
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    console.error('Error creating virtual card:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})