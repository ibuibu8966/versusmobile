'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

interface UserPayload {
  id: string
  email: string
  name: string
  contractorType: 'individual' | 'corporate'
  mustChangePassword: boolean
  isContractor: boolean
}

export default function MypageLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch {
        // ログインしていない場合は何もしない
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/user/logout', { method: 'POST' })
    router.push('/mypage/login')
    router.refresh()
  }

  // ログインページの場合は認証チェックをスキップ
  if (pathname === '/mypage/login') {
    return <>{children}</>
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen neon-gradient-bg flex items-center justify-center">
        <div className="text-white">読み込み中...</div>
      </div>
    )
  }

  // 未ログインの場合
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen neon-gradient-bg flex flex-col">
      {/* ヘッダー */}
      <header className="bg-black/80 backdrop-blur-md border-b border-[#ff0066]/30 sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/mypage" className="flex items-center space-x-2">
                <Image
                  src="/images/versus-logo.jpg"
                  alt="VERSUS MOBILE"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-lg font-bold text-white hidden sm:block">
                  マイページ
                </span>
              </Link>
              <nav className="hidden md:flex space-x-1">
                <Link
                  href="/mypage"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === '/mypage'
                      ? 'bg-[#ff0066]/20 text-[#ff0066] border border-[#ff0066]/50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  ダッシュボード
                </Link>
                <Link
                  href="/mypage/profile"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === '/mypage/profile'
                      ? 'bg-[#ff0066]/20 text-[#ff0066] border border-[#ff0066]/50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  契約者情報
                </Link>
                <Link
                  href="/mypage/order"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === '/mypage/order'
                      ? 'bg-[#ff0066]/20 text-[#ff0066] border border-[#ff0066]/50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  追加発注
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/70 hidden sm:block">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-white/70 hover:text-[#ff0066] transition-colors px-3 py-1 rounded border border-white/20 hover:border-[#ff0066]/50"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>

        {/* モバイルナビゲーション */}
        <div className="md:hidden border-t border-[#ff0066]/20">
          <nav className="flex justify-around py-2">
            <Link
              href="/mypage"
              className={`px-3 py-2 text-xs font-medium ${
                pathname === '/mypage' ? 'text-[#ff0066]' : 'text-white/70'
              }`}
            >
              ダッシュボード
            </Link>
            <Link
              href="/mypage/profile"
              className={`px-3 py-2 text-xs font-medium ${
                pathname === '/mypage/profile' ? 'text-[#ff0066]' : 'text-white/70'
              }`}
            >
              契約者情報
            </Link>
            <Link
              href="/mypage/order"
              className={`px-3 py-2 text-xs font-medium ${
                pathname === '/mypage/order' ? 'text-[#ff0066]' : 'text-white/70'
              }`}
            >
              追加発注
            </Link>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* フッター */}
      <footer className="bg-black/60 border-t border-[#ff0066]/20 py-4">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="text-sm text-white/50 hover:text-[#ff0066] transition-colors">
            トップページに戻る
          </Link>
        </div>
      </footer>
    </div>
  )
}
