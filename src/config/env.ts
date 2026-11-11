// Reads and validates required env variables once, failing fast if any are missing.
function required(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]
  if (!value) throw new Error(`Missing env variable ${name}. Copy .env.example to .env and fill it in.`)
  return value
}

export const env = {
  supabaseUrl: required('VITE_SUPABASE_URL'),
  supabasePublishableKey: required('VITE_SUPABASE_PUBLISHABLE_KEY'),
}
