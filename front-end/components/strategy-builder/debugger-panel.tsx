"use client"

import type React from "react"

import { ExecutionStep } from "@/interfaces/ExecutionStep"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, ChevronDown, PlayCircle, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExecutionRun {
  id: string
  timestamp: string
  duration: number
  status: "success" | "error" | "running"
  steps: ExecutionStep[]
  totalNodes: number
  executedNodes: number
}

export function DebuggerPanel() {
  const [debugMode, setDebugMode] = useState(false)
  const [selectedRun, setSelectedRun] = useState("last")
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"inputs" | "outputs" | "logs" | "errors">("inputs")
  const [panelHeight, setPanelHeight] = useState(300)
  const [isResizing, setIsResizing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [executionHistory, setExecutionHistory] = useState<ExecutionRun[]>([])
  const [currentRun, setCurrentRun] = useState<ExecutionRun | null>(null)
  const [debuggerEnabled, setDebuggerEnabled] = useState(true)
  const dragState = useRef<{ startY: number; startHeight: number } | null>(null)

  // Check if debugger is enabled in settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const enabled = localStorage.getItem("settings-debugger-enabled")
      if (enabled !== null) {
        setDebuggerEnabled(enabled === "true")
      }
    }
  }, [])

  // Load execution history from localStorage
  useEffect(() => {
    loadExecutionHistory()
  }, [])

  // Reload when selectedRun changes
  useEffect(() => {
    loadExecutionHistory(true) // Clear selection when run changes
  }, [selectedRun])

  // Auto-refresh when panel is open (but don't clear selection)
  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      loadExecutionHistory(false) // Don't clear selection on auto-refresh
    }, 2000) // Refresh every 2 seconds when open

    return () => clearInterval(interval)
  }, [isOpen, selectedRun])

  const loadExecutionHistory = (clearSelection = false) => {
    try {
      const historyStr = localStorage.getItem("execution-history")
      const history = historyStr ? JSON.parse(historyStr) : []
      setExecutionHistory(history)

      let newRun: ExecutionRun | null = null

      if (selectedRun === "last") {
        const lastRunStr = localStorage.getItem("last-execution")
        newRun = lastRunStr ? JSON.parse(lastRunStr) : (history.length > 0 ? history[0] : null)
      } else {
        newRun = history.find((r: ExecutionRun) => r.id === selectedRun) || null
      }

      // Only clear selected step if explicitly requested (e.g., when changing runs)
      // or if the run actually changed (different ID)
      if (clearSelection || (newRun?.id !== currentRun?.id && currentRun !== null)) {
        setSelectedStep(null)
      }

      setCurrentRun(newRun)
    } catch (error) {
      console.error("Failed to load execution history:", error)
      setCurrentRun(null)
      setSelectedStep(null)
    }
  }

  const executionSteps = currentRun?.steps || []

  const handleIsOpen = () => {
    setIsOpen(true)
  }

  const handleIsClosed = () => {
    setIsOpen(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragState.current = { startY: e.clientY, startHeight: panelHeight }
    setIsResizing(true)
  }

  useEffect(() => {
    if (!isResizing) return

    const onMove = (e: MouseEvent) => {
      if (!dragState.current) return
      const deltaY = dragState.current.startY - e.clientY
      const nextHeight = dragState.current.startHeight + deltaY
      setPanelHeight(Math.min(600, Math.max(150, nextHeight)))
    }

    const onUp = () => {
      dragState.current = null
      setIsResizing(false)
    }

    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    return () => {
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isResizing, panelHeight])

  const selectedStepData = executionSteps.find((step) => step.id === selectedStep)

  const getStatusIcon = (status: ExecutionStep["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <PlayCircle className="h-4 w-4 text-primary animate-pulse" />
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Don't render debugger if disabled in settings
  if (!debuggerEnabled) {
    return null
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar/95 backdrop-blur-sm border-t border-sidebar-border">
        <Button
          onClick={handleIsOpen}
          variant="ghost"
          size="sm"
          className="w-full h-8 rounded-none text-muted-foreground hover:text-primary"
        >
          <ChevronUp className="h-4 w-4 mr-2" />
          Show Debugger
        </Button>
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar/95 backdrop-blur-sm border-t border-sidebar-border flex flex-col"
      style={{ height: `${panelHeight}px` }}
    >

      {/* Resize Handle */}
      <div
        className="h-1 w-full cursor-row-resize hover:bg-primary/50 transition-colors"
        onMouseDown={handleMouseDown}
        onMouseDownCapture={(e) => e.preventDefault()}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-sidebar-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-sidebar-foreground">Execution History</span>
            <Button
              onClick={() => loadExecutionHistory(false)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary h-6 w-6 p-0"
              title="Refresh"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>

          <select
            value={selectedRun}
            onChange={(e) => {
              const newValue = e.target.value
              setSelectedRun(newValue)
              // Selection will be cleared by the useEffect that calls loadExecutionHistory(true)
            }}
            className="bg-card text-foreground text-sm rounded px-3 py-1 border border-border focus:outline-none focus:border-primary"
            disabled={executionHistory.length === 0 && !currentRun}
          >
            <option value="last">
              {executionHistory.length === 0 && !currentRun ? "No runs available" : "Last run"}
            </option>
            {executionHistory.map((run, idx) => {
              const date = new Date(run.timestamp)
              const timeStr = date.toLocaleTimeString()
              const statusEmoji = run.status === "success" ? "✓" : run.status === "error" ? "✗" : "⋯"
              return (
                <option key={run.id} value={run.id}>
                  {statusEmoji} Run #{executionHistory.length - idx} - {timeStr}
                </option>
              )
            })}
          </select>

          {currentRun && (
            <div className="text-xs text-muted-foreground">
              {currentRun.executedNodes}/{currentRun.totalNodes} nodes • {currentRun.duration}ms
            </div>
          )}
        </div>

        <Button onClick={handleIsClosed} variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <ChevronDown className="h-4 w-4 mr-1" />
          Hide
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Execution Order */}
        <div className="w-80 border-r border-sidebar-border overflow-y-auto">
          <div className="px-4 py-2 border-b border-sidebar-border">
            <h3 className="text-sm font-semibold text-sidebar-foreground">
              Node Execution Order
              {executionSteps.length > 0 && (
                <span className="text-xs text-muted-foreground ml-2">({executionSteps.length} steps)</span>
              )}
            </h3>
          </div>
          {!currentRun ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No execution data
            </div>
          ) : executionSteps.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No steps in this run
            </div>
          ) : (
            <div className="divide-y divide-sidebar-border">
              {executionSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setSelectedStep(step.id)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-sidebar-accent/50 transition-colors text-left ${
                  selectedStep === step.id ? "bg-sidebar-accent" : ""
                }`}
              >
                <span className="text-xs font-mono text-muted-foreground w-6">{index + 1}</span>
                {getStatusIcon(step.status)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-sidebar-foreground truncate">{step.nodeName}</div>
                  <div className="text-xs text-muted-foreground font-mono">{step.timestamp}</div>
                </div>
              </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Tabbed Data View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-sidebar-border px-4">
            {(["inputs", "outputs", "logs", "errors"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-sidebar-foreground"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {!currentRun ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
                <PlayCircle className="h-12 w-12 opacity-50" />
                <p>No execution data available</p>
                <p className="text-xs">Run your strategy to see execution details here</p>
              </div>
            ) : !selectedStepData ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Select a node from the execution order to view details
              </div>
            ) : (
              <>
                {activeTab === "inputs" && (
                  <pre className="text-xs font-mono text-sidebar-foreground bg-sidebar-accent p-4 rounded overflow-x-auto">
                    {JSON.stringify(selectedStepData.inputs, null, 2)}
                  </pre>
                )}
                {activeTab === "outputs" && (
                  <pre className="text-xs font-mono text-sidebar-foreground bg-sidebar-accent p-4 rounded overflow-x-auto">
                    {selectedStepData.outputs
                      ? JSON.stringify(selectedStepData.outputs, null, 2)
                      : "No outputs available"}
                  </pre>
                )}
                {activeTab === "logs" && (
                  <div className="space-y-1">
                    {selectedStepData.logs.map((log, i) => (
                      <div key={i} className="text-xs font-mono text-muted-foreground bg-sidebar-accent px-3 py-1.5 rounded">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "errors" && (
                  <div>
                    {selectedStepData.error ? (
                      <div className="bg-red-950/30 border border-red-900 rounded p-4">
                        <div className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                          <div>
                            <div className="text-sm font-semibold text-red-400 mb-1">Error</div>
                            <div className="text-xs font-mono text-red-300">{selectedStepData.error}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        No errors in this step
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
