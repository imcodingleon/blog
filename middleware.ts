import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  console.log('미들웨어 실행:', req.nextUrl.pathname)
  
  // 관리자 페이지 보호
  if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
    console.log('관리자 페이지 접근 시도:', req.nextUrl.pathname)
    
    try {
      const supabase = createMiddlewareClient({ req, res })
      const { data: { session }, error } = await supabase.auth.getSession()
      
      console.log('미들웨어 세션 확인:', { session: !!session, error })
      
      if (!session) {
        console.log('세션 없음 - 로그인 페이지로 리디렉션')
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
      
      console.log('세션 있음 - 접근 허용')
    } catch (error) {
      console.error('미들웨어 에러:', error)
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return res
}

// 임시로 미들웨어 비활성화 (테스트용)
export const config = {
  matcher: [],
}

// 원래 설정 (나중에 복원)
// export const config = {
//   matcher: ['/admin/:path*'],
// } 