import Link from "next/link"

interface FooterProps {
  year: number
}

export default function Footer({ year }: FooterProps) {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold">
              AI 개발자 배성현의 블로그
            </Link>
            <p className="mt-4 text-gray-300 max-w-md">
              AI 개발과 기술에 대한 인사이트를 공유하는 배성현의 개인 블로그입니다. 최신 AI 기술과 개발 경험을 나누고
              있습니다.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-300 hover:text-white transition-colors">
                  Articles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://github.com/imcodingleon" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-center text-gray-300">© {year} Modern Blog. All rights reserved.</p>
          <p className="text-center text-gray-300 mt-2">
            Contact: <a href="mailto:skwogusdld@gmail.com" className="underline hover:text-white transition-colors">skwogusdld@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
