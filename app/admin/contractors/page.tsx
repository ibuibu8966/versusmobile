'use client'

import { useState, useEffect } from 'react'

interface Application {
  id: string
  email: string
  applicantType: 'individual' | 'corporate'
  lastName?: string
  firstName?: string
  companyName?: string
  createdAt: string
  status: string
  contractorId?: string
}

interface Contractor {
  id: string
  email: string
  contractorType: 'individual' | 'corporate'
  lastName?: string
  firstName?: string
  companyName?: string
  createdAt: string
  applications: Application[]
}

interface DuplicateGroup {
  email: string
  applications: Application[]
  count: number
}

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'contractors' | 'duplicates'>('duplicates')
  const [selectedApplications, setSelectedApplications] = useState<Record<string, string[]>>({})
  const [sourceApplication, setSourceApplication] = useState<Record<string, string>>({})
  const [isMerging, setIsMerging] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [contractorsRes, duplicatesRes] = await Promise.all([
        fetch('/api/admin/contractors'),
        fetch('/api/admin/applications/duplicates'),
      ])

      const contractorsData = await contractorsRes.json()
      const duplicatesData = await duplicatesRes.json()

      if (contractorsRes.ok) {
        setContractors(contractorsData.contractors || [])
      }
      if (duplicatesRes.ok) {
        setDuplicates(duplicatesData.duplicates || [])
      }
    } catch (err) {
      console.error('データ取得エラー:', err)
      setError('データの取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectApplication = (email: string, appId: string) => {
    setSelectedApplications(prev => {
      const current = prev[email] || []
      if (current.includes(appId)) {
        return { ...prev, [email]: current.filter(id => id !== appId) }
      }
      return { ...prev, [email]: [...current, appId] }
    })
  }

  const handleSelectSource = (email: string, appId: string) => {
    setSourceApplication(prev => ({ ...prev, [email]: appId }))
  }

  const handleMerge = async (email: string) => {
    const applicationIds = selectedApplications[email] || []
    const sourceId = sourceApplication[email]

    if (applicationIds.length < 2) {
      alert('統合するには2件以上の申込を選択してください')
      return
    }

    if (!sourceId || !applicationIds.includes(sourceId)) {
      alert('契約者情報の取得元となる申込を選択してください')
      return
    }

    if (!confirm(`${applicationIds.length}件の申込を統合します。よろしいですか？`)) {
      return
    }

    setIsMerging(true)
    try {
      const response = await fetch('/api/admin/contractors/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationIds,
          sourceApplicationId: sourceId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '統合に失敗しました')
      }

      alert(`${data.mergedCount}件の申込を統合しました`)
      fetchData()
      setSelectedApplications(prev => ({ ...prev, [email]: [] }))
      setSourceApplication(prev => ({ ...prev, [email]: '' }))
    } catch (err) {
      console.error('統合エラー:', err)
      alert(err instanceof Error ? err.message : '統合に失敗しました')
    } finally {
      setIsMerging(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const getApplicantName = (app: Application) => {
    return app.applicantType === 'corporate'
      ? app.companyName
      : `${app.lastName || ''} ${app.firstName || ''}`.trim()
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">契約者管理</h1>
        <p className="text-gray-600 mt-1">契約者の統合と管理を行います</p>
      </div>

      {/* タブ切り替え */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('duplicates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'duplicates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            重複申込 ({duplicates.length})
          </button>
          <button
            onClick={() => setActiveTab('contractors')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contractors'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            契約者一覧 ({contractors.length})
          </button>
        </nav>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* 重複申込タブ */}
      {activeTab === 'duplicates' && (
        <div className="space-y-6">
          {duplicates.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              重複している申込はありません
            </div>
          ) : (
            duplicates.map((group) => (
              <div key={group.email} className="bg-white rounded-lg shadow">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{group.email}</h3>
                    <p className="text-sm text-gray-500">{group.count}件の申込</p>
                  </div>
                  <button
                    onClick={() => handleMerge(group.email)}
                    disabled={isMerging || (selectedApplications[group.email]?.length || 0) < 2}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMerging ? '統合中...' : '統合する'}
                  </button>
                </div>
                <div className="p-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">選択</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">情報元</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">申込者名</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">タイプ</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">申込日</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {group.applications.map((app) => (
                        <tr key={app.id}>
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={selectedApplications[group.email]?.includes(app.id) || false}
                              onChange={() => handleSelectApplication(group.email, app.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="radio"
                              name={`source-${group.email}`}
                              checked={sourceApplication[group.email] === app.id}
                              onChange={() => handleSelectSource(group.email, app.id)}
                              disabled={!selectedApplications[group.email]?.includes(app.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900">
                            {getApplicantName(app)}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-500">
                            {app.applicantType === 'corporate' ? '法人' : '個人'}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-500">
                            {formatDate(app.createdAt)}
                          </td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              app.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {app.status === 'completed' ? '完了' : app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500 mt-2">
                    ※「情報元」に選択した申込の契約者情報が統合後の契約者情報として使用されます
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 契約者一覧タブ */}
      {activeTab === 'contractors' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {contractors.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              契約者がいません
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    メールアドレス
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    契約者名
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タイプ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    申込数
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録日
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contractors.map((contractor) => (
                  <tr key={contractor.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {contractor.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {contractor.contractorType === 'corporate'
                        ? contractor.companyName
                        : `${contractor.lastName || ''} ${contractor.firstName || ''}`.trim()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {contractor.contractorType === 'corporate' ? '法人' : '個人'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {contractor.applications?.length || 0}件
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contractor.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
