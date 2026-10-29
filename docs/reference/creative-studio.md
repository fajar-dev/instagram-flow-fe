# Creative studio UI

Tema frontend menggunakan claymorphism lembut untuk tim kreatif dan sosial media. Tema berlaku pada halaman dashboard, auth, form, tabel, dialog, dan navigasi melalui komponen bersama.

## Sumber tema

- `app/app.config.ts`: bentuk dan ukuran komponen Nuxt UI. Tombol dan badge berbentuk pill, input rounded, kartu memiliki radius lebih besar.
- `app/assets/css/main.css`: token permukaan, bayangan inset, warna pastel, dark mode, fokus keyboard, dan reduced motion.
- `public/illustrations/*.svg`: aset terpisah untuk overview, analytics, content, settings, users, profile, activity, upload, media. Banner overview memakai aset raster `public/overview-banner.png`. Header memanggil file SVG langsung melalui img dekoratif; gradient/filter terisolasi di setiap file SVG. Ilustrasi tidak membawa informasi penting dan disembunyikan dari screen reader.
- `Header.vue`: memilih ilustrasi berdasarkan area halaman; ilustrasi header disembunyikan pada layar kecil agar ruang konten tetap cukup.

## Skala radius

Token `--ui-radius` memakai 0.25rem. Nuxt UI mengalikan token ini untuk kelas rounded; jangan menaikkannya menjadi 1rem karena kartu dan tabel akan menjadi kapsul. Kartu memakai rounded-3xl (24px), kontrol rounded-2xl (16px), dan bentuk pill dibatasi pada tombol serta badge.

## Pemakaian

Gunakan UCard untuk kontainer dan komponen form Nuxt UI agar tema diwariskan otomatis. Untuk elemen semantik seperti dl, gunakan `clay-card rounded-3xl`. `metric-tile` memberi permukaan pastel netral dengan glow warna lembut dan lengkungan konsentris di sudut kanan bawah pada metrik Overview dan Analytics. Pola SVG berada di `public/patterns/`, menggunakan warna aksen masing-masing kartu, tidak menerima pointer event, dan tidak memengaruhi layout atau informasi metrik. Glass dibatasi pada navigasi; konten utama tetap memiliki permukaan yang mudah dibaca. Jangan menerapkan efek dekoratif ke gambar konten atau mockup Instagram.

Warna dekoratif khusus dipusatkan di stylesheet dan SVG, sesuai permintaan redesign. Warna status, primary AMTI, label, urutan konten, serta fungsi aplikasi tetap memakai sistem yang ada. Hindari menduplikasi aturan warna dan shadow per halaman.

## Verifikasi

Jalankan lint, typecheck, test dan build. Periksa desktop/mobile, tema terang/gelap, focus keyboard, scrolling tabel, popup dan form panjang di browser saat akses tersedia.
