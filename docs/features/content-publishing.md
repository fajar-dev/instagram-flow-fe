# Output konten dan publikasi

Upload memakai radio Feed atau Story dengan satu nilai `output`. Nilai tersebut dikunci ketika proses diminta, termasuk ketika request diulang dengan idempotency key yang sama.

Preview mengikuti `job.output` tanpa tab pengganti placement. Form Feed menggunakan field caption, hashtag, metadata dan foto. Form Story menampilkan satu hasil edit AI; tidak menawarkan caption/hashtag posting yang tidak didukung. Keduanya memilih akun Instagram, publish sekarang atau jadwal, dan menyediakan aksi Reject. Backend menolak placement yang tidak cocok dengan job.

Publish tetap satu halaman; page menyusun preview/summary, komponen mengatur UI, composable menyusun payload dan lifecycle, service menangani HTTP. Output request adalah scalar, bukan daftar.

[Kontrak dan operasi backend](../../../backend/docs/features/instagram-publishing.md).

## Desain AI AMTI

Form upload tidak menawarkan pilihan template. Workflow memakai satu desain cover dan referensi visual AMTI secara otomatis. n8n meminta model gambar Codex mengedit foto sumber menjadi desain; backend hanya memvalidasi, menyesuaikan ukuran dan menyimpan hasil ke MinIO.

Review menampilkan hasil edit AI untuk dipilih dan diurutkan. Caption, hashtag dan metadata dapat diedit tanpa mengubah piksel gambar. Tidak ada renderer template backend atau request preview setelah setiap ketikan. Output Story tetap tanpa caption/hashtag posting.

Lihat [kontrak desain AI](../../../backend/docs/features/ai-image-design.md).

## Pemilihan slide Feed

Daftar hasil AI menggantikan perbandingan foto utama. Upload sampai 19 foto; pilih maksimal 10 gambar termasuk cover. Drag handle mendukung mouse/touch; tombol pindah menyediakan alternatif keyboard. Nomor menunjukkan urutan post, preview kiri mengikuti urutan pilihan. Story satu gambar. Payload publikasi memakai renderIds, tanpa source atau primaryAssetId.

Preview Feed dapat digeser kiri/kanan melalui sentuhan atau drag mouse. Panah, keyboard dan indikator titik menyediakan navigasi alternatif. Hanya gambar yang bergeser; header akun dan caption tetap. Urutan mengikuti pilihan slide, dan tap gambar membuka lightbox.

Form upload disusun menjadi nama proyek, aktivitas/lokasi, tanggal/klien, catatan tambahan, output Feed atau Story, foto, lalu persetujuan publikasi sebelum tombol proses.
