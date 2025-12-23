"use client"

import type React from "react"
import type { Node } from "reactflow"

import "reactflow/dist/style.css"

import { nodeTypes } from "@/constants/NodeTypes"
import { initialNodes, initialEdges, blockTemplates } from "@/lib/strategy-templates"

import { StrategyMetadata } from "@/interfaces/StrategyMetadata"
import { NodeType } from "@/types/NodeType"
import { OrderNodeData } from "@/types/OrderNodeData"
import { ConditionNodeData } from "@/types/ConditionNodeData"
import { LogicNodeData } from "@/types/LogicNodeData"
import { UtilityNodeData } from "@/types/UtilityNodeData"
import { OrderBlock } from "@/lib/order-nodes"
import { executeOrderBlock } from "@/api/execute_orderblock"

import { useCallback, useState, useEffect, useRef } from "react"
import { addEdge, ReactFlow, Background, Controls, useNodesState, useEdgesState, type Connection, useReactFlow } from "reactflow"

import { Toolbar } from "./toolbar"
import { Sidebar } from "./sidebar"
import { Inspector } from "./inspector"
import { MetadataModal } from "./metadata-modal"
import { DebuggerPanel } from "./debugger-panel"
import { RunConfirmationModal } from "./run-confirmation-modal"
import { ChartPanel } from "./chart-panel"

type StrategyNodeData = OrderNodeData | ConditionNodeData | LogicNodeData | UtilityNodeData
type StrategyNode = Node<StrategyNodeData, NodeType>

const STORAGE_KEY_NODES = "strategy-builder-nodes"
const STORAGE_KEY_EDGES = "strategy-builder-edges"
const STORAGE_KEY_METADATA = "strategy-builder-metadata"

