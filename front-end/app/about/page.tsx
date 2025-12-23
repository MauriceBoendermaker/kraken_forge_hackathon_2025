"use client"

import { Code2, Layers, Zap, Package } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

const TECH_STACK = [
  { name: "React 19", category: "Frontend" },
  { name: "Next.js 16", category: "Framework" },
  { name: "TypeScript", category: "Language" },
  { name: "React Flow", category: "Canvas" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Kraken API", category: "Exchange" },
  { name: "shadcn/ui", category: "Components" },
  { name: "Zustand", category: "State" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      <Navbar/>

      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-12 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">About</h1>
            <p className="text-muted-foreground mt-1">Architecture and technical overview</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Overview */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Trading Strategy Builder is a professional visual workflow editor designed for creating, testing, and
            deploying automated trading strategies on crypto exchanges. It provides a node-based interface similar to
            n8n and Zapier, allowing traders to build complex strategies without writing code.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            The platform features a drag-and-drop canvas powered by React Flow, real-time validation, execution
            simulation, and multi-format export capabilities (JSON, TypeScript, API requests). Designed with
            professional traders in mind, it combines the power of algorithmic trading with an intuitive visual
            interface.
          </p>
        </Card>

        {/* Tech Stack */}
        <Card className="p-6 border border-border bg-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#00B8E6]/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#00B8E6]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Tech Stack</h2>
              <p className="text-sm text-muted-foreground">Modern web technologies and frameworks</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="p-4 border border-border bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{tech.category}</p>
                <p className="font-semibold text-foreground">{tech.name}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Architecture Diagram */}
        <Card className="p-6 border border-border bg-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#00B8E6]/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#00B8E6]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Architecture Diagram</h2>
              <p className="text-sm text-muted-foreground">System layers and data flow</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* UI Layer */}
            <div className="p-4 border-l-4 border-[#00B8E6] bg-[#00B8E6]/5 rounded-r-lg">
              <h3 className="font-semibold text-foreground mb-1">UI Layer</h3>
              <p className="text-sm text-muted-foreground">
                React components, canvas editor, sidebars, inspector panels, and interactive controls
              </p>
            </div>

            {/* Node Engine */}
            <div className="p-4 border-l-4 border-blue-500 bg-blue-500/5 rounded-r-lg">
              <h3 className="font-semibold text-foreground mb-1">Node Engine</h3>
              <p className="text-sm text-muted-foreground">
                React Flow integration, node types, edge connections, validation logic, and execution flow
              </p>
            </div>

            {/* API Layer */}
            <div className="p-4 border-l-4 border-green-500 bg-green-500/5 rounded-r-lg">
              <h3 className="font-semibold text-foreground mb-1">API Layer</h3>
              <p className="text-sm text-muted-foreground">
                Kraken REST API integration, authentication, order management, and market data fetching
              </p>
            </div>

            {/* Storage */}
            <div className="p-4 border-l-4 border-purple-500 bg-purple-500/5 rounded-r-lg">
              <h3 className="font-semibold text-foreground mb-1">Storage Layer</h3>
              <p className="text-sm text-muted-foreground">
                Local state management, strategy persistence, template library, and export/import
              </p>
            </div>
          </div>

          <div className="mt-6 bg-slate-950 rounded-lg border border-slate-800 p-4">
            <pre className="text-xs text-slate-300 font-mono leading-relaxed">
              {`┌─────────────────┐
│   UI Components │ ← User interactions
└────────┬────────┘
         │
┌────────▼────────┐
│   Node Engine   │ ← Strategy graph, validation
└────────┬────────┘
         │
┌────────▼────────┐
│   API Manager   │ ← Exchange communication
└────────┬────────┘
         │
┌────────▼────────┐
│   Kraken API    │ ← Live trading execution
└─────────────────┘`}
            </pre>
          </div>
        </Card>

        {/* Drag-and-Drop Engine */}
        <Card className="p-6 border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#00B8E6]/20 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-[#00B8E6]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Drag-and-Drop Engine</h2>
              <p className="text-sm text-muted-foreground">How nodes and edges are represented</p>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-4">
            The canvas editor uses React Flow, a powerful library for building node-based interfaces. Each strategy is
            represented as a directed graph with nodes (blocks) and edges (connections).
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Node Structure</h3>
              <div className="bg-slate-950 rounded-lg border border-slate-800 p-4">
                <pre className="text-xs text-slate-300 font-mono leading-relaxed">
                  {`{
  id: "order-1",
  type: "orderNode",
  position: { x: 100, y: 200 },
  data: {
    label: "Place Order",
    pair: "BTCUSD",
    type: "market",
    size: 0.1,
    price: 45000
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Edge Structure</h3>
              <div className="bg-slate-950 rounded-lg border border-slate-800 p-4">
                <pre className="text-xs text-slate-300 font-mono leading-relaxed">
                  {`{
  id: "edge-1",
  source: "order-1",
  target: "wait-1",
  type: "smoothstep",
  animated: true
}`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Extensibility */}
        <Card className="p-6 border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#00B8E6]/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#00B8E6]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Extensibility</h2>
              <p className="text-sm text-muted-foreground">Adding custom block types</p>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-4">
            The platform is designed to be extensible. New block types can be added by following these steps:
          </p>

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-xs font-bold">
                1
              </span>
              <div>
                <p className="font-medium text-foreground mb-1">Define Block Component</p>
                <p>
                  Create a React component in <code className="text-[#00B8E6]">components/strategy-builder/nodes/</code>
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-xs font-bold">
                2
              </span>
              <div>
                <p className="font-medium text-foreground mb-1">Register Node Type</p>
                <p>
                  Add the node type to the <code className="text-[#00B8E6]">nodeTypes</code> object in the strategy builder
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-xs font-bold">
                3
              </span>
              <div>
                <p className="font-medium text-foreground mb-1">Add to Sidebar</p>
                <p>Include the new block in the sidebar library with appropriate category and metadata</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-xs font-bold">
                4
              </span>
              <div>
                <p className="font-medium text-foreground mb-1">Implement Inspector</p>
                <p>Create the configuration form in the inspector panel for the block's properties</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-xs font-bold">
                5
              </span>
              <div>
                <p className="font-medium text-foreground mb-1">Add Validation Logic</p>
                <p>Implement validation rules to ensure the block is configured correctly before execution</p>
              </div>
            </li>
          </ul>
        </Card>
      </div>

      <Footer/>

    </div>
  )
}
