import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://srksbmvwphpdwsihzlzm.supabase.co"
const supabaseKey = "sb_publishable_VKRJDpj1X_WADAvc4qGQ0w_xZsn0exj"

export const supabase = createClient(supabaseUrl, supabaseKey)
