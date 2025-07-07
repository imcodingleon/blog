import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '관리자 로그인 - AI 개발자 배성현의 블로그',
  description: '관리자 전용 로그인 페이지',
}

export default function AdminLoginPage() {
  return <AdminLoginForm />
} 