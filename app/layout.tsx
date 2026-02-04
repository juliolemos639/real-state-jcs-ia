import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteSidebar } from "@/components/site-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JCS Imóveis",
  description: "Visualize imóveis, adicione à lista e faça consultas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <div className="flex min-h-screen">
          <SiteSidebar />
          <main className="min-w-0 flex-1 px-4 py-6 lg:max-w-4xl lg:px-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
