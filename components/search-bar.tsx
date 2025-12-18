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

const ENGINES = {
  baidu: {
    name: "百度",
    url: "https://www.baidu.com/s?wd=",
    color: "text-blue-600",
  },
  google: {
    name: "Google",
    url: "https://www.google.com/search?q=",
    color: "text-red-500",
  },
  bing: {
    name: "Bing",
    url: "https://www.bing.com/search?q=",
    color: "text-blue-500",
  },
}

type EngineKey = keyof typeof ENGINES

export function SearchBar() {
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
    <div className="mx-auto w-full max-w-2xl flex items-center space-x-2">
      <Select value={engine} onValueChange={(value: EngineKey) => setEngine(value)}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="baidu">百度</SelectItem>
          <SelectItem value="google">Google</SelectItem>
          <SelectItem value="bing">Bing</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={`Search with ${ENGINES[engine].name}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-10"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  )
}
