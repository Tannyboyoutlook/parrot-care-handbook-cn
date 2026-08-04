import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "鹦鹉饲养指南｜家庭综合版",
  description: "面向家庭饲养者的鹦鹉日常照护、营养、行为、健康监测与就医指南。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
