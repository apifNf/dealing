"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Bagaimana cara kerja fee 8%?",
    answer:
      "Kami hanya mengenakan success fee 8% dari nilai transaksi, dan hanya ditagihkan saat transaksi berhasil closing — tidak ada biaya listing di muka maupun biaya tersembunyi. Fee ini tetap berlaku apabila transaksi merupakan hasil dari listing atau match yang difasilitasi DEALING, meskipun negosiasi atau transfer dana akhir dilakukan di luar platform (lihat Terms of Service kami).",
  },
  {
    question: "Apa yang dimaksud \"listing melalui review admin\"?",
    answer:
      "Setiap listing yang masuk ditinjau langsung oleh admin kami sebelum tayang di halaman Browse — bukan listing bebas tanpa filter seperti marketplace pada umumnya. Admin berhak menyetujui, menolak, atau meminta klarifikasi tambahan sebelum listing bisa dilihat calon pembeli.",
  },
  {
    question: "Apakah percakapan di chat room aman?",
    answer:
      "Chat room in-app kami sediakan sebagai kanal komunikasi resmi antara buyer dan seller yang sudah disetujui admin, dan hanya bisa diakses oleh kedua pihak tersebut. Untuk keamanan transaksi, admin DEALING dapat memonitor isi percakapan guna mendeteksi indikasi penipuan atau pelanggaran kebijakan — chat room ini bukan saluran pribadi atau terenkripsi end-to-end. Selengkapnya ada di Privacy Policy kami.",
  },
  {
    question: "Bagaimana proses jadi member eksklusif?",
    answer:
      "Ajukan aplikasi lewat halaman Membership dengan nama dan kontak Anda. Tim kami akan meninjau aplikasi tersebut, dan jika disetujui, Anda akan mendapat info listing pilihan lebih dulu — dipilih langsung oleh admin, bukan otomatis untuk semua listing yang masuk.",
  },
  {
    question: "Apakah ada biaya untuk listing bisnis saya?",
    answer:
      "Tidak ada biaya listing di muka maupun biaya pendaftaran. Anda hanya dikenakan success fee 8% saat transaksi berhasil closing — jika tidak ada transaksi yang terjadi, tidak ada biaya yang harus dibayarkan.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-white/10 bg-surfaceGlass backdrop-blur-2xl transition-colors duration-300 hover:border-primary/30">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <span className="text-base font-semibold text-white">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-textMuted transition-transform duration-300 ${open ? "rotate-180 text-primary" : ""}`}
        />
      </button>
      {open && (
        <div className="animate-step-in px-6 pb-6">
          <p className="text-sm leading-relaxed text-textMuted">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="relative w-full max-w-4xl mx-auto px-6 py-24 z-10">
      <div className="mb-16 text-center">
        <h2 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">FAQ</h2>
        <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
          Pertanyaan yang <span className="text-textMuted">Sering Diajukan.</span>
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {FAQS.map((faq) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}
