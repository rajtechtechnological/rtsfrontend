import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ChatWidget } from "@/components/chat/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EduManage - Multi-Institution Education Platform",
  description: "A comprehensive multi-tenant education management platform for franchise-based institutions. Manage students, staff, attendance, payroll, and certificates.",
  keywords: ["education", "management", "platform", "students", "staff", "payroll", "certificates"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100`} suppressHydrationWarning>
        <Providers>
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
