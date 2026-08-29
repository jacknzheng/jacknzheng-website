import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { categoryPath, writingBySlug } from '#/data/writings'

export const Route = createFileRoute('/writings/$slug')({
  loader: ({ params }) => {
    const writing = writingBySlug(params.slug)
    if (!writing) {
      throw notFound()
    }
    return { writing }
  },
  component: WritingPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.writing.title} — Jack Neo Zheng`
          : 'Jack Neo Zheng',
      },
    ],
  }),
})

function WritingPage() {
  const { writing } = Route.useLoaderData()

  return (
    <article className="max-w-[40rem]">
      <p className="font-sans text-[0.85rem] text-muted">
        <Link
          to={categoryPath[writing.category]}
          className="text-muted no-underline hover:text-ink"
        >
          {writing.category}
        </Link>
      </p>
      <h1 className="mt-3 font-serif text-[2rem] leading-snug font-normal text-ink italic">
        {writing.title}
      </h1>
      <img
        src={writing.image}
        alt=""
        className="mt-8 aspect-[4/3] w-full max-w-md object-cover"
      />
      <p className="mt-8 font-sans text-[1rem] leading-relaxed text-ink">
        {writing.excerpt}
      </p>
      <p className="mt-6 font-sans text-[0.95rem] leading-relaxed text-muted">
        Placeholder text. The finished piece will live here.
      </p>
    </article>
  )
}
