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
    const { virtualCardId, amount, merchant, code } = await req.json()

    // Create authorization on the virtual card
    const authorization = await stripe.issuing.authorizations.create({
      card: virtualCardId,
      amount: amount,
      currency: 'usd',
      merchant_data: {
        name: merchant,
        category: 'other',
        city: 'Online',
        country: 'US',
        state: 'CA'
      }
    })

    // Approve the authorization
    await stripe.issuing.authorizations.approve(authorization.id)

    // Create transaction record
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    await supabase
      .from('payment_tokens')
      .update({
        used_at: new Date().toISOString(),
        merchant_name: merchant,
        amount: amount
      })
      .eq('token', code)

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: authorization.id,
        status: 'approved'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    console.error('Error processing virtual payment:', error)
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