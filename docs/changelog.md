## 20 Oktober 2026 — Penataan dokumentasi

Memisahkan aturan, arsitektur, fitur, referensi, operasional backend, dan arsip audit. Indeks per kategori serta tautan silang diperbarui. Tidak mengubah runtime aplikasi.

## 20 Oktober 2026 — Radar statistik akun

## Audit kode — 20 Oktober 2026

Audit lifecycle upload/retry/publish, invalidasi request analytics, sorting keyboard, penghapusan opsi/tipes tidak terpakai dan pembaruan dokumentasi. Lihat [laporan audit](archive/audits/audit-code-2026-10-20.md).

Statistik akun dirapikan menjadi empat ringkasan utama dan grid metrik pendukung dengan indikator tren. Perubahan count memakai persentase terhadap periode sebelumnya; engagement rate memakai poin persentase. Baseline nol ditandai tanpa persentase palsu, data tidak tersedia tetap dibedakan dari nol. Radar lebih ringkas; rincian rentang dan skala tersedia melalui tooltip. Insight Content tidak berubah.

Statistik akun memakai radar dua periode dengan skala relatif per metrik dan nilai asli di samping. API account menambahkan previous dan range; pembanding memakai bagian periode sebelumnya yang setara, dengan batas bulan. Content tetap radial.

## 20 Oktober 2026 — Pilihan periode kalender Analytics

Mengganti query days dengan period: Today, This week, This month, Last 7 days dan Last 30 days. Perhitungan memakai WIB, awal minggu Senin, dan cache mengikuti batas kalender.

## 20 Oktober 2026 — Aksi Top posts tetap terlihat

Aksi View post memakai ikon dengan tooltip dan aria-label tanpa teks tombol. Kolomnya diposisikan sticky di sisi kanan tabel Top posts agar dapat diakses tanpa menggulir melewati semua kolom metrik.

## 20 Oktober 2026 — Tabel Top posts lengkap

Mengganti daftar Instagram posts dan dialog insight dengan tabel Top posts lengkap, termasuk tipe, tanggal publish dan semua angka metrik. Memuat seluruh cursor tanpa batas lima/20 total, mempertahankan null, serta membuka View post langsung. Insight Content mempertahankan tampilan metrik semula.

## 20 Oktober 2026 — Metrik tambahan, engagement rate dan postingan terbaik

Menambah metrik yang terverifikasi dengan credential saat ini, engagement rate berbasis reach dengan penanganan null/nol, serta ranking lima terbaik dari 20 postingan terbaru. UI memakai komponen Metrics/DataTable yang konsisten; scope ranking dan rumus ditampilkan jelas.

## 20 Oktober 2026 — Switch jadwal publikasi

Pilihan waktu publikasi memakai switch Jadwalkan. Mati berarti post sekarang; aktif menampilkan tanggal dan jam, dengan validasi jadwal yang sama.

## 20 Oktober 2026 — Form langsung pada Ready for review

Form publish tampil langsung tanpa langkah Continue to publish. Aksi Reject tersedia di samping Publish/Jadwalkan. Menghapus komponen ringkasan review, composable persiapan, tes mode persiapan dan terjemahan yang tidak lagi digunakan. Layout preview, card utama dan card Summary tetap.

## 20 Oktober 2026 — Card utama dan Summary

Mengembalikan satu card utama pada kolom kanan untuk semua status serta satu card Summary di bawahnya. Preview tetap di kiri tanpa pembungkus tambahan. Komponen isi tidak memiliki card bersarang; alur satu halaman dan Lanjut publish tetap dipertahankan.

## 20 Oktober 2026 — Panel Content tanpa card

Menghapus card pembungkus panel kanan dan kotak metadata hasil publikasi. Status/tanggal review disatukan; tombol aksi berdekatan dan form tetap di posisi yang sama. Summary menjadi metadata kecil di bawah tanpa accordion pembungkus, dengan timeline dan rincian teknis tetap dapat dibuka. Tipografi memakai text-base untuk judul dan text-sm untuk konten seperti Profile.

## 20 Oktober 2026 — Review sebelum persiapan publish

Layout Content menggunakan preview kiri dan panel status kanan dengan summary yang dapat dibuka di bawah untuk semua status. Ready for review menampilkan hasil baca-saja dan aksi Lanjut publish/Reject. Form hanya dibuka saat Lanjut publish; Batal mengembalikan konten dan preview semula tanpa request penyimpanan. Mode persiapan bukan status database. Timeline dipisahkan agar tidak menggandakan status dan pesan error pada summary.

