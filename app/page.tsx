import Link from "next/link"
import { ArrowRight, BookOpen, Users, MessageCircle } from "lucide-react"

export default function Home() {
  const featuredArticles = [
    {
      id: 1,
      title: "모던 웹 개발의 트렌드",
      excerpt: "2024년 웹 개발에서 주목해야 할 최신 기술과 트렌드를 살펴봅니다.",
      date: "2024년 1월 15일",
      readTime: "5분",
    },
    {
      id: 2,
      title: "React 18의 새로운 기능들",
      excerpt: "React 18에서 도입된 Concurrent Features와 Suspense의 활용법을 알아봅니다.",
      date: "2024년 1월 10일",
      readTime: "8분",
      readTime: "8분",
    },
    {
      id: 3,
      title: "TypeScript 베스트 프랙티스",
      excerpt: "TypeScript를 효과적으로 사용하기 위한 실무 팁과 패턴들을 소개합니다.",
      date: "2024년 1월 5일",
      readTime: "6분",
    },
  ]

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
            {featuredArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <time>{article.date}</time>
                  <span className="mx-2">•</span>
                  <span>{article.readTime} 읽기</span>
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <Link
                  href={`/articles/${article.id}`}
                  className="inline-flex items-center text-black font-medium hover:text-gray-600 transition-colors"
                >
                  더 읽기
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
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
              <dt className="mt-4 text-3xl font-bold text-black">50+</dt>
              <dd className="text-gray-600">발행된 글</dd>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-8 w-8 text-black" />
              </div>
              <dt className="mt-4 text-3xl font-bold text-black">1,000+</dt>
              <dd className="text-gray-600">독자</dd>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <MessageCircle className="h-8 w-8 text-black" />
              </div>
              <dt className="mt-4 text-3xl font-bold text-black">200+</dt>
              <dd className="text-gray-600">댓글</dd>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
