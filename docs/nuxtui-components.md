# Inventaris komponen IG Flow

Daftar ini memetakan kebutuhan aplikasi ke komponen yang sudah ada, bukan katalog seluruh library Nuxt UI.

| Kebutuhan | Komponen aplikasi | Komponen Nuxt UI terkait |
| --- | --- | --- |
| Judul dan tab route | Header, HeaderTab | UButton, UBadge |
| Navigasi desktop/mobile | Sidebar, MobileSidebar, UserPopover | UButton, UAvatar |
| Tabel dan query | DataTable | UTable, UPagination, UInput |
| Form user | user/FormFields, AddModal, UpdateModal | UForm, UFormField, UInput, USwitch, UModal |
| Konfirmasi | DeleteModal | UModal, UButton |
| Tanggal | DateInput | UInputDate, UPopover, UCalendar |
| Status | ContentStatusBadge | UBadge |
| Summary/timeline | content/JobSummary | UCard, UTimeline, UAccordion |
| Foto detail | content/AssetSlider | UCarousel, UButton |
| Gallery/infinite scroll | content/MediaGallery, InfiniteScroll | UButton |
| Preview gambar | ImagePreview, ImageLightbox, useLightbox | UModal, UButton |
| Preview privat/progresif | content/PrivateImage, ProgressiveImage | ImagePreview |
| Editor | content-review/EditorForm, PreviewPanel, RankingsPanel | UForm, UCard, UButton |
| Review/history | content-review/ReviewForm, ReviewHistory | Form dan badge |
| Feedback aksi | useToast, useServiceError | Toast Nuxt UI |

Nama path lengkap mengikuti `app/components/`; Nuxt auto-import menyertakan prefix folder, misalnya `content/JobSummary.vue` digunakan sebagai ContentJobSummary. Jangan menduplikasi komponen global dengan versi fitur yang hanya mengganti label.
