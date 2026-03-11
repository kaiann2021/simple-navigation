"use client"

import { useState, useEffect, useRef } from "react"
import { FolderDown } from "lucide-react"
import { NavigationSection } from "@/components/navigation-section"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { SettingsDialog, type FontSize, type LinkTarget } from "@/components/settings-dialog"
import { WebDavConfigDialog } from "@/components/webdav-config-dialog"
import defaultCategories from "../data/example.json"

interface Category {
  title: string
  links: { name: string; url: string }[]
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [settings, setSettings] = useState<{ fontSize: FontSize; linkTarget: LinkTarget }>({
    fontSize: "text-base",
    linkTarget: "_self",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedCategories = localStorage.getItem("nav-categories")
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories))
      } catch (error) {
        console.error("Failed to parse saved categories", error)
      }
    }

    const savedSettings = localStorage.getItem("nav-app-settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to parse saved settings", error)
      }
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = JSON.parse(content)
        if (Array.isArray(parsed)) {
          setCategories(parsed)
          localStorage.setItem("nav-categories", content)
          if (fileInputRef.current) fileInputRef.current.value = ""
        } else {
          alert("Invalid category file format")
        }
      } catch (error) {
        alert("Failed to parse JSON file")
      }
    }
    reader.readAsText(file)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -left-32 top-8 h-72 w-72 rounded-full bg-primary/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-chart-2/18 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="deck-fade-in rounded-[24px] border border-border/80 bg-card/75 px-4 py-4 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:px-5 sm:py-5">
          <div className="flex items-center gap-3">
            <SearchBar className="mx-0 max-w-none flex-1" />
            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-border/70 bg-background/55 p-2 backdrop-blur">
              <SettingsDialog initialSettings={settings} onSettingsChange={setSettings} />
              <WebDavConfigDialog onSync={setCategories} />
              <ModeToggle />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                title="Import Categories JSON"
                className="rounded-xl border-border/70 bg-background/75 hover:bg-accent/80"
              >
                <FolderDown className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </div>
          </div>
        </header>
        <div className="mt-6 columns-1 sm:columns-2 xl:columns-3 [column-gap:1.25rem]">
          {categories.map((category, index) => (
            <NavigationSection
              key={category.title}
              title={category.title}
              links={category.links}
              fontSize={settings.fontSize}
              linkTarget={settings.linkTarget}
              index={index}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
