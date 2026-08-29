import { createFileRoute } from '@tanstack/react-router'
import { ArticleGrid } from '#/components/ArticleGrid'
import { writingsByCategory } from '#/data/writings'

export const Route = createFileRoute('/technical-essays')({
  component: TechnicalEssays,
  head: () => ({
    meta: [{ title: 'Technical Essays — Jack Neo Zheng' }],
  }),
})

function TechnicalEssays() {
  return <ArticleGrid writings={writingsByCategory('Technical Essays')} />
}
