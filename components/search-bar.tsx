"use client"

import * as React from "react"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ENGINES = {
  baidu: {
    name: "百度",
    url: "https://www.baidu.com/s?wd=",
  },
  google: {
    name: "Google",
    url: "https://www.google.com/search?q=",
  },
  bing: {
    name: "Bing",
    url: "https://www.bing.com/search?q=",
  },
}

type EngineKey = keyof typeof ENGINES

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const [engine, setEngine] = React.useState<EngineKey>("baidu")
  const [query, setQuery] = React.useState("")

  const handleSearch = () => {
    if (!query.trim()) return
    const url = ENGINES[engine].url + encodeURIComponent(query)
    window.open(url, "_blank")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-3xl items-center gap-2 rounded-2xl border border-border/75 bg-background/72 p-2 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.45)] backdrop-blur",
        className,
      )}
    >
      <Select value={engine} onValueChange={(value: EngineKey) => setEngine(value)}>
        <SelectTrigger className="h-11 w-[112px] rounded-xl border-border/70 bg-card/80 text-foreground">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="baidu">百度</SelectItem>
          <SelectItem value="google">Google</SelectItem>
          <SelectItem value="bing">Bing</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative min-w-0 flex-1">
        <Input
          type="text"
          placeholder={`Search with ${ENGINES[engine].name}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-11 rounded-xl border-border/70 bg-card/80 pr-12 text-base placeholder:text-muted-foreground/90"
        />
        <Button
          size="icon"
          variant="default"
          className="absolute right-1.5 top-1.5 h-8 w-8 rounded-lg"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
