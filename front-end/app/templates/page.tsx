"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ArrowLeft, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { STRATEGY_TEMPLATES } from "@/lib/strategy-templates-data"
import { saveVersion } from "@/lib/version-manager"

const TEMPLATES = STRATEGY_TEMPLATES
const CATEGORIES = ["All", ...new Set(TEMPLATES.map((t) => t.category))]
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"]

export default function TemplatesPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "All" || template.difficulty === selectedDifficulty
      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }, [search, selectedCategory, selectedDifficulty])

  const handleLoadTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId)

    if (!template) {
      alert("Template not found!")
      return
    }

    try {
      // Load the template into localStorage
      localStorage.setItem("strategy-builder-nodes", JSON.stringify(template.nodes))
      localStorage.setItem("strategy-builder-edges", JSON.stringify(template.edges))
      localStorage.setItem("strategy-builder-metadata", JSON.stringify(template.metadata))

      // Save as a new version
      saveVersion(template.nodes, template.edges, template.metadata, `Loaded template: ${template.name}`)

      // Navigate to editor
      window.location.href = "/editor"
    } catch (error) {
      console.error("Failed to load template:", error)
      alert("Failed to load template. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">

      <Navbar/>

      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-12 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Strategy Templates</h1>
              <p className="text-muted-foreground mt-1">
                {TEMPLATES.length} pre-built strategies ready to load into the editor
              </p>
            </div>
            <Link href="/editor">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Editor
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-50 space-y-6">
              {/* Search */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Find templates..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-card border-border"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-[#00B8E6] hover:bg-[#009FCC] text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-card hover:text-foreground"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Difficulty</h3>
                <div className="space-y-2">
                  {DIFFICULTIES.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedDifficulty === difficulty
                          ? "bg-[#00B8E6] hover:bg-[#009FCC] text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-card hover:text-foreground"
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""} found
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="lg:col-span-3">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="group overflow-hidden border border-border bg-card hover:bg-card/80 hover:border-[#00B8E6]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(102,187,255,0.15)]"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-40 bg-muted overflow-hidden">
                      <img
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold group-hover:text-[#00B8E6] transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{template.category}</p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                            template.difficulty === "Beginner"
                              ? "bg-green-500/20 text-green-400"
                              : template.difficulty === "Intermediate"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {template.difficulty}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>

                      {/* Stats */}
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-foreground">{template.nodes.length}</span>
                          <span>block{template.nodes.length !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-foreground">{template.metadata.tags.length}</span>
                          <span>tag{template.metadata.tags.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleLoadTemplate(template.id)}
                        className="w-full bg-[#00B8E6] hover:bg-[#009FCC] text-accent-foreground font-medium"
                      >
                        Load Template
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer/>

    </div>
  )
}