## 20 Oktober 2026 — Satu halaman Content

Detail dan Publish digabung di `/content/:jobId`. Proses AI menampilkan foto dan timeline; draft siap review menampilkan preview dan form publish/reject; publikasi terjadwal/berhasil memakai panel status dan insight; penolakan menampilkan alasan. Halaman Publish, header tab dan composable lama dihapus. Polling detail berhenti setelah draft tersedia untuk menjaga edit pengguna.

## 20 Oktober 2026 — Tata letak insight publikasi

Insight pada Publish langsung menampilkan grafik tanpa judul/subtitle tambahan. View post berada di kanan informasi akun, tanpa separator antara akun dan grafik. Catatan keterlambatan data dihapus dari UI dan label waktu menjadi Last update/Pembaruan terakhir.

## 20 Oktober 2026 — Ringkasan publikasi

Hasil publikasi berhasil hanya menampilkan akun dan tanggal publish. Card metadata serta tombol View post dan Preview image pada ringkasan tersebut dihapus; kontrol publikasi terjadwal/gagal tetap tersedia.

## 20 Oktober 2026 — Insight di Publish dan radial chart

Memindahkan insight postingan dari Detail Content ke Publish setelah publikasi berhasil. Menghapus wrapper polling insight yang redundan. Statistik akun dan postingan memakai radial chart nuxt-charts dengan legenda, nilai asli dan penanganan data tidak tersedia.

## 20 Oktober 2026 — Urutan navigasi Analytics

Analytics ditempatkan setelah Overview pada desktop dan mobile. Navbar mobile menjadi Overview, Analytics, tombol Upload tengah, Content, Utility. Media dipindahkan ke Utility bersama Activity logs, Settings, dan Users.

## 20 Oktober 2026 — Kolom Overview dan Content

Overview menampilkan proyek (tautan detail), uploader, jumlah foto, output dan tanggal. Content memakai kolom yang sama ditambah Aksi. Lokasi menggantikan ID di bawah nama proyek; status tetap mengikuti tab tanpa kolom tambahan.

## 20 Oktober 2026 — Ringkasan review di Overview

Antrean Overview menampilkan maksimal lima draft terbaru yang siap direview, disertai subtitle. Search, pilihan limit, dan pagination disembunyikan melalui mode preview komponen tabel bersama; request API dibatasi lima baris. Halaman daftar lainnya tetap memakai kontrol lengkap.

## 20 Oktober 2026 — Analytics akun dan postingan

Menambah halaman Analytics dengan pilihan akun, periode 7/30 hari, statistik akun, daftar postingan cursor-based, pencarian baris yang sudah dimuat, dan dialog insight postingan. Detail Content menampilkan insight setelah publikasi berhasil. Menu mobile tersedia melalui Utility. Komponen mengikuti Header, DataTable, Nuxt UI dan token dashboard. Lihat [panduan Analytics](features/analytics.md).

## 20 Oktober 2026 — Warna default toast sukses

Semua toast sukses menggunakan warna default tanpa atribut color, termasuk helper login yang melayani sukses dan error. Toast error dan peringatan tetap memakai warna sesuai jenisnya. Aturan ini ditambahkan ke panduan frontend.

## 20 Oktober 2026 — Antrean review di Overview

Daftar Overview menampilkan draft berstatus READY_FOR_REVIEW melalui resource review, bukan seluruh aktivitas job. Judul dan tautan menuju Content mengikuti status yang sama; konten yang sudah publish atau ditolak tidak masuk antrean ini.

## 20 Oktober 2026 — Mockup Instagram Story

Preview Story memakai bingkai vertikal 9:16 dengan progress bar, identitas akun, dan area balasan seperti Instagram. Kontrol mockup bersifat dekoratif; gambar tetap dapat dibuka melalui lightbox. Komponen digunakan pada form Publish tanpa card pembungkus tambahan.

## 20 Oktober 2026 — Error pemuatan melalui toast

Menghapus pesan gagal memuat inline yang menduplikasi toast dari Overview, Content, Publish, daftar data, dan Settings. State kegagalan tetap digunakan untuk menjaga guard publikasi, infinite scroll, serta mencegah tampilan akun kosong ketika request gagal. Key terjemahan yang tidak digunakan dihapus dari kedua locale.

## 20 Oktober 2026 — Baseline final dan pembersihan alur lama

