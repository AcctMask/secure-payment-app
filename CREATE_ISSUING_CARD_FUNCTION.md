# create-issuing-card Edge Function Code

Copy this entire code and paste it into your Supabase Edge Function editor:

```typescript
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { memberId } = await req.json()
    if (!memberId) throw new Error('memberId is required')

    // Look up member
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .single()

    if (memberError || !member) throw new Error('Member not found')

    let cardholderId = member.stripe_cardholder_id

    // Create cardholder if doesn't exist
    if (!cardholderId) {
      const cardholder = await stripe.issuing.cardholders.create({
        name: member.user_id || 'Member',
        email: member.user_id,
        phone_number: '+10000000000',
        status: 'active',
        type: 'individual',
        billing: {
          address: {
            line1: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postal_code: '94111',
            country: 'US',
          },
        },
      })
      cardholderId = cardholder.id
      await supabase.from('members').update({ stripe_cardholder_id: cardholderId }).eq('id', memberId)
    }

    // Create virtual card
    const card = await stripe.issuing.cards.create({
      cardholder: cardholderId,
      currency: 'usd',
      type: 'virtual',
      status: 'active',
      spending_controls: { spending_limits: [{ amount: 100000, interval: 'monthly' }] },
    })

    // Insert into virtual_cards
    const { data: virtualCard, error: cardError } = await supabase
      .from('virtual_cards')
      .insert({
        member_id: memberId,
        stripe_card_id: card.id,
        last4: card.last4,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        status: 'active',
      })
      .select()
      .single()

    if (cardError) throw cardError

    return new Response(JSON.stringify({
      success: true,
      id: virtualCard.id,
      stripe_card_id: card.id,
      last4: card.last4,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
      status: 'active',
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error: any) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```
