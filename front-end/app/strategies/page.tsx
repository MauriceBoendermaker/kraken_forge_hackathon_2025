"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Copy, Trash2, AlertCircle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { getVersionHistory, refreshVersionTimestamps, type StrategyVersion } from "@/lib/version-manager"

interface Strategy {
  id: string
  name: string
  version: string
  lastUpdated: string
  tags: string[]
  description: string
  versionData: StrategyVersion
}

export default function StrategiesPage() {
  const [search, setSearch] = useState("")
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(true)

  // Load strategies from version history
  useEffect(() => {
    loadStrategies()

    // Refresh timestamps every 30 seconds
    const interval = setInterval(() => {
      loadStrategies()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadStrategies = () => {
    const versionHistory = refreshVersionTimestamps()

    // Group by strategy name and keep only the latest version of each
    const strategyMap = new Map<string, StrategyVersion>()

    versionHistory.forEach(version => {
      const strategyName = version.metadata.name
      const existing = strategyMap.get(strategyName)

      // If we don't have this strategy yet, or this version is newer (appears first in array)
      if (!existing) {
        strategyMap.set(strategyName, version)
      }
    })

    // Convert to strategy format
    const loadedStrategies: Strategy[] = Array.from(strategyMap.values()).map(version => ({
      id: version.id,
      name: version.metadata.name,
      version: version.versionNumber,
      lastUpdated: version.timestamp,
      tags: version.metadata.tags || [],
      description: version.metadata.description || "No description",
      versionData: version,
    }))

    setStrategies(loadedStrategies)
    setLoading(false)
  }

  const handleClone = (strategy: Strategy) => {
    // Load the strategy into localStorage and navigate to editor
    const version = strategy.versionData

    try {
      localStorage.setItem("strategy-builder-nodes", JSON.stringify(version.nodes))
      localStorage.setItem("strategy-builder-edges", JSON.stringify(version.edges))

      // Clone with a new name
      const clonedMetadata = {
        ...version.metadata,
        name: `${version.metadata.name} (Copy)`,
      }
      localStorage.setItem("strategy-builder-metadata", JSON.stringify(clonedMetadata))

      // Navigate to editor
      window.location.href = "/editor"
    } catch (error) {
      console.error("Failed to clone strategy:", error)
      alert("Failed to clone strategy. Please try again.")
    }
  }

  const handleDelete = (strategyId: string, strategyName: string) => {
    if (confirm(`Are you sure you want to delete "${strategyName}"? This will remove all versions of this strategy from your version history.`)) {
      try {
        const versionHistory = getVersionHistory()

        // Remove all versions with this strategy name
        const updatedHistory = versionHistory.filter(
          version => version.metadata.name !== strategyName
        )

        // Save back to localStorage
        localStorage.setItem("strategy-version-history", JSON.stringify(updatedHistory))

        // Reload strategies
        loadStrategies()

        alert(`Successfully deleted "${strategyName}"`)
      } catch (error) {
        console.error("Failed to delete strategy:", error)
        alert("Failed to delete strategy. Please try again.")
      }
    }
  }

  const handleEdit = (strategy: Strategy) => {
    // Load the strategy into localStorage and navigate to editor
    const version = strategy.versionData

    try {
      localStorage.setItem("strategy-builder-nodes", JSON.stringify(version.nodes))
      localStorage.setItem("strategy-builder-edges", JSON.stringify(version.edges))
      localStorage.setItem("strategy-builder-metadata", JSON.stringify(version.metadata))

      // Navigate to editor
      window.location.href = "/editor"
    } catch (error) {
      console.error("Failed to load strategy:", error)
      alert("Failed to load strategy. Please try again.")
    }
  }

  const filteredStrategies = strategies.filter((strategy) => {
    const matchesSearch = strategy.name.toLowerCase().includes(search.toLowerCase()) ||
                         strategy.description.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading strategies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <Navbar/>

      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-12 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Trading Strategies</h1>
              <p className="text-muted-foreground mt-1">
                {strategies.length > 0
                  ? `${strategies.length} saved strateg${strategies.length !== 1 ? "ies" : "y"} from version history`
                  : "Manage and edit your trading strategies"}
              </p>
            </div>
            <Link href="/version-history">
              <Button variant="outline" className="gap-2">
                View Version History
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search strategies by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-card border-border"
          />
          <Link href="/editor">
            <Button className="gap-2 bg-[#00B8E6] hover:bg-[#009FCC] text-accent-foreground whitespace-nowrap">
              <Plus className="w-4 h-4" />
              New Strategy
            </Button>
          </Link>
        </div>

        {/* Stats */}
        {strategies.length > 0 && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{strategies.length} strateg{strategies.length !== 1 ? "ies" : "y"} total</span>
            {filteredStrategies.length !== strategies.length && (
              <span>• {filteredStrategies.length} matching search</span>
            )}
          </div>
        )}

        {/* Strategies List */}
        <div className="space-y-3">
          {filteredStrategies.length === 0 ? (
            <Card className="p-12 text-center border border-border bg-card">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No strategies found</h3>
              <p className="text-muted-foreground mb-6">Create your first strategy to get started</p>
              <Link href="/editor">
                <Button className="gap-2 bg-[#00B8E6] hover:bg-[#009FCC] text-accent-foreground">
                  <Plus className="w-4 h-4" />
                  New Strategy
                </Button>
              </Link>
            </Card>
          ) : (
            filteredStrategies.map((strategy) => (
              <Card
                key={strategy.id}
                className="p-5 border border-border bg-card hover:bg-card/80 hover:border-[#00B8E6]/50 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-[#00B8E6] transition-colors">
                        {strategy.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        v{strategy.version}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-xs text-muted-foreground">Updated {strategy.lastUpdated}</span>
                      {strategy.tags.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {strategy.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-[#00B8E6]/10 text-[#00B8E6] rounded text-xs border border-[#00B8E6]/30 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(strategy)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Edit strategy"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClone(strategy)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Clone strategy"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(strategy.id, strategy.name)}
                      className="text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                      title="Delete strategy"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Footer/>

    </div>
  )
}
