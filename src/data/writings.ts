import type { ComponentType } from 'react'
import KMaxwellMomentum from '#/content/k-maxwell-momentum'

export const categories = [
  'Technical Essays',
  'Essays',
  'Memos',
] as const

export type Category = (typeof categories)[number]

export type Writing = {
  slug: string
  title: string
  category: Category
  image: string
  excerpt: string
}

export const writings: Writing[] = [
  {
    slug: 'k-maxwell-momentum',
    title: 'K-Maxwell Momentum',
    category: 'Technical Essays',
    image: '/images/k-maxwell/momentum-cover.png',
    excerpt:
      'One momentum method, two stronger nanoGPT results: 90 fewer training steps on Muon and 60 fewer on MuonH. Explore the measurements and changing memory interactively.',
  },
]

// Kept out of `Writing` so loader data stays serializable across the SSR
// boundary; components are looked up by slug at render time.
export const writingComponents: Record<string, ComponentType> = {
  'k-maxwell-momentum': KMaxwellMomentum,
}

export function writingsByCategory(category: Category) {
  return writings.filter((writing) => writing.category === category)
}

export function writingBySlug(slug: string) {
  return writings.find((writing) => writing.slug === slug)
}

export const categoryPath = {
  'Technical Essays': '/technical-essays',
  Essays: '/essays',
  Memos: '/memos',
} as const
