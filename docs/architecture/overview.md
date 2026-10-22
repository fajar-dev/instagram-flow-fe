# Produk dan struktur frontend IG Flow

IG Flow membantu tim AMTI mengolah dokumentasi kegiatan menjadi caption serta preview feed/story untuk review internal. Analisis AI dijalankan n8n melalui backend; browser tidak memanggil provider AI atau menyimpan credential integrasi.

## Peta halaman

| Route | Fungsi |
| --- | --- |
| `/` | Mengarahkan ke overview |
| `/auth/sign-in` | Login email/password dan Google |
| `/auth/forgot-password` | Request/resend email reset |
| `/auth/reset-password` | Validasi token dan penggantian password |
| `/overview` | Ringkasan job/konten |
| `/analytics` | Statistik akun, tren terhadap periode sebelumnya dan top posts |
| `/content` | List terpadu berdasarkan status, beserta count per tab |
| `/content/upload` | Metadata batch, validasi dan upload per file, proses AI |
| `/content/:jobId` | Carousel foto, status/error, metadata dan timeline |
| `/content/media` | Library foto, filter, download, archive dan infinite scroll |
| `/activity-logs` | Jejak aktivitas aplikasi |
| `/settings` | Akun Instagram dan sakelar dispatcher AI |
| `/user` | Pengelolaan akun |
| `/profile/information` | Nama, email dan avatar pengguna |
| `/profile/password` | Penggantian password |

Navigasi memakai `/content`, `/content/:jobId`, dan `/settings`. Alias URL AI Jobs, Studio, editor lama, dan Integration Settings sudah dihapus. `/profile` tetap memakai halaman induk untuk tab profil.

## Status dan alur

Tab list berasal dari `app/util/content-tabs.ts`. QUEUED, DISPATCHED, PROCESSING dan FAILED membaca resource jobs; READY_FOR_REVIEW, PUBLISH dan REJECTED membaca resource review. Filter default adalah READY_FOR_REVIEW.

Review langsung menuju Publish atau Reject. Edit caption/foto hanya dilakukan dalam form Publish; perubahan disimpan bersama postingan atau jadwal, tanpa langkah simpan terpisah. Reject memakai contentHash. Setelah keputusan, konten terkunci. Tidak ada tab editor atau riwayat revisi.

## Struktur

- `app/pages/`: route dan susunan halaman.
- `app/components/`: komponen bersama serta folder fitur content, content-review, reporting dan user.
- `app/composables/`: state, lifecycle, polling, request terbaru, upload, editor dan reporting.
- `app/services/`: API client/auth/user dan client per fitur; tanpa toast atau navigasi.
- `app/types/`: kontrak response dan domain.
- `app/util/`: helper stateless tanggal, query, upload, format konten, locale dan navigasi.
- `i18n/locales/`: seluruh teks UI en/id.

Semua pengguna aktif mempunyai navigasi dan akses yang sama. JWT tetap diperlukan. Gambar persisten berasal dari MinIO melalui API/presigned URL; Blob browser hanya untuk preview sementara. Logo/icon statis merupakan aset build.

## Publikasi

Satu halaman `/content/:jobId` memuat preview di kiri, card utama di kanan dan card Summary di bawah. Saat ready for review, form konten, foto, akun dan jadwal langsung muncul dengan aksi Publish/Reject. Publikasi memerlukan status READY_FOR_REVIEW dan consent batch. Pilih akun dari JSON server, urutan render AI, post sekarang atau jadwal WIB. Output Feed/Story mengikuti pilihan saat upload. Desain AI berasal dari workflow n8n. Caption/hashtag dapat berubah; konteks gambar harus tetap cocok dengan hasil AI. Project yang sudah masuk publikasi tidak dapat diedit atau dipublikasikan lagi. Retry publikasi memakai record yang sama; retry AI membuat attempt baru dan hanya attempt terbaru tampil dalam daftar; pembatalan mengakhiri project sebagai REJECTED. Worker backend harus aktif.

## Instagram Analytics

`/analytics` menampilkan statistik akun dan postingan melalui child module Instagram di backend. Detail Content juga menampilkan insight publikasi yang berhasil. Lihat [Analytics](../features/analytics.md) untuk periode, cache, dan batasan data.

Halaman `/content/:jobId` menyatukan proses AI, review, form publish/reject, jadwal dan hasil publikasi beserta insight. Tidak ada halaman Publish terpisah. Polling detail berhenti saat draft tersedia agar edit form tidak tertimpa; panel publikasi memantau jadwal/hasil secara terpisah.

Ready for review langsung menampilkan form konten, foto, akun dan jadwal dengan aksi Reject atau Publish/Jadwalkan. Card utama kanan dan card Summary di bawahnya tetap pada posisi yang sama untuk proses AI, review, penolakan, jadwal, dan hasil publikasi.

Tampilan Content mengikuti tipografi Profile: judul text-base, caption/form text-sm, metadata ringkasan text-sm. Aksi review berdekatan; timeline berada pada Summary dan rincian teknis dapat dibuka. Card dimiliki halaman, bukan komponen isinya, sehingga tidak ada card bersarang.
