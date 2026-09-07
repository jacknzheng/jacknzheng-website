import { createFileRoute } from '@tanstack/react-router'
import AboutContent from '#/content/about'

export const Route = createFileRoute('/about')({
  component: About,
  head: () => ({
    meta: [
      { title: 'About — Jack Neo Zheng' },
      {
        name: 'description',
        content:
          'Jack Neo Zheng is doing pre-training and alignment research at South Park Commons.',
      },
    ],
  }),
})

function About() {
  return (
    <article className="max-w-[38rem]">
      <h1 className="font-serif text-[1.7rem] leading-snug font-normal text-ink italic">
        About
      </h1>
      <div className="article-body">
        <AboutContent />
      </div>
    </article>
  )
}
