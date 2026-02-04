'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: '申込から何日で使えますか？',
    answer: '物理SIMは通常1〜5営業日で発送、到着後の開通操作でご利用開始。eSIMは非対応です。',
  },
  {
    question: 'MNPはできますか？',
    answer: 'いいえ、認証用SIMのためMNP（番号ポータビリティ）には対応しておりません。転入・転出ともに不可です。',
  },
  {
    question: '解約はいつですか？',
    answer: 'お申込み月の翌月末に自動的に解約となります。解約手続きは不要です。',
  },
  {
    question: '何に使えますか？',
    answer: 'SMS認証、音声認証、アプリ認証など各種認証用途にご利用いただけます。SMS・音声通話・データ通信すべて対応しています。',
  },
  {
    question: 'ポケモンカードの認証はできますか？',
    answer: 'はい、可能です。',
  },
  {
    question: 'テザリングは使えますか？',
    answer: '可能です（端末仕様に依存）。',
  },
  {
    question: '個人は何回線まで契約できますか？',
    answer: '最大5回線までです。',
  },
  {
    question: '法人の申込条件は？',
    answer: '20回線以上のお申込は別途審査が必要です（与信・運用体制の確認）。',
  },
  {
    question: 'SIMを失くした・破損した',
    answer: '再発行手数料がかかります（再発行＋配送）。',
  },
  {
    question: '支払い方法は？',
    answer: '銀行振込（請求書対応可）／クレジットカード に対応しています。',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <span className="text-white">よくある</span>
            <span className="text-[#d4af37]">質問</span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base md:text-lg px-4">
            お客様から寄せられるよくある質問にお答えします
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#d4af37]/50 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-200"
              >
                <span className="text-white font-semibold pr-4 sm:pr-8 text-sm sm:text-base">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-[#d4af37] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-white/70 leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center px-4">
          <p className="text-white/60 mb-3 sm:mb-4 text-sm sm:text-base">
            その他のご質問がございましたら、お気軽にお問い合わせください
          </p>
          <a
            href="mailto:peach.2023.7.19@gmail.com"
            className="inline-flex items-center text-[#d4af37] hover:text-[#f0d970] font-semibold transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            peach.2023.7.19@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
