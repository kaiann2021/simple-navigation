"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"

interface WebDavConfig {
  url: string
  username: string
  password: string
}

interface WebDavConfigDialogProps {
  onSync: (categories: any[]) => void
}

export function WebDavConfigDialog({ onSync }: WebDavConfigDialogProps) {
  const [config, setConfig] = useState<WebDavConfig>({ url: "", username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const savedConfig = localStorage.getItem("webdav-config")
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (e) {
        console.error("Failed to parse webdav config", e)
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("webdav-config", JSON.stringify(config))
    alert("WebDAV Configuration saved.")
  }

  const handleSync = async () => {
    if (!config.url || !config.username || !config.password) {
      alert("Please fill in all WebDAV fields.")
      return
    }

    setLoading(true)
    try {
      // Safe Base64 encoding for UTF-8 strings
      const authString = `${config.username}:${config.password}`
      const encodedAuth = btoa(encodeURIComponent(authString).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode(parseInt(p1, 16))
        }))

      const response = await fetch(config.url, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${encodedAuth}`,
          "Cache-Control": "no-cache",
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: 'omit'
      })

      if (!response.ok) {
        throw new Error(`WebDAV request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      if (Array.isArray(data)) {
        onSync(data)
        // Also save the data itself to local storage as the current working copy
        localStorage.setItem("nav-categories", JSON.stringify(data))
        // And save the config if it wasn't already
        localStorage.setItem("webdav-config", JSON.stringify(config))
        alert("Categories successfully downloaded and updated!")
        setOpen(false)
      } else {
        throw new Error("Invalid JSON format: expected an array of categories.")
      }
    } catch (error: any) {
      console.error("Sync error:", error)
      alert(`Sync failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="WebDAV Download">
          <Download className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>WebDAV Download</DialogTitle>
          <DialogDescription>
            Enter your WebDAV details to download your categories JSON file.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              JSON URL
            </Label>
            <Input
              id="url"
              placeholder="https://example.com/dav/categories.json"
              className="col-span-3"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              className="col-span-3"
              value={config.username}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              className="col-span-3"
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={handleSave}>Save Config</Button>
          <Button onClick={handleSync} disabled={loading}>
            {loading ? "Downloading..." : "Download & Apply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
