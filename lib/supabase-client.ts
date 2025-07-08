import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 관리자 로그인 함수 (클라이언트용)
export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// 관리자 로그아웃 함수 (클라이언트용)
export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// 관리자 세션 확인 함수 (클라이언트용)
export async function getAdminSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// 관리자 인증 상태 변경 감지 (클라이언트용)
export function onAdminAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session)
  })
} 