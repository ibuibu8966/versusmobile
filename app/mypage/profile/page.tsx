'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Profile {
  user: {
    id: string
    email: string
    name: string
    contractorType: 'individual' | 'corporate'
  }
  applications: Array<{
    id: string
    lastName?: string
    firstName?: string
    companyName?: string
    phone?: string
    postalCode?: string
    address?: string
    applicantType: string
  }>
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()

      if (!response.ok) {
        if (data.requirePasswordChange) {
          router.push('/mypage/change-password')
          return
        }
        if (response.status === 401) {
          router.push('/mypage/login')
          return
        }
        setError(data.error || '契約者情報の取得に失敗しました')
        return
      }

      setProfile(data)
    } catch (err) {
      console.error('契約者情報取得エラー:', err)
      setError('契約者情報の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-white/70">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const primaryApp = profile.applications[0]

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          契約者<span className="text-[#ff0066] neon-text">情報</span>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 基本情報 */}
        <div className="bg-black/40 backdrop-blur-sm border border-[#ff0066]/30 rounded-2xl overflow-hidden neon-border">
          <div className="px-4 sm:px-6 py-4 border-b border-[#ff0066]/20">
            <h3 className="text-lg font-bold text-white">基本情報</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <dt className="text-sm text-white/50">契約者タイプ</dt>
              <dd className="mt-1 text-white">
                {profile.user.contractorType === 'corporate' ? '法人' : '個人'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">契約者名</dt>
              <dd className="mt-1 text-white">{profile.user.name || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">メールアドレス</dt>
              <dd className="mt-1 text-white">{profile.user.email}</dd>
            </div>
            {primaryApp && (
              <>
                <div>
                  <dt className="text-sm text-white/50">電話番号</dt>
                  <dd className="mt-1 text-white">{primaryApp.phone || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-white/50">郵便番号</dt>
                  <dd className="mt-1 text-white">{primaryApp.postalCode || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-white/50">住所</dt>
                  <dd className="mt-1 text-white">{primaryApp.address || '-'}</dd>
                </div>
              </>
            )}
          </div>
        </div>

        {/* セキュリティ */}
        <div className="bg-black/40 backdrop-blur-sm border border-[#ff0066]/30 rounded-2xl overflow-hidden neon-border">
          <div className="px-4 sm:px-6 py-4 border-b border-[#ff0066]/20">
            <h3 className="text-lg font-bold text-white">セキュリティ</h3>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-white/70 text-sm mb-4">
              セキュリティ強化のため、定期的なパスワード変更をお勧めします。
            </p>
            <Link
              href="/mypage/change-password"
              className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 hover:border-[#ff0066]/50 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2 text-[#ff0066]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              パスワードを変更
            </Link>
          </div>
        </div>

        {/* 申込履歴 */}
        <div className="bg-black/40 backdrop-blur-sm border border-[#ff0066]/30 rounded-2xl overflow-hidden neon-border md:col-span-2">
          <div className="px-4 sm:px-6 py-4 border-b border-[#ff0066]/20">
            <h3 className="text-lg font-bold text-white">申込履歴</h3>
          </div>
          <div className="p-4 sm:p-6">
            {profile.applications.length === 0 ? (
              <p className="text-white/50">申込履歴がありません</p>
            ) : (
              <div className="space-y-3">
                {profile.applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div>
                      <div className="text-white font-medium">
                        {app.applicantType === 'corporate' ? app.companyName : `${app.lastName} ${app.firstName}`}
                      </div>
                      <div className="text-sm text-white/50">ID: {app.id.slice(0, 8)}...</div>
                    </div>
                    <span className="text-xs text-[#ff0066]">
                      {app.applicantType === 'corporate' ? '法人' : '個人'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
