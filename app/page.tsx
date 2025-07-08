import Link from "next/link"
import { ArrowRight, BookOpen, Users, MessageCircle } from "lucide-react"
import { getRecentPosts, getBlogStats } from "@/lib/blog-service"
import { formatDate, estimateReadingTime, truncateText } from "@/lib/utils"

export default async function Home() {
  // 실제 데이터베이스에서 데이터 가져오기
  const [recentPosts, blogStats] = await Promise.all([
    getRecentPosts(3), // 최근 3개 글
    getBlogStats()
  ]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">AI 개발자 배성현의 블로그</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              AI 개발과 최신 기술 트렌드에 대한 깊이 있는 인사이트를 공유합니다. 실무 경험과 기술적 노하우를 통해 함께
              성장해나가요.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/articles"
                className="bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
              >
                글 읽어보기
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-black hover:text-gray-600 transition-colors"
              >
                더 알아보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">최신 글</h2>
            <p className="mt-4 text-lg text-gray-600">최근에 발행된 글들을 확인해보세요</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <time>{formatDate(post.created_at)}</time>
                    <span className="mx-2">•</span>
                    <span>{estimateReadingTime(post.content)} 읽기</span>
                    {post.view_count > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <span>조회 {post.view_count}</span>
                      </>
                    )}
                  </div>
                  
                  {post.category && (
                    <div className="mb-3">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold text-black mb-3">{post.title}</h3>
                  
                  <p className="text-gray-600 mb-4">
                    {post.excerpt ? truncateText(post.excerpt, 120) : truncateText(post.content, 120)}
                  </p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <Link
                    href={`/articles/${post.slug}`}
                    className="inline-flex items-center text-black font-medium hover:text-gray-600 transition-colors"
                  >
                    더 읽기
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">아직 게시된 글이 없습니다</h3>
                <p className="mt-2 text-gray-500">첫 번째 글을 작성해보세요!</p>
              </div>
            )}
          </div>

          {recentPosts.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/articles"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                모든 글 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center">
                <BookOpen className="h-8 w-8 text-black" />
              </div>
              <dt className="mt-4 text-3xl font-bold text-black">
                {blogStats.publishedPosts}
              </dt>
              <dd className="text-gray-600">발행된 글</dd>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-8 w-8 text-black" />
              </div>
              <dt className="mt-4 text-3xl font-bold text-black">
                {blogStats.totalViews.toLocaleString()}
              </dt>
              <dd className="text-gray-600">총 조회수</dd>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <MessageCircle className="h-8 w-8 text-black" />
              </div>
              <dt className="mt-4 text-3xl font-bold text-black">
                {blogStats.categoriesCount}
              </dt>
              <dd className="text-gray-600">카테고리</dd>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
