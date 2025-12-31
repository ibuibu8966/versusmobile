'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Profile {
  contractorType: 'individual' | 'corporate'
  email: string
  lastName?: string
  firstName?: string
  companyName?: string
  phone?: string
  postalCode?: string
  address?: string
}

const planOptions = [
  {
    id: '3month-50plus',
    name: '50回線以上プラン',
    price: 990,
    minLines: 50,
    maxLines: 1000,
    description: '3ヶ月契約・50回線以上',
  },
  {
    id: '3month-under50',
    name: '50回線未満プラン',
    price: 1100,
    minLines: 1,
    maxLines: 49,
    description: '3ヶ月契約・1〜49回線',
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

      setProfile(data.profile)
    } catch (err) {
      console.error('契約者情報取得エラー:', err)
      setError('契約者情報の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPlan = planOptions.find(p => p.id === planType)
  const totalAmount = selectedPlan ? selectedPlan.price * lineCount * 3 : 0

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
      <div className="p-6">
        <div className="text-center text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">追加発注が完了しました</h2>
            <p className="text-gray-600 mb-6">
              ご注文ありがとうございます。<br />
              担当者より確認のご連絡をさせていただきます。
            </p>
            <p className="text-sm text-gray-500 mb-6">
              注文ID: {orderId}
            </p>
            <Link
              href="/mypage"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ダッシュボードに戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/mypage" className="text-blue-600 hover:text-blue-800 text-sm">
            &larr; ダッシュボードに戻る
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">追加発注</h2>
          <p className="text-gray-600 mt-1">
            登録済みの契約者情報を使用して追加発注を行います
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {step === 'select' && (
          <div className="space-y-6">
            {/* 契約者情報表示 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">契約者情報</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">契約者名</dt>
                  <dd className="text-gray-900">
                    {profile?.contractorType === 'corporate'
                      ? profile?.companyName
                      : `${profile?.lastName || ''} ${profile?.firstName || ''}`}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">メールアドレス</dt>
                  <dd className="text-gray-900">{profile?.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">電話番号</dt>
                  <dd className="text-gray-900">{profile?.phone || '-'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">住所</dt>
                  <dd className="text-gray-900">{profile?.address || '-'}</dd>
                </div>
              </div>
            </div>

            {/* プラン選択 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">プラン選択</h3>
              <div className="space-y-3">
                {planOptions.map((plan) => (
                  <label
                    key={plan.id}
                    className={`block p-4 border rounded-lg cursor-pointer transition ${
                      planType === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
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
                        <div className="font-medium text-gray-900">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ¥{plan.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">/回線/月</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 回線数入力 */}
            {planType && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">回線数</h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min={selectedPlan?.minLines}
                    max={selectedPlan?.maxLines}
                    value={lineCount}
                    onChange={(e) => setLineCount(parseInt(e.target.value) || 1)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  />
                  <span className="text-gray-600">回線</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedPlan?.minLines}〜{selectedPlan?.maxLines}回線で指定してください
                </p>
              </div>
            )}

            {/* 合計金額 */}
            {planType && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">合計金額（3ヶ月分）</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ¥{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1 text-right">
                  ({selectedPlan?.price.toLocaleString()}円 × {lineCount}回線 × 3ヶ月)
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep('confirm')}
                disabled={!planType || lineCount < 1}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                確認画面へ
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">注文内容の確認</h3>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">契約者情報</h4>
                <div className="text-sm text-gray-900">
                  <p>
                    {profile?.contractorType === 'corporate'
                      ? profile?.companyName
                      : `${profile?.lastName || ''} ${profile?.firstName || ''}`}
                  </p>
                  <p>{profile?.email}</p>
                  <p>{profile?.phone}</p>
                  <p>{profile?.address}</p>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">プラン</h4>
                <p className="text-sm text-gray-900">{selectedPlan?.name}</p>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">回線数</h4>
                <p className="text-sm text-gray-900">{lineCount}回線</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">合計金額（3ヶ月分）</h4>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('select')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                戻る
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '発注中...' : '発注を確定する'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
