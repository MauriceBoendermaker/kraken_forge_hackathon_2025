"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Play, SkipForward, Pause, RotateCcw, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SimulationStep {
  id: string
  stepNumber: number
  blockName: string
  blockType: string
  timestamp: string
  status: "completed" | "active" | "pending"
  inputs?: Record<string, any>
  outputs?: Record<string, any>
}

const mockSimulationSteps: SimulationStep[] = [
  {
    id: "step-1",
    stepNumber: 1,
    blockName: "Get Balance",
    blockType: "utility",
    timestamp: "0.00s",
    status: "completed",
    inputs: { account: "main" },
    outputs: { balance: "1.5 BTC", usd_value: "67500" },
  },
  {
    id: "step-2",
    stepNumber: 2,
    blockName: "Price Check",
    blockType: "condition",
    timestamp: "0.15s",
    status: "completed",
    inputs: { pair: "BTCUSD", threshold: "45000" },
    outputs: { current_price: "45125", condition_met: true },
  },
  {
    id: "step-3",
    stepNumber: 3,
    blockName: "Place Order",
    blockType: "order",
    timestamp: "0.32s",
    status: "active",
    inputs: { pair: "BTCUSD", type: "limit", size: 0.1, price: 45100 },
    outputs: { order_id: "pending...", status: "submitting" },
  },
  {
    id: "step-4",
    stepNumber: 4,
    blockName: "Wait",
    blockType: "utility",
    timestamp: "pending",
    status: "pending",
    inputs: { duration: 3600 },
  },
  {
    id: "step-5",
    stepNumber: 5,
    blockName: "Cancel If Not Filled",
    blockType: "order",
    timestamp: "pending",
    status: "pending",
  },
]

export default function SimulatorPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState("1x")
  const [selectedStep, setSelectedStep] = useState<string | null>("step-3")

  const handleRunSimulation = () => {
    setIsRunning(!isRunning)
  }

  const handleStepThrough = () => {
    // Step to next pending step
    const nextPending = mockSimulationSteps.find((s) => s.status === "pending")
    if (nextPending) {
      setSelectedStep(nextPending.id)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setSelectedStep(null)
  }

  const activeStep = mockSimulationSteps.find((s) => s.id === selectedStep)

  return (
    <div className="min-h-screen bg-background">

      <Navbar/>

      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-12 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Execution Simulator</h1>
              <p className="text-muted-foreground mt-1">Dry-run your strategy and preview execution flow</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={speed} onValueChange={setSpeed}>
                <SelectTrigger className="w-24 bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1x">1x</SelectItem>
                  <SelectItem value="2x">2x</SelectItem>
                  <SelectItem value="4x">4x</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleStepThrough} className="gap-2 bg-transparent hover:text-[#009FCC]">
                <SkipForward className="w-4 h-4" />
                Step
              </Button>
              <Button
                onClick={handleRunSimulation}
                className="gap-2 bg-[#00B8E6] hover:bg-[#009FCC] text-accent-foreground"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? "Pause" : "Run"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Mini Flow Visualization */}
          <div className="lg:col-span-1">
            <Card className="p-4 border border-border bg-card sticky top-50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Strategy Flow</h3>
              <div className="space-y-2">
                {mockSimulationSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setSelectedStep(step.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      step.id === selectedStep
                        ? "border-[#00B8E6] bg-[#00B8E6]/10 shadow-[0_0_12px_rgba(102,187,255,0.3)]"
                        : step.status === "completed"
                          ? "border-green-500/30 bg-green-500/5"
                          : step.status === "active"
                            ? "border-[#00B8E6]/50 bg-[#00B8E6]/5"
                            : "border-border bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          step.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : step.status === "active"
                              ? "bg-[#00B8E6]/20 text-[#00B8E6] animate-pulse"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.stepNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{step.blockName}</p>
                        <p className="text-xs text-muted-foreground">{step.blockType}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Execution Timeline & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <Card className="p-6 border border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Execution Timeline</h3>
              <div className="space-y-3">
                {mockSimulationSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Connector Line */}
                    {index < mockSimulationSteps.length - 1 && (
                      <div
                        className={`absolute left-[15px] top-8 w-0.5 h-6 ${
                          step.status === "completed" ? "bg-green-500/50" : "bg-border"
                        }`}
                      />
                    )}

                    <button
                      onClick={() => setSelectedStep(step.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all hover:bg-card/80 ${
                        step.id === selectedStep ? "border-[#00B8E6] bg-[#00B8E6]/5" : "border-border bg-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            step.status === "completed"
                              ? "bg-green-500/20 text-green-400 ring-2 ring-green-500/30"
                              : step.status === "active"
                                ? "bg-[#00B8E6]/20 text-[#00B8E6] ring-2 ring-[#00B8E6]/50 animate-pulse"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-foreground">{step.blockName}</h4>
                            <span className="text-xs font-mono text-muted-foreground">{step.timestamp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Type: <span className="text-[#00B8E6]">{step.blockType}</span>
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 transition-colors ${
                            step.id === selectedStep ? "text-[#00B8E6]" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Step Details */}
            {activeStep && (
              <Card className="p-6 border border-border bg-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Step {activeStep.stepNumber} Details</h3>
                    <p className="text-sm text-muted-foreground">{activeStep.blockName}</p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      activeStep.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : activeStep.status === "active"
                          ? "bg-[#00B8E6]/20 text-[#00B8E6]"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {activeStep.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Inputs */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Inputs</h4>
                    {activeStep.inputs ? (
                      <div className="bg-slate-950 rounded-lg border border-slate-800 p-4">
                        <pre className="text-xs font-mono text-slate-300">
                          {JSON.stringify(activeStep.inputs, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No inputs</p>
                    )}
                  </div>

                  {/* Outputs */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Outputs</h4>
                    {activeStep.outputs ? (
                      <div className="bg-slate-950 rounded-lg border border-slate-800 p-4">
                        <pre className="text-xs font-mono text-slate-300">
                          {JSON.stringify(activeStep.outputs, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Pending execution</p>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer/>

    </div>
  )
}
