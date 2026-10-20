# IG Flow — Aturan proyek frontend

Dashboard Nuxt untuk pengolahan konten Instagram AMTI dan review internal. Baca [overview](docs/architecture/overview.md), [konvensi kode](docs/rules/coding-standards.md) dan panduan fitur sebelum perubahan. AGENTS.md dan CLAUDE.md harus identik.

## Stack dan struktur

Nuxt 4 SPA (SSR false), Nuxt UI 4, Tailwind CSS, TypeScript, Zod, Axios, Nuxt i18n en/id dan Bun. Versi mengikuti package.json/bun.lock. User dan Profile menjadi referensi struktur/visual. Contact sudah dihapus.

Page menyusun layout; component menangani UI; composable mengelola state/lifecycle; service menangani HTTP; helper stateless ada di app/util. Modul terkait tetap dikelompokkan per fitur, tanpa facade social. Jangan menduplikasi auth client, query builder, formatter atau shared component.

## UI dan bahasa

- Wajib gunakan Nuxt UI, token tema dan class Tailwind standar. Tidak memakai arbitrary values atau CSS hardcoded untuk meniru komponen yang tersedia.
- Tema primary biru AMTI, font Geist, default button/input lg. Rujuk app/app.config.ts dan app/assets/css/main.css; jangan ubah token global untuk memperbaiki satu halaman.
- Label, placeholder, toast, validation message dan aria-label memakai i18n di kedua locale. Baca docs/rules/i18n.md sebelum menambah teks.
- Form memakai UForm/Zod/UFormField; field wajib diberi required. Modal fitur menjadi component terpisah; gunakan DeleteModal bersama.
- Gunakan toast untuk hasil aksi. Toast sukses tidak memakai atribut `color`; gunakan warna default. Error field/page/job yang perlu menetap dapat inline. Jangan menambah tombol refresh manual, role selector atau menu Contact.
- DateInput digunakan untuk tanggal. Formatter umum di util/date, formatter waktu workflow Asia/Jakarta di util/content.
- Gambar selain avatar dapat dibuka melalui shared lightbox. Gunakan UAvatar untuk avatar. Media memakai progressive preview dan MinIO; Blob sementara harus dibersihkan.
- Content menyatukan job/studio/review dalam tab status. Halaman Content `/content/:jobId` menyatukan detail dan publikasi berdasarkan status; hasil siap review langsung menampilkan form konten, foto, akun serta jadwal dengan aksi Reject dan Publish/Jadwalkan, tanpa langkah persiapan tambahan. Tidak ada tab atau halaman Publish terpisah. Media memakai infinite scroll, bukan pagination footer.

## API dan state

Plugin API adalah composition root. Jangan memanggil composable Nuxt atau request dari constructor service singleton. Service memakai apiService, requestHeaders dan ApiResponse dari app/types/api; tidak menampilkan toast/navigasi atau mengganti exception dengan undefined.

Ambil useServiceError saat setup sebelum await. Auth state readonly; pertahankan single refresh coordination dan jangan logout karena network error biasa. Gunakan useLatestRequest/polling sesuai lifecycle. Review langsung menuju Publish atau Reject. Edit hanya di form Publish dan dikirim bersama aksi publish; gunakan hash konten untuk guard. Desain AI tidak boleh digunakan bila konten berubah.

Semua user aktif memiliki akses yang sama. Callback secret hanya milik backend/n8n. Tidak ada credential AI/MinIO di frontend. READY_FOR_REVIEW langsung menuju PUBLISH atau REJECTED.

## Gaya kode dan verifikasi

Dua spasi, single quote, tanpa trailing comma; script setup TypeScript; import type untuk tipe. Component PascalCase, route/service kebab-case, composable camelCase berawalan use. Urutan script: import, macro/meta, composable, state, computed/schema, fungsi, watcher, lifecycle.

Untuk implementasi jalankan bun run typecheck, bun run lint, bun run test dan bun run build. Uji desktop/mobile bila browser tersedia dan laporkan batas verifikasi. Dokumentasi-only cukup pemeriksaan fakta/link; tidak perlu test yang menyalin teks dokumen. Update changelog untuk perubahan berarti.

Jangan install library jika Nuxt UI/Tailwind sudah mencukupi. Jangan ubah api-service, auth-service, layout, nuxt.config atau design tokens di luar scope permintaan. Jangan commit .env atau secret. Audit bertanggal adalah arsip, bukan acuan perilaku saat ini.

## Instagram publishing — 19 Oktober 2026

Publikasi Graph API memakai Instagram Login (graph.instagram.com, Instagram User access token, tanpa Facebook Page) melalui aksi eksplisit mendukung daftar multi-account, tetapi satu project hanya boleh diposting satu kali ke satu akun, langsung/terjadwal. Credential hanya di JSON privat server (bukan database); contoh tanpa secret boleh di-commit. Ready for review hanya mempunyai keputusan Publish atau Reject. Snapshot dan jadwal berada di tabel publications dengan constraint unique batch_id sejak baseline. Worker posts:dispatch terpisah dari jobs:dispatch. Settings menampilkan daftar akun dan kontrol dispatcher AI. Jangan mengulang publish saat hasil jaringan ambigu; lakukan rekonsiliasi container.

## Keterbacaan dan format

Jalankan `bun run format` untuk merapikan source dan `bun run lint` untuk memeriksa aturan. Pisahkan fungsi/method dan blok import dari deklarasi berikutnya dengan satu baris kosong. Gunakan kurung kurawal pada kondisi/loop dan satu statement per baris; jangan memadatkan beberapa operasi dalam satu baris. Formatter memecah object, argumen dan ekspresi panjang tanpa mengubah kontrak bisnis.
Frontend memakai indentasi 2 spasi, single quote, tanpa semicolon dan tanpa trailing comma. ESLint menormalkan struktur terlebih dahulu, Prettier merapikan indentasi, lalu ESLint menerapkan konvensi Nuxt/Vue.

## Penyederhanaan publish — 20 Oktober 2026

Draft menyimpan isi konten langsung. Tidak ada entity, endpoint edit, nomor, atau tabel revisi aktif. Publish menyimpan konten final dan snapshot publikasi secara atomik; Reject mengakhiri konten. Baseline development sudah disusun ulang langsung ke schema final, satu tabel satu file. Tidak ada migration transisi atau tabel revisi. Backup dan verifikasi schema wajib sebelum menyelaraskan ledger database development yang sudah berisi data.
