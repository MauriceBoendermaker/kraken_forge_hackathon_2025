"use client"

import { ToolbarProps } from "@/interfaces/ToolbarProps"
import { saveVersion } from "@/lib/version-manager"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Play, CheckCircle2, Save, Download, MoreVertical, Settings, BarChart3 } from "lucide-react"

export function Toolbar({
  strategyName,
  onStrategyNameChange,
  onMetadataClick,
  onRunClick,
  nodes,
  edges,
  onChartToggle,
  isChartOpen,
  }: ToolbarProps) {
  const handleExportJSON = () => {
    // Load latest state from localStorage to ensure we export the most recent version
    const savedNodes = localStorage.getItem("strategy-builder-nodes")
    const savedEdges = localStorage.getItem("strategy-builder-edges")
    const savedMetadata = localStorage.getItem("strategy-builder-metadata")

    const strategy = {
      name: strategyName,
      nodes: savedNodes ? JSON.parse(savedNodes) : nodes,
      edges: savedEdges ? JSON.parse(savedEdges) : edges,
      metadata: savedMetadata ? JSON.parse(savedMetadata) : null,
      timestamp: new Date().toISOString(),
      version: "1.0",
    }
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(strategy, null, 2)),
    )
    element.setAttribute("download", `${strategyName.replace(/\s+/g, "-")}.json`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleSaveVersion = () => {
    try {
      const savedNodes = localStorage.getItem("strategy-builder-nodes")
      const savedEdges = localStorage.getItem("strategy-builder-edges")
      const savedMetadata = localStorage.getItem("strategy-builder-metadata")

      if (!savedNodes || !savedEdges || !savedMetadata) {
        alert("No strategy to save. Please add some blocks first.")
        return
      }

      const nodes = JSON.parse(savedNodes)
      const edges = JSON.parse(savedEdges)
      const metadata = JSON.parse(savedMetadata)

      const version = saveVersion(nodes, edges, metadata, "Manual save")

      alert(`Version ${version.versionNumber} saved successfully!`)
    } catch (error) {
      console.error("Failed to save version:", error)
      alert("Failed to save version. Please try again.")
    }
  }

  const handleValidate = () => {
    // Load the most recent state from localStorage to validate
    const savedNodes = localStorage.getItem("strategy-builder-nodes")
    const savedEdges = localStorage.getItem("strategy-builder-edges")
    const savedMetadata = localStorage.getItem("strategy-builder-metadata")

    const nodesToValidate = savedNodes ? JSON.parse(savedNodes) : nodes
    const edgesToValidate = savedEdges ? JSON.parse(savedEdges) : edges

    // Save a version before validating
    if (savedNodes && savedEdges && savedMetadata) {
      try {
        saveVersion(
          JSON.parse(savedNodes),
          JSON.parse(savedEdges),
          JSON.parse(savedMetadata),
          "Before validation"
        )
      } catch (error) {
        console.error("Failed to auto-save before validation:", error)
      }
    }

    // Import validation function dynamically
    import("@/lib/validate-strategy").then(({ validateStrategy }) => {
      const validationResult = validateStrategy(nodesToValidate, edgesToValidate);

      console.log("Validation Result:", validationResult);
      console.log("Errors:", validationResult.errors);
      console.log("Warnings:", validationResult.warnings);

      // Store validation results in localStorage
      localStorage.setItem("validationResult", JSON.stringify(validationResult));

      // Navigate to validation page
      window.location.href = "/validation";
    }).catch((error) => {
      console.error("Validation failed:", error);
      alert("Failed to run validation. Please check the console for details.");
    });
  }

  const handleExportScreen = () => {
    window.location.href = "/export"
  }

  const handleValidateScreen = () => {
    window.location.href = "/validation"
  }

  const handleResetCanvas = () => {
    if (confirm("Are you sure you want to reset the canvas? This will delete all blocks and connections.")) {
      // Clear localStorage
      localStorage.removeItem("strategy-builder-nodes")
      localStorage.removeItem("strategy-builder-edges")
      localStorage.removeItem("strategy-builder-metadata")
      // Reload the page to reset state
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3 bg-sidebar border-b border-sidebar-border">
      {/* Left: Name Input */}
      <div className="flex-1 max-w-xs">
        <Input
          value={strategyName}
          onChange={(e) => onStrategyNameChange(e.target.value)}
          placeholder="Strategy name"
          className="text-sm font-medium bg-card border-sidebar-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Center: Status */}
      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        Ready
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className={`gap-2 text-xs bg-transparent hover:text-primary ${isChartOpen ? "text-primary" : ""}`}
          onClick={onChartToggle}
          title="Toggle market chart"
        >
          <BarChart3 className="w-4 h-4" />
          Chart
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="gap-2 text-xs bg-transparent hover:text-primary"
          onClick={onMetadataClick}
          title="Edit strategy metadata"
        >
          <Settings className="w-4 h-4" />
          Metadata
        </Button>

        <Button size="sm" variant="outline" className="gap-2 text-xs bg-transparent hover:text-primary" onClick={handleValidate}>
          <CheckCircle2 className="w-4 h-4" />
          Validate
        </Button>

        <Button size="sm" className="gap-2 text-xs bg-primary hover:bg-primary/90" onClick={onRunClick}>
          <Play className="w-4 h-4" />
          Run
        </Button>

        <Button size="sm" variant="outline" className="gap-2 text-xs bg-transparent hover:text-primary" onClick={handleSaveVersion}>
          <Save className="w-4 h-4" />
          Save
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleExportScreen} className="gap-2">
              <Download className="w-4 h-4" />
              Export Strategy
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">Import JSON</DropdownMenuItem>
            <DropdownMenuItem onClick={handleResetCanvas} className="gap-2 text-destructive">
              Reset Canvas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
