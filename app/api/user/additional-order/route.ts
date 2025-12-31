import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserSession } from '@/lib/userAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 料金計算
function calculatePrice(planType: string, lineCount: number): number {
  const pricePerLine = planType === '3month-50plus' ? 990 : 1100
  return pricePerLine * lineCount * 3 // 3ヶ月分
}

// POST: 追加発注
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { planType, lineCount } = body

    // バリデーション
    if (!planType || !['3month-50plus', '3month-under50'].includes(planType)) {
      return NextResponse.json(
        { error: 'プランタイプが無効です' },
        { status: 400 }
      )
    }

    if (!lineCount || lineCount < 1) {
      return NextResponse.json(
        { error: '回線数は1以上で指定してください' },
        { status: 400 }
      )
    }

    if (planType === '3month-50plus' && lineCount < 50) {
      return NextResponse.json(
        { error: '50回線以上プランは50回線以上で申し込んでください' },
        { status: 400 }
      )
    }

    if (planType === '3month-under50' && lineCount >= 50) {
      return NextResponse.json(
        { error: '50回線未満プランは49回線以下で申し込んでください' },
        { status: 400 }
      )
    }

    // 契約者情報を取得
    let sourceData: Record<string, unknown>

    if (session.isContractor) {
      // Contractorから取得
      const { data, error } = await supabase
        .from('Contractor')
        .select('*')
        .eq('id', session.id)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: '契約者情報が見つかりません' },
          { status: 404 }
        )
      }

      sourceData = {
        applicantType: data.contractorType,
        lastName: data.lastName,
        firstName: data.firstName,
        lastNameKana: data.lastNameKana,
        firstNameKana: data.firstNameKana,
        companyName: data.companyName,
        companyNameKana: data.companyNameKana,
        corporateNumber: data.corporateNumber,
        phone: data.phone,
        email: data.email,
        postalCode: data.postalCode,
        address: data.address,
        idCardFrontUrl: data.idCardFrontUrl,
        idCardBackUrl: data.idCardBackUrl,
        registrationUrl: data.registrationUrl,
        expirationDate: data.expirationDate,
        contractorId: data.id,
      }
    } else {
      // Applicationから取得
      const { data, error } = await supabase
        .from('Application')
        .select('*')
        .eq('id', session.id)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: '契約者情報が見つかりません' },
          { status: 404 }
        )
      }

      sourceData = {
        applicantType: data.applicantType,
        lastName: data.lastName,
        firstName: data.firstName,
        lastNameKana: data.lastNameKana,
        firstNameKana: data.firstNameKana,
        companyName: data.companyName,
        companyNameKana: data.companyNameKana,
        corporateNumber: data.corporateNumber,
        establishedDate: data.establishedDate,
        representativeLastName: data.representativeLastName,
        representativeFirstName: data.representativeFirstName,
        representativeLastNameKana: data.representativeLastNameKana,
        representativeFirstNameKana: data.representativeFirstNameKana,
        representativeBirthDate: data.representativeBirthDate,
        representativePostalCode: data.representativePostalCode,
        representativeAddress: data.representativeAddress,
        contactLastName: data.contactLastName,
        contactFirstName: data.contactFirstName,
        contactLastNameKana: data.contactLastNameKana,
        contactFirstNameKana: data.contactFirstNameKana,
        phone: data.phone,
        email: data.email,
        postalCode: data.postalCode,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        idCardFrontUrl: data.idCardFrontUrl,
        idCardBackUrl: data.idCardBackUrl,
        registrationUrl: data.registrationUrl,
        expirationDate: data.expirationDate,
        contractorId: data.contractorId,
      }
    }

    const totalAmount = calculatePrice(planType, lineCount)
    const now = new Date().toISOString()

    // 新規申込を作成
    const { data: newApplication, error: createError } = await supabase
      .from('Application')
      .insert({
        id: crypto.randomUUID(),
        ...sourceData,
        planType,
        lineCount,
        totalAmount,
        isSecondApplication: true,
        status: 'submitted',
        verificationStatus: 'unverified',
        paymentStatus: 'not_issued',
        createdAt: now,
        updatedAt: now,
        submittedAt: now,
        agreePrivacy: true,
        agreeTerms: true,
        agreeTelecom: true,
        agreeWithdrawal: true,
        agreeNoAntisocial: true,
      })
      .select()
      .single()

    if (createError) {
      console.error('追加発注作成エラー:', createError)
      return NextResponse.json(
        { error: '申込の作成に失敗しました', details: createError.message },
        { status: 500 }
      )
    }

    // 回線レコードを作成
    const lineRecords = Array.from({ length: lineCount }, () => ({
      applicationId: newApplication.id,
      lineStatus: 'not_opened',
    }))

    const { error: lineError } = await supabase
      .from('Line')
      .insert(lineRecords)

    if (lineError) {
      console.error('回線レコード作成エラー:', lineError)
      // 申込は作成済みなのでエラーにはしない
    }

    return NextResponse.json({
      success: true,
      application: {
        id: newApplication.id,
        planType: newApplication.planType,
        lineCount: newApplication.lineCount,
        totalAmount: newApplication.totalAmount,
      },
    })
  } catch (error) {
    console.error('追加発注エラー:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: '追加発注に失敗しました', details: errorMessage },
      { status: 500 }
    )
  }
}
