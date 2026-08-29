import { createFileRoute } from '@tanstack/react-router'
import { ArticleGrid } from '#/components/ArticleGrid'
import { writingsByCategory } from '#/data/writings'

export const Route = createFileRoute('/essays')({
  component: Essays,
  head: () => ({
    meta: [{ title: 'Essays — Jack Neo Zheng' }],
  }),
})

function Essays() {
  return <ArticleGrid writings={writingsByCategory('Essays')} />
}
