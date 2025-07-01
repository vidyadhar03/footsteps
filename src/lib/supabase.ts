import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definition for waitlist data
export interface WaitlistData {
  email: string
  suggested_feature: string[] | null
  comments: string | null
  phone_number?: string | null
}

// Function to insert waitlist data
export async function insertWaitlistData(data: WaitlistData) {
  try {
    const { data: result, error } = await supabase
      .from('footsteps-waitlist')
      .insert([data])
      .select()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return result
  } catch (error) {
    console.error('Failed to insert waitlist data:', error)
    throw error
  }
}

 