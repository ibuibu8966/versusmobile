'use client';

export default function PriceTable() {
  return (
    <section id="pricing" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Neon grid background */}
      <div className="absolute inset-0 z-0 opacity-15">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 0, 102, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 102, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      {/* Floating neon orbs */}
      <div className="absolute top-10 left-1/4 w-64 h-64 bg-[#ff0066]/15 rounded-full blur-[100px] z-0"></div>
      <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-[#ff3399]/15 rounded-full blur-[80px] z-0"></div>
      {/* Top and bottom neon lines */}
      <div className="absolute top-0 left-0 right-0 h-px neon-line"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px neon-line"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>認証用SIM</span>
            <span className="text-[#ff0066]" style={{WebkitTextStroke: '0.5px black', textShadow: '0 0 15px #ff0066, 0 0 30px #ff0066, 0 2px 4px rgba(0,0,0,0.9)'}}>料金プラン</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>
            SMS認証・音声通話・データ通信対応。シンプルな1回払い。
          </p>
        </div>

        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* 50回線以上 */}
          <div className="relative bg-black/60 backdrop-blur-sm border-2 border-[#ff0066] rounded-3xl p-8 neon-border transition-all duration-300 transform hover:scale-105">
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#ff0066] to-[#ff3399] text-black text-xs font-bold px-4 py-1 rounded-full" style={{boxShadow: '0 0 10px #ff0066'}}>
              お得
            </div>
            <div className="text-center">
              <div className="text-[#ff3399] text-sm font-semibold mb-3">50回線以上</div>
              <div className="text-5xl font-bold mb-3">
                <span className="text-[#ff0066]" style={{WebkitTextStroke: '0.5px black', textShadow: '0 0 15px #ff0066, 0 0 30px #ff0066, 0 2px 4px rgba(0,0,0,0.9)'}}>¥3,300</span>
                <span className="text-white/60 text-xl">/回線</span>
              </div>
              <div className="text-white/70 text-sm">1回払い・税込</div>
            </div>
          </div>

          {/* 50回線未満 */}
          <div className="relative bg-black/50 backdrop-blur-sm border border-[#ff0066]/50 rounded-3xl p-8 neon-box-hover transition-all duration-300 transform hover:scale-105">
            <div className="text-center">
              <div className="text-[#ff3399] text-sm font-semibold mb-3">50回線未満</div>
              <div className="text-5xl font-bold mb-3">
                <span className="text-[#ff0066]" style={{WebkitTextStroke: '0.5px black', textShadow: '0 0 15px #ff0066, 0 0 30px #ff0066, 0 2px 4px rgba(0,0,0,0.9)'}}>¥3,600</span>
                <span className="text-white/60 text-xl">/回線</span>
              </div>
              <div className="text-white/70 text-sm">1回払い・税込</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-black/50 backdrop-blur-sm border border-[#ff0066]/30 rounded-3xl p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            <span className="text-[#ff0066]" style={{WebkitTextStroke: '0.5px black', textShadow: '0 0 15px #ff0066, 0 0 30px #ff0066, 0 2px 4px rgba(0,0,0,0.9)'}}>認証用SIMの特徴</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff0066] to-[#ff3399] rounded-xl flex items-center justify-center mx-auto mb-3" style={{boxShadow: '0 0 15px #ff0066'}}>
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-white font-semibold mb-1">SMS認証対応</div>
              <div className="text-white/60 text-sm">各種サービスのSMS認証に</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff0066] to-[#ff3399] rounded-xl flex items-center justify-center mx-auto mb-3" style={{boxShadow: '0 0 15px #ff0066'}}>
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-white font-semibold mb-1">音声通話対応</div>
              <div className="text-white/60 text-sm">通話認証にも利用可能</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff0066] to-[#ff3399] rounded-xl flex items-center justify-center mx-auto mb-3" style={{boxShadow: '0 0 15px #ff0066'}}>
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div className="text-white font-semibold mb-1">データ通信対応</div>
              <div className="text-white/60 text-sm">アプリ認証等にも</div>
            </div>
          </div>

          <div className="border-t border-[#ff0066]/20 pt-6">
            <h4 className="text-[#ff0066] font-semibold mb-4 text-center drop-shadow-[0_0_5px_#ff0066]">ご利用上の注意</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#ff3399] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="text-white font-medium">MNP不可</span>
                  <p className="text-white/60 mt-1">番号ポータビリティ（転入・転出）には対応しておりません</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#ff3399] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="text-white font-medium">当月末自動解約</span>
                  <p className="text-white/60 mt-1">お申込み月の当月末に自動的に解約となります</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#ff0066]/20">
            <p className="text-white/50 text-xs leading-relaxed text-center">
              ※ 表示価格はすべて税込です<br />
              ※ 別途、ユニバーサルサービス料・電話リレーサービス料がかかります<br />
              ※ SIM登録・個別配送料込み
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
