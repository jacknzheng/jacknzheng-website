import { createFileRoute } from '@tanstack/react-router'
import { ArticleGrid } from '#/components/ArticleGrid'
import { writings } from '#/data/writings'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [{ title: 'Jack Neo Zheng' }],
  }),
})

function Home() {
  return <ArticleGrid writings={writings} />
}
