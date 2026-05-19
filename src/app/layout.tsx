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
    "ห้างทองธารทอง",
    "ราคาทองคำ",
    "ทองคำวันนี้",
    "ทองคำแท่ง",
    "ทองรูปพรรณ",
    "ราคาทองวันนี้",
    "ราคาทองคำวันนี้",
    "ทองคำ 96.5%",
    "ทองคำ 99.99%",
    "ThanThong"
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
              toast: "text-gray-100 border-gray-700 bg-background/90 backdrop-blur-md shadow-lg",
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
