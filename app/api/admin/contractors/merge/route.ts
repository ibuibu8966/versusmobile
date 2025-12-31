import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAdminSession } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST: 複数の申込を1つの契約者に統合
export async function POST(request: NextRequest) {
  const session = await getAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { applicationIds, sourceApplicationId } = body

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length < 1) {
      return NextResponse.json(
        { error: '統合する申込IDを指定してください' },
        { status: 400 }
      )
    }

    if (!sourceApplicationId) {
      return NextResponse.json(
        { error: '契約者情報の取得元となる申込IDを指定してください' },
        { status: 400 }
      )
    }

    // 取得元の申込情報を取得
    const { data: sourceApplication, error: sourceError } = await supabase
      .from('Application')
      .select('*')
      .eq('id', sourceApplicationId)
      .single()

    if (sourceError || !sourceApplication) {
      return NextResponse.json(
        { error: '取得元の申込情報が見つかりません' },
        { status: 404 }
      )
    }

    // Contractorを作成
    const { data: contractor, error: contractorError } = await supabase
      .from('Contractor')
      .insert({
        id: crypto.randomUUID(),
        email: sourceApplication.email,
        password: sourceApplication.password,
        mustChangePassword: !sourceApplication.password,
        contractorType: sourceApplication.applicantType,
        lastName: sourceApplication.lastName,
        firstName: sourceApplication.firstName,
        lastNameKana: sourceApplication.lastNameKana,
        firstNameKana: sourceApplication.firstNameKana,
        companyName: sourceApplication.companyName,
        companyNameKana: sourceApplication.companyNameKana,
        corporateNumber: sourceApplication.corporateNumber,
        phone: sourceApplication.phone,
        postalCode: sourceApplication.postalCode,
        address: sourceApplication.address,
        idCardFrontUrl: sourceApplication.idCardFrontUrl,
        idCardBackUrl: sourceApplication.idCardBackUrl,
        registrationUrl: sourceApplication.registrationUrl,
        expirationDate: sourceApplication.expirationDate,
      })
      .select()
      .single()

    if (contractorError) {
      console.error('Contractor作成エラー:', contractorError)
      return NextResponse.json(
        { error: '契約者情報の作成に失敗しました' },
        { status: 500 }
      )
    }

    // すべての申込をContractorに紐付け
    const { error: updateError } = await supabase
      .from('Application')
      .update({ contractorId: contractor.id })
      .in('id', applicationIds)

    if (updateError) {
      console.error('申込更新エラー:', updateError)
      return NextResponse.json(
        { error: '申込の紐付けに失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      contractor,
      mergedCount: applicationIds.length,
    })
  } catch (error) {
    console.error('統合エラー:', error)
    return NextResponse.json(
      { error: '申込の統合に失敗しました' },
      { status: 500 }
    )
  }
}
