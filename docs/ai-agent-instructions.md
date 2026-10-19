# Panduan kontribusi agent — IG Flow frontend

Baca [AGENTS](../AGENTS.md), [overview](project-overview.md), dan panduan fitur yang disentuh. Gunakan User/Profile sebagai referensi aktif untuk struktur dan visual.

1. Periksa perubahan lokal pengguna sebelum mengedit. Tentukan apakah perubahan milik page, component, composable, service atau util.
2. Reuse Nuxt UI, tema aplikasi dan shared component. Jangan menambah CSS arbitrary, formatter atau client HTTP duplikat.
3. Cocokkan API dengan backend; pertahankan auth, idempotency, optimistic revision dan cleanup media.
4. Tambahkan label/placeholder/aria-label pada kedua locale. Tidak ada role, Contact atau menu terpisah AI Jobs/Studio/Review.
5. Jalankan typecheck, lint, test dan build untuk perubahan implementasi. Periksa browser desktop/mobile bila tersedia; laporkan jika akses tidak memungkinkan.
6. Perbarui dokumen yang menjelaskan keputusan aktif dan changelog. Audit bertanggal adalah arsip, bukan sumber aturan fitur yang sudah dihapus.

Perubahan dokumen cukup diverifikasi terhadap source, command dan tautan. Jangan menjalankan workflow live, mengubah environment atau mengirim pesan eksternal hanya untuk memperbarui panduan.
