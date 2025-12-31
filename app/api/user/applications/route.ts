import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserSession } from '@/lib/userAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: 自分の申込一覧
export async function GET(request: NextRequest) {
  try {
    const session = await getUserSession(request)

    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    if (session.mustChangePassword) {
      return NextResponse.json(
        { error: 'パスワード変更が必要です', requirePasswordChange: true },
        { status: 403 }
      )
    }

    let applications

    if (session.isContractor) {
      // Contractorの場合、紐づくすべてのApplicationを取得
      const { data, error } = await supabase
        .from('Application')
        .select('*, lines:Line(*)')
        .eq('contractorId', session.id)
        .order('createdAt', { ascending: false })

      if (error) {
        console.error('申込取得エラー:', error)
        return NextResponse.json(
          { error: '申込情報の取得に失敗しました' },
          { status: 500 }
        )
      }

      applications = data
    } else {
      // Applicationの場合、同じメールアドレスのすべてのApplicationを取得
      const { data, error } = await supabase
        .from('Application')
        .select('*, lines:Line(*)')
        .eq('email', session.email)
        .eq('status', 'completed')
        .order('createdAt', { ascending: false })

      if (error) {
        console.error('申込取得エラー:', error)
        return NextResponse.json(
          { error: '申込情報の取得に失敗しました' },
          { status: 500 }
        )
      }

      applications = data
    }

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('申込一覧取得エラー:', error)
    return NextResponse.json(
      { error: '申込情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}
