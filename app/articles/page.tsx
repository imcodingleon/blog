import Link from "next/link"
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react"
import { getPublishedPosts, getAllCategories } from "@/lib/blog-service"
import { formatDate, estimateReadingTime, truncateText } from "@/lib/utils"
import { Suspense } from "react"

interface ArticlesPageProps {
  searchParams: {
    category?: string;
    page?: string;
    search?: string;
  }
}

// 클라이언트 컴포넌트로 분리할 필터링/검색 컴포넌트
function CategoryFilter({ categories, currentCategory }: { 
  categories: string[], 
  currentCategory?: string 
}) {
  return (
    <div className="mt-12 flex flex-wrap justify-center gap-2">
      <Link
        href="/articles"
        className={`px-4 py-2 text-sm font-medium border transition-colors ${
          !currentCategory
            ? "bg-black text-white border-black"
            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
        }`}
      >
        전체
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/articles?category=${encodeURIComponent(category)}`}
          className={`px-4 py-2 text-sm font-medium border transition-colors ${
            currentCategory === category
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}

function SearchForm({ initialSearch }: { initialSearch?: string }) {
  return (
    <div className="mt-8 max-w-md mx-auto">
      <form action="/articles" method="GET" className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          name="search"
          defaultValue={initialSearch}
          placeholder="글 제목이나 내용으로 검색..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-1 text-sm rounded hover:bg-gray-800 transition-colors"
        >
          검색
        </button>
      </form>
    </div>
  );
}

function Pagination({ 
  currentPage, 
  hasMore, 
  category, 
  search 
}: { 
  currentPage: number, 
  hasMore: boolean, 
  category?: string, 
  search?: string 
}) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (page > 1) params.set('page', page.toString());
    
    const queryString = params.toString();
    return `/articles${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="mt-12 flex justify-center gap-4">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          이전 페이지
        </Link>
      )}
      
      <span className="px-4 py-2 bg-black text-white">
        {currentPage}
      </span>
      
      {hasMore && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          다음 페이지
        </Link>
      )}
    </div>
  );
}

export default async function Articles({ searchParams }: ArticlesPageProps) {
  const category = searchParams.category;
  const search = searchParams.search;
  const page = parseInt(searchParams.page || '1');
  const postsPerPage = 9;

  // 실제 데이터베이스에서 데이터 가져오기
  const [postsResponse, allCategories] = await Promise.all([
    getPublishedPosts({
      category,
      limit: postsPerPage,
      offset: (page - 1) * postsPerPage,
      sortBy: 'created_at',
      sortOrder: 'desc'
    }),
    getAllCategories()
  ]);

  // 카테고리 목록에서 실제 사용되는 카테고리만 추출
  const usedCategories = allCategories.map(cat => cat.name);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">Articles</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            개발과 디자인에 대한 인사이트를 공유합니다
            {category && ` • ${category} 카테고리`}
            {search && ` • "${search}" 검색 결과`}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            총 {postsResponse.totalCount}개의 글
          </p>
        </div>

        {/* Search */}
        <SearchForm initialSearch={search} />

        {/* Categories */}
        <CategoryFilter categories={usedCategories} currentCategory={category} />

        {/* Articles Grid */}
        {postsResponse.posts.length > 0 ? (
          <>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {postsResponse.posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      {post.category && (
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                          {post.category}
                        </span>
                      )}
                      {post.view_count > 0 && (
                        <span className="text-xs text-gray-500">
                          조회 {post.view_count}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-black mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt ? truncateText(post.excerpt, 150) : truncateText(post.content, 150)}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{post.tags.length - 3}개
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <time>{formatDate(post.created_at)}</time>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{estimateReadingTime(post.content)} 읽기</span>
                      </div>
                    </div>

                    <Link
                      href={`/articles/${post.slug}`}
                      className="inline-flex items-center text-black font-medium hover:text-gray-600 transition-colors"
                    >
                      더 읽기
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <Pagination 
              currentPage={page}
              hasMore={postsResponse.hasMore}
              category={category}
              search={search}
            />
          </>
        ) : (
          <div className="mt-16 text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {search ? `"${search}"에 대한 검색 결과가 없습니다` : 
               category ? `"${category}" 카테고리에 글이 없습니다` : 
               '아직 게시된 글이 없습니다'}
            </h3>
            <p className="mt-2 text-gray-500">
              {search || category ? (
                <Link href="/articles" className="text-black hover:text-gray-600">
                  모든 글 보기 →
                </Link>
              ) : (
                '첫 번째 글을 작성해보세요!'
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
