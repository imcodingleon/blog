import { User, Target, Heart } from "lucide-react"

export default function About() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">About</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">Modern Blog에 대해 더 자세히 알아보세요</p>
        </div>

        {/* Main Content */}
        <div className="mt-16 space-y-16">
          <section>
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-black mr-3" />
              <h2 className="text-2xl font-bold text-black">소개</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Modern Blog는 깔끔하고 모던한 디자인을 추구하는 블로그입니다. 웹 개발, 디자인, 그리고 기술에 대한 다양한
                인사이트를 공유하며, 독자들에게 유용한 정보를 제공하는 것을 목표로 합니다.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                우리는 복잡함보다는 단순함을, 화려함보다는 실용성을 추구합니다. Black and White의 미니멀한 컬러 팔레트를
                통해 콘텐츠에 집중할 수 있는 환경을 제공합니다.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-black mr-3" />
              <h2 className="text-2xl font-bold text-black">목표</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-gray-50 p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-3">품질 높은 콘텐츠</h3>
                <p className="text-gray-600">
                  깊이 있고 실용적인 정보를 제공하여 독자들의 성장에 도움이 되는 콘텐츠를 만들어갑니다.
                </p>
              </div>
              <div className="bg-gray-50 p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-3">사용자 경험</h3>
                <p className="text-gray-600">
                  모든 디바이스에서 최적화된 읽기 경험을 제공하며, 직관적이고 접근하기 쉬운 인터페이스를 구현합니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-6">
              <Heart className="h-6 w-6 text-black mr-3" />
              <h2 className="text-2xl font-bold text-black">가치</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-lg font-semibold text-black">단순함</h3>
                <p className="text-gray-600 mt-2">
                  불필요한 요소를 제거하고 핵심에 집중하는 미니멀한 디자인을 추구합니다.
                </p>
              </div>
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-lg font-semibold text-black">접근성</h3>
                <p className="text-gray-600 mt-2">모든 사용자가 쉽게 접근하고 이용할 수 있는 웹사이트를 만듭니다.</p>
              </div>
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-lg font-semibold text-black">품질</h3>
                <p className="text-gray-600 mt-2">검증된 정보와 실무 경험을 바탕으로 한 고품질 콘텐츠를 제공합니다.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
