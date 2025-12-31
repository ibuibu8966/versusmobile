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
  not_opened: { label: '未開通', color: 'bg-white/10 text-white/70 border-white/20' },
  opened: { label: '開通済', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  shipped: { label: '発送済', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  waiting_return: { label: '返却待ち', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  returned: { label: '返却済', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  canceled: { label: 'キャンセル', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
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

  const statusCounts = getStatusCounts()

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          ダッシュ<span className="text-[#ff0066] neon-text">ボード</span>
        </h2>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-black/40 backdrop-blur-sm border border-[#ff0066]/30 rounded-xl p-4 sm:p-6 neon-box-hover transition-all duration-300">
          <div className="text-sm text-white/60 mb-1">総回線数</div>
          <div className="text-3xl sm:text-4xl font-bold text-white">{statusCounts.total}</div>
        </div>
        <div className="bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 sm:p-6 hover:border-green-500/60 transition-all duration-300">
          <div className="text-sm text-white/60 mb-1">開通済</div>
          <div className="text-3xl sm:text-4xl font-bold text-green-400">{statusCounts.opened}</div>
        </div>
        <div className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 sm:p-6 hover:border-blue-500/60 transition-all duration-300">
          <div className="text-sm text-white/60 mb-1">発送済</div>
          <div className="text-3xl sm:text-4xl font-bold text-blue-400">{statusCounts.shipped}</div>
        </div>
        <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 hover:border-white/40 transition-all duration-300">
          <div className="text-sm text-white/60 mb-1">未開通</div>
          <div className="text-3xl sm:text-4xl font-bold text-white/70">{statusCounts.not_opened}</div>
        </div>
      </div>

      {/* 追加発注ボタン */}
      <div className="mb-8">
        <Link
          href="/mypage/order"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#ff0066] to-[#ff3399] text-black font-bold rounded-xl neon-box neon-box-hover transition-all duration-300 hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          追加発注
        </Link>
      </div>

      {/* 回線一覧 */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#ff0066]/30 rounded-2xl overflow-hidden neon-border">
        <div className="px-4 sm:px-6 py-4 border-b border-[#ff0066]/20">
          <h3 className="text-lg font-bold text-white">回線一覧</h3>
        </div>

        {lines.length === 0 ? (
          <div className="p-8 text-center text-white/50">
            回線情報がありません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-black/30">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#ff0066] uppercase tracking-wider">
                    電話番号
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#ff0066] uppercase tracking-wider hidden sm:table-cell">
                    ICCID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#ff0066] uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#ff0066] uppercase tracking-wider hidden md:table-cell">
                    契約月
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#ff0066] uppercase tracking-wider">
                    詳細
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ff0066]/10">
                {lines.map((line) => {
                  const status = lineStatusLabels[line.lineStatus] || { label: line.lineStatus, color: 'bg-white/10 text-white/70 border-white/20' }
                  return (
                    <tr key={line.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                        {line.phoneNumber || '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white/60 hidden sm:table-cell">
                        {line.iccid || '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white/60 hidden md:table-cell">
                        {line.contractMonth || '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/mypage/lines/${line.id}`}
                          className="text-[#ff0066] hover:text-[#ff3399] transition-colors"
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
