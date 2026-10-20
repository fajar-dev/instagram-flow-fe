# Audit kode — 20 Oktober 2026

> Arsip historis: mencatat kondisi dan keputusan pada tanggal dokumen. Bukan aturan atau panduan implementasi aktif; lihat [indeks dokumentasi](../../README.md).

Laporan lintas proyek berada pada [audit backend](../../../../backend/docs/archive/audits/audit-2026-10-20.md). Audit mempertahankan UI yang telah disetujui; tidak mengubah susunan menu atau alur bisnis.

Perbaikan frontend:
- `useLatestRequest.invalidate()` menggugurkan respons yang sedang berjalan ketika tidak ada pilihan akun.
- Upload berhenti memulai file berikutnya setelah halaman ditinggalkan. Retry job dan submit publish mengabaikan toast/navigasi/callback terlambat setelah unmount. Request yang sudah diterima server tetap dapat selesai.
- Header sort menggunakan button native agar dapat dioperasikan dengan keyboard.
- Tipe AuditEntry dan opsi statistik lama yang tidak dipakai setelah pemisahan AccountStatistics dihapus.
- Dokumentasi menyebut satu halaman Content dengan form langsung pada ready for review dan fitur Analytics yang sudah tersedia.

Verifikasi: lint, typecheck, 52 tes dan production build lulus. Tidak ada verifikasi visual browser baru; akses localhost sebelumnya ditolak oleh izin tersimpan. Tes service tidak memanggil publish Instagram nyata.
