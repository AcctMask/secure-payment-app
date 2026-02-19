import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const anon = process.env.SUPABASE_ANON_KEY

if (!url || !anon) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in env')
  process.exit(1)
}

const supabase = createClient(url, anon)

async function main() {
  // Quick connectivity check against a public table you have
  const { data, error } = await supabase.from('user_payment_methods').select('id').limit(1)
  console.log('query data:', data)
  console.log('query error:', error)

  // Or call an Edge Function if you have one deployed
  // const { data, error } = await supabase.functions.invoke('get-billing-status', {
  //   headers: { Authorization: `Bearer ${anon}` },
  // })
  // console.log('function data:', data)
  // console.log('function error:', error)
}

main().catch((e) => {
  console.error('script failed:', e)
  process.exit(1)
})