Migration disusun ulang menjadi 13 file untuk 13 tabel (1792490400000–1792490400012), langsung memakai schema Review → Publish/Reject. Migration transisi dan tabel revisi tidak lagi disertakan. Setiap file memiliki up/down untuk satu tabel; dependency diuji melalui rollback dan reapply. Schema lokal dibandingkan dengan database test yang dibuat dari baseline sebelum ledger diselaraskan, setelah backup SQL privat; data aplikasi dipertahankan.

Alias URL editor, AI Jobs, Studio, dan Integration Settings beserta penanganan navigasinya dihapus. Teks UI serta import yang tidak dipakai dibersihkan. Formatter kini menormalkan struktur dengan ESLint sebelum Prettier agar perbaikan braces tidak meninggalkan indentasi yang rusak. Adapter n8n legacy tetap digunakan karena merupakan kontrak integrasi aktif, bukan sisa alur editor.

## 20 Oktober 2026 — Review langsung ke Publish atau Reject

Menghapus langkah simpan revisi. Detail menampilkan hasil dan keputusan; form Publish menyatukan caption, foto, akun dan waktu posting. Backend menerima konten final dalam request publish, menyimpan draft dan snapshot atomik, serta mempertahankan idempotency dan satu postingan per project. History database lama diarsipkan sebelum konsolidasi. Endpoint PATCH draft, entity revisi, nomor revisi dan UI editor lama dihapus. URL editor lama hanya alias menuju Publish.

Validasi: 160 tes backend dan 44 tes frontend lulus; typecheck, lint, dan build kedua project lulus. Lima migration telah diterapkan pada database development lokal setelah backup SQL privat. Pengujian visual browser terhalang saved origin permission; tidak ada publikasi nyata ke Instagram pada refactor ini.

## 2026-10-20 — Keterbacaan kode

## 20 Oktober 2026 — autentikasi berdasarkan referensi

Layout auth menggunakan panel visual AMTI Instagram Flow di kiri dengan logo atas dan teks bawah, serta form di kanan. Hero Instagram AMTI (`public/hero.png`) disempurnakan mengikuti ilustrasi awal: logo AMTI, Instagram, komentar, like, foto, dan grafik pada latar navy. Latar dilengkapi grid blueprint, garis alur melengkung, dan titik koneksi biru; detail memudar di bagian bawah agar ruang teks tetap terbaca. Style form login/reset/lupa password tetap seperti semula. Google login dan alur autentikasi tetap dipertahankan.

## 20 Oktober 2026 — ringkasan Overview

Overview kembali memakai desain banner awal: latar primary lembut, judul dan aksi di kiri, kartu Siap review di kanan. Empat metrik pendukung ditampilkan di bawah dengan angka tetap terlihat saat polling. Daftar pekerjaan diberi judul Aktivitas konten. Tidak mengubah cakupan data atau alur publikasi.

## 20 Oktober 2026 — navigasi melayang

Latar dashboard memakai token bg-muted agar navigasi dan panel terpisah secara visual dalam light/dark mode. Sidebar desktop diberi jarak dari tepi layar, border penuh, sudut membulat dan shadow tipis. Bottom bar mobile memakai inset serupa dengan safe area perangkat; tetap berada dalam alur flex agar konten tidak tertutup. Tombol upload tengah tetap terangkat.

## 20 Oktober 2026 — style tabel bersama

DataTable memakai header kolom ringkas, padding baris konsisten, hover ringan, border tipis dan footer pagination dalam satu panel. Toolbar membungkus pada viewport menengah agar filter/aksi tidak bertumpuk. Berlaku untuk Users, Content, Overview dan Activity Logs; galeri Media dan layout halaman dipertahankan. Tidak mengubah query atau aksi data.

## 20 Oktober 2026 — audit struktur lanjutan

Audit struktur publikasi: state, polling, aksi dan lifecycle preview dipindahkan dari PublicationPanel ke usePublications. Cleanup hanya menutup lightbox miliknya; hasil/error yang terlambat setelah unmount diabaikan. Breadcrumb alias editor kini menautkan detail yang sama dengan route utama.

- Merapikan source dan tests: jarak fungsi/method, blok import, indentasi, kondisi berkurung kurawal dan pemecahan object/parameter panjang.
- Menambahkan command format dan aturan lint untuk menjaga pola yang sama. Perubahan alur reporting/breadcrumb yang sudah ada tetap dipertahankan.

## 2026-10-20 — Seluruh periode pada reporting

Overview, daftar Content dan count status tidak lagi memakai batas default 30 hari. Parameter days tetap opsional untuk filter eksplisit; pagination tetap berlaku.

## 2026-10-20 — Breadcrumb desktop

- Breadcrumb tampil di kanan atas header halaman pada desktop. Mobile dan desktop memakai useBreadcrumbs yang sama agar hierarki konsisten.

