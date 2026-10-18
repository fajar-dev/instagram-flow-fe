export function useLightbox() {
  const lightboxOpen = useState('lightbox-open', () => false)
  const lightboxImage = useState('lightbox-image', () => '')
  const lightboxAlt = useState('lightbox-alt', () => '')

  function openLightbox(src: string, alt = '') {
    if (!src) return
    lightboxImage.value = src
    lightboxAlt.value = alt
    lightboxOpen.value = true
  }

  function closeLightbox() {
    lightboxOpen.value = false
  }

  return { lightboxOpen, lightboxImage, lightboxAlt, openLightbox, closeLightbox }
}
