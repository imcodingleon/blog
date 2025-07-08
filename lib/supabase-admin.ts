import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

// 서버 전용 Supabase 클라이언트 (SERVICE_ROLE_KEY 사용)
// 데이터베이스 CRUD 작업에만 사용하며, 클라이언트에서 import하면 안됩니다.
export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 기존 코드와의 호환성을 위해 supabaseAdmin으로도 export
export const supabaseAdmin = supabase 