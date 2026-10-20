# Output konten dan publikasi

Upload memakai radio Feed atau Story dengan satu nilai `output`. Nilai tersebut dikunci ketika proses diminta, termasuk ketika request diulang dengan idempotency key yang sama.

Preview mengikuti `job.output` tanpa tab pengganti placement. Form Feed menggunakan field caption, hashtag, metadata dan foto. Form Story menampilkan pilihan foto serta sumber foto/desain; tidak menawarkan caption/hashtag posting yang tidak didukung. Keduanya memilih akun Instagram, publish sekarang atau jadwal, dan menyediakan aksi Reject. Backend menolak placement yang tidak cocok dengan job.

Publish tetap satu halaman; page menyusun preview/summary, komponen mengatur UI, composable menyusun payload dan lifecycle, service menangani HTTP. Output request adalah scalar, bukan daftar.

[Kontrak dan operasi backend](../../../backend/docs/features/instagram-publishing.md).
