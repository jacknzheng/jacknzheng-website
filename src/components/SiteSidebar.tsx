import { Link, useLocation } from '@tanstack/react-router'

const navItems = [
  { to: '/technical-essays', label: 'Technical Essays' },
  { to: '/essays', label: 'Essays' },
  { to: '/memos', label: 'Memos' },
  { to: '/about', label: 'About' },
] as const

const socialItems = [
  { href: 'https://jackneozheng.substack.com/', label: 'Substack' },
  { href: 'https://www.linkedin.com/in/jacknzheng', label: 'LinkedIn' },
  { href: 'https://x.com/jacknzheng', label: 'X' },
  { href: 'https://github.com/jacknzheng', label: 'GitHub' },
] as const

export function SiteSidebar() {
  const pathname = useLocation({
    select: (location) => location.pathname.replace(/\/$/, '') || '/',
  })

  return (
    <aside className="md:sticky md:top-0 md:self-start md:pt-16 md:pb-16">
      <Link
        to="/"
        className="font-serif text-[1.65rem] leading-tight text-ink no-underline"
      >
        Jack Neo Zheng
      </Link>
      <nav className="mt-8 flex flex-col gap-2.5 md:mt-10">
        {navItems.map((item) => {
          const isActive = pathname === item.to
          const isFilter = item.to !== '/about'

          return (
            <Link
              key={item.to}
              to={isFilter && isActive ? '/' : item.to}
              resetScroll={!isFilter}
              aria-label={
                isFilter
                  ? `${isActive ? 'Clear' : 'Apply'} ${item.label} filter`
                  : undefined
              }
              className={`w-fit font-sans text-[0.95rem] tracking-tight no-underline ${
                isActive
                  ? 'text-ink underline decoration-ink underline-offset-[5px]'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <nav className="mt-8 flex flex-col gap-2.5" aria-label="Social">
        {socialItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="w-fit font-sans text-[0.95rem] tracking-tight text-muted no-underline hover:text-ink"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
