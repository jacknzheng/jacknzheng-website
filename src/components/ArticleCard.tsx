import { Link } from '@tanstack/react-router'
import type { Writing } from '#/data/writings'

export function ArticleCard({ writing }: { writing: Writing }) {
  return (
    <Link
      to="/writings/$slug"
      params={{ slug: writing.slug }}
      className="group flex items-start justify-between gap-6 border-t border-rule py-8 no-underline"
    >
      <div className="min-w-0 pr-2">
        <h2 className="font-serif text-[1.35rem] leading-snug font-normal text-ink italic group-hover:underline group-hover:underline-offset-4">
          {writing.title}
        </h2>
        <p className="mt-2 font-sans text-[0.85rem] text-muted">
          {writing.category}
        </p>
      </div>
      <img
        src={writing.image}
        alt=""
        className="h-[4.75rem] w-[6.25rem] shrink-0 object-cover"
      />
    </Link>
  )
}
