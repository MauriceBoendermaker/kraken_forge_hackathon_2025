"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Download, Code2, FileJson, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExportProps {
  strategyName?: string
}

// Mock strategy data - in real app, this would come from router state or params
const mockStrategy = {
  name: "BTC DCA Strategy",
  description: "Daily dollar-cost averaging for Bitcoin",
  version: "1.0.0",
  nodes: [
    {
      id: "order-1",
      type: "order",
      data: { label: "Place Order", pair: "BTCUSD", type: "limit", size: 0.1 },
    },
    {
      id: "wait-1",
      type: "utility",
      data: { label: "Wait", duration: 3600 },
    },
    {
      id: "condition-1",
      type: "condition",
      data: { label: "If/Else", condition: "price > 40000" },
    },
  ],
  edges: [
    { source: "order-1", target: "wait-1" },
    { source: "wait-1", target: "condition-1" },
  ],
}

// Generate JSON export
const jsonExport = JSON.stringify(mockStrategy, null, 2)

// Generate TypeScript SDK skeleton
const typescriptExport = `import { TradingStrategy, Order, Condition } from '@kraken/trading-sdk'

export class ${mockStrategy.name.replace(/\s+/g, "")}Strategy extends TradingStrategy {
  private pair = '${mockStrategy.nodes[0]?.data?.pair || "BTCUSD"}'
  private orderSize = ${mockStrategy.nodes[0]?.data?.size || 0.1}

  async execute(): Promise<void> {
    // Place initial order
    const order = await this.placeOrder({
      pair: this.pair,
      type: 'limit',
      size: this.orderSize,
      price: await this.getCurrentPrice(),
    })

    // Wait for ${mockStrategy.nodes[1]?.data?.duration || 3600} seconds
    await this.wait(${mockStrategy.nodes[1]?.data?.duration || 3600})

    // Check condition
    if (${mockStrategy.nodes[2]?.data?.condition || "true"}) {
      await this.executeNextBlock()
    }
  }
}

// Export strategy instance
export default new ${mockStrategy.name.replace(/\s+/g, "")}Strategy()
`

// Generate Kraken API request preview
const krakenApiExport = `curl -X POST https://api.kraken.com/0/private/AddOrder \\
  -H "API-Key: your-api-key" \\
  -H "API-Sign: your-signature" \\
  -d "pair=${mockStrategy.nodes[0]?.data?.pair || "BTCUSD"}" \\
  -d "type=buy" \\
  -d "ordertype=limit" \\
  -d "price=40000" \\
  -d "volume=${mockStrategy.nodes[0]?.data?.size || 0.1}" \\
  -d "nonce=\$(date +%s%N | cut -b1-13)"

# Response:
{
  "error": [],
  "result": {
    "descr": {
      "order": "buy 0.1 BTCUSD @ limit 40000"
    },
    "txid": ["TXHCXH-BW3X3-BUCMWZ"]
  }
}
`

function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div className="relative bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
        <div className="absolute top-3 right-3 z-10">
          <Button
            size="sm"
            variant="ghost"
            onClick={copyToClipboard}
            className="gap-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
      <p className="text-xs text-slate-400">Language: {language}</p>
    </div>
  )
}

export default function ExportPage() {
  const [downloadFormat, setDownloadFormat] = useState("json")

  const handleDownload = () => {
    let content = ""
    let filename = ""
    let mimeType = "text/plain"

    if (downloadFormat === "json") {
      content = jsonExport
      filename = `${mockStrategy.name.replace(/\s+/g, "-")}.json`
    } else if (downloadFormat === "typescript") {
      content = typescriptExport
      filename = `${mockStrategy.name.replace(/\s+/g, "")}.ts`
      mimeType = "text/typescript"
    } else {
      content = krakenApiExport
      filename = `${mockStrategy.name.replace(/\s+/g, "-")}-api.sh`
      mimeType = "text/plain"
    }

    const element = document.createElement("a")
    element.setAttribute("href", "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(content))
    element.setAttribute("download", filename)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-background">

      <Navbar/>

      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-15 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Export Strategy</h1>
            <p className="text-muted-foreground mt-1">
              Export "{mockStrategy.name}" in multiple formats for integration with your trading infrastructure
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Strategy Info Card */}
        <Card className="mb-8 p-6 border border-border bg-card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">STRATEGY NAME</p>
              <p className="text-sm font-semibold text-foreground">{mockStrategy.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">VERSION</p>
              <p className="text-sm font-semibold text-foreground">{mockStrategy.version}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">TOTAL BLOCKS</p>
              <p className="text-sm font-semibold text-foreground">{mockStrategy.nodes.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">CONNECTIONS</p>
              <p className="text-sm font-semibold text-foreground">{mockStrategy.edges.length}</p>
            </div>
          </div>
        </Card>

        {/* Export Formats Tabs */}
        <Tabs defaultValue="json" className="w-full" onValueChange={setDownloadFormat}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger
                value="json"
                className="gap-2 data-[state=active]:bg-[#00B8E6] data-[state=active]:text-accent-foreground"
              >
                <FileJson className="w-4 h-4" />
                JSON
              </TabsTrigger>
              <TabsTrigger
                value="typescript"
                className="gap-2 data-[state=active]:bg-[#00B8E6] data-[state=active]:text-accent-foreground"
              >
                <Code2 className="w-4 h-4" />
                TypeScript
              </TabsTrigger>
              <TabsTrigger
                value="kraken"
                className="gap-2 data-[state=active]:bg-[#00B8E6] data-[state=active]:text-accent-foreground"
              >
                <Send className="w-4 h-4" />
                Kraken API
              </TabsTrigger>
            </TabsList>

            <Button onClick={handleDownload} className="gap-2 bg-[#00B8E6] hover:bg-[#009FCC] text-accent-foreground">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>

          <TabsContent value="json" className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">JSON Definition</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export your strategy as a JSON file for backup or version control. This format contains all nodes,
                connections, and metadata.
              </p>
            </div>
            <CodeBlock code={jsonExport} language="json" />
          </TabsContent>

          <TabsContent value="typescript" className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">TypeScript SDK Skeleton</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a TypeScript class that implements your strategy using our Trading SDK. Extend this with your
                custom logic and error handling.
              </p>
            </div>
            <CodeBlock code={typescriptExport} language="typescript" />
          </TabsContent>

          <TabsContent value="kraken" className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Kraken API Request Preview</h3>
              <p className="text-sm text-muted-foreground mb-4">
                See how your strategy translates to Kraken API requests. Use these requests directly with your API
                credentials and secure signing process.
              </p>
            </div>
            <CodeBlock code={krakenApiExport} language="bash" />
          </TabsContent>
        </Tabs>

        {/* Additional Info */}
        <Card className="mt-8 p-6 border border-border bg-card/50">
          <h3 className="text-sm font-semibold text-foreground mb-3">Export Notes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Keep your JSON exports version controlled for strategy history and rollback capabilities</li>
            <li>✓ Use the TypeScript SDK to add custom pre/post-trade hooks, risk management, and monitoring</li>
            <li>✓ The Kraken API preview is for reference - use official SDK for production integrations</li>
          </ul>
        </Card>
      </div>

      <Footer/>

    </div>
  )
}
