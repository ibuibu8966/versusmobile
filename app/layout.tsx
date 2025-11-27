import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VERSUS MOBILE - 仕入れの相棒。音声込みで使うぶんだけに最適化。",
  description: "1GB/月880円・音声＋SMS込み。重い月は100GB目安（10GB/3日）で使い倒せる。個人向けと100回線以上の継続利用向けプランをご用意。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://versusmobile.vercel.app/",
    siteName: "VERSUS MOBILE",
    title: "VERSUS MOBILE - 仕入れの相棒。音声込みで使うぶんだけに最適化。",
    description: "1GB/月880円・音声＋SMS込み。重い月は100GB目安（10GB/3日）で使い倒せる。",
    images: [
      {
        url: "/images/versus-logo.jpg",
        width: 1200,
        height: 1200,
        alt: "VERSUS MOBILE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VERSUS MOBILE - 仕入れの相棒。音声込みで使うぶんだけに最適化。",
    description: "1GB/月880円・音声＋SMS込み。重い月は100GB目安（10GB/3日）で使い倒せる。",
    images: ["/images/versus-logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
