import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Methods': 'POST', 
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' 
    }})
  }

  try {
    const { priceId, email, membershipType } = await req.json()
    
    // Validate required fields
    if (!priceId || !email) {
      throw new Error('Missing required fields: priceId and email')
    }

    // Get the origin for redirect URLs
    const origin = req.headers.get('origin') || 'http://localhost:5173'
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId, // Use the actual Stripe Price ID
        quantity: 1,
      }],
      mode: 'subscription',
      customer_email: email,
      success_url: `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}&membership=${membershipType}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        membershipType: membershipType
      }
    })

    return new Response(JSON.stringify({ 
      sessionId: session.id, 
      url: session.url 
    }), {
      headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*' 
      }
    })
  } catch (error) {
    console.error('Checkout session error:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*' 
      }
    })
  }
})
