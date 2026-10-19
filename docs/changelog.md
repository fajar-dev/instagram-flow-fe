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

## 2026-10-16 — AMTI Social dashboard

- Overview dari data API, upload bertahap dengan progress, job/detail, studio revisi, review internal, media privat, audit, dan konfigurasi admin.
- Navigasi mengikuti role ADMIN, MARKETING, REVIEWER, UPLOADER; backend tetap menjadi otoritas izin.
- API ada di `app/services/social-service.ts`, kontrak di `app/types/social.d.ts`, helper stateless tanggal WIB/hashtag/ukuran file di `app/util/social.ts`.
- Polling berhenti ketika halaman tersembunyi dan mencegah request tumpang tindih. Studio memakai revisi/hash untuk menolak edit dan approval basi.
- Preview SVG adalah pratinjau, bukan file siap publikasi. Perubahan konten menandai preview kedaluwarsa. Tidak ada publish Instagram atau metrik engagement buatan.
- Teks tersedia en/id menggunakan NuxtUI dan layout project. Gambar privat diambil dengan bearer auth lalu object URL dibersihkan.
- Setup integrasi dan batas workflow V0.2: lihat `../../backend/README_SETUP.md`.

## 2026-10-16 — Social structure cleanup

Split API clients by feature, move upload/studio/list state into explicit composables, and extract studio panels. Fix dropped filter reloads during active requests. Add API contract regression tests. Details: [refactor notes](../../backend/docs/content-automation/REFACTOR-2026-10-16.md).

### Final feature layout and storage correction

Removed social umbrella folders. Features and their related children now live at the top level, with per-feature composition roots. Frontend routes have legacy aliases. Runtime content storage reuses the original MinIO helper with a private bucket; a verified/resumable command preserves existing local data. See the refactor document for the final structure.


## 2026-10-16 — Audit konsistensi lanjutan

Pisahkan repository reporting, gunakan serializer eksplisit per fitur, pindahkan retry ke service, satukan pagination dan header auth, seragamkan ApiResponse frontend, serta perbaiki batch FAILED saat dispatch habis. Bersihkan penamaan internal modul lama dan perbarui dokumentasi. Lihat audit 2026-10-16.

## 2026-10-16 — Audit alur dan composition root

Hapus aggregator src/modules/workflow.module.ts; routes dan CLI mengimpor module pemilik fitur. Dependency transaksi bersama diwiring oleh shared.module.ts. Link reset memakai FRONTEND_URL, bukan APP_URL; batas aset mengabaikan arsip; retry menghormati retryable. Editor tidak lagi memberi toast sukses setelah reload gagal, input dibekukan saat save/reload, dan payload proses tetap stabil saat retry jaringan. Validasi reset password frontend mengikuti kebijakan backend existing (minimum 6). Pengujian browser belum bisa dilakukan: origin localhost:3000 ditolak oleh izin browser tersimpan.

### 2026-10-16 — Typography and list consistency audit

- Reuse contact/user DataTable controls and pagination for automation lists; media retains a gallery through the shared content slot.
- Align body text, section headings, card spacing and form widths with contact/user/profile; preserve existing palette and avatars.
- Add reusable latest-request handling, loading/error states, page reset/clamping and duplicate-submit guards. Fix dynamic job/studio state when navigating between IDs.
- See `docs/audit-2026-10-16.md` for decisions and verification limits.

### 2026-10-16 — Equal access and feature component cleanup

- Remove role selectors/types/access composable and role-dependent navigation/actions.
- Share user form fields and reporting page shell; split studio editing/review forms into feature components.
- Fix overlapping active navigation for nested studio routes; retain contact/user/profile typography and theme.

### 2026-10-16 — Remove refresh controls

- Remove all manual refresh/reload buttons and unused translation keys.
- Share reporting pagination/search watchers with contact/user; suppress repeated polling error toasts until recovery.
- Guard contact forms against duplicate submission and remove empty table action wrappers.

## 2026-10-16 — Feature API routes

Removed the /api/social prefix. Feature resources now live directly under /api (batches, jobs, drafts, review, media, assets, renders, overview, audit-logs, settings and media-access). Backend api.ts explicitly applies authentication and mutation/body limits per route, matching contact/user. Service-secret callbacks and signed-media validation remain separate. Frontend services, tests, Swagger and generated media URLs use the new paths. Legacy frontend /social aliases are removed. Deploy frontend/backend together and re-import the updated n8n workflow; existing in-flight manifests may still reference the previous URLs.

