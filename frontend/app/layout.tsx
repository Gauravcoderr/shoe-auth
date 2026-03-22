import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/layout/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400", "500", "600", "700", "800"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "SneakerAuth — AI Shoe Authentication",
  description: "Upload photos of your sneakers. Our AI checks 50+ points in seconds and tells you if they're real or fake. Supports Nike, Jordan, Adidas, and New Balance.",
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