export function StrategyBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  // Load initial state from localStorage or use defaults
  const getInitialNodes = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_NODES)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse saved nodes:", e)
        }
      }
    }
    return initialNodes as Node<StrategyNodeData>[]
  }

  const getInitialEdges = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_EDGES)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse saved edges:", e)
        }
      }
    }
    return initialEdges
  }

  const getInitialMetadata = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_METADATA)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse saved metadata:", e)
        }
      }
    }
    return {
      name: "Untitled Strategy",
      description: "",
      version: "1.0",
      tags: [],
    }
  }

  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes())
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges())
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [metadataOpen, setMetadataOpen] = useState(false)
  const [metadata, setMetadata] = useState<StrategyMetadata>(getInitialMetadata())
  const [chartPanelOpen, setChartPanelOpen] = useState(false)

  // Add delete handler to all nodes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onDelete: handleNodeDelete,
        },
      }))
    )
  }, [])

  // Save nodes to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_NODES, JSON.stringify(nodes))
    }
  }, [nodes])

  // Save edges to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_EDGES, JSON.stringify(edges))
    }
  }, [edges])

  // Save metadata to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_METADATA, JSON.stringify(metadata))
    }
  }, [metadata])

  const runStrategy = async () => {
    for (const node of nodes) {
      await executeOrderBlock(node as OrderBlock);
    }
  };

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node<StrategyNodeData>) => {
    setSelectedNodeId(node.id)
  }, [])

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges],
  )

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId))
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
      if (selectedNodeId === nodeId) setSelectedNodeId(null)
    },
    [selectedNodeId, setEdges, setNodes],
  )

  const handleAddNode = useCallback(
    (blockId: string) => {
      const template = blockTemplates[blockId as keyof typeof blockTemplates]

      if (!template) {
        console.error(`No template found for block: ${blockId}`)
        return
      }

      const newNode: Node<StrategyNodeData> = {
        id: `${blockId}-${Date.now()}`,
        type: template.nodeType,
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        data: {
          ...template.defaultData,
          onDelete: handleNodeDelete,
        } as StrategyNodeData,
      }

      setNodes((nds) => [...nds, newNode])
    },
    [setNodes],
  )

  const handleUpdateNode = useCallback(
    (nodeId: string, data: Partial<StrategyNodeData>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n)),
      )
    },
    [setNodes],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const blockId = event.dataTransfer.getData("application/reactflow")

      if (!blockId || !reactFlowInstance) {
        return
      }

      const template = blockTemplates[blockId as keyof typeof blockTemplates]

      if (!template) {
        console.error(`No template found for block: ${blockId}`)
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: Node<StrategyNodeData> = {
        id: `${blockId}-${Date.now()}`,
        type: template.nodeType,
        position,
        data: {
          ...template.defaultData,
          onDelete: handleNodeDelete,
        } as StrategyNodeData,
      }

      setNodes((nds) => [...nds, newNode])
    },
    [reactFlowInstance, setNodes],
  )

  const [runModalOpen, setRunModalOpen] = useState(false)
  const [runResult, setRunResult] = useState<any>(null)

  const handleRun = useCallback(async () => {
    // Save a version before running
    try {
      const { saveVersion } = await import("@/lib/version-manager")
      saveVersion(nodes, edges, metadata, "Before execution run")
    } catch (error) {
      console.error("Failed to auto-save before run:", error)
    }

    const startTime = Date.now()
    const logs: Array<{ timestamp: string; level: string; message: string; nodeId?: string }> = []
    const errors: Array<{ nodeId: string; nodeName: string; error: string }> = []
    const executionSteps: Array<any> = []
    let executedNodes = 0

    // Helper to format timestamp
    const getTimestamp = () => {
      const now = new Date()
      return now.toTimeString().split(" ")[0]
    }

    const getMillisTimestamp = () => {
      const now = new Date()
      return now.toTimeString().split(" ")[0] + "." + now.getMilliseconds().toString().padStart(3, "0")
    }

    // Show running state
    setRunResult({
      status: "running",
      message: "Executing Strategy...",
      details: "Processing workflow nodes",
    })
    setRunModalOpen(true)

    logs.push({ timestamp: getTimestamp(), level: "info", message: "Starting strategy execution", nodeId: "start" })

    try {
      // Validate nodes exist
      if (nodes.length === 0) {
        throw new Error("No nodes in strategy to execute")
      }

      // Execute each node sequentially
      for (const node of nodes) {
        const stepStartTime = getMillisTimestamp()
        const stepLogs: string[] = []

        try {
          logs.push({
            timestamp: getTimestamp(),
            level: "info",
            message: `Executing: ${node.data.label}`,
            nodeId: node.id,
          })

          stepLogs.push(`[${stepStartTime}] Starting execution of ${node.data.label}`)

          // Execute the node via API
          const result = await executeOrderBlock(node as OrderBlock)

          const stepEndTime = getMillisTimestamp()

          logs.push({
            timestamp: getTimestamp(),
            level: "success",
            message: `Completed: ${node.data.label}`,
            nodeId: node.id,
          })

          stepLogs.push(`[${stepEndTime}] Execution completed successfully`)

          // Log API response details if available
          if (result) {
            logs.push({
              timestamp: getTimestamp(),
              level: "info",
              message: `API Response: ${JSON.stringify(result).substring(0, 100)}...`,
              nodeId: node.id,
            })
            stepLogs.push(`[${stepEndTime}] API Response received`)
          }

          // Save execution step
          executionSteps.push({
            id: `step-${executionSteps.length}`,
            nodeId: node.id,
            nodeName: node.data.label,
            status: "success",
            timestamp: stepEndTime,
            inputs: node.data,
            outputs: result,
            logs: stepLogs,
          })

          executedNodes++
        } catch (error: any) {
          const errorMessage = error.message || "Unknown error occurred"
          const stepEndTime = getMillisTimestamp()

          errors.push({
            nodeId: node.id,
            nodeName: node.data.label,
            error: errorMessage,
          })

          logs.push({
            timestamp: getTimestamp(),
            level: "error",
            message: `Failed: ${errorMessage}`,
            nodeId: node.id,
          })

          stepLogs.push(`[${stepEndTime}] Execution failed: ${errorMessage}`)

          // Save failed execution step
          executionSteps.push({
            id: `step-${executionSteps.length}`,
            nodeId: node.id,
            nodeName: node.data.label,
            status: "error",
            timestamp: stepEndTime,
            inputs: node.data,
            outputs: null,
            logs: stepLogs,
            error: errorMessage,
          })

          // Continue execution even on error (or break if you want to stop on first error)
          // break;
        }
      }

      const duration = Date.now() - startTime

      // Save execution history
      const executionRun = {
        id: `run-${Date.now()}`,
        timestamp: new Date().toISOString(),
        duration,
        status: errors.length > 0 ? "error" : "success",
        steps: executionSteps,
        totalNodes: nodes.length,
        executedNodes,
      }

      // Save to localStorage for debugger
      const existingHistory = localStorage.getItem("execution-history")
      const history = existingHistory ? JSON.parse(existingHistory) : []
      history.unshift(executionRun) // Add to beginning
      // Keep only last 10 runs
      if (history.length > 10) history.pop()
      localStorage.setItem("execution-history", JSON.stringify(history))
      localStorage.setItem("last-execution", JSON.stringify(executionRun))

      // Set final result
      if (errors.length > 0) {
        // Also save execution errors to validation results for the validation page
        const executionErrors = errors.map((err, idx) => ({
          id: `exec-err-${idx}`,
          type: "error" as const,
          message: `Execution Error: ${err.error}`,
          nodeRef: err.nodeId,
          nodeLabel: err.nodeName,
        }));

        const validationWithExecErrors = {
          isValid: false,
          errors: executionErrors,
          warnings: [{
            id: "exec-warn-1",
            type: "warning" as const,
            message: "These are execution errors from the last run. Fix these issues before running again.",
          }],
          totalIssues: executionErrors.length + 1,
        };

        localStorage.setItem("validationResult", JSON.stringify(validationWithExecErrors));

        setRunResult({
          status: "error",
          message: "Execution Completed with Errors",
          details: `${errors.length} node(s) failed during execution`,
          executedNodes,
          totalNodes: nodes.length,
          duration,
          errors,
          logs,
        })
      } else {
        logs.push({ timestamp: getTimestamp(), level: "success", message: "Strategy completed successfully", nodeId: "end" })

        setRunResult({
          status: "success",
          message: "Strategy Executed Successfully",
          details: "All nodes processed without errors",
          executedNodes,
          totalNodes: nodes.length,
          duration,
          errors: [],
          logs,
        })
      }
    } catch (error: any) {
      const duration = Date.now() - startTime

      logs.push({
        timestamp: getTimestamp(),
        level: "error",
        message: `Critical error: ${error.message}`,
        nodeId: "system",
      })

      setRunResult({
        status: "error",
        message: "Execution Failed",
        details: error.message || "Strategy execution encountered a critical error",
        executedNodes,
        totalNodes: nodes.length,
        duration,
        errors: [
          {
            nodeId: "system",
            nodeName: "System",
            error: error.message || "Unknown error",
          },
        ],
        logs,
      })
    }
  }, [nodes, edges, metadata])

  const handleMetadataSave = (newMetadata: StrategyMetadata) => {
    setMetadata(newMetadata)
  }

  const selectedNode = (nodes as StrategyNode[]).find((n) => n.id === selectedNodeId) ?? null

  return (
    <>
      <div className="flex h-full w-full">
        <Sidebar onAddNode={handleAddNode} />

        <div className="flex-1 flex flex-col">
          <Toolbar
            onRun={runStrategy}
            onRunClick={handleRun}
            strategyName={metadata.name}
            onStrategyNameChange={(name) => setMetadata({ ...metadata, name })}
            onMetadataClick={() => setMetadataOpen(true)}
            nodes={nodes}
            edges={edges}
            onChartToggle={() => setChartPanelOpen(!chartPanelOpen)}
            isChartOpen={chartPanelOpen}
          />

          <div className="flex-1 bg-card" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              proOptions={{ hideAttribution: true }}
              className="bg-background"
            >
              <Background className="[&>*]:stroke-muted-foreground/20" gap={16} />
              <Controls position="top-right" className="[&>button]:bg-card [&>button]:border-border [&>button]:text-foreground" />
            </ReactFlow>
          </div>
        </div>

        <Inspector node={selectedNode} onUpdateNode={handleUpdateNode} onDeleteNode={handleNodeDelete} />
      </div>

      <MetadataModal open={metadataOpen} onOpenChange={setMetadataOpen} metadata={metadata} onSave={handleMetadataSave} />

      <RunConfirmationModal open={runModalOpen} onOpenChange={setRunModalOpen} result={runResult} />

      <ChartPanel isOpen={chartPanelOpen} onClose={() => setChartPanelOpen(false)} />

      <DebuggerPanel />
    </>
  )
}