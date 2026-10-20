# IG Flow — Frontend

Dashboard AMTI untuk menyiapkan konten Instagram: unggah dokumentasi kegiatan, pantau pemrosesan AI, perbaiki caption/foto, dan lakukan review internal. Frontend menggunakan Nuxt 4 (SPA), Nuxt UI 4, Tailwind CSS, TypeScript, Axios, Zod, serta bahasa Indonesia/English.

## Menjalankan

```sh
bun install
# Hanya jika belum memiliki .env:
cp .env.example .env
bun run dev
```

`API_BASE_URL` default `http://localhost:4000/api`; `GOOGLE_CLIENT_ID` diperlukan untuk login Google. Jalankan [backend](../backend/README.md) terlebih dahulu untuk menggunakan data nyata. Jangan menyimpan secret backend, MinIO, atau AI di frontend.

## Halaman utama

- Overview: ringkasan aktivitas dan status konten.
- Content: job dan draft dalam satu menu, tab berdasarkan status dengan count.
- Detail Content: preview, summary/timeline, form caption/foto, akun dan jadwal, keputusan Publish/Reject serta hasil publikasi dalam satu halaman.
- Analytics: statistik akun, perbandingan periode dan top posts.
- Media: galeri masonry, thumbnail blur ke gambar penuh, infinite scroll dan lightbox.
- Activity Logs, Settings, User dan Profile.

Upload tersedia pada `/content/upload`. Semua user aktif terautentikasi memiliki akses yang sama. Ready for review langsung menuju Publish atau Reject. Satu project dipublikasikan satu kali ke satu akun, sekarang atau terjadwal. Insight tersedia untuk postingan yang berhasil dipublikasikan. Telegram belum tersedia.

## Verifikasi

```sh
bun run typecheck
bun run lint
bun run test
bun run build
```

Build lokal dapat dipreview melalui `bun run preview`. Pengujian service memakai adapter terkontrol; verifikasi browser dan integrasi nyata merupakan pemeriksaan terpisah.

Mulai dari [indeks dokumentasi](docs/README.md), [peta halaman](docs/architecture/overview.md), [panduan UI](docs/rules/component-guide.md), dan [aturan kontribusi](AGENTS.md).
