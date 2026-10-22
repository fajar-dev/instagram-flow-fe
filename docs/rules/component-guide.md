# Komponen dashboard IG Flow

## Layout dan form

`Header` mengatur judul/deskripsi/aksi halaman, `HeaderTab` navigasi route dan count, `DataTable` list beserta filter/pagination. Referensi User dan Profile digunakan untuk spacing serta tipografi. Gunakan UCard hanya jika pengelompokan konten membutuhkan card; hindari card bertingkat yang berulang.

Form memakai UForm, schema Zod, UFormField, label, placeholder dan atribut required yang sesuai schema. `user/FormFields.vue` dipakai bersama modal tambah/edit. Modal fitur diletakkan di component terpisah; konfirmasi hapus memakai DeleteModal.

`DateInput.vue` menghubungkan string YYYY-MM-DD dengan DateValue, UInputDate, UPopover dan UCalendar. Gunakan component ini untuk tanggal dokumentasi. Avatar/uploader menggunakan UAvatar bersama nama; avatar tidak membuka lightbox.

## Detail konten dan publikasi

Satu halaman `/content/:jobId`: preview kiri, card utama kanan, card Summary di bawahnya. Tidak ada tab Detail/Editor/Publish atau langkah revisi.

- `content/JobSummary.vue`: metadata proyek dan ringkasan job; `JobTimeline.vue`: waktu proses.
- `content/AssetSlider.vue`: foto sumber selama proses AI atau ketika gagal.
- `content-review/PreviewPanel.vue`: hasil AI; Feed memakai carousel swipe/drag dengan header dan caption tetap, Story satu gambar.
- `publishing/PublicationForm.vue`: metadata, caption Feed, pilihan slide, akun dan jadwal. `SlideSelection.vue` menampilkan gambar AI, skor, alasan dan urutan; maksimal 10 Feed atau satu Story.
- `publishing/PublicationPanel.vue`: form atau hasil publikasi sesuai status. `RejectionNotice.vue` menampilkan catatan penolakan.

Header/card dimiliki halaman; komponen isi tidak menambah card bersarang. Preview gambar menggunakan lightbox bersama; tidak ada preview publikasi tunggal terpisah.

## Media

`ProgressiveImage` menampilkan thumbnail blur lalu gambar penuh, dengan lazy loading. `PrivateImage` menangani media yang perlu diambil melalui API. `ImagePreview` membuka `useLightbox`; `ImageLightbox` dipasang sekali di root aplikasi.

Lightbox memakai modal transparan, image object-contain, close button, dan menutup saat route berubah. Jangan memasang satu modal per item galeri. Gambar selain avatar dapat dipreview; tombol download tetap mempunyai aksi terpisah.

`MediaGallery` memakai masonry. `InfiniteScroll` memuat halaman selanjutnya melalui composable reporting dan menyediakan retry/fallback saat diperlukan. Pagination UI disembunyikan untuk Media; API tetap mengembalikan halaman data. Jangan menggabungkan duplikat item atau mengulang otomatis halaman yang terus gagal.

## Feedback dan aksesibilitas

Gunakan toast untuk hasil mutation. Field validation tetap inline. Error job di Summary dan error load halaman harus bertahan sampai state berubah; keduanya bukan toast sekali lewat. Semua tombol ikon mempunyai aria-label terjemahan, status memakai label selain warna, dan tab/carousel/lightbox tetap dapat dioperasikan lewat keyboard.

## Publishing dan Settings

PublishingPublicationPanel berada dalam halaman Content, menampilkan satu publikasi project atau PublicationForm secara inline. Reject menjadi aksi sekunder pada bagian bawah form; state dan idempotency berada di usePublicationForm. DateInput plus input jam menerima jadwal WIB. Gambar hasil AI dapat dibuka melalui lightbox pada preview kiri. Unknown outcome tidak mempunyai tombol retry agar tidak membuat duplikasi. Settings memakai InstagramAccounts dan DispatcherPanel, tanpa mengekspos credential.

## Navigasi mobile

`MobileNavbar` berada di bawah area scroll layout dashboard pada layar di bawah breakpoint lg. Urutannya Overview, Analytics, Upload (ikon bulat), Content, Utility. Padding safe-area mengikuti perangkat; navbar tidak menutupi konten. `MobileUtilitySidebar` berisi Media, Activity logs, Settings dan Users, memakai sumber menu yang sama dari `useNavigation`. Drawer menutup setelah navigasi dan ketika viewport berpindah ke desktop. Logo dan avatar tetap di header mobile; sidebar desktop tetap tersedia pada lg.
