import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "flag-icons/css/flag-icons.min.css";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "签证地图｜给中国护照的全球旅行指南",
    template: "%s｜签证地图",
  },
  description: "按世界地图和七大洲查找面向中国护照持有者的最新旅游签证攻略。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={geist.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
