import type { Writing } from '#/data/writings'
import { ArticleCard } from './ArticleCard'

export function ArticleGrid({ writings }: { writings: Writing[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
      {writings.map((writing) => (
        <ArticleCard key={writing.slug} writing={writing} />
      ))}
    </div>
  )
}
