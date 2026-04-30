import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Thai } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-plex-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ห้างทองธารทอง - ราคาทองวันนี้",
  description: "อัปเดตราคาทองคำวันนี้ ทองคำแท่ง ทองรูปพรรณ อัปเดตทุก 30 นาที",
  keywords: [
    "ห้างทองธานทอง",
    "ราคาทองคำ",
    "ทองคำวันนี้",
    "ทองคำแท่ง",
    "ทองรูปพรรณ",
    "ทองคำแท่งวันนี้",
    "ทองรูปพรรณวันนี้",
    "ราคาทองวันนี้",
    "ราคาทองคำวันนี้",
    "ราคาทองคำแท่ง",
    "ราคาทองคำรูปพรรณ",
    "ทองคำแท่ง 96.5%",
    "ทองคำรูปพรรณ 96.5%",
    "ราคาทอง 96.5%",
    "ราคาทองคำแท่ง 96.5%",
    "ราคาทองคำรูปพรรณ 96.5%",
    "ราคาทอง 96.5%",
    "ทองคำแท่ง 99.99%",
    "ทองคำรูปพรรณ 99.99%",
    "ราคาทอง 99.99%",
    "ราคาทองคำแท่ง 99.99%",
    "ราคาทองคำรูปพรรณ 99.99%",
    "ราคาทอง 99.99%"
  ],
  authors: [{ name: "ห้างทองธารทอง" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${ibmPlexSans.variable} ${ibmPlexSansThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans-thai">
        {children}
        <Toaster
          richColors
          position="top-right"
          duration={2000}
          expand={false}
          theme="dark"
          toastOptions={{
            classNames: {
              toast: "text-gray-100 border-gray-700 bg-[#1a202c]/90 backdrop-blur-md shadow-lg",
              title: "text-white",
              description: "text-gray-300",
              success: "border-green-500/30 bg-green-500/5",
              error: "border-red-500/30 bg-red-500/5",
              warning: "border-yellow-500/30 bg-yellow-500/5",
              info: "border-blue-500/30 bg-blue-500/5",
              loading: "border-gray-600 bg-gray-800/80",
            },
          }}
        />
      </body>
    </html>
  );
}
