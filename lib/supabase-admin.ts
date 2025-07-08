import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 서버 전용 Supabase 클라이언트 (SERVICE_ROLE_KEY 사용)
// 데이터베이스 CRUD 작업에만 사용하며, 클라이언트에서 import하면 안됩니다.
export const supabase = createClient(supabaseUrl, supabaseServiceKey) 