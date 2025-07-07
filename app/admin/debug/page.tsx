'use client'

import { useEffect, useState } from 'react'
import { SupabaseTest } from '@/components/admin/supabase-test'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/components/admin/admin-auth-context'

export default function AdminDebug() {
  const [mounted, setMounted] = useState(false)
  const { adminUser, isAdminLoggedIn, isLoading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>관리자 디버깅 페이지</CardTitle>
            <CardDescription>인증 상태와 Supabase 연결을 확인합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">인증 상태</h3>
                <p><strong>로딩:</strong> {isLoading ? '로딩 중...' : '완료'}</p>
                <p><strong>로그인:</strong> {isAdminLoggedIn ? '✅ 로그인됨' : '❌ 로그인되지 않음'}</p>
                <p><strong>관리자:</strong> {adminUser?.email || '없음'}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">로컬 스토리지</h3>
                <p><strong>admin-logged-in:</strong> {localStorage.getItem('admin-logged-in') || '없음'}</p>
                <p><strong>admin-user:</strong> {localStorage.getItem('admin-user') ? '있음' : '없음'}</p>
                <p><strong>URL:</strong> {window.location.pathname}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => router.push('/admin/login')}>
                로그인 페이지
              </Button>
              <Button onClick={() => router.push('/admin')} disabled={!isAdminLoggedIn}>
                관리자 페이지
              </Button>
              <Button onClick={() => router.push('/admin/test')}>
                테스트 페이지
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin'} 
                variant="outline"
                disabled={!isAdminLoggedIn}
              >
                강제 관리자 페이지 이동
              </Button>
            </div>
          </CardContent>
        </Card>

        <SupabaseTest />
      </div>
    </div>
  )
} 