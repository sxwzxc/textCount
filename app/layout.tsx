import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "字符统计工具",
  description: "实时统计中文、英文、符号、数字与空白等字符信息",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
