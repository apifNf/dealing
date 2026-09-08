import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "DEALING | Premium Business Acquisitions",
  description: "Marketplace eksklusif untuk akuisisi startup, SaaS, dan bisnis digital.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable}`}>
      <body className="antialiased bg-[#0A0A0B] text-[#EDEDED] font-sans selection:bg-primary/30 selection:text-white">
        <Navbar />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}