# Perapian keputusan konten — 19 Oktober 2026

- Header mobile memakai logo, judul halaman dan breadcrumb yang dapat dinavigasi, serta avatar di kanan. Breadcrumb mengikuti hierarki Content dan Profile tanpa menampilkan ID internal.

- Header mobile menampilkan logo, identitas IG Flow dan nama halaman aktif dengan avatar tetap di kanan. Header dipisahkan ke MobileHeader.

- Navigasi mobile menjadi navbar bawah lima posisi: Overview, Content, Upload, Media, Utility. Drawer Utility berisi Activity logs, Settings dan Users; menu hamburger lama di header dihapus. Active route membedakan Upload/Media dari Content.

- Hasil publish dirapikan menjadi header akun/status, metadata dua kolom dan aksi utama Lihat postingan. Komponen PublicationResult memisahkan tampilan hasil dari orchestration; badge tahap Publish yang berulang disembunyikan pada tab Publish.

- Tiga keterangan preview (simulasi, foto sumber, outdated) dihapus sesuai permintaan; pemilihan gambar fallback tetap berfungsi.

- Preview Feed memakai tampilan postingan Instagram: header akun generik, lokasi, gambar, ikon dekoratif dan caption/hashtag dari form. Caption dapat diperluas, Story dan lightbox tetap tersedia.

- Preview duplikat dalam tab Publish dihapus; field publikasi memakai lebar penuh tab. Preview utama tetap di kiri.

- Publishing disatukan sebagai tab ketiga di Content editor: Caption, Photos, Publish. PublicationForm menggantikan PublishModal; akun, jadwal, snapshot dan status delivery tersedia inline tanpa card bertingkat. Reject menjadi aksi sekunder di bawah form. State dipertahankan saat pindah tab.

- Panel Instagram publishing dipusatkan di Content editor; duplikasi panel pada halaman detail dihapus.

- Layout editor memakai preview sticky di kiri dan form lebih luas di kanan; panel Publish/Reject berada setelah form. Lokasi/aktivitas sejajar di desktop dan bertumpuk di mobile.
- Editor hanya memakai tab Caption dan Photos; komponen History dan terjemahan tidak terpakai dihapus.
- Catatan penolakan revisi aktif tampil di Summary dan editor, tanpa ID teknis. Riwayat backend tetap dipertahankan untuk audit.
- Editor setelah keputusan menampilkan petunjuk baca saja dan menyembunyikan aksi simpan/restore. Pesan publikasi kosong dibedakan untuk konten yang ditolak.

# Riwayat perubahan IG Flow — frontend

## 2026-10-19 — Instagram multi-account publishing

- Credential JSON privat, daftar akun di Settings, dan pemeriksaan koneksi.
- Publikasi langsung/terjadwal untuk gambar feed/story dengan snapshot revisi/JPEG di MinIO.
- Worker terpisah dengan lease, idempotency, cancellation, retry dan rekonsiliasi outcome ambigu.
- Migration publications, kontrak API, terjemahan dan test regresi.
- Belum diuji ke akun Instagram nyata karena credential belum diisi.

> Entri lama adalah riwayat pada tanggalnya, bukan panduan aktif. Lihat [indeks dokumentasi](README.md) untuk implementasi saat ini.

## 2026-10-19 — Dokumentasi produk

- Mengganti panduan template dengan dokumentasi produk IG Flow berdasarkan source aktif.
- Menyelaraskan setup, peta fitur/halaman, API, storage, migration, UI, dan aturan kontribusi.
- Menandai audit/PRD lama sebagai arsip; membedakan batas fitur, konfigurasi dan hasil uji nyata.
- Tidak mengubah runtime, environment, schema database atau workflow deployment.

Semua perubahan penting pada project ini didokumentasikan di file ini.

Format: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

---

## [0.1.0] — 2026-06-18

### 🎉 Initial Release

- Fondasi awal dashboard Nuxt yang kemudian dikembangkan menjadi IG Flow
- Nuxt 4, NuxtUI v4, Tailwind CSS v4, TypeScript, Zod, Axios
- Authentication (email/password, Google OAuth, forgot/reset password)
- User management CRUD
- Contact CRUD
- Profile configuration
- Dashboard layout dengan collapsible sidebar
- Auth layout dengan split-screen design
- Custom design system (green primary, Geist font)
- Dokumentasi lengkap di `docs/`

---

## Template untuk Entry Baru

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Added
- Fitur baru yang ditambahkan

### Changed
- Perubahan pada fitur yang sudah ada

