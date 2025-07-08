"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, FileText, BarChart3, Lock, LogOut, Shield, Search } from "lucide-react"
import { useAdminAuth } from "@/components/admin/admin-auth-context"
import { useRouter } from "next/navigation"
import { getAllPosts, getBlogStats, deletePost } from "@/lib/blog-service-client"
import { formatDate, estimateReadingTime } from "@/lib/utils"
import PostForm from "@/components/admin/post-form"
import type { Post, BlogStats } from "@/lib/types/blog"

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showPostForm, setShowPostForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  
  const { adminUser, isAdminLoggedIn, isLoading: authLoading, adminSignOut } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    // 관리자 로그인 상태 확인
    if (!authLoading && !isAdminLoggedIn) {
      router.push('/admin/login')
    } else if (!authLoading && isAdminLoggedIn) {
      loadData()
    }
  }, [authLoading, isAdminLoggedIn, router])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [postsData, statsData] = await Promise.all([
        getAllPosts({ limit: 50, sortBy: 'updated_at', sortOrder: 'desc' }),
        getBlogStats()
      ])
      setPosts(postsData.posts)
      setStats(statsData)
    } catch (error) {
      console.error('데이터 로딩 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await adminSignOut()
    router.push('/admin/login')
  }

  const handleCreatePost = () => {
    setEditingPost(null)
    setShowPostForm(true)
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setShowPostForm(true)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('정말로 이 글을 삭제하시겠습니까?')) return

    try {
      await deletePost(postId)
      setPosts(posts.filter(post => post.id !== postId))
      await loadData() // 통계 새로고침
    } catch (error) {
      console.error('글 삭제 실패:', error)
      alert('글 삭제에 실패했습니다.')
    }
  }

  const handlePostSave = (savedPost: Post) => {
    setShowPostForm(false)
    setEditingPost(null)
    loadData() // 데이터 새로고침
  }

  const handlePostCancel = () => {
    setShowPostForm(false)
    setEditingPost(null)
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && post.published) ||
                         (filterStatus === 'draft' && !post.published)
    
    return matchesSearch && matchesFilter
  })

  // 로딩 중
  if (authLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 로그인되지 않았을 때
  if (!isAdminLoggedIn) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-black">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-black">접근 권한이 없습니다</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              관리자 로그인이 필요합니다
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/login')}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    )
  }

  // 글 작성/편집 폼 표시
  if (showPostForm) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <PostForm
            post={editingPost || undefined}
            onSave={handlePostSave}
            onCancel={handlePostCancel}
          />
        </div>
      </div>
    )
  }

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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>{adminUser?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>로그아웃</span>
            </button>
          </div>
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
            {stats && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-black" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">총 글 수</p>
                      <p className="text-2xl font-bold text-black">{stats.totalPosts}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Eye className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">게시된 글</p>
                      <p className="text-2xl font-bold text-black">{stats.publishedPosts}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">총 조회수</p>
                      <p className="text-2xl font-bold text-black">{stats.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">카테고리 수</p>
                      <p className="text-2xl font-bold text-black">{stats.categoriesCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Articles */}
            <div className="bg-white shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-black">최근 글</h3>
                <button
                  onClick={handleCreatePost}
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>새 글 작성</span>
                </button>
              </div>
              
              {isLoading ? (
                <div className="p-6 text-center">로딩 중...</div>
              ) : (
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
                          수정일
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
                      {posts.slice(0, 5).map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-black truncate max-w-xs">
                              {post.title}
                            </div>
                            {post.category && (
                              <div className="text-xs text-gray-500">{post.category}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              post.published 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {post.published ? "게시됨" : "초안"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(post.updated_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.view_count.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditPost(post)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {post.published && (
                                <a
                                  href={`/articles/${post.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              )}
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === "articles" && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-white p-4 shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="글 제목 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                
                {/* Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">모든 글</option>
                  <option value="published">게시된 글</option>
                  <option value="draft">초안</option>
                </select>
              </div>
              
              <button
                onClick={handleCreatePost}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>새 글 작성</span>
              </button>
            </div>

            {/* Articles List */}
            <div className="bg-white shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-black">
                  글 목록 ({filteredPosts.length}개)
                </h3>
              </div>
              
              {isLoading ? (
                <div className="p-6 text-center">로딩 중...</div>
              ) : filteredPosts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {searchTerm ? '검색 결과가 없습니다.' : '아직 작성된 글이 없습니다.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          제목
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          카테고리
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          작성일
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
                      {filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-black">
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {estimateReadingTime(post.content)} 읽기
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.category || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              post.published 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {post.published ? "게시됨" : "초안"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(post.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.view_count.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditPost(post)}
                                className="text-blue-600 hover:text-blue-800"
                                title="편집"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {post.published && (
                                <a
                                  href={`/articles/${post.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-800"
                                  title="보기"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              )}
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 hover:text-red-800"
                                title="삭제"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
