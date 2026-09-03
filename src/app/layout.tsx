import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MotorMatch - Motor Selection & Sizing Tool",
  description: "Web app untuk membantu engineer memilih dan sizing motor (servo/stepper/induksi-VFD) berdasarkan mekanisme dan parameter beban",
  keywords: ["motor", "sizing", "servo", "stepper", "VFD", "engineering", "automation"],
  authors: [{ name: "MotorMatch" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-surface-50 font-sans">
        {children}
      </body>
    </html>
  );
}