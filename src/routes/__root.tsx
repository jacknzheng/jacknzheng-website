import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { SiteSidebar } from '#/components/SiteSidebar'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Jack Neo Zheng',
      },
      {
        name: 'description',
        content: 'Technical essays, essays, and memos by Jack Neo Zheng.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1180px] px-6 py-10 md:px-10 md:py-6 lg:px-14">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[220px_minmax(0,1fr)] md:gap-16 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-24">
        <SiteSidebar />
        <main className="min-w-0 md:pt-16 md:pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <p className="font-serif text-[1.35rem] text-ink italic">Not found.</p>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {import.meta.env.DEV ? (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}
