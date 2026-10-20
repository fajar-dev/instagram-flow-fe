# Komponen dashboard IG Flow

## Layout dan form

`Header` mengatur judul/deskripsi/aksi halaman, `HeaderTab` navigasi route dan count, `DataTable` list beserta filter/pagination. Referensi User dan Profile digunakan untuk spacing serta tipografi. Gunakan UCard hanya jika pengelompokan konten membutuhkan card; hindari card bertingkat yang berulang.

Form memakai UForm, schema Zod, UFormField, label, placeholder dan atribut required yang sesuai schema. `user/FormFields.vue` dipakai bersama modal tambah/edit. Modal fitur diletakkan di component terpisah; konfirmasi hapus memakai DeleteModal.

`DateInput.vue` menghubungkan string YYYY-MM-DD dengan DateValue, UInputDate, UPopover dan UCalendar. Gunakan component ini untuk tanggal dokumentasi. Avatar/uploader menggunakan UAvatar bersama nama; avatar tidak membuka lightbox.

## Detail dan editor konten

- `content/JobHeader.vue`: navigasi Detail/Editor tanpa tombol Back.
- `content/JobSummary.vue`: status, safe error, metadata/deskripsi, timeline created/started/completed, dan detail teknis.
- `content/AssetSlider.vue`: carousel dengan panah di dalam frame pada mobile/desktop; panah/dots hanya jika lebih dari satu aset.
- `content-review/PreviewPanel.vue`: preview feed/story dan keadaan outdated.
- `PublishFields`, `RankingsPanel`: field caption dan pemilihan foto dalam UForm publikasi. `RejectionNotice` menampilkan catatan penolakan; keputusan Publish/Reject tersedia dari detail.

Tab editor memakai UTabs pill compact dengan color primary. Panel memakai v-show agar state form tidak hilang saat pindah tab. Perubahan belum disimpan tetap ditandai sebelum review.

## Media

`ProgressiveImage` menampilkan thumbnail blur lalu gambar penuh, dengan lazy loading. `PrivateImage` menangani media yang perlu diambil melalui API. `ImagePreview` membuka `useLightbox`; `ImageLightbox` dipasang sekali di root aplikasi.

Lightbox memakai modal transparan, image object-contain, close button, dan menutup saat route berubah. Jangan memasang satu modal per item galeri. Gambar selain avatar dapat dipreview; tombol download tetap mempunyai aksi terpisah.

`MediaGallery` memakai masonry. `InfiniteScroll` memuat halaman selanjutnya melalui composable reporting dan menyediakan retry/fallback saat diperlukan. Pagination UI disembunyikan untuk Media; API tetap mengembalikan halaman data. Jangan menggabungkan duplikat item atau mengulang otomatis halaman yang terus gagal.

## Feedback dan aksesibilitas

Gunakan toast untuk hasil mutation. Field validation tetap inline. Error job di Summary dan error load halaman harus bertahan sampai state berubah; keduanya bukan toast sekali lewat. Semua tombol ikon mempunyai aria-label terjemahan, status memakai label selain warna, dan tab/carousel/lightbox tetap dapat dioperasikan lewat keyboard.

## Publishing dan Settings

PublishingPublicationPanel berada di tab Publish dalam Content editor, menampilkan satu publikasi project atau PublicationForm secara inline. Reject menjadi aksi sekunder pada bagian bawah form; state dan idempotency berada di usePublicationForm. DateInput plus input jam menerima jadwal WIB. Snapshot final dapat dibuka melalui lightbox. Unknown outcome tidak mempunyai tombol retry agar tidak membuat duplikasi. Settings memakai InstagramAccounts dan DispatcherPanel, tanpa mengekspos credential.

## Navigasi mobile

`MobileNavbar` berada di bawah area scroll layout dashboard pada layar di bawah breakpoint lg. Urutannya Overview, Content, Upload (ikon bulat), Media, Utility. Padding safe-area mengikuti perangkat; navbar tidak menutupi konten. `MobileUtilitySidebar` hanya berisi Activity logs, Settings dan Users, memakai sumber menu yang sama dari `useNavigation`. Drawer menutup setelah navigasi dan ketika viewport berpindah ke desktop. Logo dan avatar tetap di header mobile; sidebar desktop tetap tersedia pada lg.
