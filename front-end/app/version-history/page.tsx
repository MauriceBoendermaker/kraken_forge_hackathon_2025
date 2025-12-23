"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw, Clock, AlertCircle, Plus, Minus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getVersionHistory, restoreVersion, refreshVersionTimestamps, type StrategyVersion } from "@/lib/version-manager"

export default function VersionHistoryPage() {
  const [versions, setVersions] = useState<StrategyVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load version history from localStorage
    const loadVersions = () => {
      const history = refreshVersionTimestamps() // This updates relative timestamps
      setVersions(history)

      // Auto-select the first (current) version
      if (history.length > 0 && !selectedVersion) {
        setSelectedVersion(history[0].id)
      }

      setLoading(false)
    }

    loadVersions()

    // Refresh timestamps every 30 seconds
    const interval = setInterval(() => {
      const history = refreshVersionTimestamps()
      setVersions(history)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const activeVersion = versions.find((v) => v.id === selectedVersion)

  const handleRestore = (versionId: string) => {
    const version = versions.find(v => v.id === versionId)
    if (!version) return

    if (confirm(`Are you sure you want to restore to version ${version.versionNumber}? Current changes will be saved as a new version before restoring.`)) {
      const restored = restoreVersion(versionId)

      if (restored) {
        alert(`Successfully restored to version ${version.versionNumber}. Redirecting to editor...`)
        window.location.href = "/editor"
      } else {
        alert("Failed to restore version. Please try again.")
      }
    }
  }

  // Generate JSON diff between selected version and previous version
  const getJsonDiff = () => {
    if (!activeVersion) return { old: "", new: "" }

    const currentIndex = versions.findIndex(v => v.id === activeVersion.id)
    const previousVersion = currentIndex < versions.length - 1 ? versions[currentIndex + 1] : null

    const newJson = {
      name: activeVersion.metadata.name,
      version: activeVersion.versionNumber,
      nodes: activeVersion.nodes,
      edges: activeVersion.edges,
    }

    const oldJson = previousVersion ? {
      name: previousVersion.metadata.name,
      version: previousVersion.versionNumber,
      nodes: previousVersion.nodes,
      edges: previousVersion.edges,
    } : {}

    return {
      old: JSON.stringify(oldJson, null, 2),
      new: JSON.stringify(newJson, null, 2),
    }
  }

  const jsonDiff = getJsonDiff()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading version history...</p>
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
              <h1 className="text-3xl font-bold text-foreground">Version History</h1>
              <p className="text-muted-foreground mt-1">
                {versions.length > 0
                  ? `${versions.length} saved version${versions.length !== 1 ? "s" : ""} • ${activeVersion?.metadata.name || "Untitled Strategy"}`
                  : "View and restore previous strategy versions"}
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
        {/* Info Banner */}
        {versions.length === 0 ? (
          <Card className="p-12 text-center border border-border bg-card">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Version History</h3>
            <p className="text-muted-foreground mb-6">
              No saved versions found. Versions are created automatically when you Save, Run, or Validate your strategy.
            </p>
            <Link href="/editor">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go to Editor
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Local-only history for this strategy. Versions are saved automatically when you Save, Run, or Validate.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Version List */}
              <div className="lg:col-span-1">
                <Card className="border border-border bg-card">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Versions ({versions.length})
                    </h2>
                  </div>
                  <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                    {versions.map((version, idx) => (
                  <button
                    key={version.id}
                    onClick={() => setSelectedVersion(version.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedVersion === version.id
                        ? "border-[#00B8E6] bg-[#00B8E6]/10 shadow-sm"
                        : "border-border bg-card hover:bg-card/80"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">v{version.versionNumber}</span>
                          {version.status === "current" && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">{version.metadata.name}</p>
                        <p className="text-xs text-muted-foreground">{version.label}</p>
                        {version.metadata.tags && version.metadata.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {version.metadata.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 bg-[#00B8E6]/10 text-[#00B8E6] text-xs rounded border border-[#00B8E6]/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3" />
                      {version.timestamp}
                    </p>
                    {version.status !== "current" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRestore(version.id)
                        }}
                        className="w-full mt-3 gap-2 text-xs bg-[#00B8E6]/10 hover:bg-[#00B8E6]/20 text-[#00B8E6]"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restore
                        </Button>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Diff Preview */}
          <div className="lg:col-span-2">
            {activeVersion ? (
              <Card className="border border-border bg-card">
                <div className="p-6 border-b border-border space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-semibold text-foreground">Version {activeVersion.versionNumber}</h2>
                        {activeVersion.status === "current" && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-1">{activeVersion.metadata.name}</h3>
                      <p className="text-sm text-muted-foreground">{activeVersion.label}</p>
                    </div>
                  </div>

                  {activeVersion.metadata.description && (
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-foreground mb-1">Description</p>
                      <p className="text-sm text-muted-foreground">{activeVersion.metadata.description}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 flex-wrap">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeVersion.timestamp}
                    </p>
                    {activeVersion.metadata.tags && activeVersion.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {activeVersion.metadata.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-[#00B8E6]/10 text-[#00B8E6] text-xs rounded border border-[#00B8E6]/30 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Tabs defaultValue="flow" className="w-full">
                  <div className="px-6 pt-4">
                    <TabsList className="bg-muted">
                      <TabsTrigger value="flow">Flow Diff</TabsTrigger>
                      <TabsTrigger value="json">JSON Diff</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="flow" className="p-6 space-y-4">
                    {/* Added Blocks */}
                    {activeVersion.changes.added.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Added ({activeVersion.changes.added.length})
                        </h3>
                        <div className="space-y-2">
                          {activeVersion.changes.added.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3"
                            >
                              <Plus className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-sm text-green-400">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Removed Blocks */}
                    {activeVersion.changes.removed.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                          <Minus className="w-4 h-4" />
                          Removed ({activeVersion.changes.removed.length})
                        </h3>
                        <div className="space-y-2">
                          {activeVersion.changes.removed.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3"
                            >
                              <Minus className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <span className="text-sm text-red-400 line-through">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Modified Blocks */}
                    {activeVersion.changes.modified.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Modified ({activeVersion.changes.modified.length})
                        </h3>
                        <div className="space-y-2">
                          {activeVersion.changes.modified.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-3"
                            >
                              <Edit className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                              <span className="text-sm text-yellow-400">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeVersion.changes.added.length === 0 &&
                      activeVersion.changes.removed.length === 0 &&
                      activeVersion.changes.modified.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No changes in this version</p>
                        </div>
                      )}
                  </TabsContent>

                  <TabsContent value="json" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Old Version */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                          Previous Version
                        </h3>
                        <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                          <pre className="p-4 text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto max-h-96 overflow-y-auto">
                            {jsonDiff.old || "No previous version"}
                          </pre>
                        </div>
                      </div>

                      {/* New Version */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                          Selected Version
                        </h3>
                        <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                          <pre className="p-4 text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto max-h-96 overflow-y-auto">
                            {jsonDiff.new}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-xs text-blue-400">
                        💡 <strong>Tip:</strong> Use a diff tool like VS Code to see line-by-line changes between
                        versions
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            ) : (
              <Card className="p-12 text-center border border-border bg-card">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select a version</h3>
                <p className="text-muted-foreground">Choose a version from the left to view changes</p>
              </Card>
            )}
          </div>
        </div>
          </>
        )}
      </div>

      <Footer/>

    </div>
  )
}
