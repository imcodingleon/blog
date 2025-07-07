import { Mail, MapPin, Phone, Send } from "lucide-react"

export default function Contact() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">Contact</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">궁금한 점이 있으시면 언제든지 연락해주세요</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-8">연락처 정보</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-black mt-1 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-black">이메일</h3>
                  <p className="text-gray-600">contact@modernblog.com</p>
                  <p className="text-sm text-gray-500 mt-1">24시간 내에 답변드리겠습니다</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-black mt-1 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-black">전화</h3>
                  <p className="text-gray-600">+82 10-1234-5678</p>
                  <p className="text-sm text-gray-500 mt-1">평일 9:00 - 18:00</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-black mt-1 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-black">주소</h3>
                  <p className="text-gray-600">
                    서울특별시 강남구
                    <br />
                    테헤란로 123, 456호
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-black mb-6">자주 묻는 질문</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-black pl-4">
                  <h4 className="font-medium text-black">글 기고는 어떻게 하나요?</h4>
                  <p className="text-gray-600 text-sm mt-1">이메일로 연락주시면 기고 가이드라인을 안내해드립니다.</p>
                </div>
                <div className="border-l-4 border-black pl-4">
                  <h4 className="font-medium text-black">광고 문의는 어디로 하나요?</h4>
                  <p className="text-gray-600 text-sm mt-1">비즈니스 관련 문의는 이메일로 연락해주세요.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-8">메시지 보내기</h2>

            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors"
                  placeholder="이름을 입력해주세요"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors"
                  placeholder="이메일을 입력해주세요"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors"
                  placeholder="제목을 입력해주세요"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                  메시지 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors resize-none"
                  placeholder="메시지를 입력해주세요"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <Send className="h-4 w-4 mr-2" />
                메시지 보내기
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
