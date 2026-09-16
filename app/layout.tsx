import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "DEALING | Premium Business Acquisitions",
  description: "Marketplace eksklusif untuk akuisisi startup, SaaS, dan bisnis digital.",
};

async function getNavbarUser() {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  return user;
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getNavbarUser();

  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable}`}>
      <body className="antialiased bg-[#0A0A0B] text-[#EDEDED] font-sans selection:bg-primary/30 selection:text-white">
        <Navbar user={user} />
        <div className="pt-20">{children}</div>
        <Footer />
      </body>
    </html>
  );
}