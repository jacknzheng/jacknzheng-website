import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
  head: () => ({
    meta: [{ title: 'About — Jack Neo Zheng' }],
  }),
})

function About() {
  return (
    <article className="max-w-[38rem]">
      <h1 className="font-serif text-[1.7rem] leading-snug font-normal text-ink italic">
        About
      </h1>
      <div className="mt-8 space-y-5 font-sans text-[0.98rem] leading-relaxed text-ink">
        <p>
          Jack Neo Zheng writes technical essays, essays, and memos. This page
          is a placeholder until a longer note belongs here.
        </p>
        <p className="text-muted">
          The site is a quiet index of that work. Nothing here is finished
          except the intention to keep adding to it.
        </p>
      </div>
    </article>
  )
}
