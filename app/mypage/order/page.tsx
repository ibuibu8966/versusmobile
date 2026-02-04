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
    phone?: string
    address?: string
  }>
}

const planOptions = [
  {
    id: 'auth-50plus',
    name: '認証用SIM（50回線以上）',
    price: 3300,
    minLines: 50,
    maxLines: 1000,
    description: '1回払い・50回線以上',
  },
  {
    id: 'auth-under50',
    name: '認証用SIM（50回線未満）',
    price: 3600,
    minLines: 1,
    maxLines: 49,
    description: '1回払い・1〜49回線',
  },
]

export default function AdditionalOrderPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [planType, setPlanType] = useState('')
  const [lineCount, setLineCount] = useState(1)
  const [step, setStep] = useState<'select' | 'confirm' | 'complete'>('select')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')

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

  const selectedPlan = planOptions.find(p => p.id === planType)
  const totalAmount = selectedPlan ? selectedPlan.price * lineCount : 0

  const handlePlanChange = (newPlanType: string) => {
    setPlanType(newPlanType)
    const plan = planOptions.find(p => p.id === newPlanType)
    if (plan) {
      setLineCount(plan.minLines)
    }
  }

  const handleSubmit = async () => {
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/user/additional-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, lineCount }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '追加発注に失敗しました')
        return
      }

      setOrderId(data.application.id)
      setStep('complete')
    } catch (err) {
      console.error('追加発注エラー:', err)
      setError('追加発注に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-white/70">読み込み中...</div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">追加発注が完了しました</h2>
          <p className="text-white/70 mb-6">
            ご注文ありがとうございます。<br />
            担当者より確認のご連絡をさせていただきます。
          </p>
          <p className="text-sm text-white/50 mb-6">
            注文ID: {orderId}
          </p>
          <Link
            href="/mypage"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#ff0066] to-[#ff3399] text-black font-bold rounded-xl neon-box neon-box-hover transition-all duration-300"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </div>
    )
  }

  const primaryApp = profile?.applications[0]

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <Link href="/mypage" className="text-[#ff0066] hover:text-[#ff3399] text-sm transition-colors">
          &larr; ダッシュボードに戻る
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
          追加<span className="text-[#ff0066] neon-text">発注</span>
        </h2>
        <p className="text-white/60 mt-1">
          登録済みの契約者情報を使用して追加発注を行います
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {step === 'select' && (
        <div className="space-y-6">
          {/* 契約者情報表示 */}
          <div className="bg-black/40 backdrop-blur-sm border border-[#ff0066]/30 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg font-bold text-white mb-4">契約者情報</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-white/50">契約者名</dt>
                <dd className="text-white mt-1">{profile?.user.name || '-'}</dd>
              </div>
              <div>
                <dt className="text-white/50">メールアドレス</dt>
                <dd className="text-white mt-1">{profile?.user.email || '-'}</dd>
              </div>
              <div>
                <dt className="text-white/50">電話番号</dt>
                <dd className="text-white mt-1">{primaryApp?.phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-white/50">住所</dt>
                <dd className="text-white mt-1">{primaryApp?.address || '-'}</dd>
              </div>
            </div>
          </div>

          {/* プラン選択 */}
          <div className="bg-black/40 backdrop-blur-sm border border-[#ff0066]/30 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg font-bold text-white mb-4">プラン選択</h3>
            <div className="space-y-3">
              {planOptions.map((plan) => (
                <label
                  key={plan.id}
                  className={`block p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                    planType === plan.id
                      ? 'border-[#ff0066] bg-[#ff0066]/10'
                      : 'border-white/20 hover:border-white/40 bg-white/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="planType"
                    value={plan.id}
                    checked={planType === plan.id}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{plan.name}</div>
                      <div className="text-sm text-white/60">{plan.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#ff0066]">
                        ¥{plan.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">/回線</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 回線数入力 */}
          {planType && (
            <div className="bg-black/40 backdrop-blur-sm border border-[#ff0066]/30 rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg font-bold text-white mb-4">回線数</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min={selectedPlan?.minLines}
                  max={selectedPlan?.maxLines}
                  value={lineCount}
                  onChange={(e) => setLineCount(parseInt(e.target.value) || 1)}
                  className="w-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#ff0066] transition-colors"
                />
                <span className="text-white/70">回線</span>
              </div>
              <p className="text-sm text-white/50 mt-2">
                {selectedPlan?.minLines}〜{selectedPlan?.maxLines}回線で指定してください
              </p>
            </div>
          )}

          {/* 合計金額 */}
          {planType && (
            <div className="bg-[#ff0066]/10 border border-[#ff0066]/30 rounded-2xl p-4 sm:p-6">
              <div className="flex justify-between items-center">
                <span className="text-white/80">合計金額</span>
                <span className="text-3xl font-bold text-[#ff0066] neon-text">
                  ¥{totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-white/50 mt-1 text-right">
                ({selectedPlan?.price.toLocaleString()}円 × {lineCount}回線)
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setStep('confirm')}
              disabled={!planType || lineCount < 1}
              className="px-8 py-3 bg-gradient-to-r from-[#ff0066] to-[#ff3399] text-black font-bold rounded-xl neon-box neon-box-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              確認画面へ
            </button>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="space-y-6">
          <div className="bg-black/40 backdrop-blur-sm border border-[#ff0066]/30 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg font-bold text-white mb-6">注文内容の確認</h3>

            <div className="border-b border-[#ff0066]/20 pb-4 mb-4">
              <h4 className="text-sm font-medium text-[#ff0066] mb-2">契約者情報</h4>
              <div className="text-sm text-white">
                <p>{profile?.user.name}</p>
                <p className="text-white/70">{profile?.user.email}</p>
                <p className="text-white/70">{primaryApp?.phone}</p>
                <p className="text-white/70">{primaryApp?.address}</p>
              </div>
            </div>

            <div className="border-b border-[#ff0066]/20 pb-4 mb-4">
              <h4 className="text-sm font-medium text-[#ff0066] mb-2">プラン</h4>
              <p className="text-white">{selectedPlan?.name}</p>
            </div>

            <div className="border-b border-[#ff0066]/20 pb-4 mb-4">
              <h4 className="text-sm font-medium text-[#ff0066] mb-2">回線数</h4>
              <p className="text-white">{lineCount}回線</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#ff0066] mb-2">合計金額</h4>
              <p className="text-3xl font-bold text-white">
                ¥{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep('select')}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              戻る
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-[#ff0066] to-[#ff3399] text-black font-bold rounded-xl neon-box neon-box-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '発注中...' : '発注を確定する'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
