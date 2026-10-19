# Komponen dashboard IG Flow

## Layout dan form

`Header` mengatur judul/deskripsi/aksi halaman, `HeaderTab` navigasi route dan count, `DataTable` list beserta filter/pagination. Referensi User dan Profile digunakan untuk spacing serta tipografi. Gunakan UCard hanya jika pengelompokan konten membutuhkan card; hindari card bertingkat yang berulang.

Form memakai UForm, schema Zod, UFormField, label, placeholder dan atribut required yang sesuai schema. `user/FormFields.vue` dipakai bersama modal tambah/edit. Modal fitur diletakkan di component terpisah; konfirmasi hapus memakai DeleteModal.

`DateInput.vue` menghubungkan string YYYY-MM-DD dengan DateValue, UInputDate, UPopover dan UCalendar. Gunakan component ini untuk tanggal dokumentasi. Avatar/uploader menggunakan UAvatar bersama nama; avatar tidak membuka lightbox.

## Detail dan editor konten

- `content/JobHeader.vue`: navigasi Detail/Editor tanpa tombol Back.
- `content/JobSummary.vue`: status, revision, safe error, metadata/deskripsi, timeline created/started/completed, dan detail teknis.
- `content/AssetSlider.vue`: carousel dengan panah di dalam frame pada mobile/desktop; panah/dots hanya jika lebih dari satu aset.
- `content-review/PreviewPanel.vue`: preview feed/story dan keadaan outdated.
- `EditorForm`, `RankingsPanel`, `ReviewForm`, `ReviewHistory`: form caption, pemilihan foto, keputusan review dan riwayat keputusan.

Tab editor memakai UTabs pill compact dengan color primary. Panel memakai v-show agar state form tidak hilang saat pindah tab. Perubahan belum disimpan tetap ditandai sebelum review.

## Media

`ProgressiveImage` menampilkan thumbnail blur lalu gambar penuh, dengan lazy loading. `PrivateImage` menangani media yang perlu diambil melalui API. `ImagePreview` membuka `useLightbox`; `ImageLightbox` dipasang sekali di root aplikasi.

Lightbox memakai modal transparan, image object-contain, close button, dan menutup saat route berubah. Jangan memasang satu modal per item galeri. Gambar selain avatar dapat dipreview; tombol download tetap mempunyai aksi terpisah.

`MediaGallery` memakai masonry. `InfiniteScroll` memuat halaman selanjutnya melalui composable reporting dan menyediakan retry/fallback saat diperlukan. Pagination UI disembunyikan untuk Media; API tetap mengembalikan halaman data. Jangan menggabungkan duplikat item atau mengulang otomatis halaman yang terus gagal.

## Feedback dan aksesibilitas

Gunakan toast untuk hasil mutation. Field validation tetap inline. Error job di Summary dan error load halaman harus bertahan sampai state berubah; keduanya bukan toast sekali lewat. Semua tombol ikon mempunyai aria-label terjemahan, status memakai label selain warna, dan tab/carousel/lightbox tetap dapat dioperasikan lewat keyboard.
