"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye, FileText, BarChart3, Lock } from "lucide-react"

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  })
  const [loginError, setLoginError] = useState("")

  // 간단한 로그인 처리 (실제 프로덕션에서는 더 안전한 방법 사용)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    
    // 간단한 하드코딩된 로그인 (실제로는 서버에서 검증)
    if (loginForm.username === "admin" && loginForm.password === "password123") {
      setIsLoggedIn(true)
    } else {
      setLoginError("사용자명 또는 비밀번호가 올바르지 않습니다.")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setLoginForm({ username: "", password: "" })
    setLoginError("")
  }

  // 로그인 폼 렌더링
  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-black">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-black">관리자 로그인</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              관리자 패널에 접근하려면 로그인하세요
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  사용자명
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                  placeholder="사용자명을 입력하세요"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                  placeholder="비밀번호를 입력하세요"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                />
              </div>
            </div>

            {loginError && (
              <div className="text-red-600 text-sm text-center">{loginError}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const stats = [
    { name: "총 글 수", value: "24", icon: FileText },
    { name: "총 조회수", value: "12,345", icon: Eye },
    { name: "댓글 수", value: "156", icon: FileText },
    { name: "구독자 수", value: "1,234", icon: FileText },
  ]

  const recentArticles = [
    { id: 1, title: "모던 웹 개발의 트렌드", status: "발행됨", date: "2024-01-15", views: 1234 },
    { id: 2, title: "React 18의 새로운 기능들", status: "발행됨", date: "2024-01-10", views: 987 },
    { id: 3, title: "TypeScript 베스트 프랙티스", status: "초안", date: "2024-01-05", views: 0 },
  ]

  const tabs = [
    { id: "dashboard", name: "대시보드", icon: BarChart3 },
    { id: "articles", name: "글 관리", icon: FileText },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">관리자 패널</h1>
            <p className="mt-2 text-gray-600">블로그 관리 및 통계를 확인하세요</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            로그아웃
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.name} className="bg-white p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Icon className="h-8 w-8 text-black" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                        <p className="text-2xl font-bold text-black">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recent Articles */}
            <div className="bg-white shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-black">최근 글</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        제목
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        날짜
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        조회수
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentArticles.map((article) => (
                      <tr key={article.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-black">{article.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              article.status === "발행됨"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {article.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{article.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {article.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-black hover:text-gray-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === "articles" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">글 관리</h2>
              <button className="bg-black text-white px-4 py-2 font-medium hover:bg-gray-800 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />새 글 작성
              </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">글 관리 기능이 여기에 표시됩니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
