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
  metadataBase: new URL("https://versusmobile.vercel.app"),
  title: "VERSUS MOBILE - 認証用SIMプラン。SMS・音声・データ対応。",
  description: "認証用SIMプラン。SMS・音声・データ対応。50回線以上¥3,300、50回線未満¥3,600の1回払い。MNP不可・当月末自動解約。",
  applicationName: "VERSUS MOBILE",
  keywords: ["MVNO", "格安SIM", "認証用SIM", "SMS認証", "音声認証", "VERSUS MOBILE"],
  authors: [{ name: "VERSUS MOBILE" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://versusmobile.vercel.app/",
    siteName: "VERSUS MOBILE",
    title: "VERSUS MOBILE - 認証用SIMプラン。SMS・音声・データ対応。",
    description: "認証用SIMプラン。SMS・音声・データ対応。50回線以上¥3,300、50回線未満¥3,600の1回払い。",
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
    title: "VERSUS MOBILE - 認証用SIMプラン。SMS・音声・データ対応。",
    description: "認証用SIMプラン。SMS・音声・データ対応。50回線以上¥3,300、50回線未満¥3,600の1回払い。",
    images: ["/images/versus-logo.jpg"],
  },
  icons: {
    icon: "/icon.jpg",
    apple: "/apple-icon.jpg",
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
