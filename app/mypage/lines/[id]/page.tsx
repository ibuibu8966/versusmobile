'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Line {
  id: string
  phoneNumber: string | null
  iccid: string | null
  lineStatus: string
  contractMonth: string | null
  shipmentDate: string | null
  returnDate: string | null
  createdAt: string
  updatedAt: string
  application: {
    id: string
    planType: string
    applicantType: string
    companyName: string | null
    lastName: string | null
    firstName: string | null
    createdAt: string
  }
}

const lineStatusLabels: Record<string, { label: string; color: string }> = {
  not_opened: { label: '未開通', color: 'bg-gray-100 text-gray-800' },
  opened: { label: '開通済', color: 'bg-green-100 text-green-800' },
  shipped: { label: '発送済', color: 'bg-blue-100 text-blue-800' },
  waiting_return: { label: '返却待ち', color: 'bg-yellow-100 text-yellow-800' },
  returned: { label: '返却済', color: 'bg-purple-100 text-purple-800' },
  canceled: { label: 'キャンセル', color: 'bg-red-100 text-red-800' },
}

const planTypeLabels: Record<string, string> = {
  '3month-50plus': '50回線以上プラン',
  '3month-under50': '50回線未満プラン',
}

export default function LineDetailPage() {
  const router = useRouter()
  const params = useParams()
  const lineId = params.id as string

  const [line, setLine] = useState<Line | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (lineId) {
      fetchLineDetail()
    }
  }, [lineId])

  const fetchLineDetail = async () => {
    try {
      const response = await fetch('/api/user/lines')
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
        setError(data.error || '回線情報の取得に失敗しました')
        return
      }

      const foundLine = data.lines?.find((l: Line) => l.id === lineId)
      if (!foundLine) {
        setError('回線が見つかりませんでした')
        return
      }

      setLine(foundLine)
    } catch (err) {
      console.error('回線取得エラー:', err)
      setError('回線情報の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link href="/mypage" className="text-blue-600 hover:text-blue-800">
          ダッシュボードに戻る
        </Link>
      </div>
    )
  }

  if (!line) {
    return null
  }

  const status = lineStatusLabels[line.lineStatus] || { label: line.lineStatus, color: 'bg-gray-100 text-gray-800' }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/mypage" className="text-blue-600 hover:text-blue-800 text-sm">
          &larr; ダッシュボードに戻る
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 mt-2">回線詳細</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 回線情報 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">回線情報</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <dt className="text-sm text-gray-500">電話番号</dt>
              <dd className="mt-1 text-lg font-medium text-gray-900">
                {line.phoneNumber || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">ICCID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">
                {line.iccid || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">ステータス</dt>
              <dd className="mt-1">
                <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">契約月</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {line.contractMonth || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">発送日</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(line.shipmentDate)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">返却日</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(line.returnDate)}
              </dd>
            </div>
          </div>
        </div>

        {/* 申込情報 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">申込情報</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <dt className="text-sm text-gray-500">契約者名</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {line.application.applicantType === 'corporate'
                  ? line.application.companyName
                  : `${line.application.lastName || ''} ${line.application.firstName || ''}`}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">契約者タイプ</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {line.application.applicantType === 'corporate' ? '法人' : '個人'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">プラン</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {planTypeLabels[line.application.planType] || line.application.planType}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">申込日</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(line.application.createdAt)}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
