import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LegalPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">
            <span className="text-white">特定商取引法に基づく</span>
            <span className="text-[#ff0066]">表記</span>
          </h1>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="space-y-8 text-white/80">
              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">販売業者</h2>
                <p>合同会社ピーチ（VERSUS MOBILE運営）</p>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">代表責任者</h2>
                <p>宮崎　忍</p>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">所在地</h2>
                <p>〒290-0242</p>
                <p>千葉県市原市荻作530-4</p>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">電話番号</h2>
                <p>050-8890-8892（平日10:00-18:00）</p>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">メールアドレス</h2>
                <p>
                  <a
                    href="mailto:peach.2023.7.19@gmail.com"
                    className="text-[#ff0066] hover:text-[#ff3399] transition-colors"
                  >
                    peach.2023.7.19@gmail.com
                  </a>
                </p>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">販売価格</h2>
                <p>認証用SIMプラン（税込価格・1回払い）</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>認証用SIM（50回線以上）: ¥3,300/回線</li>
                  <li>認証用SIM（50回線未満）: ¥3,600/回線</li>
                </ul>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">商品代金以外の必要料金</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>ユニバーサルサービス料: 2円/月</li>
                  <li>電話リレーサービス料: 1円/月</li>
                  <li>銀行振込の場合: 振込手数料（お客様負担）</li>
                </ul>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">申込方法</h2>
                <p>Webサイトからのオンライン申込</p>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">支払方法</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>クレジットカード決済</li>
                  <li>銀行振込（請求書対応可）</li>
                </ul>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">支払時期</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>申込時に1回払い</li>
                </ul>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">引き渡し時期</h2>
                <p>物理SIM: 申込後1〜5営業日で発送、到着後の開通手続で利用開始</p>
                <p className="text-white/60 text-sm mt-1">
                  ※eSIMは非対応です
                </p>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">返品・交換・解約</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>返品:</strong> 通信サービスの性質上、開通後の返品は不可
                  </li>
                  <li>
                    <strong>交換:</strong> 不良SIMの場合は再発行（手数料あり）
                  </li>
                  <li>
                    <strong>解約:</strong> 解約金なし。お申込み月の当月末に自動解約（手続き不要）
                  </li>
                  <li>
                    <strong>MNP:</strong> 転入・転出ともに不可
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">役務提供条件</h2>
                <p>
                  電波状況、設備保守、天災等により一時的にサービスを利用できない場合があります。
                </p>
              </div>

              <div>
                <h2 className="text-[#ff0066] font-semibold mb-2 text-lg">クーリング・オフ</h2>
                <p>
                  本サービスは通信役務・通信販売に該当するため、クーリング・オフの適用外です。
                </p>
              </div>

              <div id="telecom-law" className="pt-6 border-t border-white/10 scroll-mt-24">
                <h2 className="text-[#ff0066] font-semibold mb-6 text-xl">電気通信事業法に基づく表示</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-semibold mb-3">電気通信事業者</h3>
                    <p>合同会社ピーチ</p>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">届出番号</h3>
                    <p>A-07-22969（総務省 届出受理済）</p>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">受理通知</h3>
                    <p className="mb-2">総務省より受理された届出書の受理通知（令和7年10月6日付）</p>
                    <a
                      href="/documents/20251022133036857.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[#ff0066] hover:text-[#ff3399] transition-colors underline"
                    >
                      受理通知PDF（A-07-22969）を確認する
                    </a>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">提供区域</h3>
                    <p>日本国内（NTTドコモ網の提供エリアに準拠）</p>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">緊急通報（110/118/119）</h3>
                    <p>発信可能</p>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">通話定額の対象外番号</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>0570（ナビダイヤル）</li>
                      <li>0180（テレドーム）</li>
                      <li>104（番号案内）</li>
                      <li>衛星電話・衛星船舶電話</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">フェアユースポリシー（速度制御）</h3>
                    <p>
                      ネットワークの混雑回避や品質維持のため、通信速度を制御する場合があります。
                    </p>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">通信速度（ベストエフォート）</h3>
                    <p>下り最大：375Mbps</p>
                    <p>上り最大：50Mbps</p>
                    <p className="text-white/60 text-sm mt-2">
                      ※ 実際の速度は通信環境や混雑状況により変動します。記載の速度は技術規格上の最大値であり、実効速度を保証するものではありません。
                    </p>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">使用ネットワーク</h3>
                    <p>NTTドコモ網系MVNO</p>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">サービス提供時間</h3>
                    <p>24時間365日（設備保守・障害時を除く）</p>
                    <p className="mt-1">回線切替操作：10:00-19:00</p>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">最低利用期間・解約金</h3>
                    <p>当月末自動解約（手続き不要）</p>
                    <p>解約金：0円</p>
                    <p className="text-white/60 text-sm mt-2">※ MNP転入・転出は不可</p>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">お問い合わせ</h3>
                    <p>
                      メール：
                      <a
                        href="mailto:peach.2023.7.19@gmail.com"
                        className="text-[#ff0066] hover:text-[#ff3399] transition-colors"
                      >
                        peach.2023.7.19@gmail.com
                      </a>
                    </p>
                    <p className="mt-1">受付時間：平日10:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
