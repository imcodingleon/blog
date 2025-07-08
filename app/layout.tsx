import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AdminAuthProvider } from "@/components/admin/admin-auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI 개발자 배성현의 블로그",
  description: "AI 개발과 기술에 대한 인사이트를 공유하는 블로그",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const year = new Date().getFullYear()
  return (
    <html lang="ko">
      <body className={inter.className} suppressHydrationWarning>
        <AdminAuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer year={year} />
          </div>
        </AdminAuthProvider>
      </body>
    </html>
  )
}
