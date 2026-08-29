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
    slug: 'notes-on-training-small-models',
    title: 'Notes on Training Small Models',
    category: 'Technical Essays',
    image: '/images/small-models.svg',
    excerpt:
      'What actually moves the needle when you cannot scale compute, and which knobs are mostly theater.',
  },
  {
    slug: 'what-a-kernel-actually-does',
    title: 'What a Kernel Actually Does',
    category: 'Technical Essays',
    image: '/images/kernel.svg',
    excerpt:
      'A walk through memory, scheduling, and the thin line between hardware and a process that thinks it owns the machine.',
  },
  {
    slug: 'on-keeping-a-notebook',
    title: 'On Keeping a Notebook',
    category: 'Essays',
    image: '/images/notebook.svg',
    excerpt:
      'Half the value of writing things down is finding them again when you have become a different person.',
  },
  {
    slug: 'cities-at-dusk',
    title: 'Cities at Dusk',
    category: 'Essays',
    image: '/images/dusk.svg',
    excerpt:
      'The hour when a city stops performing for itself and starts looking like a set of lights someone forgot to turn off.',
  },
  {
    slug: 'a-working-definition-of-taste',
    title: 'A Working Definition of Taste',
    category: 'Memos',
    image: '/images/taste.svg',
    excerpt:
      'Taste is not preference. It is the ability to notice when something is slightly wrong and to care enough to fix it.',
  },
  {
    slug: 'why-i-write-in-public',
    title: 'Why I Write in Public',
    category: 'Memos',
    image: '/images/public.svg',
    excerpt:
      'Publishing is a forcing function. It turns a private loop of thought into something that can be disagreed with.',
  },
]

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
