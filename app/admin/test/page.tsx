'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/components/admin/admin-auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AdminTest() {
  const { adminUser, isAdminLoggedIn, isLoading } = useAdminAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>관리자 인증 상태 테스트</CardTitle>
          <CardDescription>현재 관리자 인증 상태를 확인합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p><strong>로딩 상태:</strong> {isLoading ? '로딩 중...' : '완료'}</p>
            <p><strong>로그인 상태:</strong> {isAdminLoggedIn ? '✅ 로그인됨' : '❌ 로그인되지 않음'}</p>
            <p><strong>관리자 이메일:</strong> {adminUser?.email || '없음'}</p>
          </div>
          
          <div className="space-y-2">
            <p><strong>로컬 스토리지:</strong></p>
            <p>- admin-logged-in: {mounted ? (localStorage.getItem('admin-logged-in') || '없음') : '로딩 중...'}</p>
            <p>- admin-user: {mounted ? (localStorage.getItem('admin-user') ? '있음' : '없음') : '로딩 중...'}</p>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={() => router.push('/admin')}
              disabled={!isAdminLoggedIn}
            >
              관리자 페이지로 이동
            </Button>
            <Button 
              onClick={() => router.push('/admin/login')}
              variant="outline"
            >
              로그인 페이지로 이동
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 