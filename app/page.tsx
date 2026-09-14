import Link from 'next/link';
import { PageBackground } from '@/components/shared/PageBackground';

export default function Home() {
  return (
    <PageBackground mainClassName="flex flex-col items-center">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 z-10 pt-20">
        <div className="text-center max-w-4xl flex flex-col items-center mt-12">
          <div className="px-5 py-2 bg-surfaceGlass border border-white/10 rounded-full text-xs font-medium text-primary mb-8 backdrop-blur-xl shadow-lg">
            Exclusive Business Acquisition Club
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-normal tracking-tight mb-8 text-white leading-[1.1]">
            Bangun Sistem yang <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-primary to-amber-600">
              Mengubah Penghasilan
            </span> <br />
            Menjadi Kekayaan.
          </h1>

          <p className="text-base md:text-lg text-textMuted mb-12 max-w-2xl leading-relaxed">
            DEALING membantu founder dan investor meningkatkan cashflow, mengambil keputusan akuisisi terbaik, dan membangun aset yang bertumbuh selama puluhan tahun.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              href="/onboarding"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Gabung DEALING Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-24 z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
              Membership Benefits
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
              Apa yang akan <br />
              <span className="text-textMuted">Anda dapatkan?</span>
            </h3>
          </div>
          <button className="px-6 py-3 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-full hover:bg-white/10 transition-all backdrop-blur-md">
            Lihat Semua Fitur
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01 */}
          <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-500 overflow-hidden cursor-default">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <span className="text-textMuted/50 text-sm font-mono mb-8 block">01</span>
            <h4 className="text-2xl font-serif text-white mb-4 group-hover:text-primary transition-colors duration-300">
              Verified Deal Flow
            </h4>
            <p className="text-textMuted text-sm leading-relaxed relative z-10">
              Akses eksklusif ke startup dan bisnis digital dengan metrik keuangan yang sudah diverifikasi ketat oleh tim auditor internal kami.
            </p>
          </div>

          {/* Card 02 */}
          <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-500 overflow-hidden cursor-default">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <span className="text-textMuted/50 text-sm font-mono mb-8 block">02</span>
            <h4 className="text-2xl font-serif text-white mb-4 group-hover:text-primary transition-colors duration-300">
              Premium Escrow
            </h4>
            <p className="text-textMuted text-sm leading-relaxed relative z-10">
              Keamanan transaksi tingkat tinggi dengan layanan escrow, memastikan perpindahan aset digital dan dana berjalan 100% aman dan transparan.
            </p>
          </div>

          {/* Card 03 */}
          <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-500 overflow-hidden cursor-default">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <span className="text-textMuted/50 text-sm font-mono mb-8 block">03</span>
            <h4 className="text-2xl font-serif text-white mb-4 group-hover:text-primary transition-colors duration-300">
              Data-Driven Valuation
            </h4>
            <p className="text-textMuted text-sm leading-relaxed relative z-10">
              Dapatkan panduan valuasi bisnis yang presisi berbasis data metrik industri real-time, memastikan Anda mengakuisisi atau menjual aset di harga yang paling optimal.
            </p>
          </div>
        </div>
      </section>

    </PageBackground>
  );
}