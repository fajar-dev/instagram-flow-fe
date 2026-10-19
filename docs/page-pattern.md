# Pola halaman IG Flow

## List dan profil

Gunakan `app/pages/user/index.vue` sebagai referensi list CRUD: Header, DataTable, query/filter, modal tambah/edit terpisah dan DeleteModal. Profile memakai halaman induk dengan tab Information/Password dan form di child route. Jangan mengembalikan Contact sebagai halaman contoh.

## Content terpadu

`app/pages/content/index.vue` menampilkan HeaderTab berdasarkan `app/util/content-tabs.ts`, count dari reporting service, serta ReportingRecordList sesuai resource/status. List job dan draft tetap mempunyai kontrak data berbeda; halaman menyatukannya melalui mapping tab, bukan memaksakan satu bentuk entity.

Detail menyusun AssetSlider dan JobSummary. Status, revision, error, deskripsi, timeline dan informasi teknis berada di Summary. Editor menyusun PreviewPanel dan card tab Caption/Photos/Review/History. Pertahankan state saat pindah panel, optimistic revision guard, dan penanda preview outdated.

## Upload dan Media

Upload menyimpan metadata batch lalu mengirim file secara terpisah. Validasi per gambar dan status upload individu harus tetap terlihat; satu kegagalan tidak menghapus hasil file lain. Batas upload berasal dari API, bukan salinan config frontend.

Media menggunakan galeri masonry dan infinite scroll. Request selanjutnya menambahkan data unik; filter baru mereset daftar. Jangan menambahkan pagination footer atau polling yang mengganti seluruh daftar saat pengguna sedang scroll.

## Lifecycle request

Gunakan useLatestRequest agar response lama tidak menimpa pilihan/filter terbaru. Gunakan usePolling hanya pada halaman yang memerlukan pembaruan status, serta cleanup ketika unmount. Ambil useServiceError saat setup, gunakan try/catch/finally untuk mutation, dan jangan memulai request dari constructor service.

Setiap halaman perlu loading, empty dan error state yang sesuai. Gunakan toast untuk hasil aksi dan pesan inline yang tetap terlihat untuk kegagalan load. Uji responsif, label tombol, fokus keyboard dan navigation state sebelum menyatakan UI selesai.
