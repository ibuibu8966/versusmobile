import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserSession } from '@/lib/userAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: 自分の回線一覧
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

    let lines

    if (session.isContractor) {
      // Contractorの場合、紐づくすべてのApplicationの回線を取得
      const { data: applications } = await supabase
        .from('Application')
        .select('id')
        .eq('contractorId', session.id)

      if (!applications || applications.length === 0) {
        return NextResponse.json({ lines: [] })
      }

      const applicationIds = applications.map(app => app.id)

      const { data, error } = await supabase
        .from('Line')
        .select('*, application:Application(*)')
        .in('applicationId', applicationIds)
        .order('createdAt', { ascending: false })

      if (error) {
        console.error('回線取得エラー:', error)
        return NextResponse.json(
          { error: '回線情報の取得に失敗しました' },
          { status: 500 }
        )
      }

      lines = data
    } else {
      // Applicationの場合、同じメールアドレスのすべてのApplicationの回線を取得
      const { data: applications } = await supabase
        .from('Application')
        .select('id')
        .eq('email', session.email)
        .eq('status', 'completed')

      if (!applications || applications.length === 0) {
        return NextResponse.json({ lines: [] })
      }

      const applicationIds = applications.map(app => app.id)

      const { data, error } = await supabase
        .from('Line')
        .select('*, application:Application(*)')
        .in('applicationId', applicationIds)
        .order('createdAt', { ascending: false })

      if (error) {
        console.error('回線取得エラー:', error)
        return NextResponse.json(
          { error: '回線情報の取得に失敗しました' },
          { status: 500 }
        )
      }

      lines = data
    }

    return NextResponse.json({ lines })
  } catch (error) {
    console.error('回線一覧取得エラー:', error)
    return NextResponse.json(
      { error: '回線情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}
