import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { createUserToken, UserSession } from '@/lib/userAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST: ユーザーログイン
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です' },
        { status: 400 }
      )
    }

    // 1. まずContractorを検索
    const { data: contractor } = await supabase
      .from('Contractor')
      .select('*')
      .eq('email', email)
      .single()

    if (contractor) {
      // Contractorが見つかった場合
      if (!contractor.password) {
        // パスワード未設定の場合（初回ログイン）、メールアドレスがパスワード
        if (password !== email) {
          return NextResponse.json(
            { error: 'メールアドレスまたはパスワードが正しくありません' },
            { status: 401 }
          )
        }
      } else {
        // パスワードが設定されている場合
        const isValid = await bcrypt.compare(password, contractor.password)
        if (!isValid) {
          return NextResponse.json(
            { error: 'メールアドレスまたはパスワードが正しくありません' },
            { status: 401 }
          )
        }
      }

      // 最終ログイン日時を更新
      await supabase
        .from('Contractor')
        .update({ lastLoginAt: new Date().toISOString() })
        .eq('id', contractor.id)

      const name = contractor.contractorType === 'individual'
        ? `${contractor.lastName || ''} ${contractor.firstName || ''}`.trim()
        : contractor.companyName || ''

      const session: UserSession = {
        id: contractor.id,
        email: contractor.email,
        name,
        contractorType: contractor.contractorType as 'individual' | 'corporate',
        mustChangePassword: contractor.mustChangePassword,
        isContractor: true,
      }

      const token = await createUserToken(session)

      const response = NextResponse.json({
        success: true,
        user: session,
        mustChangePassword: contractor.mustChangePassword,
      })

      response.cookies.set('user-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    }

    // 2. Contractorが見つからない場合、Applicationを検索
    // submitted または completed ステータスの申込でログイン可能
    const { data: applications } = await supabase
      .from('Application')
      .select('*')
      .eq('email', email)
      .in('status', ['submitted', 'completed'])
      .order('createdAt', { ascending: false })
      .limit(1)

    if (!applications || applications.length === 0) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    const application = applications[0]

    // パスワード検証
    if (!application.password) {
      // パスワード未設定の場合（既存ユーザー）、メールアドレスがパスワード
      if (password !== email) {
        return NextResponse.json(
          { error: 'メールアドレスまたはパスワードが正しくありません' },
          { status: 401 }
        )
      }
    } else {
      // パスワードが設定されている場合
      const isValid = await bcrypt.compare(password, application.password)
      if (!isValid) {
        return NextResponse.json(
          { error: 'メールアドレスまたはパスワードが正しくありません' },
          { status: 401 }
        )
      }
    }

    const name = application.applicantType === 'individual'
      ? `${application.lastName || ''} ${application.firstName || ''}`.trim()
      : application.companyName || ''

    // 初回ログインの場合（パスワード未設定）はパスワード変更必須
    const mustChangePassword = !application.password

    const session: UserSession = {
      id: application.id,
      email: application.email,
      name,
      contractorType: application.applicantType as 'individual' | 'corporate',
      mustChangePassword,
      isContractor: false,
    }

    const token = await createUserToken(session)

    const response = NextResponse.json({
      success: true,
      user: session,
      mustChangePassword,
    })

    response.cookies.set('user-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('ログインエラー:', error)
    return NextResponse.json(
      { error: 'ログインに失敗しました' },
      { status: 500 }
    )
  }
}
