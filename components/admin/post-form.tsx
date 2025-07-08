"use client"

import { useState, useEffect } from "react"
import { Save, Eye, ArrowLeft, Tag, Hash, ImageIcon } from "lucide-react"
import { createPost, updatePost, getAllCategories, generateSlug, isSlugUnique } from "@/lib/blog-service-client"
import type { Post, CreatePostData, UpdatePostData, Category } from "@/lib/types/blog"

interface PostFormProps {
  post?: Post;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

export default function PostForm({ post, onSave, onCancel }: PostFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    category: post?.category || '',
    tags: post?.tags?.join(', ') || '',
    featured_image: post?.featured_image || '',
    meta_description: post?.meta_description || '',
    published: post?.published || false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [slugGenerated, setSlugGenerated] = useState(!post) // 새 글일 때만 자동 생성

  // 카테고리 목록 로드
  useEffect(() => {
    loadCategories()
  }, [])

  // 제목이 변경되면 슬러그 자동 생성 (새 글일 때만)
  useEffect(() => {
    if (slugGenerated && formData.title && !post) {
      const newSlug = generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug: newSlug }))
    }
  }, [formData.title, slugGenerated, post])

  const loadCategories = async () => {
    try {
      const categoriesData = await getAllCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('카테고리 로딩 실패:', error)
    }
  }

  const validateForm = async () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'URL 슬러그를 입력해주세요'
    } else {
      // 슬러그 중복 확인
      const isUnique = await isSlugUnique(formData.slug, post?.id)
      if (!isUnique) {
        newErrors.slug = '이미 사용 중인 URL 슬러그입니다'
      }
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isValid = await validateForm()
    if (!isValid) return

    setIsLoading(true)

    try {
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || null,
        category: formData.category || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : null,
        featured_image: formData.featured_image.trim() || null,
        meta_description: formData.meta_description.trim() || null,
        published: formData.published
      }

      let savedPost: Post

      if (post) {
        // 글 수정
        savedPost = await updatePost({ id: post.id, ...postData } as UpdatePostData)
      } else {
        // 새 글 작성
        savedPost = await createPost(postData as CreatePostData)
      }

      onSave(savedPost)
    } catch (error) {
      console.error('글 저장 실패:', error)
      alert('글 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSlugChange = (value: string) => {
    setSlugGenerated(false) // 수동으로 변경했으므로 자동 생성 중단
    setFormData(prev => ({ ...prev, slug: value }))
  }

  const regenerateSlug = () => {
    if (formData.title) {
      const newSlug = generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug: newSlug }))
      setSlugGenerated(true)
    }
  }

  return (
    <div className="bg-white shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-black">
          {post ? '글 편집' : '새 글 작성'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            제목 *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="글 제목을 입력하세요"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* URL 슬러그 */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            URL 슬러그 *
          </label>
          <div className="flex">
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="url-slug"
            />
            <button
              type="button"
              onClick={regenerateSlug}
              className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 text-sm"
            >
              자동 생성
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            URL: /articles/{formData.slug}
          </p>
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
        </div>

        {/* 요약 */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            요약
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="글의 간단한 요약을 입력하세요 (선택사항)"
          />
        </div>

        {/* 카테고리와 태그 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 카테고리 */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 태그 */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline h-4 w-4 mr-1" />
              태그
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="태그1, 태그2, 태그3"
            />
            <p className="mt-1 text-xs text-gray-500">쉼표로 구분하여 입력하세요</p>
          </div>
        </div>

        {/* 대표 이미지 */}
        <div>
          <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-2">
            <ImageIcon className="inline h-4 w-4 mr-1" />
            대표 이미지 URL
          </label>
          <input
            type="url"
            id="featured_image"
            value={formData.featured_image}
            onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* 본문 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            본문 *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm"
            placeholder="마크다운 형식으로 글을 작성하세요..."
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          <p className="mt-1 text-xs text-gray-500">마크다운 문법을 사용할 수 있습니다</p>
        </div>

        {/* SEO 메타 설명 */}
        <div>
          <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
            SEO 메타 설명
          </label>
          <textarea
            id="meta_description"
            value={formData.meta_description}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
            rows={2}
            maxLength={160}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="검색 엔진에 표시될 설명 (160자 이하 권장)"
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.meta_description.length}/160자
          </p>
        </div>

        {/* 게시 상태 */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <span className="ml-2 text-sm text-gray-700">
              바로 게시하기 (체크하지 않으면 초안으로 저장됩니다)
            </span>
          </label>
        </div>

        {/* 작업 버튼 */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          
          <div className="flex space-x-3">
            {formData.published && (
              <button
                type="button"
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                미리보기
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? '저장 중...' : formData.published ? '게시하기' : '초안 저장'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
} 