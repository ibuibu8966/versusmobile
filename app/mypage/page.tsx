'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Line {
  id: string
  phoneNumber: string | null
  iccid: string | null
  lineStatus: string
  contractMonth: string | null
  createdAt: string
  application: {
    id: string
    planType: string
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

export default function MypageDashboard() {
  const router = useRouter()
  const [lines, setLines] = useState<Line[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLines()
  }, [])

  const fetchLines = async () => {
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

      setLines(data.lines || [])
    } catch (err) {
      console.error('回線取得エラー:', err)
      setError('回線情報の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      total: lines.length,
      opened: 0,
      shipped: 0,
      not_opened: 0,
      waiting_return: 0,
      returned: 0,
      canceled: 0,
    }

    lines.forEach(line => {
      counts[line.lineStatus] = (counts[line.lineStatus] || 0) + 1
    })

    return counts
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

  const statusCounts = getStatusCounts()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">ダッシュボード</h2>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">総回線数</div>
          <div className="text-3xl font-bold text-gray-900">{statusCounts.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">開通済</div>
          <div className="text-3xl font-bold text-green-600">{statusCounts.opened}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">発送済</div>
          <div className="text-3xl font-bold text-blue-600">{statusCounts.shipped}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">未開通</div>
          <div className="text-3xl font-bold text-gray-600">{statusCounts.not_opened}</div>
        </div>
      </div>

      {/* 追加発注ボタン */}
      <div className="mb-6">
        <Link
          href="/mypage/order"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          追加発注
        </Link>
      </div>

      {/* 回線一覧 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">回線一覧</h3>
        </div>

        {lines.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            回線情報がありません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    電話番号
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ICCID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    契約月
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    詳細
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lines.map((line) => {
                  const status = lineStatusLabels[line.lineStatus] || { label: line.lineStatus, color: 'bg-gray-100 text-gray-800' }
                  return (
                    <tr key={line.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {line.phoneNumber || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {line.iccid || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {line.contractMonth || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Link
                          href={`/mypage/lines/${line.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          詳細
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
