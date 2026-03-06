'use client'

import { usePathname } from 'next/navigation'

export default function RedirectBanner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // adminページはそのまま表示
  if (pathname.startsWith('/admin')) {
    return <>{children}</>
  }

  // それ以外は移転メッセージのみ表示
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center px-6 max-w-2xl">
        <div className="text-4xl sm:text-5xl font-bold mb-6">
          <span className="text-white">VERSUS</span>
          <span className="text-[#ff0066] ml-2">MOBILE</span>
        </div>
        <div className="bg-[#ff0066]/10 border border-[#ff0066]/30 rounded-2xl p-8 mb-8">
          <p className="text-white text-xl sm:text-2xl font-bold mb-4">
            サイト移転のお知らせ
          </p>
          <p className="text-white/80 text-base sm:text-lg mb-6">
            こちらのサイトは下記URLに移転しました。
          </p>
          <a
            href="https://supermobile-lines-versus.vercel.app/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#ff0066] to-[#ff3399] text-white font-bold text-lg rounded-xl hover:opacity-90 transition-opacity"
          >
            新サイトへ移動する
          </a>
          <p className="text-white/60 text-sm mt-4 break-all">
            https://supermobile-lines-versus.vercel.app/
          </p>
        </div>
      </div>
    </div>
  )
}
