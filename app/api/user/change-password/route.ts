import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { getUserSession, createUserToken, UserSession } from '@/lib/userAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST: パスワード変更
export async function POST(request: NextRequest) {
  try {
    const session = await getUserSession(request)

    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '現在のパスワードと新しいパスワードは必須です' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'パスワードは8文字以上で入力してください' },
        { status: 400 }
      )
    }

    // メールアドレスと同じパスワードは禁止
    if (newPassword === session.email) {
      return NextResponse.json(
        { error: 'メールアドレスと同じパスワードは使用できません' },
        { status: 400 }
      )
    }

    if (session.isContractor) {
      // Contractorのパスワード変更
      const { data: contractor } = await supabase
        .from('Contractor')
        .select('*')
        .eq('id', session.id)
        .single()

      if (!contractor) {
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' },
          { status: 404 }
        )
      }

      // 現在のパスワードを検証
      if (!contractor.password) {
        // 初回ログイン時（パスワード未設定）
        if (currentPassword !== session.email) {
          return NextResponse.json(
            { error: '現在のパスワードが正しくありません' },
            { status: 401 }
          )
        }
      } else {
        const isValid = await bcrypt.compare(currentPassword, contractor.password)
        if (!isValid) {
          return NextResponse.json(
            { error: '現在のパスワードが正しくありません' },
            { status: 401 }
          )
        }
      }

      // 新しいパスワードをハッシュ化して保存
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      const { error: updateError } = await supabase
        .from('Contractor')
        .update({
          password: hashedPassword,
          mustChangePassword: false,
          passwordChangedAt: new Date().toISOString(),
        })
        .eq('id', session.id)

      if (updateError) {
        console.error('パスワード更新エラー:', updateError)
        return NextResponse.json(
          { error: 'パスワードの更新に失敗しました' },
          { status: 500 }
        )
      }
    } else {
      // Applicationのパスワード変更
      const { data: application } = await supabase
        .from('Application')
        .select('*')
        .eq('id', session.id)
        .single()

      if (!application) {
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' },
          { status: 404 }
        )
      }

      // 現在のパスワードを検証
      if (!application.password) {
        // 初回ログイン時（パスワード未設定）
        if (currentPassword !== session.email) {
          return NextResponse.json(
            { error: '現在のパスワードが正しくありません' },
            { status: 401 }
          )
        }
      } else {
        const isValid = await bcrypt.compare(currentPassword, application.password)
        if (!isValid) {
          return NextResponse.json(
            { error: '現在のパスワードが正しくありません' },
            { status: 401 }
          )
        }
      }

      // 新しいパスワードをハッシュ化して保存
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      const { error: updateError } = await supabase
        .from('Application')
        .update({
          password: hashedPassword,
          mustChangePassword: false,
        })
        .eq('id', session.id)

      if (updateError) {
        console.error('パスワード更新エラー:', updateError)
        return NextResponse.json(
          { error: 'パスワードの更新に失敗しました' },
          { status: 500 }
        )
      }
    }

    // 新しいセッショントークンを発行（mustChangePasswordをfalseに更新）
    const newSession: UserSession = {
      ...session,
      mustChangePassword: false,
    }

    const token = await createUserToken(newSession)

    const response = NextResponse.json({
      success: true,
      message: 'パスワードを変更しました',
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
    console.error('パスワード変更エラー:', error)
    return NextResponse.json(
      { error: 'パスワード変更に失敗しました' },
      { status: 500 }
    )
  }
}
