"use client"

import Link from "next/link"
import { ArrowRight, Github, BookOpen, Zap, Activity, Bug, Boxes, Download, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { ReactFlow, type Node, type Edge, Background, Controls } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useCallback } from "react"

export default function LandingPage() {
  const initialNodes: Node[] = [
    {
      id: "1",
      type: "default",
      position: { x: 20, y: 20 },
      data: { label: "Place Order" },
      style: {
        background: "#0F1419",
        border: "2px solid #00D9FF",
        borderRadius: "8px",
        padding: "12px",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "600",
        boxShadow: "0 0 20px rgba(0, 217, 255, 0.2)",
      },
    },
    {
      id: "2",
      type: "default",
      position: { x: 200, y: 100 },
      data: { label: "Condition" },
      style: {
        background: "#0F1419",
        border: "2px solid #FFD700",
        borderRadius: "8px",
        padding: "12px",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "600",
        boxShadow: "0 0 20px rgba(255, 215, 0, 0.2)",
      },
    },
    {
      id: "3",
      type: "default",
      position: { x: 50, y: 200 },
      data: { label: "Wait" },
      style: {
        background: "#0F1419",
        border: "2px solid #9966FF",
        borderRadius: "8px",
        padding: "12px",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "600",
        boxShadow: "0 0 20px rgba(153, 102, 255, 0.2)",
      },
    },
  ]

  const initialEdges: Edge[] = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "#00D9FF", strokeWidth: 2 },
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      animated: true,
      style: { stroke: "#FFD700", strokeWidth: 2 },
    },
  ]

  const onNodeClick = useCallback(() => {
    console.log("Clicked in preview")
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background text-foreground">

      <Navbar/>

      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00B8E6]/10 border border-[#00B8E6]/20 text-[#00B8E6] text-sm font-medium">
                <Zap className="w-4 h-4" />
                High-Performance Trading Logic
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                Build Lightning-Fast Trading Logic.{" "}
                <span className="bg-gradient-to-r from-[#00B8E6] via-[#6B4ACF] to-[#00B8E6] bg-clip-text text-transparent">
                  Visually.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed text-pretty max-w-xl">
                A high-performance, low-code strategy builder powered by Kraken's API. Drag blocks, visualize flows, and
                simulate real execution — all inside your browser.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/editor">
                  <Button
                    size="lg"
                    className="bg-[#00B8E6] hover:bg-[#009FCC] text-black font-semibold text-base px-8 shadow-[0_0_20px_rgba(0,184,230,0.3)] hover:shadow-[0_0_25px_rgba(0,184,230,0.4)] transition-all"
                  >
                    Create New Strategy
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border hover:border-[#00B8E6]/50 hover:text-[#00B8E6] hover:bg-[#00B8E6]/10 text-foreground font-semibold text-base px-8 bg-transparent"
                  >
                    View Templates
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link href="/docs" className="hover:text-[#00B8E6] transition-colors flex items-center gap-2 ">
                  <BookOpen className="w-4 h-4" />
                  Documentation
                </Link>
                <a
                  href="https://github.com/MauriceBoendermaker/kraken_forge_hackathon_2025/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00B8E6] transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub Repository
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f2e] to-[#0a1f2e] opacity-30 blur-3xl rounded-full" />
              <Card className="relative border-border bg-card backdrop-blur-xl p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Strategy Preview</h3>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                  </div>
                </div>

                <div className="relative h-80 bg-background rounded-lg border border-border overflow-hidden">
                  <ReactFlow
                    nodes={initialNodes}
                    edges={initialEdges}
                    onNodeClick={onNodeClick}
                    fitView
                    attributionPosition="bottom-right"
                    proOptions={{ hideAttribution: true }}
                  >
                    <Background color="#00B8E6" gap={20} size={1} />
                  </ReactFlow>

                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-[#00B8E6]/15 border border-[#00B8E6]/30 backdrop-blur-sm">
                    <span className="text-xs text-[#00B8E6] font-medium">Interactive Demo</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Everything you need to trade smarter</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools designed for traders who demand precision and performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group p-6 border-border bg-card/50 backdrop-blur-xl hover:border-[#00D9FF]/50 transition-all hover:shadow-[0_0_30px_rgba(0,217,255,0.15)]">
              <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Boxes className="w-6 h-6 text-[#00D9FF]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Drag & Drop Strategy Builder</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Visual node editor with React Flow. Connect blocks intuitively without writing code.
              </p>
            </Card>

            <Card className="group p-6 border-border bg-card/50 backdrop-blur-xl hover:border-[#8B5CF6]/50 transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Live Backtesting Simulator</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Step-by-step execution logs with block highlighting for strategy validation.
              </p>
            </Card>

            <Card className="group p-6 border-border bg-card/50 backdrop-blur-xl hover:border-[#10B981]/50 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bug className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Flow Debugger</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Inspect inputs, outputs, and errors in real-time with advanced debugging tools.
              </p>
            </Card>

            <Card className="group p-6 border-border bg-card/50 backdrop-blur-xl hover:border-[#F59E0B]/50 transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Kraken API Integration</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                High-performance execution engine architecture with direct exchange connectivity.
              </p>
            </Card>

            <Card className="group p-6 border-border bg-card/50 backdrop-blur-xl hover:border-[#EC4899]/50 transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]">
              <div className="w-12 h-12 rounded-xl bg-[#EC4899]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-[#EC4899]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Template Gallery</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Load prebuilt strategies like DCA, Stop-Loss, Trailing TP, and Grid Trading.
              </p>
            </Card>

            <Card className="group p-4 border-border bg-card/50 backdrop-blur-xl hover:border-[#06B6D4]/50 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6 text-[#06B6D4]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Versioning & Export Tools</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Export JSON definitions, TypeScript SDK skeletons, and API request sequences.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="relative overflow-hidden border-border bg-card/70 backdrop-blur-xl p-8 hover:border-[#00D9FF]/30 transition-all group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D9FF] opacity-10 blur-[100px] rounded-full group-hover:opacity-20 transition-opacity" />
            <div className="relative">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Built for performance</h2>
                <p className="text-muted-foreground text-lg">Modern architecture powering lightning-fast execution</p>
              </div>
              <div className="bg-muted rounded-lg border border-border p-6">
                <pre className="text-sm text-foreground font-mono leading-relaxed overflow-x-auto">
                  {`┌─────────────────────────────────────────────────┐
│         React Flow Canvas (UI Layer)           │
│  Drag-and-drop • Node connections • Inspector  │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│        Strategy Engine (Node Engine)           │
│   Validation • Execution flow • State mgmt     │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│         Kraken API Wrapper (API Layer)         │
│   Authentication • Order mgmt • Market data    │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│              Kraken Exchange                    │
└─────────────────────────────────────────────────┘`}
                </pre>
              </div>
              <div className="mt-6 text-center">
                <Link href="/about">
                  <Button variant="link" className="text-[#00D9FF] hover:text-[#00B8E6] font-semibold">
                    Read the Architecture <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Start building in seconds
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Ready to build your first trading strategy?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join traders using visual workflows to automate their crypto strategies with precision and confidence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/editor">
              <Button
                size="lg"
                className="bg-[#00B8E6] hover:bg-[#009FCC] text-black font-semibold text-base px-8 shadow-[0_0_15px_rgba(0,184,230,0.2)] transition-all hover:shadow-[0_0_20px_rgba(0,184,230,0.3)]"
              >
                Create New Strategy
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer/>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
