export const NDA_VERSION = "1.0";

/**
 * Generic click-to-accept NDA shown before a buyer can request a chat room
 * with a listing's seller. Deliberately simple/generic (no e-signature,
 * no per-listing customization) — enough for an early-stage marketplace to
 * signal confidentiality expectations, not a substitute for legal counsel.
 */
export const NDA_TEXT = `
Perjanjian Kerahasiaan (NDA) ini berlaku antara Anda ("Calon Pembeli") dan pemilik bisnis
("Penjual") sehubungan dengan informasi yang akan didiskusikan melalui chat room DEALING
terkait listing yang bersangkutan.

1. Kerahasiaan Informasi
Segala informasi bisnis yang dibagikan oleh Penjual dalam diskusi ini — termasuk namun
tidak terbatas pada data finansial, strategi operasional, kredensial akses, kode sumber,
daftar pelanggan, dan dokumen pendukung lainnya — bersifat rahasia dan hanya boleh
digunakan untuk keperluan evaluasi akuisisi.

2. Larangan Membagikan ke Pihak Lain
Anda setuju untuk tidak membagikan, menyalin, atau mengungkapkan informasi rahasia
tersebut kepada pihak ketiga mana pun tanpa persetujuan tertulis dari Penjual, kecuali
kepada penasihat profesional (akuntan/pengacara) yang terikat kewajiban kerahasiaan
serupa.

3. Penggunaan Terbatas
Informasi yang diperoleh hanya boleh digunakan untuk mengevaluasi kelayakan akuisisi
bisnis ini, bukan untuk tujuan kompetitif atau tujuan lain di luar itu.

4. Komunikasi di Dalam Platform
Demi keamanan kedua belah pihak, seluruh negosiasi awal wajib dilakukan melalui chat
room resmi DEALING. Berbagi kontak pribadi atau mengarahkan percakapan ke luar platform
sebelum kesepakatan tercapai dapat dikenakan sanksi sesuai kebijakan platform (lihat
peringatan pada halaman chat room).

5. Jangka Waktu
Kewajiban kerahasiaan ini berlaku selama 2 (dua) tahun sejak persetujuan ini diberikan,
atau sampai informasi yang dimaksud menjadi pengetahuan umum bukan karena pelanggaran
perjanjian ini.

Dengan mengklik "Saya Setuju", Anda menyatakan telah membaca, memahami, dan menyetujui
seluruh ketentuan di atas untuk listing yang bersangkutan.
`.trim();
