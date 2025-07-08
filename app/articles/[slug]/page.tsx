import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, Tag, ArrowLeft, Eye } from "lucide-react"
import { getPostBySlug, getRecentPosts, incrementViewCount, debugListAllSlugs } from "@/lib/blog-service"
import { formatDate, estimateReadingTime, formatRelativeTime } from "@/lib/utils"
import { Metadata } from "next"

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>
}

// 메타데이터 생성
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const post = await getPostBySlug(decodedSlug, true) // 임시로 미발행 글도 조회

  if (!post) {
    return {
      title: '글을 찾을 수 없습니다',
      description: '요청하신 글을 찾을 수 없습니다.'
    }
  }

  return {
    title: post.title,
    description: post.meta_description || post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt || post.content.slice(0, 160),
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: ['배성현'],
      images: post.featured_image ? [post.featured_image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.meta_description || post.excerpt || post.content.slice(0, 160),
      images: post.featured_image ? [post.featured_image] : undefined,
    }
  }
}

// 마크다운 간단 렌더링 함수 (실제로는 markdown-to-jsx나 다른 라이브러리 사용 권장)
function renderMarkdown(content: string) {
  return content
    .split('\n')
    .map((line, index) => {
      // 헤딩 처리
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mt-8 mb-4 text-black">{line.slice(4)}</h3>
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-10 mb-6 text-black">{line.slice(3)}</h2>
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-12 mb-8 text-black">{line.slice(2)}</h1>
      }
      
      // 리스트 처리
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-2">{line.slice(2)}</li>
      }
      
      // 볼드 처리
      const boldRegex = /\*\*(.*?)\*\*/g
      if (boldRegex.test(line)) {
        const parts = line.split(boldRegex)
        return (
          <p key={index} className="mb-4 text-gray-800 leading-relaxed">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
            )}
          </p>
        )
      }
      
      // 일반 문단
      if (line.trim()) {
        return <p key={index} className="mb-4 text-gray-800 leading-relaxed">{line}</p>
      }
      
      // 빈 줄
      return <br key={index} />
    })
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  console.log(`[PostPage] 요청된 슬러그: ${resolvedParams.slug}`);
  console.log(`[PostPage] 디코딩된 슬러그: ${decodedSlug}`);
  
  // 디버깅: 모든 글의 슬러그 출력
  await debugListAllSlugs();
  
  const post = await getPostBySlug(decodedSlug, true) // 임시로 미발행 글도 조회
  
  if (!post) {
    notFound()
  }

  // 조회수 증가 (비동기, 에러가 나도 페이지 로딩에 영향 없음)
  incrementViewCount(post.id).catch(console.error)

  // 관련 글 가져오기 (같은 카테고리의 최근 글)
  const relatedPosts = await getRecentPosts(4)
    .then(posts => posts.filter(p => p.id !== post.id && (!post.category || p.category === post.category)))
    .catch(() => [])

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/articles"
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            글 목록으로 돌아가기
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          {/* 카테고리 */}
          {post.category && (
            <div className="mb-4">
              <Link
                href={`/articles?category=${encodeURIComponent(post.category)}`}
                className="inline-block bg-black text-white px-3 py-1 text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                {post.category}
              </Link>
            </div>
          )}

          {/* 제목 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
            {post.title}
          </h1>

          {/* 요약 */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <time dateTime={post.created_at}>
                {formatDate(post.created_at)}
              </time>
              <span className="mx-2">•</span>
              <span>{formatRelativeTime(post.created_at)}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{estimateReadingTime(post.content)} 읽기</span>
            </div>

            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              <span>조회 {(post.view_count + 1).toLocaleString()}</span>
            </div>
          </div>

          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/articles?search=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* 대표 이미지 */}
        {post.featured_image && (
          <div className="mb-8">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        )}

        {/* 본문 */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-lg leading-relaxed">
            {renderMarkdown(post.content)}
          </div>
        </div>

        {/* 글 정보 푸터 */}
        <footer className="border-t border-gray-200 pt-8">
          <div className="text-sm text-gray-500">
            <p>
              작성일: {formatDate(post.created_at)}
              {post.updated_at !== post.created_at && (
                <span> • 수정일: {formatDate(post.updated_at)}</span>
              )}
            </p>
          </div>
        </footer>
      </article>

      {/* 관련 글 */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-black mb-8">관련 글</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.slice(0, 2).map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {relatedPost.category && (
                    <div className="mb-3">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {relatedPost.category}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-lg font-semibold text-black mb-3 line-clamp-2">
                    <Link
                      href={`/articles/${relatedPost.slug}`}
                      className="hover:text-gray-600 transition-colors"
                    >
                      {relatedPost.title}
                    </Link>
                  </h3>
                  
                  {relatedPost.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <time>{formatDate(relatedPost.created_at)}</time>
                    <span className="mx-2">•</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{estimateReadingTime(relatedPost.content)} 읽기</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
} 