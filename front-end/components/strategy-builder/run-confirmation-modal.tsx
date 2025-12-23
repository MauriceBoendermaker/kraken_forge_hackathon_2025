"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertTriangle, Loader2, ExternalLink } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

import { RunConfirmationModalProps } from "@/interfaces/RunConfirmationModalProps";

export function RunConfirmationModal({ open, onOpenChange, result }: RunConfirmationModalProps) {
  const getStatusIcon = () => {
    if (!result) return <Loader2 className="w-12 h-12 text-primary animate-spin" />

    switch (result.status) {
      case "running":
        return <Loader2 className="w-12 h-12 text-primary animate-spin" />
      case "success":
        return <CheckCircle2 className="w-12 h-12 text-green-500" />
      case "error":
        return <XCircle className="w-12 h-12 text-red-500" />
      case "info":
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />
    }
  }

  const getStatusColor = () => {
    if (!result) return "text-primary"

    switch (result.status) {
      case "running":
        return "text-primary"
      case "success":
        return "text-green-500"
      case "error":
        return "text-red-500"
      case "info":
        return "text-yellow-500"
    }
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-400"
      case "warning":
        return "text-yellow-400"
      case "success":
        return "text-green-400"
      default:
        return "text-muted-foreground"
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 !z-[100] flex items-center justify-center p-4" onClick={() => onOpenChange(false)}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative max-w-2xl w-full bg-sidebar border-sidebar-border border rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-sidebar border-b border-sidebar-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Strategy Execution</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Status Icon and message */}
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            {getStatusIcon()}
            <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
              {result?.message || "Initializing execution..."}
            </h3>
            {result?.details && <p className="text-sm text-muted-foreground">{result.details}</p>}
          </div>

          {/* Stats grid */}
          {result && (result.executedNodes !== undefined || result.duration !== undefined) && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-3 border border-sidebar-border">
                <div className="text-2xl font-bold text-foreground">
                  {result.executedNodes}/{result.totalNodes}
                </div>
                <div className="text-xs text-muted-foreground">Nodes Executed</div>
              </div>
              <div className="bg-card rounded-lg p-3 border border-sidebar-border">
                <div className="text-2xl font-bold text-foreground">{result.duration}ms</div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>
              <div className="bg-card rounded-lg p-3 border border-sidebar-border">
                <div className="text-2xl font-bold text-foreground">{result.errors?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
            </div>
          )}

          {/* Error list */}
          {result?.errors && result.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Errors</h4>
              <div className="space-y-2">
                {result.errors.map((error, idx) => (
                  <div key={idx} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-mono text-xs text-red-400 mb-1">{error.nodeId}</div>
                        <div className="text-sm text-foreground font-medium mb-1">{error.nodeName}</div>
                        <div className="text-xs text-muted-foreground">{error.error}</div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-xs gap-1">
                        Jump <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Execution logs */}
          {result?.logs && result.logs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Execution Log</h4>
              <ScrollArea className="h-48 bg-card rounded-lg border border-sidebar-border">
                <div className="p-3 space-y-2 font-mono text-xs">
                  {result.logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-muted-foreground shrink-0">{log.timestamp}</span>
                      <span className={`shrink-0 font-semibold uppercase ${getLogLevelColor(log.level)}`}>
                        [{log.level}]
                      </span>
                      {log.nodeId && <span className="text-primary shrink-0">{log.nodeId}</span>}
                      <span className="text-foreground">{log.message}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            {result?.status === "error" && (
              <Button variant="outline" size="sm" className="hover:text-primary" onClick={() => (window.location.href = "/validation")}>
                View Validation
              </Button>
            )}
            {result?.status === "success" && (
              <Button variant="outline" size="sm" className="hover:text-primary" onClick={() => (window.location.href = "/export")}>
                Export Strategy
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={result?.status === "running"}
              className="bg-primary hover:bg-primary/90"
            >
              {result?.status === "running" ? "Running..." : "Close"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
