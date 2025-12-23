"use client"
import { ReactFlowProvider } from "reactflow"
import { StrategyBuilder } from "@/components/strategy-builder/strategy-builder"

export default function EditorPage() {
  return (
    <main className="w-full h-screen bg-background">
      <ReactFlowProvider>
        <StrategyBuilder />
      </ReactFlowProvider>
    </main>
  )
}
