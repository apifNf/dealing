'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed w-full z-50 top-4 px-4 flex justify-center">
      <nav 
        className={`
          transition-all duration-500 ease-in-out
          bg-[#121214]/80 backdrop-blur-xl border border-white/10 
          rounded-full flex items-center justify-between
          shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-4xl
          ${isScrolled ? 'h-14 px-6' : 'h-16 px-6'}
        `}
      >
        {/* Logo Custom & Teks Brand */}
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          
          {/* Logo Ikon 'D' Custom (Infinity) */}
          <div className="relative w-7 h-7 flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="DEALING Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Teks DEALING yang menghilang saat scroll */}
          <span 
            className={`
              text-[10px] md:text-xs font-semibold tracking-[0.25em] text-textMain mt-0.5
              transition-all duration-500 ease-in-out whitespace-nowrap
              ${isScrolled ? 'opacity-0 max-w-0 pointer-events-none translate-x-[-10px]' : 'opacity-100 max-w-[120px] translate-x-0'}
            `}
          >
            DEALING
          </span>
        </Link>
        
        {/* Menu Navigasi Tengah */}
        <div className="hidden md:flex space-x-6 text-xs font-medium text-textMuted mx-4">
          <Link href="/browse" className="hover:text-textMain transition-colors">Browse</Link>
          <Link href="/onboarding?intent=sell" className="hover:text-textMain transition-colors">List Business</Link>
          <Link href="/admin/dashboard" className="hover:text-textMain transition-colors">Admin</Link>
        </div>

        {/* Tombol Aksi Kanan */}
        <div className="flex items-center space-x-2">
          <Link
            href="/onboarding"
            className="text-xs md:text-sm font-medium text-textMuted hover:text-textMain px-3 py-1.5 transition-all"
          >
            Masuk
          </Link>
          <Link
            href="/onboarding"
            className="px-4 py-1.5 bg-gradient-to-r from-primary to-orange-600 text-white text-xs md:text-sm font-semibold rounded-full hover:opacity-90 transition-all shadow-[0_0_15px_rgba(194,65,12,0.3)] whitespace-nowrap"
          >
            Gabung
          </Link>
        </div>
      </nav>
    </header>
  );
};