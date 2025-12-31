import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAdminSession } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: 契約者一覧を取得
export async function GET(request: NextRequest) {
  const session = await getAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('Contractor')
      .select('*, applications:Application(*)', { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(`email.ilike.%${search}%,companyName.ilike.%${search}%,lastName.ilike.%${search}%`)
    }

    const { data: contractors, error, count } = await query

    if (error) {
      console.error('契約者取得エラー:', error)
      return NextResponse.json(
        { error: '契約者情報の取得に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      contractors,
      total: count,
      page,
      limit,
    })
  } catch (error) {
    console.error('契約者一覧取得エラー:', error)
    return NextResponse.json(
      { error: '契約者情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}
