import { ReactNode } from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { redirect } from 'next/navigation'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

interface UserPayload {
  id: string
  email: string
  name: string
  contractorType: 'individual' | 'corporate'
  mustChangePassword: boolean
  isContractor: boolean
}

async function getUserSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('user-token')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as unknown as UserPayload
  } catch {
    return null
  }
}

export default async function MypageLayout({ children }: { children: ReactNode }) {
  const session = await getUserSession()

  // ログインページの場合は認証チェックをスキップ
  if (!session) {
    return <>{children}</>
  }

  // パスワード変更が必要な場合
  if (session.mustChangePassword) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-blue-600 shadow-md">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-white">
                VERSUS MOBILE マイページ
              </h1>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-blue-600 shadow-md">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">
                VERSUS MOBILE マイページ
              </h1>
              <nav className="flex space-x-4">
                <Link
                  href="/mypage"
                  className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  ダッシュボード
                </Link>
                <Link
                  href="/mypage/profile"
                  className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  契約者情報
                </Link>
                <Link
                  href="/mypage/order"
                  className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  追加発注
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-100">
                {session.name}
              </span>
              <form action="/api/user/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-blue-100 hover:text-white"
                >
                  ログアウト
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
