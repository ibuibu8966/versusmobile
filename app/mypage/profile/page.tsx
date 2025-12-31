'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Profile {
  contractorType: 'individual' | 'corporate'
  email: string
  lastName?: string
  firstName?: string
  lastNameKana?: string
  firstNameKana?: string
  companyName?: string
  companyNameKana?: string
  corporateNumber?: string
  representativeLastName?: string
  representativeFirstName?: string
  representativeLastNameKana?: string
  representativeFirstNameKana?: string
  representativeBirthDate?: string
  representativePostalCode?: string
  representativeAddress?: string
  contactLastName?: string
  contactFirstName?: string
  contactLastNameKana?: string
  contactFirstNameKana?: string
  phone?: string
  postalCode?: string
  address?: string
  dateOfBirth?: string
  idCardFrontUrl?: string
  idCardBackUrl?: string
  registrationUrl?: string
  expirationDate?: string
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

      setProfile(data.profile)
    } catch (err) {
      console.error('契約者情報取得エラー:', err)
      setError('契約者情報の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">契約者情報</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">基本情報</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <dt className="text-sm text-gray-500">契約者タイプ</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.contractorType === 'corporate' ? '法人' : '個人'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">メールアドレス</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">電話番号</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.phone || '-'}</dd>
            </div>
          </div>
        </div>

        {/* 個人情報または法人情報 */}
        {profile.contractorType === 'individual' ? (
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">契約者情報</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <dt className="text-sm text-gray-500">氏名</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.lastName} {profile.firstName}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">氏名（カナ）</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.lastNameKana} {profile.firstNameKana}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">生年月日</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(profile.dateOfBirth)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">郵便番号</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.postalCode || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">住所</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.address || '-'}</dd>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">法人情報</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">会社名</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.companyName || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">会社名（カナ）</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.companyNameKana || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">法人番号</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.corporateNumber || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">郵便番号</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.postalCode || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">住所</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.address || '-'}</dd>
                </div>
              </div>
            </div>

            {/* 代表者情報 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">代表者情報</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">代表者名</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.representativeLastName} {profile.representativeFirstName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">代表者名（カナ）</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.representativeLastNameKana} {profile.representativeFirstNameKana}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">生年月日</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(profile.representativeBirthDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">郵便番号</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.representativePostalCode || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">住所</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.representativeAddress || '-'}</dd>
                </div>
              </div>
            </div>

            {/* 担当者情報 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">担当者情報</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">担当者名</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.contactLastName} {profile.contactFirstName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">担当者名（カナ）</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.contactLastNameKana} {profile.contactFirstNameKana}
                  </dd>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 書類情報 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">登録書類</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <dt className="text-sm text-gray-500">身分証明書（表）</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.idCardFrontUrl ? '登録済み' : '未登録'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">身分証明書（裏）</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.idCardBackUrl ? '登録済み' : '未登録'}
              </dd>
            </div>
            {profile.contractorType === 'corporate' && (
              <div>
                <dt className="text-sm text-gray-500">登記簿謄本</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.registrationUrl ? '登録済み' : '未登録'}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-gray-500">身分証有効期限</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(profile.expirationDate)}
              </dd>
            </div>
          </div>
        </div>

        {/* パスワード変更 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">セキュリティ</h3>
          </div>
          <div className="p-4">
            <Link
              href="/mypage/change-password"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              パスワードを変更
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
