# Analytics

Halaman `/analytics` menggunakan Header, UFormField/USelect, DataTable, UModal, dan token visual dashboard. Menu Analytics berada setelah Overview pada sidebar desktop dan navbar mobile. Media tersedia melalui Utility pada mobile; tombol Upload tetap di tengah navbar. Akun mengikuti daftar akun Instagram aktif yang sudah dikonfigurasi.

Pilihan periode kalender hanya memengaruhi statistik akun. Hanya ada tabel Top posts; tipe, tanggal publish dan semua angka insight tampil langsung. Tombol View post menuju Instagram. Tidak ada daftar Instagram posts tambahan atau modal insight. Konten yang diterbitkan di luar IG Flow juga dapat muncul. Halaman Content menggunakan panel insight yang sama setelah publication berstatus PUBLISHED dan memiliki mediaId. Panel menggunakan data publication yang sudah dipolling oleh halaman Content, tanpa request daftar publikasi tambahan.

Struktur: services/analytics untuk HTTP, composables/analytics untuk lifecycle dan state, components/analytics untuk daftar/metric/panel. `useLatestRequest` menangani race request dan toast; pemrosesan halaman tambahan memiliki generation guard agar data akun sebelumnya tidak masuk akun baru. `util/number` membedakan null dari nol.

Data dapat tertunda, metrik yang tidak tersedia ditampilkan sebagai —. Timestamp menunjukkan waktu pengambilan, bukan waktu terakhir interaksi di Instagram. Cache backend lima menit. Tidak ada refresh manual atau error inline duplikat toast. Kontrol akun/periode dan tabel mendukung layout mobile; tabel metrik lebar memakai scroll horizontal. Analytics saat ini tidak menyimpan snapshot historis di database.

## Verifikasi

48 tes frontend lulus, termasuk pencegahan data pagination akun lama masuk akun baru. Lint, typecheck, pemeriksaan unused declarations dan build berhasil. Pemeriksaan visual browser belum dapat dilakukan karena saved origin permission menolak localhost:3000.

## Visualisasi metrik

Statistik akun dan postingan memakai RadialBarChart dari nuxt-charts, dengan legenda di bawah dan nilai asli di samping. Kategori dan data mengikuti urutan yang sama. Nilai null tidak diplot dan tetap ditampilkan sebagai —; nol tetap nol. Metrik dapat tumpang tindih sehingga tidak dijumlahkan atau diubah menjadi persentase. Warna metrik stabil antarperiode dan akun, memakai token tema.

## Tambahan metrik dan peringkat — 20 Oktober 2026

Credential beta_dev12 diuji read-only pada Graph v24.0. Metrik akun tambahan yang mengembalikan angka: accounts_engaged, likes, comments, saves, shares, replies, reposts, profile_links_taps. Feed mendukung follows, profile_visits, profile_activity. follows_and_unfollows kosong dan metrik Reels tidak didukung pada Feed yang diuji, sehingga tidak ditambahkan. Ini bukan jaminan semua akun/jenis media akan memiliki data; nilai tidak tersedia tetap null.

Engagement rate dihitung sebagai total_interactions / reach × 100, dibulatkan dua desimal. Reach nol/null atau interaksi null menghasilkan null. Interaksi nol dengan reach positif menghasilkan 0%. Nilai dapat melebihi 100 karena bukan persentase akun unik. Persentase tidak dicampur ke radial chart; chart membandingkan views, reach dan total_interactions, metrik lainnya tetap berupa angka.

Endpoint GET /instagram/accounts/:accountKey/top-posts menerima cursor after dan mengembalikan maksimal 20 media per request beserta cursor berikutnya. Frontend memuat seluruh halaman bertahap, deduplikasi ID, mengurutkan semua postingan berdasarkan interaksi lalu reach, dan menjaga pergantian akun dari respons lama. Null tetap ditampilkan, diurutkan terakhir. Jika request gagal, data yang sudah dimuat dipertahankan dan tombol coba lagi melanjutkan cursor yang sama. Tidak ada lagi batas lima terbaik atau 20 total.

Insight pada Content mempertahankan metrik semula (Feed/Reels: views, reach, likes, comments, saved, shares, total_interactions; Story: views, reach, replies, navigation) tanpa engagement rate atau metrik profil tambahan. Radial chart Content tetap menampilkan semua metrik semula; tambahan metrik akun dan ER hanya pada menu Analytics.

## Periode kalender

Pilihan Today, This week dan This month memakai batas hari Asia/Jakarta (WIB). Minggu dimulai Senin; bulan dimulai tanggal 1; semua rentang berakhir pada waktu pengambilan data. Default This week. Cache memasukkan awal rentang agar tidak memakai data rentang kemarin saat berganti hari/minggu/bulan. Top posts tetap memakai angka lifetime dan tidak difilter periode akun.

## Radar akun

Hanya statistik akun memakai RadarChart, membandingkan periode terpilih dengan bagian berjalan periode sebelumnya. Today bergeser satu hari, This week tujuh hari, This month mulai tanggal 1 bulan sebelumnya (dibatasi akhir bulan jika lebih pendek). Rentang aktual tersedia melalui tooltip pembanding. Setiap sumbu (reach, likes, comments, saves, shares, engagement rate) dinormalisasi terhadap maksimum kedua periode; maksimum menjadi 100. Nol tidak dianggap data hilang, null tidak diplot. Minimal tiga sumbu tersedia untuk radar. Nilai asli kedua periode tetap ditampilkan. Insight Content tetap radial tanpa pembanding.


Statistik akun menampilkan Views, Reach, Interactions, dan Engagement rate sebagai ringkasan utama, lalu radar dan metrik pendukung. Indikator tren menghitung (sekarang − sebelumnya) / sebelumnya × 100%; ER memakai selisih poin persentase. Baseline nol dengan nilai baru positif ditulis “Dari nol”, kedua nilai nol menghasilkan 0%, dan null menghasilkan tanda —. Tooltip indikator menampilkan arah dan nilai sebelumnya. Tidak ada sparkline sintetis: data yang tersedia adalah agregat dua periode, bukan deret waktu harian.
