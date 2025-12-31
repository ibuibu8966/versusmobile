import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserSession } from '@/lib/userAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: 契約者情報取得
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

    let profile

    if (session.isContractor) {
      // Contractorから取得
      const { data, error } = await supabase
        .from('Contractor')
        .select('*')
        .eq('id', session.id)
        .single()

      if (error) {
        console.error('契約者情報取得エラー:', error)
        return NextResponse.json(
          { error: '契約者情報の取得に失敗しました' },
          { status: 500 }
        )
      }

      profile = {
        contractorType: data.contractorType,
        email: data.email,
        // 個人情報
        lastName: data.lastName,
        firstName: data.firstName,
        lastNameKana: data.lastNameKana,
        firstNameKana: data.firstNameKana,
        // 法人情報
        companyName: data.companyName,
        companyNameKana: data.companyNameKana,
        corporateNumber: data.corporateNumber,
        // 共通情報
        phone: data.phone,
        postalCode: data.postalCode,
        address: data.address,
        // 書類情報
        idCardFrontUrl: data.idCardFrontUrl,
        idCardBackUrl: data.idCardBackUrl,
        registrationUrl: data.registrationUrl,
        expirationDate: data.expirationDate,
      }
    } else {
      // Applicationから取得
      const { data, error } = await supabase
        .from('Application')
        .select('*')
        .eq('id', session.id)
        .single()

      if (error) {
        console.error('契約者情報取得エラー:', error)
        return NextResponse.json(
          { error: '契約者情報の取得に失敗しました' },
          { status: 500 }
        )
      }

      profile = {
        contractorType: data.applicantType,
        email: data.email,
        // 個人情報
        lastName: data.lastName,
        firstName: data.firstName,
        lastNameKana: data.lastNameKana,
        firstNameKana: data.firstNameKana,
        // 法人情報
        companyName: data.companyName,
        companyNameKana: data.companyNameKana,
        corporateNumber: data.corporateNumber,
        // 代表者情報（法人のみ）
        representativeLastName: data.representativeLastName,
        representativeFirstName: data.representativeFirstName,
        representativeLastNameKana: data.representativeLastNameKana,
        representativeFirstNameKana: data.representativeFirstNameKana,
        representativeBirthDate: data.representativeBirthDate,
        representativePostalCode: data.representativePostalCode,
        representativeAddress: data.representativeAddress,
        // 担当者情報（法人のみ）
        contactLastName: data.contactLastName,
        contactFirstName: data.contactFirstName,
        contactLastNameKana: data.contactLastNameKana,
        contactFirstNameKana: data.contactFirstNameKana,
        // 共通情報
        phone: data.phone,
        postalCode: data.postalCode,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        // 書類情報
        idCardFrontUrl: data.idCardFrontUrl,
        idCardBackUrl: data.idCardBackUrl,
        registrationUrl: data.registrationUrl,
        expirationDate: data.expirationDate,
      }
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('契約者情報取得エラー:', error)
    return NextResponse.json(
      { error: '契約者情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}
