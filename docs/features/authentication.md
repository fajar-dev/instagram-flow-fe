# Login

`useSignIn` mengelola form password serta alur sukses/error Google dan Microsoft. Halaman sign-in hanya menyusun UI. `auth-service` menyimpan sesi dari API; Google dan Microsoft menghasilkan sesi aplikasi yang sama.

Microsoft memakai popup, bukan redirect halaman utama. `useMicrosoftCodeClient` mengelola lifecycle popup; `util/auth/microsoft-popup.ts` membangun state/PKCE dan memvalidasi pesan. Callback `/auth/microsoft/callback` hanya meneruskan kode kepada opener dengan origin yang sama, lalu opener menukar kode melalui backend. Tidak ada sesi/token aplikasi di callback, verifier di storage, atau penukaran kode dari query halaman sign-in.

Popup diblokir dan timeout lima menit menampilkan toast. Menutup popup membatalkan login tanpa toast error. Listener dan timer dibersihkan ketika selesai atau komponen dilepas. Callback yang dibuka langsung meminta pengguna menutup jendela dan masuk kembali.

## Konfigurasi

Frontend membutuhkan MICROSOFT_CLIENT_ID, MICROSOFT_TENANT_ID dan MICROSOFT_REDIRECT_URI. Nilainya harus sama dengan backend dan aplikasi Microsoft Entra. Jangan menaruh MICROSOFT_CLIENT_SECRET di frontend.

Redirect URI development adalah `http://localhost:3000/auth/microsoft/callback`; jika kosong, frontend memakai origin aktif. Daftarkan URI sebagai platform **Web** di Entra karena backend menggunakan confidential client untuk menukar kode. Hanya scope openid/profile/email yang diminta. Backend hanya menerima pengguna lokal yang sudah terdaftar dan aktif.

Callback wajib berada pada origin aplikasi. Header browser/deployment harus mempertahankan opener popup OAuth; kebijakan COOP same-origin dapat memutusnya. Pengujian login nyata membutuhkan akun Microsoft dan konfigurasi Entra, terpisah dari tes otomatis PKCE, validasi pesan dan sesi.

## Struktur file

- `app/pages/auth/`: halaman sign-in dan callback.
- `app/composables/auth/`: useAuth untuk sesi, useSignIn untuk koordinasi login, useMicrosoftCodeClient untuk lifecycle popup.
- `app/util/auth/microsoft-popup.ts`: PKCE, URL authorize, validasi pesan dan kontrol window.
- `app/services/auth-service.ts`: komunikasi API dan penyimpanan sesi, mengikuti konvensi service aplikasi.
- `tests/microsoft-popup.test.js` dan `tests/auth.test.js`: regresi popup dan sesi.

Composable dalam subfolder diimpor eksplisit oleh konsumennya; tidak mengandalkan auto-import folder bertingkat.

## Kembali ke halaman tujuan

Halaman yang membutuhkan sesi mengarahkan pengguna ke `/auth/sign-in?redirect=<fullPath>` saat belum login. Jika refresh token ditolak ketika aplikasi berjalan atau saat sesi dipulihkan, URL halaman saat itu juga dipertahankan, termasuk query dan hash. Refresh yang berhasil tetap melanjutkan request tanpa membuka login; gangguan jaringan tidak menghapus sesi.

Login password, Google dan Microsoft memakai penyelesaian login bersama yang membaca tujuan ini setelah autentikasi berhasil. Navigasi memakai replace agar tombol Back tidak kembali ke login. Pengguna yang sudah login dan membuka halaman guest juga mengikuti tujuan redirect. Nilai kosong/tidak valid, URL eksternal dan tujuan halaman auth kembali ke `/`; helper `app/util/auth/redirect.ts` memvalidasi tujuan. Query redirect yang sudah ada pada halaman auth tidak ditimpa oleh respons 401 yang datang terlambat.