## 2026-10-16 — Reset baseline dan audit struktur

Baseline migration/database direset atas instruksi pengguna. Runtime tidak lagi memakai nama social; config dan terjemahan dipisah per fitur, dispatcher menjadi jobs:dispatch. Form contact berbagi fields/validasi dan tidak lagi tertutup saat klik di dalam modal. Lihat backend/docs/AUDIT-BASELINE-2026-10-16.md untuk detail dan batas verifikasi.

## 2026-10-16 — Dispatcher dan notifikasi

Kontrol dispatcher dashboard dipertahankan sesuai pilihan pengguna. Status statis/deployment yang tidak diperlukan dihapus; readiness divalidasi saat toggle dan worker tick. Upload mengikuti batas backend melalui /batches/limits. UAlert frontend dihapus; toast menjadi notifikasi utama, dengan teks untuk status kontekstual. Lihat backend/docs/AUDIT-DISPATCHER-2026-10-16.md.

## 2026-10-16 — Konsistensi placeholder dan form

Lengkapi placeholder bilingual untuk upload konten, editor judul/caption/hashtag, review, dan select/filter. Review memakai label UFormField yang tetap terlihat. Modal contact memakai jarak field space-y-3 seperti modal user; form halaman tetap space-y-4 seperti profile. Ukuran kontrol mengikuti app.config.ts, tanpa override font/size per fitur. Input tanggal native memiliki petunjuk permanen karena placeholder bergantung browser.

## 2026-10-18 — MinIO presigned media

n8n preview URLs now reuse MinIO presigning. Removed MEDIA_SIGNING_SECRET and the custom media-access route; manifest/render validation and dispatcher readiness were updated. See backend/docs/AUDIT-PRESIGNED-MEDIA-2026-10-18.md.

## 2026-10-18 — Independent image uploads

Validate each selected image (size, MIME/extension, browser decoding and 40 MP resolution) and show errors on its card. Upload failures no longer stop later files. Stable per-file state retains successful uploads across retries/removal. Failed files can be retried or removed; processing only uploaded files is an explicit separate action. Backend remains authoritative for static-image format and decoding.

## 2026-10-18 — Unified Content navigation

Replaced AI Jobs, AI Studio and Content Review sidebar entries with Content. Status tabs use job lifecycle for queued/dispatched/processing/failed and current draft status for ready/in-review/revision/approved/rejected, preserving server pagination/search and avoiding duplicate or incorrectly classified review rows. Tabs scroll horizontally on small screens, reset pagination on change, and store status in the URL. The existing 30-day list scope is stated explicitly.

Detail and editor pages now live under `/content/:jobId` and `/content/:jobId/edit`. Old URLs are route aliases to the same implementations for existing bookmarks and n8n links, not duplicate pages. Media remains its separate sidebar entry. Upload, retry, list actions and newly generated manifest review URLs use the new routes.

## 2026-10-18 — Profile-style Content tabs with counts

Content now uses the same underline typography, spacing and active state as Profile through the shared HeaderTab component. Header tab navigation scrolls horizontally when needed. Added compact per-status counts from one authenticated summary request, polled every 20 seconds and refreshed on status changes, using the same 30-day scope as the lists. Removed the Content page's Upload Content action. Profile retains its original appearance through the shared component.

### Content count badge sizing

Adjusted HeaderTab count badges to medium with standard padding and medium-weight tabular numbers, keeping them readable and proportional to tab labels.

## 2026-10-18 — Masonry Media gallery

Replaced uniform media cards with responsive masonry columns (one/two/three) using each photo's aspect ratio. Project/uploader information and download/archive controls overlay the photo; controls remain visible on mobile and keyboard focus. MediaGallery and ProgressiveImage are separate feature components, reusing list search, pagination and archive confirmation.

Images request authenticated preview URLs near the viewport and fade from a real blurred 32px MinIO thumbnail into the sharp preview. No per-image spinner or skeleton, artificial loading delay, persistent local media or additional library. Reduced-motion preferences disable transitions. The list's initial metadata request uses a short status message because image thumbnails are unavailable until IDs arrive.

