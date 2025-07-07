import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export default function Articles() {
  const articles = [
    {
      id: 1,
      title: "모던 웹 개발의 트렌드",
      excerpt:
        "2024년 웹 개발에서 주목해야 할 최신 기술과 트렌드를 살펴봅니다. React Server Components, Edge Computing, 그리고 AI 통합에 대해 알아보세요.",
      date: "2024년 1월 15일",
      readTime: "5분",
      category: "웹 개발",
    },
    {
      id: 2,
      title: "React 18의 새로운 기능들",
      excerpt:
        "React 18에서 도입된 Concurrent Features와 Suspense의 활용법을 알아봅니다. 성능 최적화와 사용자 경험 개선 방법을 다룹니다.",
      date: "2024년 1월 10일",
      readTime: "8분",
      category: "React",
    },
    {
      id: 3,
      title: "TypeScript 베스트 프랙티스",
      excerpt:
        "TypeScript를 효과적으로 사용하기 위한 실무 팁과 패턴들을 소개합니다. 타입 안정성과 개발 생산성을 높이는 방법을 알아보세요.",
      date: "2024년 1월 5일",
      readTime: "6분",
      category: "TypeScript",
    },
    {
      id: 4,
      title: "CSS Grid와 Flexbox 마스터하기",
      excerpt: "현대적인 CSS 레이아웃 기법인 Grid와 Flexbox를 완전히 이해하고 실무에 적용하는 방법을 배워봅시다.",
      date: "2023년 12월 28일",
      readTime: "7분",
      category: "CSS",
    },
    {
      id: 5,
      title: "Next.js 13 App Router 완벽 가이드",
      excerpt: "Next.js 13의 새로운 App Router를 활용한 풀스택 애플리케이션 개발 방법을 단계별로 설명합니다.",
      date: "2023년 12월 20일",
      readTime: "10분",
      category: "Next.js",
    },
    {
      id: 6,
      title: "웹 접근성의 중요성과 구현 방법",
      excerpt: "모든 사용자가 접근할 수 있는 웹사이트를 만들기 위한 접근성 가이드라인과 실제 구현 방법을 알아봅니다.",
      date: "2023년 12월 15일",
      readTime: "9분",
      category: "접근성",
    },
  ]

  const categories = ["전체", "웹 개발", "React", "TypeScript", "CSS", "Next.js", "접근성"]

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">Articles</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">개발과 디자인에 대한 인사이트를 공유합니다</p>
        </div>

        {/* Categories */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 text-sm font-medium border transition-colors ${
                category === "전체"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                    {article.category}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-black mb-3 line-clamp-2">{article.title}</h3>

                <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <time>{article.date}</time>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{article.readTime} 읽기</span>
                  </div>
                </div>

                <Link
                  href={`/articles/${article.id}`}
                  className="inline-flex items-center text-black font-medium hover:text-gray-600 transition-colors"
                >
                  더 읽기
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
            더 많은 글 보기
          </button>
        </div>
      </div>
    </div>
  )
}
