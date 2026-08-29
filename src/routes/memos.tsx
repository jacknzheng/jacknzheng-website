import { createFileRoute } from '@tanstack/react-router'
import { ArticleGrid } from '#/components/ArticleGrid'
import { writingsByCategory } from '#/data/writings'

export const Route = createFileRoute('/memos')({
  component: Memos,
  head: () => ({
    meta: [{ title: 'Memos — Jack Neo Zheng' }],
  }),
})

function Memos() {
  return <ArticleGrid writings={writingsByCategory('Memos')} />
}