Validation: backend/ frontend regression suites, typechecks, frontend lint and builds. Real MinIO verification returned a 412-byte 26×32 thumbnail, 200 for signed images and 403 without signature. Browser visual verification remains blocked by the previously denied localhost permission.

## 2026-10-18 — Media infinite scroll

- Media hides pagination and page-size controls; an intersection sentinel loads subsequent pages near the viewport. Existing masonry and progressive MinIO previews remain.
- Appends deduplicated assets, stops at the end, resets on search/date/archive, and preserves loaded images on a failed next-page request. Failed requests require an explicit retry instead of automatic loops.
- Media no longer polls and replaces the gallery every 20 seconds; other reporting tables retain pagination and polling.

## 2026-10-18 — Date picker and uploader avatars

Reusable DateInput uses Nuxt UI segmented date input and calendar popover, keeping date-only YYYY-MM-DD payloads and disabled upload state. Reporting uploader cells display avatar and name; media overlays also use uploader profile photos.

## 2026-10-18 — Content detail and editor layout

- Detail uses a swipeable Nuxt UI photo carousel beside extracted JobSummary metadata. Date-only documentation dates use the shared date formatter.
- Studio uses two responsive columns, a bounded preview with Feed/Story tabs, and a compact ranking carousel with an explicit selected-photo state. Existing save, restore, review, stale-render and retry behavior is retained.
- ProgressiveImage optionally supports a fixed frame and contain mode for full-photo previews; the media masonry default remains unchanged.

## 2026-10-18 — Click-to-preview content images

- Shared ImagePreview opens a Nuxt UI modal from a keyboard-accessible image trigger, with Escape/overlay/close-button dismissal and an unavailable-image state.
- Applied to progressive gallery/slider photos, private result renders, and staged uploads. Reuses signed MinIO or temporary browser Blob URLs; no duplicate download API or persistent local copies.
- Avatars, profile-photo upload controls, and decorative/navigation branding retain their existing behavior. Gallery download/archive controls remain independent.

## 2026-10-18 — Shared transparent lightbox

- Replaced per-image modal instances with one ImageLightbox at the app root and useLightbox shared state. ImagePreview remains a reusable trigger.
- Matches the transparent, borderless preview style with padded contained image and floating round close button. Retains accessible modal labels, keyboard dismissal and failed-image feedback.
- Closes on route changes and when the originating image is removed or its URL changes.

## 2026-10-18 — Focused Content workspace

- Shared JobHeader provides Profile-style Detail/Editor navigation, contextual status/revision, and unsaved-change indicator.
- Detail prioritizes photos in a 7/5 layout, a single project summary and lifecycle timeline, with execution metadata collapsed by default.
- Editor keeps a bounded preview beside Caption/Photos/Review/History tabs. Tabs preserve form state; compact photo comparisons replace stacked image carousels. Review guards, revision saving, restore and private lightbox remain unchanged.

## 2026-10-18 — Detail process timeline

- Replaced the plain lifecycle icon list with a vertical Nuxt UI Timeline connecting Created, Started and Completed. Recorded stages use primary color; pending stages remain muted. Timestamps reuse the existing Jakarta formatter and update with job polling.

## 2026-10-19 — Remove Contact

Removed the Contact application feature, endpoints, entities, UI, types, client, translations and dedicated tests. Shared auth, logging, language and pagination tests now use supported User endpoints. User is the active CRUD reference. Historical audit records remain unchanged.

Backend migration `1792368000000-drop-contacts` removes the retired table. Applied migration history is preserved; reverting restores only the empty schema, not deleted data.

## 2026-10-19 — Move job metadata into summary

Moved status, revision number and workflow error into the project summary. Removed the shared header action row and Back to Content button from both detail and editor. Unsaved-edit feedback stays beside the editor controls.

## 2026-10-19 — Summary description styling

Description now uses a labeled full-width summary field with readable body text and preserved line breaks. Removed the surrounding horizontal rules and excessive top padding.

## 2026-10-19 — Visible carousel arrows

Override both base and sm arrow positions so Nuxt UI does not place desktop controls outside the card. Solid, shadowed controls sit above image/lightbox triggers with a consistent touch target. Endpoint disabled states and single-image behavior remain intact.

## 2026-10-19 — Compact editor tabs

Replaced icon/underline editor tabs with text-only segmented pills on a muted track. The active tab uses the primary theme color with contrasting text; removed the extra header divider while retaining tab state and keyboard behavior.
