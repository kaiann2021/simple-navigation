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
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"

export type FontSize = "text-sm" | "text-base" | "text-lg" | "text-xl" | "text-2xl"
export type LinkTarget = "_self" | "_blank"

interface Settings {
  fontSize: FontSize
  linkTarget: LinkTarget
}

interface SettingsDialogProps {
  onSettingsChange: (settings: Settings) => void
  initialSettings: Settings
}

export function SettingsDialog({ onSettingsChange, initialSettings }: SettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>(initialSettings)

  // Sync state with props when dialog opens or props change
  useEffect(() => {
    setSettings(initialSettings)
  }, [initialSettings, open])

  const handleSave = () => {
    onSettingsChange(settings)
    localStorage.setItem("nav-app-settings", JSON.stringify(settings))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Appearance Settings">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Appearance Settings</DialogTitle>
          <DialogDescription>
            Customize the look and feel of your navigation page.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="font-size" className="text-right">
              Font Size
            </Label>
            <select
              id="font-size"
              className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors data-[placeholder]:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={settings.fontSize}
              onChange={(e) => setSettings({ ...settings, fontSize: e.target.value as FontSize })}
            >
              <option value="text-sm">Small</option>
              <option value="text-base">Medium (Default)</option>
              <option value="text-lg">Large</option>
              <option value="text-xl">Extra Large</option>
              <option value="text-2xl">Huge</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link-target" className="text-right">
              Open Links
            </Label>
            <select
              id="link-target"
              className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors data-[placeholder]:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={settings.linkTarget}
              onChange={(e) => setSettings({ ...settings, linkTarget: e.target.value as LinkTarget })}
            >
              <option value="_self">Current Tab</option>
              <option value="_blank">New Tab</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
