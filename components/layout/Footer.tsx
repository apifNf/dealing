import Link from "next/link";
import Image from "next/image";
import { ContactEmailLink } from "@/components/shared/ContactEmail";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-surfaceGlass backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative h-7 w-7 shrink-0">
                <Image src="/logo.png" alt="DEALING Logo" fill className="object-contain" />
              </div>
              <span className="text-xs font-semibold tracking-[0.25em] text-textMain">DEALING</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-textMuted">
              Platform Micro-M&A aset digital Indonesia — mempertemukan penjual dan pembeli lewat proses yang
              transparan dan listing terverifikasi.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Kontak Resmi</h3>
            <ContactEmailLink
              showIcon
              className="flex items-center gap-2 text-sm text-textMuted transition-colors hover:text-textMain"
            />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Legal</h3>
            <Link href="/terms" className="text-sm text-textMuted transition-colors hover:text-textMain">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-textMuted transition-colors hover:text-textMain">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-textMuted/70">
          © {year} DEALING. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
