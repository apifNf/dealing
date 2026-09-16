import type { Metadata } from "next";
import { PageBackground } from "@/components/shared/PageBackground";

// ============================================================================
// INTERNAL NOTE (not shown to users): This is a FIRST DRAFT of the Terms of
// Service, written to cover the standard bases for a micro-M&A marketplace
// (service definition, user obligations, listing/review process, the 8%
// success fee, and an anti-circumvention clause). It has NOT been reviewed
// by a lawyer and must not be treated as legally final — get real legal
// review before relying on this in a dispute or using it to justify
// withholding/charging a fee.
// ============================================================================

export const metadata: Metadata = {
  title: "Terms of Service | DEALING",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-serif text-xl text-white">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-textMuted">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <PageBackground>
      <div className="px-6 py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-primary">Legal</p>
            <h1 className="font-serif text-3xl text-white sm:text-4xl">Syarat & Ketentuan Layanan</h1>
            <p className="mt-3 text-sm text-textMuted">Terakhir diperbarui: {lastUpdated}</p>
          </div>

          <div className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-surfaceGlass p-8 backdrop-blur-2xl sm:p-10">
            <Section title="1. Definisi Layanan">
              <p>
                DEALING ("Platform", "kami") adalah platform Micro-M&A yang mempertemukan penjual ("Seller") dan
                pembeli ("Buyer") aset digital — termasuk namun tidak terbatas pada Content Account, Website/Media,
                SaaS/Micro-Tools, Newsletter & Komunitas, dan E-Commerce & Toko Digital.
              </p>
              <p>
                Peran DEALING terbatas pada: (a) menerima dan meninjau (review) listing yang diajukan Seller, (b)
                menampilkan listing yang disetujui kepada Buyer melalui halaman Browse, (c) memfasilitasi
                pencocokan (matching) antara listing dan preferensi Buyer, dan (d) menyediakan chat room in-app
                untuk komunikasi antara Buyer dan Seller. DEALING bukan pihak dalam transaksi jual-beli itu
                sendiri, tidak memiliki, tidak menjual, dan tidak menjamin kondisi aset yang dilistingkan.
              </p>
            </Section>

            <Section title="2. Kewajiban Pengguna">
              <p>
                Dengan menggunakan Platform, Anda setuju untuk: (a) memberikan informasi yang akurat dan tidak
                menyesatkan saat mendaftar, membuat listing, atau berkomunikasi di chat room; (b) tidak
                menggunakan Platform untuk tujuan penipuan, pencucian uang, atau aktivitas ilegal lainnya; (c)
                mematuhi Perjanjian Kerahasiaan (NDA) yang Anda setujui sebelum mengakses detail listing tertentu;
                dan (d) tidak menyalahgunakan chat room untuk tujuan di luar evaluasi dan negosiasi akuisisi aset
                yang bersangkutan.
              </p>
            </Section>

            <Section title="3. Proses Listing & Review">
              <p>
                Setiap listing yang diajukan Seller berstatus "Pending" hingga ditinjau oleh admin DEALING. Admin
                berhak menyetujui, menolak, atau meminta klarifikasi tambahan atas suatu listing tanpa kewajiban
                menjelaskan alasan penolakan secara rinci. Listing yang disetujui ("Approved") akan tampil di
                halaman Browse dan dapat diakses publik dalam bentuk ringkasan (bukan seluruh detail sensitif).
              </p>
              <p>
                Persetujuan listing oleh admin bukan merupakan jaminan atau verifikasi independen atas kebenaran
                seluruh data finansial atau operasional yang disampaikan Seller. Buyer tetap bertanggung jawab
                untuk melakukan uji tuntas (due diligence) sendiri sebelum menyepakati transaksi apa pun.
              </p>
            </Section>

            <Section title="4. Success Fee (8%)">
              <p>
                DEALING mengenakan success fee sebesar <strong className="text-textMain">8% (delapan persen)</strong>{" "}
                dari nilai transaksi, yang hanya berlaku dan ditagihkan apabila transaksi akuisisi aset benar-benar
                berhasil closing (disepakati dan dieksekusi kedua belah pihak). Tidak ada biaya pendaftaran, biaya
                listing di muka, atau biaya tersembunyi lain di luar success fee ini.
              </p>
              <p className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-textMain">
                <strong>Ketentuan anti-penghindaran fee:</strong> Apabila suatu transaksi atau proses closing
                terjadi sebagai hasil dari listing atau match yang difasilitasi oleh DEALING — baik pencocokan
                melalui halaman Browse, sistem matching (Gatekeeper), maupun perkenalan awal melalui chat room
                Platform — maka success fee sebesar 8% tetap berlaku dan wajib dibayarkan kepada DEALING,
                meskipun negosiasi lebih lanjut, penandatanganan perjanjian, atau transfer dana pada akhirnya
                dilakukan di luar Platform. Upaya menghindari fee dengan sengaja memindahkan transaksi ke luar
                Platform setelah perkenalan difasilitasi oleh DEALING merupakan pelanggaran terhadap ketentuan ini.
              </p>
            </Section>

            <Section title="5. Chat Room & Kerahasiaan">
              <p>
                Chat room in-app disediakan sebagai kanal komunikasi utama antara Buyer dan Seller yang sudah
                disetujui admin. Demi keamanan transaksi, admin DEALING dapat memonitor isi percakapan di dalam
                chat room — lihat Privacy Policy kami untuk detail lengkap mengenai pemrosesan data ini. Pengguna
                dihimbau untuk tidak membagikan kontak pribadi atau melakukan negosiasi/transaksi di luar chat
                room yang disediakan; pelanggaran dapat berujung pada penangguhan akses (banned) sesuai kebijakan
                Platform.
              </p>
            </Section>

            <Section title="6. Batasan Tanggung Jawab">
              <p>
                DEALING disediakan atas dasar "sebagaimana adanya" (as-is). Kami tidak bertanggung jawab atas
                kerugian yang timbul dari keputusan akuisisi yang diambil pengguna, termasuk namun tidak terbatas
                pada ketidakakuratan data yang disampaikan pihak lain, kegagalan negosiasi, atau sengketa antara
                Buyer dan Seller pasca-transaksi.
              </p>
            </Section>

            <Section title="7. Penangguhan & Penghentian Akses">
              <p>
                DEALING berhak menangguhkan atau menghentikan akses pengguna yang terbukti melanggar Ketentuan
                ini, termasuk namun tidak terbatas pada pelanggaran ketentuan anti-penghindaran fee pada Pasal 4
                atau penyalahgunaan chat room pada Pasal 5.
              </p>
            </Section>

            <Section title="8. Perubahan Ketentuan">
              <p>
                Kami dapat memperbarui Ketentuan ini dari waktu ke waktu. Perubahan material akan diinformasikan
                melalui Platform. Penggunaan berkelanjutan atas Platform setelah perubahan berlaku dianggap
                sebagai persetujuan atas ketentuan yang diperbarui.
              </p>
            </Section>

            <Section title="9. Hukum yang Berlaku">
              <p>
                Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Pertanyaan
                mengenai Ketentuan ini dapat dikirimkan ke{" "}
                <a href="mailto:atechlabshello@gmail.com" className="text-primary hover:underline">
                  atechlabshello@gmail.com
                </a>
                .
              </p>
            </Section>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}
