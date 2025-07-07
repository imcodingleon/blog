'use client'

import { useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SupabaseTest() {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult('')
    
    try {
      // 환경 변수 확인
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      console.log('환경 변수 확인:')
      console.log('SUPABASE_URL:', supabaseUrl)
      console.log('SUPABASE_KEY 존재:', !!supabaseKey)
      
      let result = `환경 변수 확인:\n`
      result += `- SUPABASE_URL: ${supabaseUrl || '❌ 설정되지 않음'}\n`
      result += `- SUPABASE_KEY: ${supabaseKey ? '✅ 설정됨' : '❌ 설정되지 않음'}\n\n`
      
      if (!supabaseUrl || !supabaseKey) {
        result += '❌ 환경 변수가 설정되지 않았습니다.'
        setTestResult(result)
        return
      }
      
      // Supabase 연결 테스트
      result += 'Supabase 연결 테스트 중...\n'
      
      const { data, error } = await supabaseAdmin.auth.getSession()
      
      if (error) {
        result += `❌ Supabase 연결 오류: ${error.message}\n`
      } else {
        result += `✅ Supabase 연결 성공\n`
        result += `- 현재 세션: ${data.session ? '있음' : '없음'}\n`
      }
      
      setTestResult(result)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
      setTestResult(`❌ 테스트 중 오류 발생: ${errorMessage}`)
      console.error('테스트 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Supabase 연결 테스트</CardTitle>
        <CardDescription>환경 변수 및 Supabase 연결 상태를 확인합니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={isLoading} className="w-full">
          {isLoading ? '테스트 중...' : '연결 테스트'}
        </Button>
        
        {testResult && (
          <div className="bg-gray-100 p-3 rounded-md">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {testResult}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 