import type { Metadata } from "next";
import { PageBackground } from "@/components/shared/PageBackground";
import { ContactEmailLink } from "@/components/shared/ContactEmail";

export const metadata: Metadata = {
  title: "Privacy Policy | DEALING",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-serif text-xl text-white">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-textMuted">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <PageBackground>
      <div className="px-6 py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-primary">Legal</p>
            <h1 className="font-serif text-3xl text-white sm:text-4xl">Kebijakan Privasi</h1>
            <p className="mt-3 text-sm text-textMuted">Terakhir diperbarui: {lastUpdated}</p>
          </div>

          <div className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-surfaceGlass p-8 backdrop-blur-2xl sm:p-10">
            <Section title="1. Data yang Kami Kumpulkan">
              <p>Kami mengumpulkan dan menyimpan data berikut sehubungan dengan penggunaan Platform:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-textMain">Informasi akun:</strong> email dan password (tersimpan dalam
                  bentuk hash, bukan teks biasa) untuk Buyer dan Seller yang mendaftar.
                </li>
                <li>
                  <strong className="text-textMain">Informasi kontak:</strong> email, nomor WhatsApp, atau
                  Telegram yang Anda cantumkan pada form listing (Seller) atau preferensi akuisisi (Buyer).
                </li>
                <li>
                  <strong className="text-textMain">Data listing:</strong> kategori aset, metrik bisnis (revenue,
                  traffic, jumlah subscriber, dsb.), dan dokumen pendukung yang diunggah Seller.
                </li>
                <li>
                  <strong className="text-textMain">Catatan persetujuan NDA:</strong> waktu (timestamp) dan alamat
                  IP saat Buyer menyetujui Perjanjian Kerahasiaan untuk suatu listing.
                </li>
                <li>
                  <strong className="text-textMain">Isi pesan chat room:</strong> seluruh konten pesan yang
                  dikirim Buyer dan Seller di dalam chat room in-app, termasuk waktu pengiriman.
                </li>
              </ul>
            </Section>

            <Section title="2. Monitoring Chat Room oleh Admin">
              <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-textMain">
                <strong>Penting:</strong> Chat room di Platform ini <strong>bukan</strong> saluran komunikasi
                pribadi atau terenkripsi end-to-end. Admin DEALING memiliki akses untuk membaca dan memonitor
                seluruh isi percakapan pada setiap chat room, kapan pun, untuk tujuan keamanan transaksi —
                termasuk mendeteksi indikasi penipuan, pelanggaran Syarat & Ketentuan (seperti upaya menghindari
                success fee), atau aktivitas mencurigakan lainnya. Jangan membagikan informasi yang tidak ingin
                diketahui pihak ketiga di dalam chat room.
              </p>
            </Section>

            <Section title="3. Penggunaan Data">
              <p>Data yang kami kumpulkan digunakan untuk:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Menjalankan proses review dan approval listing oleh admin.</li>
                <li>
                  Memfasilitasi pencocokan otomatis ("Gatekeeper") antara listing baru yang disetujui dengan
                  preferensi Buyer yang tersimpan (kategori dan rentang budget), lalu meneruskan detail
                  kontak yang relevan kepada tim ops kami untuk ditindaklanjuti secara manual.
                </li>
                <li>
                  Mengirim notifikasi operasional internal (listing baru, permintaan chat room, pesan yang
                  terdeteksi mencurigakan) ke channel Telegram tim ops kami — notifikasi ini dikirim ke tim
                  internal DEALING, bukan ke pihak ketiga di luar organisasi.
                </li>
                <li>Autentikasi dan menjaga keamanan akun Anda, termasuk proses reset password.</li>
                <li>Menegakkan Syarat & Ketentuan, termasuk investigasi atas dugaan pelanggaran.</li>
              </ul>
            </Section>

            <Section title="4. Berbagi Data">
              <p>
                Kami tidak menjual data pribadi Anda kepada pihak ketiga. Detail kontak Buyer/Seller hanya
                dibagikan kepada pihak lawan transaksi yang relevan (misalnya, kontak Seller kepada Buyer yang
                sudah disetujui admin untuk berdiskusi), atau kepada anggota Membership yang disetujui saat admin
                membagikan listing tertentu ke grup membership.
              </p>
            </Section>

            <Section title="5. Penyimpanan & Keamanan">
              <p>
                Data disimpan di database yang tidak diekspos secara publik. Password disimpan dalam bentuk hash
                (bcrypt), bukan teks biasa. Meski demikian, tidak ada sistem yang sepenuhnya bebas risiko — Anda
                bertanggung jawab menjaga kerahasiaan kredensial akun Anda sendiri.
              </p>
            </Section>

            <Section title="6. Hak Anda">
              <p>
                Anda dapat menghubungi kami untuk meminta akses, koreksi, atau penghapusan data pribadi Anda,
                sepanjang tidak bertentangan dengan kewajiban hukum atau kebutuhan pembuktian transaksi yang
                sedang berjalan.
              </p>
            </Section>

            <Section title="7. Kontak">
              <p>
                Pertanyaan mengenai Kebijakan Privasi ini dapat dikirimkan ke{" "}
                <ContactEmailLink className="text-primary hover:underline" />.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}
