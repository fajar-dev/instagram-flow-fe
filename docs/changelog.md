# 📋 Changelog

Semua perubahan penting pada project ini didokumentasikan di file ini.

Format: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

---

## [0.1.0] — 2026-06-18

### 🎉 Initial Release

- Nuxt Boilerplate — Starter template admin dashboard
- Nuxt 4, NuxtUI v4, Tailwind CSS v4, TypeScript, Zod, Axios
- Authentication (email/password, Google OAuth, forgot/reset password)
- User management CRUD
- Contact CRUD
- Profile configuration
- Dashboard layout dengan collapsible sidebar
- Auth layout dengan split-screen design
- Custom design system (green primary, Geist font)
- Dokumentasi lengkap di `docs/`

---

## Template untuk Entry Baru

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Added
- Fitur baru yang ditambahkan

### Changed
- Perubahan pada fitur yang sudah ada

### Fixed
- Bug yang diperbaiki

### Removed
- Fitur yang dihapus

### Security
- Perubahan terkait keamanan
```

## 2026-10-15 — Audit dan refactor

- Perbaiki logout, redirect dashboard, kontrak ApiResponse, encoding email reset, dan inisialisasi sesi melalui plugin.
- Pisahkan error presentation dari service; deduplikasi refresh paralel dan lindungi sesi dari refresh terlambat.
- Pertahankan Google login dengan penanganan konfigurasi kosong; pusatkan footer/i18n auth, cleanup timer/blob preview, dan rapikan lint.
- Tambah test service Bun. Rincian keputusan dan batas pengujian: [audit-2026-10-15.md](./audit-2026-10-15.md).

## 2026-10-15 — Sidebar mobile

- Ganti overlay sidebar sempit dengan komponen MobileSidebar berbasis NuxtUI Slideover dan menu vertikal yang mendukung tap.
- Pusatkan header mobile di dashboard layout; tutup drawer setelah navigasi atau ketika beralih ke desktop.
- Menu pengaturan tema/bahasa mendukung klik; label navigasi tersedia dalam en/id.

## 2026-10-15 — Penyempurnaan ukuran sidebar dan avatar

- Perkecil drawer mobile dari w-80 menjadi w-64, ukuran teks, ikon, dan jarak menu agar lebih ringkas.
- Kembalikan avatar user di header mobile; ganti ikon Settings di sidebar desktop/mobile dengan avatar user.
- Gunakan tombol avatar yang dapat diakses melalui keyboard dan tetap membuka menu akun.

## 2026-10-15 — Penyederhanaan sidebar

- Hapus menu Feedback dari sidebar desktop dan mobile, termasuk konfigurasi dan terjemahan yang tidak terpakai.
- Hapus footer avatar sidebar mobile; akses akun tetap tersedia melalui avatar header mobile dan sidebar desktop.
- Tambahkan separator di atas avatar sidebar desktop, selaras dengan separator di bawah logo.

## 2026-10-15 — Hero Instagram Flow

- Ganti `public/hero.png` dengan ilustrasi Instagram Flow: ikon Instagram terhubung ke pesan, interaksi, konten, dan analitik dalam gradasi ungu–pink–oranye.
- Aset PNG portrait 1024×1536 dibuat menggunakan imagegen bawaan; bagian bawah diberi ruang gelap agar teks hero tetap terbaca. Layout auth tetap menggunakan path yang sama.
- Revisi identitas AMTI: gunakan referensi logo resmi, dominasi biru navy/slate, detail koneksi sensor, dan aksen Instagram. Prompt revisi imagegen: pertahankan workflow Instagram, tambahkan tile logo AMTI yang terhubung, nuansa teknologi korporat, serta ruang gelap di bawah untuk judul.

## 2026-10-15 — Utility frontend dan logo navigasi mobile

- Pusatkan format tanggal/tanggal-waktu, query daftar/route, serta pilihan bahasa dan flag di `app/util` dengan import eksplisit.
- Halaman Contact dan User mengikuti bahasa aktif untuk tanggal; tanggal invalid/kosong memakai placeholder yang konsisten.
- Pindahkan tipe SortOrder ke `app/types/query.d.ts` agar service tidak bergantung pada composable UI.
- Tambah pengujian edge case tanggal, timezone, encoding query, parameter duplikat, dan fallback locale.
- Header sidebar mobile menampilkan BrandLogo AMTI; label navigasi tetap tersedia bagi pembaca layar.

## 2026-10-15 — Lengkapi profile

- Hubungkan halaman informasi dan password ke endpoint auth existing; tambahkan tipe payload profile dan method AuthService.
- Perbarui auth state readonly melalui service dan cache user setelah berhasil, termasuk status hasPassword. Respons setelah logout tidak menghidupkan kembali sesi.
- Perbaiki path tab absolut, redirect /profile, serta akses Profil saya melalui menu avatar desktop/mobile.
- Lengkapi terjemahan en/id, schema reaktif terhadap locale, validasi kata sandi lama, autocomplete, dan penanganan error UI.
- Tambahkan useImageUpload untuk preview foto, cleanup object URL, dan pengabaian respons upload yang tidak lagi relevan. Foto diterapkan ke profil setelah pengguna menyimpan form.
- Tambahkan regression test untuk update profile/password, persistence user, respons terlambat setelah logout, dan kegagalan update.
