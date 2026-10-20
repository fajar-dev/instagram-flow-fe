# Tema Nuxt UI untuk IG Flow

IG Flow menggunakan Nuxt UI 4 dan Tailwind CSS. Sumber tema adalah `app/app.config.ts` serta `app/assets/css/main.css`; primary AMTI adalah biru `#2D4E6F`, font Geist, neutral memakai palette neutral. Jangan menyalin hex tersebut ke setiap component; gunakan token primary/neutral/error/warning dan text/background semantic.

## Pedoman visual

- Rujuk User/Profile untuk heading, form dan spacing halaman.
- Gunakan `text-sm`, `text-xs`, `text-muted`, `text-toned`, `text-highlighted` sesuai hierarki; jangan memperbesar semua teks untuk menonjolkan state.
- Default button/input aplikasi berukuran lg. Aksi sekunder yang padat dapat memakai sm; tab editor compact memakai sm.
- Navigasi halaman memakai HeaderTab. Panel editor memakai UTabs variant pill color primary; active indicator mengikuti tema.
- Gunakan class responsif standar seperti grid-cols, gap, p, rounded dan breakpoint sm/lg/xl; hindari arbitrary values.
- Tampilkan count tab dengan ukuran yang terbaca tanpa mendominasi label.

## Komponen yang sudah tersedia

Gunakan UButton/UInput/UForm/UFormField, USelect/USelectMenu, UTextarea, UCheckbox, USwitch, UModal, UPopover, UCalendar, UInputDate, UAvatar, UBadge, UTabs, UCarousel, UTimeline, UAccordion dan UTable melalui component aplikasi bila sudah ada.

Untuk behavior rinci, baca type/theme dependency yang terpasang dan `.nuxt/ui/` setelah Nuxt prepare. File `.nuxt` adalah hasil generate dan tidak boleh diedit. Jangan menyalin katalog dokumentasi vendor ke repo; panduan ini hanya memuat keputusan UI aplikasi.

Lihat [inventaris komponen](ui-components.md) dan [pola komponen](../rules/component-guide.md). Perubahan token tema global harus dipisahkan dari perbaikan satu halaman agar tidak mengubah seluruh dashboard tanpa sengaja.
