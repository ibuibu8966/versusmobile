import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MyPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {/* 準備中アイコン */}
            <div className="w-24 h-24 mb-8 rounded-full bg-gradient-to-br from-[#ff0066]/30 to-[#ff0066]/10 border-2 border-[#ff0066]/50 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#ff0066]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* 準備中テキスト */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">準備中</span>
            </h1>
            <p className="text-white/60 text-lg text-center max-w-md mb-8">
              マイページは現在準備中です。<br />
              もうしばらくお待ちください。
            </p>

            {/* トップページに戻るボタン */}
            <a
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-[#ff0066] to-[#ff3399] text-black font-bold text-lg rounded-full hover:shadow-2xl hover:shadow-[#ff0066]/50 transition-all duration-300 transform hover:scale-105"
            >
              トップページに戻る
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
