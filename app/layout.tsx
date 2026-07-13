import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "鹦鹉饲养指南｜九本资料综合版",
  description: "从九本鹦鹉与鸟类资料中交叉整理的日常照护、营养、行为与就医指南。",
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
