/** Local image assets — bundled in /public/images for fast, reliable loading */

export const images = {
  hero: '/images/preme.jpg',
  about: '/images/aboto.jpg',
  categories: {
    saltwater: '/images/categories/saltwater.svg',
    freshwater: '/images/categories/freshwater.svg',
    nano: '/images/categories/nano.svg',
    custom: '/images/categories/custom.svg',
    accessories: '/images/categories/accessories.svg',
  },
  products: {
     azule: '/images/products/azule.jpg',
    'azure-reef-120': '/images/products/azure-reef-120.svg',
     serin: '/images/products/serin.jpg',
    'serenity-fresh-75': '/images/products/serenity-fresh-75.svg',
     coral: '/images/products/coral.jpg',
    'coral-mini-20': '/images/products/coral-mini-20.svg',
    'deep-blue-custom': '/images/products/deep-blue-custom.svg',
     cani: '/images/products/cani.jpg',
    'tidal-pro-filter': '/images/products/tidal-pro-filter.svg',
     led: '/images/products/led.jpg',
    'reef-spectrum-led': '/images/products/reef-spectrum-led.svg',
     lagoon: '/images/products/lagoon.jpg',
    'lagoon-salt-90': '/images/products/lagoon-salt-90.svg',
     zen: '/images/products/zen.jpg',
    'zen-planted-40': '/images/products/zen-planted-40.svg',
  },
} as const

export function productImage(slug: string): string {
  return images.products[slug as keyof typeof images.products] ?? '/images/products/default.svg'
}

export function productGallery(slug: string): string[] {
  const main = productImage(slug)
  const extras: Record<string, string[]> = {
    'azure-reef-120': ['/images/gallery/reef-corals.svg', '/images/gallery/reef-fish.svg'],
    'serenity-fresh-75': ['/images/gallery/planted-tank.svg'],
    'coral-mini-20': ['/images/gallery/nano-shrimp.svg'],
    'deep-blue-custom': ['/images/gallery/custom-room.svg'],
  }
  return [main, ...(extras[slug] ?? [])]
}

export function categoryImage(category: keyof typeof images.categories): string {
  return images.categories[category]
}
