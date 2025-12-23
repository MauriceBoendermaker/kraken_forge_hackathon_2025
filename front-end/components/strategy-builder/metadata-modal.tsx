"use client"

import { MetadataModalProps } from "@/interfaces/MetadataModalProps"
import { getVersionHistory } from "@/lib/version-manager"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

export function MetadataModal({ open, onOpenChange, metadata, onSave }: MetadataModalProps) {
  const [formData, setFormData] = useState(metadata)
  const [tagInput, setTagInput] = useState("")
  const [currentVersion, setCurrentVersion] = useState("1.0")

  // Sync formData with incoming metadata prop
  useEffect(() => {
    setFormData(metadata)
  }, [metadata])

  // Load current version from history when modal opens
  useEffect(() => {
    if (open) {
      const history = getVersionHistory()
      if (history.length > 0) {
        // The first version in history is the current one
        setCurrentVersion(history[0].versionNumber)
      } else {
        // If no history, next version will be 1.0
        setCurrentVersion("1.0")
      }
    }
  }, [open])

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const handleSave = () => {
    // Update version to match current version from history
    const updatedFormData = {
      ...formData,
      version: currentVersion,
    }
    onSave(updatedFormData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-sidebar border-sidebar-border max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-sidebar-foreground">Strategy Metadata</DialogTitle>
          <p className="text-xs text-muted-foreground">Configure global strategy information</p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2 bg-sidebar-accent/30 p-3 rounded-md border border-sidebar-border/50">
            <Label className="text-xs font-semibold text-sidebar-foreground">Strategy Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. BTC DCA Strategy"
              className="bg-card border-sidebar-border text-card-foreground text-sm"
            />
          </div>

          <div className="space-y-2 bg-sidebar-accent/30 p-3 rounded-md border border-sidebar-border/50">
            <Label className="text-xs font-semibold text-sidebar-foreground">Description</Label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your strategy..."
              className="w-full h-20 bg-card border border-sidebar-border text-card-foreground text-sm rounded-md p-2 resize-none focus:outline-none focus:border-sidebar-primary"
            />
          </div>

          <div className="space-y-2 bg-sidebar-accent/30 p-3 rounded-md border border-sidebar-border/50">
            <Label className="text-xs font-semibold text-sidebar-foreground">Version</Label>
            <div className="flex items-center gap-2">
              <Input
                value={currentVersion}
                readOnly
                disabled
                className="bg-muted border-sidebar-border text-muted-foreground text-sm cursor-not-allowed"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">Auto-managed</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Version numbers are automatically managed from version history
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-sidebar-foreground">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Add a tag..."
                className="flex-1 bg-card border-sidebar-border text-card-foreground text-sm"
              />
              <Button onClick={handleAddTag} size="sm" className="bg-sidebar-primary hover:bg-sidebar-primary/90">
                Add
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.tags.map((tag) => (
                  <Card
                    key={tag}
                    className="inline-flex items-center gap-2 px-2.5 py-1 bg-sidebar-primary/20 border-sidebar-primary/40 text-sidebar-primary text-xs font-medium group hover:bg-sidebar-primary/30 transition-colors"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="opacity-60 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="space-y-2 sm:space-y-0 sm:gap-2">
          <Button onClick={() => onOpenChange(false)} variant="outline" className="text-sm">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar text-sm font-medium"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
