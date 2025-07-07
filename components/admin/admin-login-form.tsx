'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInAdmin } from '@/lib/supabase-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Eye, EyeOff } from 'lucide-react'

export function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // 환경 변수 확인
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    try {
      console.log('로그인 시도 중...', { email })
      const { data, error } = await signInAdmin(email, password)

      console.log('로그인 응답:', { data, error })

      if (error) {
        console.error('로그인 에러:', error)
        setError(`로그인 실패: ${error.message}`)
      } else if (data.user) {
        console.log('로그인 성공:', data.user)
        // 관리자 로그인 성공
        handleSuccessfulLogin(data.user)
      } else {
        console.log('데이터가 없습니다:', data)
        setError('로그인 데이터를 받지 못했습니다.')
      }
    } catch (error) {
      console.error('로그인 중 예외 발생:', error)
      setError(`로그인 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 로그인 성공 후 대안 방법들
  const handleSuccessfulLogin = (user: any) => {
    console.log('로그인 성공:', user)
    
    // 로컬 스토리지 저장
    localStorage.setItem('admin-logged-in', 'true')
    localStorage.setItem('admin-user', JSON.stringify(user))
    
    console.log('로컬 스토리지 저장 완료')
    
    // 강제 페이지 이동 (여러 방법 시도)
    console.log('페이지 이동 시도 시작')
    
    // 방법 1: 즉시 window.location.href 사용
    console.log('방법 1: window.location.href 사용')
    window.location.href = '/admin'
    
    // 방법 2: 백업 - window.location.replace 사용
    setTimeout(() => {
      console.log('방법 2: window.location.replace 사용')
      if (window.location.pathname !== '/admin') {
        window.location.replace('/admin')
      }
    }, 100)
    
    // 방법 3: 백업 - 강제 새로고침과 함께 이동
    setTimeout(() => {
      console.log('방법 3: 강제 새로고침과 함께 이동')
      if (window.location.pathname !== '/admin') {
        window.location.assign('/admin')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">관리자 로그인</CardTitle>
          <CardDescription>관리자 계정으로 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">관리자 이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '관리자 로그인'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 