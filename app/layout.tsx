import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "鹦鹉饲养指南｜虎皮与小太阳·新手图解版",
  description: "面向零基础新手的虎皮与小太阳照护手册，支持手机查阅与完整离线阅读。",
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
