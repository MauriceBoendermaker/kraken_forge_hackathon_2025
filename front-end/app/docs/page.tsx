"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Blocks, Rocket, Lightbulb, Code2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

const NAV_SECTIONS = [
  { id: "getting-started", label: "Getting Started", icon: Rocket },
  { id: "blocks-overview", label: "Blocks Overview", icon: Blocks },
  { id: "first-strategy", label: "Building Your First Strategy", icon: Lightbulb },
  { id: "examples", label: "Example Strategies", icon: Code2 },
  { id: "kraken-api", label: "Kraken API Basics", icon: BookOpen },
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started")

  return (
    <div className="min-h-screen bg-background">

      <Navbar/>

      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-12 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documentation</h1>
            <p className="text-muted-foreground mt-1">Learn how to build powerful trading strategies</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-50 space-y-2">
              {NAV_SECTIONS.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                      activeSection === section.id
                        ? "bg-[#00B8E6] text-accent-foreground font-medium shadow-sm"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started */}
            {activeSection === "getting-started" && (
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Welcome to the Trading Strategy Builder! This visual workflow editor lets you create, test, and deploy
                  automated trading strategies for crypto exchanges without writing code.
                </p>

                <Card className="p-6 border border-border bg-card mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Quick Start</h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      <span>Drag blocks from the left sidebar onto the canvas</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      <span>Connect blocks by dragging from output to input handles</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                      <span>Click a block to configure its properties in the right panel</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-xs font-bold">
                        4
                      </span>
                      <span>Validate your strategy and export to JSON or TypeScript</span>
                    </li>
                  </ol>
                </Card>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-400 flex items-start gap-2">
                    <span className="text-lg">💡</span>
                    <span>
                      <strong>Tip:</strong> Start with a pre-built template from the Templates gallery to learn by
                      example
                    </span>
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3">Core Concepts</h3>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <div>
                    <h4 className="text-foreground font-medium mb-2">Blocks</h4>
                    <p>
                      Blocks are the building units of your strategy. Each block performs a specific action like placing
                      an order, checking a condition, or waiting for a time interval.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-foreground font-medium mb-2">Connections</h4>
                    <p>
                      Connections define the execution flow between blocks. The strategy executes blocks in the order
                      determined by these connections.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-foreground font-medium mb-2">Validation</h4>
                    <p>
                      Before running a strategy, the validator checks for errors like missing required fields or invalid
                      connections to prevent execution failures.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Blocks Overview */}
            {activeSection === "blocks-overview" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Blocks Overview</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Learn about the different types of blocks available and how to use them in your trading strategies.
                </p>

                <div className="space-y-4">
                  <Card className="p-5 border border-border bg-card">
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
                        <span className="text-green-400 text-sm">📊</span>
                      </div>
                      Order Actions
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Execute trades and manage positions on the exchange
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 text-sm">
                        <code className="px-2 py-1 bg-muted text-[#00B8E6] rounded text-xs font-mono">Place Order</code>
                        <span className="text-muted-foreground">Submit buy/sell orders with limit or market type</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <code className="px-2 py-1 bg-muted text-[#00B8E6] rounded text-xs font-mono">Cancel Order</code>
                        <span className="text-muted-foreground">Cancel an existing open order by ID</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <code className="px-2 py-1 bg-muted text-[#00B8E6] rounded text-xs font-mono">Batch Add</code>
                        <span className="text-muted-foreground">Submit multiple orders at once</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-5 border border-border bg-card">
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400 text-sm">⚖️</span>
                      </div>
                      Conditions
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Control flow based on market data or logic checks
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 text-sm">
                        <code className="px-2 py-1 bg-muted text-[#00B8E6] rounded text-xs font-mono">If/Else</code>
                        <span className="text-muted-foreground">Branch execution based on a boolean condition</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <code className="px-2 py-1 bg-muted text-[#00B8E6] rounded text-xs font-mono">Compare</code>
                        <span className="text-muted-foreground">Compare two values (price, volume, balance)</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <code className="px-2 py-1 bg-muted text-[#00B8E6] rounded text-xs font-mono">
                          Price Threshold
                        </code>
                        <span className="text-muted-foreground">Trigger when price crosses a specific level</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-5 border border-border bg-card">
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-400 text-sm">🛠️</span>
                      </div>
                      Utilities
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Helper functions for timing, logging, and data fetching
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 text-sm">
                        <code className="px-2 py-1 bg-muted text-[#00B8E6] rounded text-xs font-mono">Wait</code>
                        <span className="text-muted-foreground">Pause execution for a specified duration</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <code className="px-2 py-1 bg-muted text-[#00B8E6] rounded text-xs font-mono">Get Balance</code>
                        <span className="text-muted-foreground">Fetch current account balances</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <code className="px-2 py-1 bg-muted text-[#00B8E6] rounded text-xs font-mono">Fetch Ticker</code>
                        <span className="text-muted-foreground">Get latest price data for a trading pair</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Building First Strategy */}
            {activeSection === "first-strategy" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Building Your First Strategy</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Follow this step-by-step guide to create a simple stop-loss strategy that protects your position.
                </p>

                <Card className="p-6 border border-[#00B8E6]/30 bg-[#00B8E6]/5">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Example: Stop-Loss Protection</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <h4 className="font-semibold text-foreground">Add a "Fetch Ticker" block</h4>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11">
                        Drag the "Fetch Ticker" utility block to the canvas. Configure it to monitor BTCUSD price every
                        60 seconds.
                      </p>
                      <div className="ml-11 mt-3 bg-slate-950 rounded border border-slate-800 p-3">
                        <code className="text-xs text-slate-300 font-mono">{`{ pair: "BTCUSD", interval: 60 }`}</code>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <h4 className="font-semibold text-foreground">Add a "Price Threshold" condition</h4>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11">
                        Connect a "Price Threshold" block that checks if price falls below your stop level (e.g.,
                        $40,000).
                      </p>
                      <div className="ml-11 mt-3 bg-slate-950 rounded border border-slate-800 p-3">
                        <code className="text-xs text-slate-300 font-mono">
                          {`{ operator: "<", threshold: 40000 }`}
                        </code>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        <h4 className="font-semibold text-foreground">Add a "Place Order" block</h4>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11">
                        Connect a "Place Order" block to the TRUE output. Set it to sell your position at market price.
                      </p>
                      <div className="ml-11 mt-3 bg-slate-950 rounded border border-slate-800 p-3">
                        <code className="text-xs text-slate-300 font-mono">
                          {`{ type: "market", side: "sell", size: 0.1 }`}
                        </code>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#00B8E6]/20 text-[#00B8E6] flex items-center justify-center text-sm font-bold">
                          4
                        </div>
                        <h4 className="font-semibold text-foreground">Validate and test</h4>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11">
                        Click "Validate" in the toolbar to check for errors, then use the Simulator to test with
                        historical data.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Example Strategies */}
            {activeSection === "examples" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Example Strategies</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Explore common trading strategy patterns and learn how to implement them.
                </p>

                <div className="grid gap-4">
                  <Card className="p-5 border border-border bg-card hover:border-[#00B8E6]/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-foreground">DCA (Dollar Cost Averaging)</h3>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                        Beginner
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Buy a fixed amount at regular intervals regardless of price to average out cost over time.
                    </p>
                    <div className="bg-slate-950 rounded border border-slate-800 p-4 mb-4">
                      <pre className="text-xs text-slate-300 font-mono leading-relaxed">
                        {`1. Wait (86400s) → Daily interval
2. Place Order (market buy, 0.01 BTC)
3. Loop back to step 1`}
                      </pre>
                    </div>
                    <Link href="/templates">
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Template
                      </Button>
                    </Link>
                  </Card>

                  <Card className="p-5 border border-border bg-card hover:border-[#00B8E6]/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-foreground">Grid Trading</h3>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full font-medium">
                        Advanced
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Place multiple buy and sell orders at different price levels to profit from volatility.
                    </p>
                    <div className="bg-slate-950 rounded border border-slate-800 p-4 mb-4">
                      <pre className="text-xs text-slate-300 font-mono leading-relaxed">
                        {`1. Batch Add (5 buy orders at -2%, -4%, -6%, -8%, -10%)
2. Batch Add (5 sell orders at +2%, +4%, +6%, +8%, +10%)
3. Monitor fills and replace executed orders`}
                      </pre>
                    </div>
                    <Link href="/templates">
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Template
                      </Button>
                    </Link>
                  </Card>

                  <Card className="p-5 border border-border bg-card hover:border-[#00B8E6]/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-foreground">Trailing Take-Profit</h3>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-medium">
                        Intermediate
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Lock in profits as price rises, but keep following the trend until reversal.
                    </p>
                    <div className="bg-slate-950 rounded border border-slate-800 p-4 mb-4">
                      <pre className="text-xs text-slate-300 font-mono leading-relaxed">
                        {`1. Fetch Ticker (monitor price)
2. If price > peak: Update peak
3. If price < (peak - 5%): Place sell order
4. Loop back to step 1`}
                      </pre>
                    </div>
                    <Link href="/templates">
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Template
                      </Button>
                    </Link>
                  </Card>
                </div>

                <Card className="p-5 border border-[#00B8E6]/30 bg-[#00B8E6]/5">
                  <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#00B8E6]" />
                    Templates Gallery
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore 8+ pre-built strategy templates ready to use or customize for your needs.
                  </p>
                  <Link href="/templates">
                    <Button className="gap-2 bg-[#00B8E6] hover:bg-[#00B8E6]/90 text-[#00B8E6]-foreground">
                      <Rocket className="w-4 h-4" />
                      Open Templates
                    </Button>
                  </Link>
                </Card>
              </div>
            )}

            {/* Kraken API */}
            {activeSection === "kraken-api" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Kraken API Basics</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Learn how your strategies translate to Kraken API calls and understand the authentication flow.
                </p>

                <Card className="p-6 border border-border bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    All authenticated Kraken API requests require an API key and signature. Keys are generated in your
                    Kraken account settings.
                  </p>
                  <div className="bg-slate-950 rounded border border-slate-800 p-4">
                    <code className="text-xs text-slate-300 font-mono">
                      {`API-Key: your-api-key-here
API-Sign: base64(hmac-sha512(path + nonce + postdata, secret))`}
                    </code>
                  </div>
                </Card>

                <Card className="p-6 border border-border bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Place Order Example</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    When you add a "Place Order" block, it generates a call to Kraken's AddOrder endpoint:
                  </p>
                  <div className="bg-slate-950 rounded border border-slate-800 p-4">
                    <pre className="text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto">
                      {`POST https://api.kraken.com/0/private/AddOrder

{
  "pair": "XXBTZUSD",
  "type": "buy",
  "ordertype": "limit",
  "price": "45000.0",
  "volume": "0.1",
  "validate": false
}`}
                    </pre>
                  </div>
                </Card>

                <Card className="p-6 border border-border bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Rate Limits</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Kraken enforces API rate limits to prevent abuse. Keep these limits in mind when designing your
                    strategies:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-[#00B8E6]">•</span>
                      <span>Public endpoints: 1 request per second</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00B8E6]">•</span>
                      <span>Private endpoints: Tier-based (15-20 requests per second for verified accounts)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00B8E6]">•</span>
                      <span>Use "Wait" blocks to respect rate limits and avoid bans</span>
                    </li>
                  </ul>
                </Card>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-yellow-400">
                    ⚠️ <strong>Warning:</strong> This builder uses mock API credentials for demonstration. Replace with
                    real credentials only in production environments with proper security measures.
                  </p>
                </div>

                <Card className="p-5 border border-[#00B8E6]/30 bg-[#00B8E6]/5">
                  <h3 className="text-base font-semibold text-foreground mb-2">External Resources</h3>
                  <div className="space-y-2">
                    <a
                      href="https://docs.kraken.com/rest/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#00B8E6] hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Kraken REST API Documentation
                    </a>
                    <a
                      href="https://support.kraken.com/hc/en-us/articles/360000919966"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#00B8E6] hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Kraken API Authentication Guide
                    </a>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer/>

    </div>
  )
}
