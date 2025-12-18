"use client"

import { useState, useEffect, useRef } from "react"
import { NavigationSection } from "@/components/navigation-section"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchBar } from "@/components/search-bar"
import { FolderDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import defaultCategories from "../data/example.json"

import { SettingsDialog, type FontSize, type LinkTarget } from "@/components/settings-dialog"
import { WebDavConfigDialog } from "@/components/webdav-config-dialog"

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
    // Load Categories
    const savedCategories = localStorage.getItem("nav-categories")
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories))
      } catch (e) {
        console.error("Failed to parse saved categories", e)
      }
    }

    // Load Settings
    const savedSettings = localStorage.getItem("nav-app-settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Failed to parse saved settings", e)
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
          // Optional: clear the input so the same file can be selected again if needed
          if (fileInputRef.current) fileInputRef.current.value = ''
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
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-end gap-2 mb-4">
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
          >
            <FolderDown className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
        <div className="mb-12 flex justify-center">
          <SearchBar />
        </div>
        <div className="space-y-8">
          {categories.map((category) => (
            <NavigationSection
              key={category.title}
              title={category.title}
              links={category.links}
              fontSize={settings.fontSize}
              linkTarget={settings.linkTarget}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
