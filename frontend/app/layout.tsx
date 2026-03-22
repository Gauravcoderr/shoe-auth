import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/layout/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400", "500", "600", "700", "800"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const viewport: Viewport = {
  themeColor: "#111111",
};

export const metadata: Metadata = {
  title: "SneakerAuth — AI Shoe Authentication",
  description: "Upload photos of your sneakers. Our AI checks 74 points in seconds and tells you if they're real or fake. Supports Nike, Jordan, Adidas, and New Balance.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SneakerAuth",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "SneakerAuth — AI Shoe Authentication",
    description: "Is your sneaker real or fake? Upload photos and get an AI verdict in 30 seconds.",
    url: "https://sneakerauth.vercel.app",
    siteName: "SneakerAuth",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SneakerAuth" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SneakerAuth — AI Shoe Authentication",
    description: "Is your sneaker real or fake? AI verdict in 30 seconds.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} font-sans antialiased bg-[#f7f7f4] text-[#111]`}>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