### Fixed
- Bug yang diperbaiki

### Removed
- Fitur yang dihapus

### Security
- Perubahan terkait keamanan
```

## 2026-10-15 — Audit dan refactor

- Perbaiki logout, redirect dashboard, kontrak ApiResponse, encoding email reset, dan inisialisasi sesi melalui plugin.
- Pisahkan error presentation dari service; deduplikasi refresh paralel dan lindungi sesi dari refresh terlambat.
- Pertahankan Google login dengan penanganan konfigurasi kosong; pusatkan footer/i18n auth, cleanup timer/blob preview, dan rapikan lint.
- Tambah test service Bun. Rincian keputusan dan batas pengujian: [audit-2026-10-15.md](archive/audits/audit-2026-10-15.md).

## 2026-10-15 — Sidebar mobile

- Ganti overlay sidebar sempit dengan komponen MobileSidebar berbasis NuxtUI Slideover dan menu vertikal yang mendukung tap.
- Pusatkan header mobile di dashboard layout; tutup drawer setelah navigasi atau ketika beralih ke desktop.
- Menu pengaturan tema/bahasa mendukung klik; label navigasi tersedia dalam en/id.

## 2026-10-15 — Penyempurnaan ukuran sidebar dan avatar

- Perkecil drawer mobile dari w-80 menjadi w-64, ukuran teks, ikon, dan jarak menu agar lebih ringkas.
- Kembalikan avatar user di header mobile; ganti ikon Settings di sidebar desktop/mobile dengan avatar user.
- Gunakan tombol avatar yang dapat diakses melalui keyboard dan tetap membuka menu akun.

## 2026-10-15 — Penyederhanaan sidebar

- Hapus menu Feedback dari sidebar desktop dan mobile, termasuk konfigurasi dan terjemahan yang tidak terpakai.
- Hapus footer avatar sidebar mobile; akses akun tetap tersedia melalui avatar header mobile dan sidebar desktop.
- Tambahkan separator di atas avatar sidebar desktop, selaras dengan separator di bawah logo.

## 2026-10-15 — Hero Instagram Flow

- Ganti `public/hero.png` dengan ilustrasi Instagram Flow: ikon Instagram terhubung ke pesan, interaksi, konten, dan analitik dalam gradasi ungu–pink–oranye.
- Aset PNG portrait 1024×1536 dibuat menggunakan imagegen bawaan; bagian bawah diberi ruang gelap agar teks hero tetap terbaca. Layout auth tetap menggunakan path yang sama.
- Revisi identitas AMTI: gunakan referensi logo resmi, dominasi biru navy/slate, detail koneksi sensor, dan aksen Instagram. Prompt revisi imagegen: pertahankan workflow Instagram, tambahkan tile logo AMTI yang terhubung, nuansa teknologi korporat, serta ruang gelap di bawah untuk judul.

## 2026-10-15 — Utility frontend dan logo navigasi mobile

- Pusatkan format tanggal/tanggal-waktu, query daftar/route, serta pilihan bahasa dan flag di `app/util` dengan import eksplisit.
- Halaman Contact dan User mengikuti bahasa aktif untuk tanggal; tanggal invalid/kosong memakai placeholder yang konsisten.
- Pindahkan tipe SortOrder ke `app/types/query.d.ts` agar service tidak bergantung pada composable UI.
- Tambah pengujian edge case tanggal, timezone, encoding query, parameter duplikat, dan fallback locale.
- Header sidebar mobile menampilkan BrandLogo AMTI; label navigasi tetap tersedia bagi pembaca layar.

## 2026-10-15 — Lengkapi profile

- Hubungkan halaman informasi dan password ke endpoint auth existing; tambahkan tipe payload profile dan method AuthService.
- Perbarui auth state readonly melalui service dan cache user setelah berhasil, termasuk status hasPassword. Respons setelah logout tidak menghidupkan kembali sesi.
- Perbaiki path tab absolut, redirect /profile, serta akses Profil saya melalui menu avatar desktop/mobile.
- Lengkapi terjemahan en/id, schema reaktif terhadap locale, validasi kata sandi lama, autocomplete, dan penanganan error UI.
- Tambahkan useImageUpload untuk preview foto, cleanup object URL, dan pengabaian respons upload yang tidak lagi relevan. Foto diterapkan ke profil setelah pengguna menyimpan form.
- Tambahkan regression test untuk update profile/password, persistence user, respons terlambat setelah logout, dan kegagalan update.

## 2026-10-16 — AMTI Social dashboard

- Overview dari data API, upload bertahap dengan progress, job/detail, studio revisi, review internal, media privat, audit, dan konfigurasi admin.
- Navigasi mengikuti role ADMIN, MARKETING, REVIEWER, UPLOADER; backend tetap menjadi otoritas izin.
- API ada di `app/services/social-service.ts`, kontrak di `app/types/social.d.ts`, helper stateless tanggal WIB/hashtag/ukuran file di `app/util/social.ts`.
- Polling berhenti ketika halaman tersembunyi dan mencegah request tumpang tindih. Studio memakai revisi/hash untuk menolak edit dan approval basi.
- Preview SVG adalah pratinjau, bukan file siap publikasi. Perubahan konten menandai preview kedaluwarsa. Tidak ada publish Instagram atau metrik engagement buatan.
- Teks tersedia en/id menggunakan NuxtUI dan layout project. Gambar privat diambil dengan bearer auth lalu object URL dibersihkan.
- Setup integrasi dan batas workflow V0.2: lihat `../../backend/docs/operations/setup.md`.

## 2026-10-16 — Social structure cleanup

Split API clients by feature, move upload/studio/list state into explicit composables, and extract studio panels. Fix dropped filter reloads during active requests. Add API contract regression tests. Details: [refactor notes](../../backend/docs/archive/audits/refactor-2026-10-16.md).

### Final feature layout and storage correction

Removed social umbrella folders. Features and their related children now live at the top level, with per-feature composition roots. Frontend routes have legacy aliases. Runtime content storage reuses the original MinIO helper with a private bucket; a verified/resumable command preserves existing local data. See the refactor document for the final structure.


## 2026-10-16 — Audit konsistensi lanjutan

Pisahkan repository reporting, gunakan serializer eksplisit per fitur, pindahkan retry ke service, satukan pagination dan header auth, seragamkan ApiResponse frontend, serta perbaiki batch FAILED saat dispatch habis. Bersihkan penamaan internal modul lama dan perbarui dokumentasi. Lihat audit 2026-10-16.

## 2026-10-16 — Audit alur dan composition root

Hapus aggregator src/modules/workflow.module.ts; routes dan CLI mengimpor module pemilik fitur. Dependency transaksi bersama diwiring oleh shared.module.ts. Link reset memakai FRONTEND_URL, bukan APP_URL; batas aset mengabaikan arsip; retry menghormati retryable. Editor tidak lagi memberi toast sukses setelah reload gagal, input dibekukan saat save/reload, dan payload proses tetap stabil saat retry jaringan. Validasi reset password frontend mengikuti kebijakan backend existing (minimum 6). Pengujian browser belum bisa dilakukan: origin localhost:3000 ditolak oleh izin browser tersimpan.

### 2026-10-16 — Typography and list consistency audit

- Reuse contact/user DataTable controls and pagination for automation lists; media retains a gallery through the shared content slot.
- Align body text, section headings, card spacing and form widths with contact/user/profile; preserve existing palette and avatars.
- Add reusable latest-request handling, loading/error states, page reset/clamping and duplicate-submit guards. Fix dynamic job/studio state when navigating between IDs.
- See `docs/archive/audits/audit-2026-10-16.md` for decisions and verification limits.

### 2026-10-16 — Equal access and feature component cleanup

- Remove role selectors/types/access composable and role-dependent navigation/actions.
- Share user form fields and reporting page shell; split studio editing/review forms into feature components.
- Fix overlapping active navigation for nested studio routes; retain contact/user/profile typography and theme.

### 2026-10-16 — Remove refresh controls

- Remove all manual refresh/reload buttons and unused translation keys.
- Share reporting pagination/search watchers with contact/user; suppress repeated polling error toasts until recovery.
- Guard contact forms against duplicate submission and remove empty table action wrappers.

## 2026-10-16 — Feature API routes

Removed the /api/social prefix. Feature resources now live directly under /api (batches, jobs, drafts, review, media, assets, renders, overview, audit-logs, settings and media-access). Backend api.ts explicitly applies authentication and mutation/body limits per route, matching contact/user. Service-secret callbacks and signed-media validation remain separate. Frontend services, tests, Swagger and generated media URLs use the new paths. Legacy frontend /social aliases are removed. Deploy frontend/backend together and re-import the updated n8n workflow; existing in-flight manifests may still reference the previous URLs.

## 2026-10-16 — Reset baseline dan audit struktur

Baseline migration/database direset atas instruksi pengguna. Runtime tidak lagi memakai nama social; config dan terjemahan dipisah per fitur, dispatcher menjadi jobs:dispatch. Form contact berbagi fields/validasi dan tidak lagi tertutup saat klik di dalam modal. Lihat backend/docs/archive/audits/audit-baseline-2026-10-16.md untuk detail dan batas verifikasi.

## 2026-10-16 — Dispatcher dan notifikasi

Kontrol dispatcher dashboard dipertahankan sesuai pilihan pengguna. Status statis/deployment yang tidak diperlukan dihapus; readiness divalidasi saat toggle dan worker tick. Upload mengikuti batas backend melalui /batches/limits. UAlert frontend dihapus; toast menjadi notifikasi utama, dengan teks untuk status kontekstual. Lihat backend/docs/archive/audits/audit-dispatcher-2026-10-16.md.

## 2026-10-16 — Konsistensi placeholder dan form

Lengkapi placeholder bilingual untuk upload konten, editor judul/caption/hashtag, review, dan select/filter. Review memakai label UFormField yang tetap terlihat. Modal contact memakai jarak field space-y-3 seperti modal user; form halaman tetap space-y-4 seperti profile. Ukuran kontrol mengikuti app.config.ts, tanpa override font/size per fitur. Input tanggal native memiliki petunjuk permanen karena placeholder bergantung browser.

## 2026-10-18 — MinIO presigned media

n8n preview URLs now reuse MinIO presigning. Removed MEDIA_SIGNING_SECRET and the custom media-access route; manifest/render validation and dispatcher readiness were updated. See backend/docs/archive/audits/audit-presigned-media-2026-10-18.md.

## 2026-10-18 — Independent image uploads

Validate each selected image (size, MIME/extension, browser decoding and 40 MP resolution) and show errors on its card. Upload failures no longer stop later files. Stable per-file state retains successful uploads across retries/removal. Failed files can be retried or removed; processing only uploaded files is an explicit separate action. Backend remains authoritative for static-image format and decoding.

## 2026-10-18 — Unified Content navigation

Replaced AI Jobs, AI Studio and Content Review sidebar entries with Content. Status tabs use job lifecycle for queued/dispatched/processing/failed and current draft status for ready/in-review/revision/approved/rejected, preserving server pagination/search and avoiding duplicate or incorrectly classified review rows. Tabs scroll horizontally on small screens, reset pagination on change, and store status in the URL. The existing 30-day list scope is stated explicitly.

Detail and editor pages now live under `/content/:jobId` and `/content/:jobId/edit`. Old URLs are route aliases to the same implementations for existing bookmarks and n8n links, not duplicate pages. Media remains its separate sidebar entry. Upload, retry, list actions and newly generated manifest review URLs use the new routes.

## 2026-10-18 — Profile-style Content tabs with counts

Content now uses the same underline typography, spacing and active state as Profile through the shared HeaderTab component. Header tab navigation scrolls horizontally when needed. Added compact per-status counts from one authenticated summary request, polled every 20 seconds and refreshed on status changes, using the same 30-day scope as the lists. Removed the Content page's Upload Content action. Profile retains its original appearance through the shared component.

### Content count badge sizing

Adjusted HeaderTab count badges to medium with standard padding and medium-weight tabular numbers, keeping them readable and proportional to tab labels.

## 2026-10-18 — Masonry Media gallery

Replaced uniform media cards with responsive masonry columns (one/two/three) using each photo's aspect ratio. Project/uploader information and download/archive controls overlay the photo; controls remain visible on mobile and keyboard focus. MediaGallery and ProgressiveImage are separate feature components, reusing list search, pagination and archive confirmation.

Images request authenticated preview URLs near the viewport and fade from a real blurred 32px MinIO thumbnail into the sharp preview. No per-image spinner or skeleton, artificial loading delay, persistent local media or additional library. Reduced-motion preferences disable transitions. The list's initial metadata request uses a short status message because image thumbnails are unavailable until IDs arrive.

Validation: backend/ frontend regression suites, typechecks, frontend lint and builds. Real MinIO verification returned a 412-byte 26×32 thumbnail, 200 for signed images and 403 without signature. Browser visual verification remains blocked by the previously denied localhost permission.

## 2026-10-18 — Media infinite scroll

- Media hides pagination and page-size controls; an intersection sentinel loads subsequent pages near the viewport. Existing masonry and progressive MinIO previews remain.
- Appends deduplicated assets, stops at the end, resets on search/date/archive, and preserves loaded images on a failed next-page request. Failed requests require an explicit retry instead of automatic loops.
- Media no longer polls and replaces the gallery every 20 seconds; other reporting tables retain pagination and polling.

## 2026-10-18 — Date picker and uploader avatars

Reusable DateInput uses Nuxt UI segmented date input and calendar popover, keeping date-only YYYY-MM-DD payloads and disabled upload state. Reporting uploader cells display avatar and name; media overlays also use uploader profile photos.

## 2026-10-18 — Content detail and editor layout

- Detail uses a swipeable Nuxt UI photo carousel beside extracted JobSummary metadata. Date-only documentation dates use the shared date formatter.
- Studio uses two responsive columns, a bounded preview with Feed/Story tabs, and a compact ranking carousel with an explicit selected-photo state. Existing save, restore, review, stale-render and retry behavior is retained.
- ProgressiveImage optionally supports a fixed frame and contain mode for full-photo previews; the media masonry default remains unchanged.

## 2026-10-18 — Click-to-preview content images

- Shared ImagePreview opens a Nuxt UI modal from a keyboard-accessible image trigger, with Escape/overlay/close-button dismissal and an unavailable-image state.
- Applied to progressive gallery/slider photos, private result renders, and staged uploads. Reuses signed MinIO or temporary browser Blob URLs; no duplicate download API or persistent local copies.
- Avatars, profile-photo upload controls, and decorative/navigation branding retain their existing behavior. Gallery download/archive controls remain independent.

## 2026-10-18 — Shared transparent lightbox

- Replaced per-image modal instances with one ImageLightbox at the app root and useLightbox shared state. ImagePreview remains a reusable trigger.
- Matches the transparent, borderless preview style with padded contained image and floating round close button. Retains accessible modal labels, keyboard dismissal and failed-image feedback.
- Closes on route changes and when the originating image is removed or its URL changes.

## 2026-10-18 — Focused Content workspace

- Shared JobHeader provides Profile-style Detail/Editor navigation, contextual status/revision, and unsaved-change indicator.
- Detail prioritizes photos in a 7/5 layout, a single project summary and lifecycle timeline, with execution metadata collapsed by default.
- Editor keeps a bounded preview beside Caption/Photos/Review/History tabs. Tabs preserve form state; compact photo comparisons replace stacked image carousels. Review guards, revision saving, restore and private lightbox remain unchanged.

## 2026-10-18 — Detail process timeline

- Replaced the plain lifecycle icon list with a vertical Nuxt UI Timeline connecting Created, Started and Completed. Recorded stages use primary color; pending stages remain muted. Timestamps reuse the existing Jakarta formatter and update with job polling.

## 2026-10-19 — Remove Contact

Removed the Contact application feature, endpoints, entities, UI, types, client, translations and dedicated tests. Shared auth, logging, language and pagination tests now use supported User endpoints. User is the active CRUD reference. Historical audit records remain unchanged.

Backend migration `1792368000000-drop-contacts` removes the retired table. Applied migration history is preserved; reverting restores only the empty schema, not deleted data.

## 2026-10-19 — Move job metadata into summary

Moved status, revision number and workflow error into the project summary. Removed the shared header action row and Back to Content button from both detail and editor. Unsaved-edit feedback stays beside the editor controls.

## 2026-10-19 — Summary description styling

Description now uses a labeled full-width summary field with readable body text and preserved line breaks. Removed the surrounding horizontal rules and excessive top padding.

## 2026-10-19 — Visible carousel arrows

Override both base and sm arrow positions so Nuxt UI does not place desktop controls outside the card. Solid, shadowed controls sit above image/lightbox triggers with a consistent touch target. Endpoint disabled states and single-image behavior remain intact.

## 2026-10-19 — Compact editor tabs

Replaced icon/underline editor tabs with text-only segmented pills on a muted track. The active tab uses the primary theme color with contrasting text; removed the extra header divider while retaining tab state and keyboard behavior.

## Instagram Login

Publishing memakai graph.instagram.com dan Instagram User access token. Kebutuhan Facebook Page serta pageId/pageAccessToken dihapus dari konfigurasi dan kontrak akun. Token lama tidak dikonversi otomatis; isi accessToken Instagram Login di JSON privat.

## Settings layout

Settings displays the AI dispatcher above Instagram accounts with a shared content width. Headings remain above the existing cards, without tabs or side-by-side columns.

## 2026-10-19 — Ready → Publish / Reject

Removed intermediate review decisions. One project now targets one account and one publication, enforced with a unique project constraint and serialized decisions. Publish starts delivery directly; Reject preserves the revision/hash guard. The editor locks after either decision, and failed delivery retries the same publication. Content tabs, counts, overview, API contracts, translations and migration history are aligned.
