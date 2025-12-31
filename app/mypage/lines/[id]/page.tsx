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
  not_opened: { label: '未開通', color: 'bg-white/10 text-white/70 border-white/20' },
  opened: { label: '開通済', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  shipped: { label: '発送済', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  waiting_return: { label: '返却待ち', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  returned: { label: '返却済', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  canceled: { label: 'キャンセル', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-white/70">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <Link href="/mypage" className="text-[#ff0066] hover:text-[#ff3399] transition-colors">
          ダッシュボードに戻る
        </Link>
      </div>
    )
  }

  if (!line) {
    return null
  }

  const status = lineStatusLabels[line.lineStatus] || { label: line.lineStatus, color: 'bg-white/10 text-white/70 border-white/20' }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <Link href="/mypage" className="text-[#ff0066] hover:text-[#ff3399] text-sm transition-colors">
          &larr; ダッシュボードに戻る
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
          回線<span className="text-[#ff0066] neon-text">詳細</span>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 回線情報 */}
        <div className="bg-black/40 backdrop-blur-sm border border-[#ff0066]/30 rounded-2xl overflow-hidden neon-border">
          <div className="px-4 sm:px-6 py-4 border-b border-[#ff0066]/20">
            <h3 className="text-lg font-bold text-white">回線情報</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <dt className="text-sm text-white/50">電話番号</dt>
              <dd className="mt-1 text-xl font-bold text-[#ff0066]">
                {line.phoneNumber || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">ICCID</dt>
              <dd className="mt-1 text-sm text-white font-mono">
                {line.iccid || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">ステータス</dt>
              <dd className="mt-1">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${status.color}`}>
                  {status.label}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">契約月</dt>
              <dd className="mt-1 text-white">
                {line.contractMonth || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">発送日</dt>
              <dd className="mt-1 text-white">
                {formatDate(line.shipmentDate)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">返却日</dt>
              <dd className="mt-1 text-white">
                {formatDate(line.returnDate)}
              </dd>
            </div>
          </div>
        </div>

        {/* 申込情報 */}
        <div className="bg-black/40 backdrop-blur-sm border border-[#ff0066]/30 rounded-2xl overflow-hidden neon-border">
          <div className="px-4 sm:px-6 py-4 border-b border-[#ff0066]/20">
            <h3 className="text-lg font-bold text-white">申込情報</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <dt className="text-sm text-white/50">契約者名</dt>
              <dd className="mt-1 text-white">
                {line.application.applicantType === 'corporate'
                  ? line.application.companyName
                  : `${line.application.lastName || ''} ${line.application.firstName || ''}`}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">契約者タイプ</dt>
              <dd className="mt-1 text-white">
                {line.application.applicantType === 'corporate' ? '法人' : '個人'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">プラン</dt>
              <dd className="mt-1 text-white">
                {planTypeLabels[line.application.planType] || line.application.planType}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">申込日</dt>
              <dd className="mt-1 text-white">
                {formatDate(line.application.createdAt)}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
