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
- Review: foto carousel, summary/timeline, caption dan keputusan Publish/Reject.
- Publish: penyesuaian caption/foto dan pemilihan akun serta jadwal dalam satu form.
- Media: galeri masonry, thumbnail blur ke gambar penuh, infinite scroll dan lightbox.
- Activity Logs, Integration Settings, User dan Profile.

Upload tersedia pada `/content/upload`. Semua user aktif terautentikasi memiliki akses yang sama. Ready for review langsung menuju Publish atau Reject. Satu project dipublikasikan satu kali ke satu akun, sekarang atau terjadwal. Analytics Instagram dan Telegram belum tersedia.

## Verifikasi

```sh
bun run typecheck
bun run lint
bun run test
bun run build
```

Build lokal dapat dipreview melalui `bun run preview`. Pengujian service memakai adapter terkontrol; verifikasi browser dan integrasi nyata merupakan pemeriksaan terpisah.

Mulai dari [indeks dokumentasi](docs/README.md), [peta halaman](docs/project-overview.md), [panduan UI](docs/component-guide.md), dan [aturan kontribusi](AGENTS.md).
