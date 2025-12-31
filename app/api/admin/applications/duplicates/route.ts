import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAdminSession } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: 重複メールアドレスの申込を取得
export async function GET(request: NextRequest) {
  const session = await getAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  try {
    // 重複メールアドレスを持つ申込を取得
    // 同じメールアドレスで複数の完了済み申込がある場合を検出
    const { data: applications, error } = await supabase
      .from('Application')
      .select('id, email, applicantType, lastName, firstName, companyName, createdAt, status, contractorId')
      .eq('status', 'completed')
      .is('contractorId', null)
      .order('email', { ascending: true })
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('申込取得エラー:', error)
      return NextResponse.json(
        { error: '申込情報の取得に失敗しました' },
        { status: 500 }
      )
    }

    // メールアドレスでグループ化し、2件以上あるものだけ返す
    const emailGroups: Record<string, typeof applications> = {}

    applications?.forEach(app => {
      if (!emailGroups[app.email]) {
        emailGroups[app.email] = []
      }
      emailGroups[app.email].push(app)
    })

    const duplicates = Object.entries(emailGroups)
      .filter(([_, apps]) => apps.length > 1)
      .map(([email, apps]) => ({
        email,
        applications: apps,
        count: apps.length,
      }))

    return NextResponse.json({ duplicates })
  } catch (error) {
    console.error('重複検出エラー:', error)
    return NextResponse.json(
      { error: '重複検出に失敗しました' },
      { status: 500 }
    )
  }
}
