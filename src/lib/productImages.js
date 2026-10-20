// Category fallback images - these always work (placehold.co generates on-the-fly)
const CAT_IMAGES = {
  printers:    'https://placehold.co/600x450/FFF3E8/FF6B00?text=Thermal+Printer&font=inter',
  scanners:    'https://placehold.co/600x450/F0F9FF/0284C7?text=Barcode+Scanner&font=inter',
  terminals:   'https://placehold.co/600x450/F5F3FF/7C3AED?text=POS+Terminal&font=inter',
  accessories: 'https://placehold.co/600x450/F0FDF4/16A34A?text=Accessory&font=inter',
}

// Once you upload your own product photos to imgbb.com,
// add them here: 'product-slug': 'https://i.ibb.co/xxxxx/photo.jpg'
export const productImages = {}

export function getProductImages(product) {
  if (!product) return []

  const images = [
    product.primary_image,
    ...(Array.isArray(product.images) ? product.images : []),
    productImages[product.slug],
  ].filter(Boolean)

  return [...new Set(images)]
}

export function getProductImage(product) {
  if (!product) return ''
  const images = getProductImages(product)
  if (images[0]) return images[0]

  return CAT_IMAGES[product.category] || 'https://placehold.co/600x450/F3F4F6/9CA3AF?text=No+Image&font=inter'
}

export default productImages
