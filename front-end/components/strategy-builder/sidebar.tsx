"use client"

import type React from "react"

import { SidebarProps } from "@/interfaces/SidebarProps"
import { BlockCategory } from "@/types/BlockCategory"
import { CategoryKey } from "@/types/CategoryKey"
import { BLOCK_CATEGORIES } from "@/constants/BockCategories"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Plus, AlertCircle, Home, Save, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Sidebar({ onAddNode }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)

  const q = searchQuery.toLowerCase()

  const filteredCategories = (Object.entries(BLOCK_CATEGORIES) as Array<[CategoryKey, BlockCategory]>).reduce(
    (acc, [key, category]) => {
      const blocks = category.blocks.filter(
        (block) => block.label.toLowerCase().includes(q) || block.description.toLowerCase().includes(q),
      )

      if (blocks.length > 0) {
        acc[key] = { ...category, blocks }
      }

      return acc
    },
    {} as Partial<Record<CategoryKey, BlockCategory>>,
  )

  const filteredEntries = (Object.entries(filteredCategories) as Array<[CategoryKey, BlockCategory | undefined]>).filter(
    (entry): entry is [CategoryKey, BlockCategory] => Boolean(entry[1]),
  )

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, blockId: string) => {
    e.dataTransfer.effectAllowed = "move"
    setDraggedBlock(blockId)
  }

  const handleDragEnd = () => {
    setDraggedBlock(null)
  }

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden">
      <div className="sticky top-0 z-10 bg-sidebar border-b border-sidebar-border p-4 space-y-3">
        {/* Mini Navbar with Action Buttons */}
        <div className="flex items-center gap-2 mb-2">
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 h-8 text-xs border-sidebar-border hover:text-primary"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Button>
          </Link>
          <Link href="/templates">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 border-sidebar-border hover:text-primary"
              title="Templates"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link href="/settings">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 border-sidebar-border hover:text-primary"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <h2 className="text-sm font-semibold text-sidebar-foreground">Strategy Blocks</h2>
        <Input
          type="text"
          placeholder="Search blocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 bg-card border-sidebar-border text-card-foreground text-sm placeholder:text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">Drag blocks to canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <div className="flex items-center justify-center p-6 h-full">
            <p className="text-xs text-muted-foreground text-center">No blocks match your search</p>
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={["orders", "conditions"]} className="px-2 py-2">
            {filteredEntries.map(([key, category]) => {
              const Icon = category.icon

              return (
                <AccordionItem key={key} value={key} className="border-none">
                  <AccordionTrigger className="px-3 py-2.5 hover:bg-sidebar-accent/50 rounded-md text-xs font-semibold text-sidebar-foreground transition-colors">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${category.color}`} />
                      {category.label}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="space-y-2 pt-2 pb-2">
                    {category.blocks.map((block) => (
                      <Card
                        key={block.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, block.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onAddNode(block.id)}
                        className={`p-3 cursor-move bg-card border border-sidebar-border hover:border-sidebar-primary hover:bg-card/90 transition-all group ${
                          draggedBlock === block.id ? "opacity-50 border-sidebar-primary" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-card-foreground group-hover:text-sidebar-primary transition-colors">
                              {block.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{block.description}</p>
                          </div>
                          <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-sidebar-primary flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Card>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
      </div>

      <div className="sticky bottom-0 p-4 border-t border-sidebar-border bg-sidebar-accent/20 space-y-2">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-sidebar-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">Drag blocks to canvas or click to add</p>
        </div>
      </div>
    </div>
  )
}
