interface NavigationLink {
  name: string
  url: string
}


interface NavigationSectionProps {
  title: string
  links: NavigationLink[]
  fontSize?: string
  linkTarget?: string
}

export function NavigationSection({
  title,
  links,
  fontSize = "text-base",
  linkTarget = "_self"
}: NavigationSectionProps) {
  return (
    <section>
      <h2 className={`mb-3 font-medium text-muted-foreground ${fontSize}`}>{title}</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 lg:grid-cols-6">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target={linkTarget}
            rel="noopener noreferrer"
            className={`text-foreground transition-colors hover:text-primary hover:underline ${fontSize}`}
          >
            {link.name}
          </a>
        ))}
      </div>
    </section>
  )
}
