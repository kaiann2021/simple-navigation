interface NavigationLink {
  name: string
  url: string
}

interface NavigationSectionProps {
  title: string
  links: NavigationLink[]
  fontSize?: string
  linkTarget?: string
  index?: number
}

export function NavigationSection({
  title,
  links,
  fontSize = "text-base",
  linkTarget = "_self",
  index = 0,
}: NavigationSectionProps) {
  return (
    <section
      className="mb-5 break-inside-avoid rounded-3xl border border-border/80 bg-card/75 p-5 shadow-[0_20px_55px_-35px_rgba(30,58,138,0.45)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.52)] animate-[rise_500ms_ease-out_both]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`font-medium text-foreground [font-family:var(--font-display)] ${fontSize}`}>{title}</h2>
        <span className="rounded-full border border-border/80 bg-background/70 px-2.5 py-1 text-xs text-muted-foreground">
          {links.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target={linkTarget}
            rel="noopener noreferrer"
            className="group/link flex items-center justify-between rounded-xl border border-border/65 bg-background/62 px-3 py-2.5 transition-all duration-200 hover:border-primary/40 hover:bg-accent/70"
          >
            <span className={`truncate text-foreground ${fontSize}`}>{link.name}</span>
            <span className="text-xs text-muted-foreground transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:text-primary">
              ↗
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
