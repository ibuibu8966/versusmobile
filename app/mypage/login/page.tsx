'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function UserLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'ログインに失敗しました')
        return
      }

      // パスワード変更が必要な場合
      if (data.mustChangePassword) {
        router.push('/mypage/change-password')
        router.refresh()
        return
      }

      // ログイン成功 - マイページにリダイレクト
      router.push('/mypage')
      router.refresh()
    } catch (error) {
      console.error('ログインエラー:', error)
      setError('ログインに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen neon-gradient-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ff0066]/10 rounded-full blur-[150px] z-0"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#ff3399]/10 rounded-full blur-[100px] z-0"></div>

      <div className="max-w-md w-full relative z-10">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/versus-logo.jpg"
              alt="VERSUS MOBILE"
              width={80}
              height={80}
              className="mx-auto rounded-full drop-shadow-[0_0_30px_rgba(255,0,102,0.5)]"
            />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-white">
            マイページ<span className="text-[#ff0066] neon-text">ログイン</span>
          </h1>
          <p className="mt-2 text-sm text-white/60">
            契約情報の確認・追加発注ができます
          </p>
        </div>

        {/* ログインフォーム */}
        <div className="bg-black/50 backdrop-blur-md border border-[#ff0066]/30 rounded-2xl p-8 neon-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff0066] transition-colors"
                placeholder="example@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff0066] transition-colors"
                placeholder="パスワード"
              />
              <p className="mt-2 text-xs text-white/50">
                初回ログインの場合、パスワードはメールアドレスと同じです
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#ff0066] to-[#ff3399] text-black font-bold text-lg rounded-xl neon-box neon-box-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
        </div>

        {/* トップページへのリンク */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-[#ff0066] transition-colors"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
