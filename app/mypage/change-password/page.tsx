'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません')
      return
    }

    if (newPassword.length < 8) {
      setError('パスワードは8文字以上で入力してください')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'パスワード変更に失敗しました')
        return
      }

      // パスワード変更成功 - マイページにリダイレクト
      router.push('/mypage')
      router.refresh()
    } catch (error) {
      console.error('パスワード変更エラー:', error)
      setError('パスワード変更に失敗しました')
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
            パスワード<span className="text-[#ff0066] neon-text">変更</span>
          </h1>
          <p className="mt-2 text-sm text-white/60">
            初回ログインのため、パスワードの変更が必要です
          </p>
        </div>

        {/* フォーム */}
        <div className="bg-black/50 backdrop-blur-md border border-[#ff0066]/30 rounded-2xl p-8 neon-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-white/80 mb-2">
                現在のパスワード
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff0066] transition-colors"
                placeholder="現在のパスワード"
              />
              <p className="mt-2 text-xs text-white/50">
                初回ログインの場合、メールアドレスを入力してください
              </p>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-white/80 mb-2">
                新しいパスワード
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff0066] transition-colors"
                placeholder="8文字以上"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                新しいパスワード（確認）
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff0066] transition-colors"
                placeholder="確認用"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#ff0066] to-[#ff3399] text-black font-bold text-lg rounded-xl neon-box neon-box-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '変更中...' : 'パスワードを変更'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
