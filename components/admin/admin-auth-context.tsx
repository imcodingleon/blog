'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { getAdminSession, onAdminAuthStateChange, signOutAdmin } from '@/lib/supabase-admin'

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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // 페이지 로드 시 관리자 세션 확인
    const checkAdminSession = async () => {
      try {
        console.log('AdminAuthContext: 세션 확인 시작')
        
        // 로컬 스토리지 먼저 확인 (클라이언트에서만)
        const adminLoggedIn = localStorage.getItem('admin-logged-in')
        const adminUserData = localStorage.getItem('admin-user')
        
        console.log('로컬 스토리지 확인:', { adminLoggedIn, hasUserData: !!adminUserData })
        
        if (adminLoggedIn === 'true' && adminUserData) {
          const user = JSON.parse(adminUserData)
          console.log('로컬 스토리지에서 사용자 정보 로드:', user.email)
          setAdminUser(user)
          setIsAdminLoggedIn(true)
        }
        
        // Supabase 세션 확인
        const { session } = await getAdminSession()
        console.log('Supabase 세션 확인:', { hasSession: !!session })
        
        if (session?.user) {
          console.log('Supabase 세션에서 사용자 정보 업데이트:', session.user.email)
          setAdminUser(session.user)
          setIsAdminLoggedIn(true)
          localStorage.setItem('admin-logged-in', 'true')
          localStorage.setItem('admin-user', JSON.stringify(session.user))
        } else if (!adminLoggedIn) {
          // 로컬 스토리지에도 없고 세션도 없으면 로그아웃 상태
          setAdminUser(null)
          setIsAdminLoggedIn(false)
          localStorage.removeItem('admin-logged-in')
          localStorage.removeItem('admin-user')
        }
      } catch (error) {
        console.error('관리자 세션 확인 오류:', error)
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
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin-logged-in')
          localStorage.removeItem('admin-user')
        }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin-logged-in')
        localStorage.removeItem('admin-user')
      }
    } catch (error) {
      console.error('관리자 로그아웃 오류:', error)
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