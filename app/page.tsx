import Link from 'next/link';
import { ArrowRight, ClipboardCheck, FileCheck2, ListChecks, Search } from 'lucide-react';
import { PageBackground } from '@/components/shared/PageBackground';
import { FaqSection } from '@/components/home/FaqSection';

const GENERAL_BENEFITS = [
  {
    number: '01',
    title: 'Listing Melalui Review',
    description:
      'Setiap listing melewati proses review admin kami sebelum tayang — bukan listing bebas tanpa filter seperti marketplace pada umumnya.',
  },
  {
    number: '02',
    title: 'Fee Transparan',
    description:
      'Kami hanya mengenakan success fee 8% saat transaksi berhasil closing — tidak ada biaya listing di muka, tidak ada biaya tersembunyi.',
  },
  {
    number: '03',
    title: 'Anda Tetap Pegang Kendali',
    description:
      'Saat ini, negosiasi harga dan transfer dana dilakukan langsung antar pembeli dan penjual melalui chat room yang sudah di sediakan oleh pihak DEALING yang aman — bukan lewat pihak ketiga yang menahan dana Anda. Kami sedang mengembangkan opsi escrow untuk keamanan tambahan ke depannya.',
  },
  {
    number: '04',
    title: 'Estimasi Valuasi Awal',
    description:
      'Dapatkan estimasi valuasi berbasis multiplier revenue bulanan sebagai titik awal diskusi harga — panduan awal, bukan angka pasti dari data pasar real-time.',
  },
];

const MEMBERSHIP_BENEFITS = [
  {
    number: '01',
    title: 'Early Access Listing',
    description:
      'Member yang lolos aplikasi dan approval tim kami akan mendapat info listing pilihan lebih dulu — dipilih langsung oleh admin, bukan otomatis untuk semua listing yang masuk.',
  },
  {
    number: '02',
    title: 'Escrow Terlindungi',
    badge: '(Segera Hadir)',
    description:
      'Kami sedang mengembangkan layanan escrow untuk mengamankan proses serah-terima aset dan dana. Saat ini, negosiasi dan transaksi dilakukan langsung antar pihak.',
  },
];

const HOW_IT_WORKS = [
  {
    icon: ClipboardCheck,
    title: 'Submit Listing',
    description: 'Isi detail bisnis Anda lewat form terpandu, sesuai kategori aset digital yang Anda jual.',
  },
  {
    icon: FileCheck2,
    title: 'Review Admin',
    description: 'Tim kami meninjau data yang masuk sebelum listing tayang ke publik — bukan listing bebas tanpa filter.',
  },
  {
    icon: ListChecks,
    title: 'Listing Tayang',
    description: 'Setelah disetujui, listing Anda tampil di halaman Browse dan bisa ditemukan calon pembeli.',
  },
  {
    icon: Search,
    title: 'Matching Buyer',
    description: 'Sistem kami otomatis mencocokkan listing baru dengan preferensi buyer yang tersimpan, lalu tim kami menghubungkan kedua pihak.',
  },
];

export default function Home() {
  return (
    <PageBackground mainClassName="flex flex-col items-center">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 z-10 pt-20">
        <div className="text-center max-w-4xl flex flex-col items-center mt-12">
          <div className="px-5 py-2 bg-surfaceGlass border border-white/10 rounded-full text-xs font-medium text-primary mb-8 backdrop-blur-2xl shadow-lg">
            Platform Micro-M&A Aset Digital Indonesia
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-normal tracking-tight mb-8 text-white leading-[1.1]">
            Ubah Aset Intelektual <br />
            Menjadi{" "}
            <span className="inline-block italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-primary to-amber-600 pr-4">
              Valuasi yang Nyata.
            </span>
          </h1>

          <p className="text-base md:text-lg text-textMuted mb-12 max-w-2xl leading-relaxed">
            DEALING adalah platform untuk M&A aset digital di Indonesia. Kami mempertemukan penjual dan pembeli
            aset digital—Content Account, Website/Media, SaaS, Newsletter & Komunitas, hingga E-Commerce—lewat
            proses yang transparan dan listing terverifikasi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              href="/onboarding?intent=sell"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Jual Bisnis Saya
            </Link>
            <Link
              href="/browse"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.02] border border-white/10 text-white font-semibold rounded-full backdrop-blur-2xl hover:bg-white/[0.05] hover:border-primary/40 transition-all"
            >
              Cari Bisnis untuk Diakuisisi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= GENERAL BENEFITS SECTION ================= */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-24 z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
              Standar Kami
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
              Kenapa <br />
              <span className="text-textMuted">DEALING?</span>
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {GENERAL_BENEFITS.map((benefit) => (
            <div
              key={benefit.number}
              className="group relative p-8 rounded-3xl bg-surfaceGlass border border-white/10 backdrop-blur-2xl hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 overflow-hidden cursor-default"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <span className="text-textMuted/50 text-sm font-mono mb-8 block">{benefit.number}</span>
              <h4 className="text-2xl font-serif text-white mb-4 group-hover:text-primary transition-colors duration-300">
                {benefit.title}
              </h4>
              <p className="text-textMuted text-sm leading-relaxed relative z-10">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MEMBERSHIP SECTION ================= */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-24 z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
              Membership Eksklusif
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
              Ingin Akses <br />
              <span className="text-textMuted">Lebih Dulu?</span>
            </h3>
          </div>
          <Link
            href="/membership"
            className="px-6 py-3 bg-white/[0.02] border border-white/10 text-white text-sm font-semibold rounded-full hover:bg-white/[0.05] hover:border-primary/40 transition-all backdrop-blur-2xl whitespace-nowrap"
          >
            Daftar Jadi Member
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {MEMBERSHIP_BENEFITS.map((benefit) => (
            <div
              key={benefit.number}
              className="group relative p-8 rounded-3xl bg-surfaceGlass border border-white/10 backdrop-blur-2xl hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 overflow-hidden cursor-default"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <span className="text-textMuted/50 text-sm font-mono mb-8 block">{benefit.number}</span>
              <h4 className="text-2xl font-serif text-white mb-4 group-hover:text-primary transition-colors duration-300">
                {benefit.title} {benefit.badge && <span className="text-primary">{benefit.badge}</span>}
              </h4>
              <p className="text-textMuted text-sm leading-relaxed relative z-10">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-24 z-10">
        <div className="mb-16 text-center">
          <h2 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">Cara Kerja</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Dari Submit Sampai <span className="text-textMuted">Ketemu Buyer.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, index) => (
            <div
              key={step.title}
              className="group relative p-8 rounded-3xl bg-surfaceGlass border border-white/10 backdrop-blur-2xl hover:border-primary/30 transition-all duration-500 overflow-hidden cursor-default"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-transform duration-500 group-hover:scale-110">
                <step.icon className="h-6 w-6" />
              </div>
              <span className="text-textMuted/50 text-xs font-mono mb-2 block">
                LANGKAH {String(index + 1).padStart(2, "0")}
              </span>
              <h4 className="text-lg font-semibold text-white mb-3">{step.title}</h4>
              <p className="text-textMuted text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <FaqSection />

    </PageBackground>
  );
}