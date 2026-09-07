import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { categoryPath, writingBySlug } from '#/data/writings'
import kMaxwellContent from '#/content/k-maxwell-momentum.html?raw'

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
      { name: 'description', content: loaderData?.writing.excerpt },
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
      {writing.slug === 'k-maxwell-momentum' && (
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: kMaxwellContent }}
        />
      )}
    </article>
  )
}
