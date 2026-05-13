import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

// Google Font — Next.js otomatik optimize eder
// Font dosyası build sırasında indirilir, Google'a runtime'da istek gitmez
const inter = Inter({ subsets: ["latin"] });

// Metadata — sayfanın <head> etiketi içeriği
// SEO için önemli — arama motorları bunu okur
export const metadata: Metadata = {
  title: "LibraryAPI",
  description: "Kütüphane Yönetim Sistemi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // children → içine render edilecek sayfa
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {/* Providers → React Query ve diğer context'leri sarar */}
        <Providers>
          <Navbar />
          {/* main → her sayfanın içeriği buraya gelir */}
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}