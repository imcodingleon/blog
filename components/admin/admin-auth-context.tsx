'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { getAdminSession, onAdminAuthStateChange, signOutAdmin } from '@/lib/supabase-client'

interface AdminAuthContextType {
  adminUser: User | null
  isAdminLoggedIn: boolean
  isLoading: boolean
  adminSignOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  isAdminLoggedIn: false,
  isLoading: true,
  adminSignOut: async () => {},
})

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<User | null>(null)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // 로컬 스토리지 정리 함수
  const clearAuthData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin-logged-in')
      localStorage.removeItem('admin-user')
      // Supabase 관련 토큰도 정리
      localStorage.removeItem('sb-localhost-auth-token')
      localStorage.removeItem('sb-auth-token')
      sessionStorage.removeItem('sb-localhost-auth-token')
      sessionStorage.removeItem('sb-auth-token')
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // 페이지 로드 시 관리자 세션 확인
    const checkAdminSession = async () => {
      try {
        console.log('AdminAuthContext: 세션 확인 시작')
        
        // Supabase 세션 확인 (토큰 오류 처리 포함)
        try {
          const { session, error } = await getAdminSession()
          console.log('Supabase 세션 확인:', { hasSession: !!session, error })
          
          if (error) {
            console.error('세션 확인 중 오류:', error)
            // 토큰 관련 오류인 경우 정리
            if (error.message.includes('Invalid Refresh Token') || 
                error.message.includes('refresh_token_not_found') ||
                error.message.includes('JWT expired')) {
              console.log('유효하지 않은 토큰으로 인한 오류 - 인증 데이터 정리')
              clearAuthData()
            }
            setAdminUser(null)
            setIsAdminLoggedIn(false)
          } else if (session?.user) {
            console.log('Supabase 세션에서 사용자 정보 확인:', session.user.email)
            setAdminUser(session.user)
            setIsAdminLoggedIn(true)
            // 유효한 세션이 있으면 로컬 스토리지 업데이트
            if (typeof window !== 'undefined') {
              localStorage.setItem('admin-logged-in', 'true')
              localStorage.setItem('admin-user', JSON.stringify(session.user))
            }
          } else {
            // 세션이 없으면 로컬 스토리지도 정리
            console.log('세션 없음 - 로그아웃 상태')
            clearAuthData()
            setAdminUser(null)
            setIsAdminLoggedIn(false)
          }
        } catch (sessionError) {
          console.error('세션 확인 중 예외:', sessionError)
          // 세션 확인 실패 시 로컬 데이터 정리
          clearAuthData()
          setAdminUser(null)
          setIsAdminLoggedIn(false)
        }
      } catch (error) {
        console.error('관리자 세션 확인 오류:', error)
        clearAuthData()
        setAdminUser(null)
        setIsAdminLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminSession()

    // 관리자 인증 상태 변경 감지
    const { data: { subscription } } = onAdminAuthStateChange((session) => {
      console.log('인증 상태 변경 감지:', { hasSession: !!session })
      
      if (session?.user) {
        console.log('세션 있음 - 로그인 상태로 변경:', session.user.email)
        setAdminUser(session.user)
        setIsAdminLoggedIn(true)
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin-logged-in', 'true')
          localStorage.setItem('admin-user', JSON.stringify(session.user))
        }
      } else {
        console.log('세션 없음 - 로그아웃 상태로 변경')
        setAdminUser(null)
        setIsAdminLoggedIn(false)
        clearAuthData()
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [mounted])

  const adminSignOut = async () => {
    try {
      await signOutAdmin()
      setAdminUser(null)
      setIsAdminLoggedIn(false)
      clearAuthData()
    } catch (error) {
      console.error('관리자 로그아웃 오류:', error)
      // 로그아웃 실패해도 로컬 데이터는 정리
      clearAuthData()
      setAdminUser(null)
      setIsAdminLoggedIn(false)
    }
  }

  return (
    <AdminAuthContext.Provider value={{ 
      adminUser, 
      isAdminLoggedIn, 
      isLoading, 
      adminSignOut 
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
} 