"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X, TrendingUp, RefreshCw } from "lucide-react"

// Top 10 crypto trading pairs - TradingView symbols
const TRADING_PAIRS = [
  { value: "BTCUSD", label: "BTC/USD" },
  { value: "ETHUSD", label: "ETH/USD" },
  { value: "USDTUSD", label: "USDT/USD" },
  { value: "XRPUSD", label: "XRP/USD" },
  { value: "SOLUSD", label: "SOL/USD" },
  { value: "ADAUSD", label: "ADA/USD" },
  { value: "DOTUSD", label: "DOT/USD" },
  { value: "MATICUSD", label: "MATIC/USD" },
  { value: "AVAXUSD", label: "AVAX/USD" },
  { value: "LINKUSD", label: "LINK/USD" },
]

const INTERVALS = [
  { value: "60", label: "1 Hour" },
  { value: "240", label: "4 Hours" },
  { value: "D", label: "1 Day" },
]

interface ChartPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ChartPanel({ isOpen, onClose }: ChartPanelProps) {
  const widgetRef = useRef<HTMLDivElement>(null)
  const [selectedPair, setSelectedPair] = useState("BTCUSD")
  const [selectedInterval, setSelectedInterval] = useState("240")
  const [isLoading, setIsLoading] = useState(true)

  // Initialize TradingView widget
  useEffect(() => {
    if (!isOpen) return

    setIsLoading(true)

    // Delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      const container = widgetRef.current
      if (!container) {
        console.warn("Chart container not ready")
        setIsLoading(false)
        return
      }

      // Clear previous widget
      container.innerHTML = ""

      // Set unique ID for container
      const containerId = `tradingview_${Date.now()}`
      container.id = containerId

      // Check if TradingView is already loaded
      if (typeof (window as any).TradingView !== "undefined") {
        // Initialize widget directly
        new (window as any).TradingView.widget({
          width: "100%",
          height: 600,
          symbol: `KRAKEN:${selectedPair}`,
          interval: selectedInterval,
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#0F1419",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: false,
          container_id: containerId,
          backgroundColor: "#0F1419",
          gridColor: "#1f2937",
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: [],
        })
        setTimeout(() => setIsLoading(false), 1500)
      } else {
        // Load TradingView script first
        const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]')

        if (existingScript) {
          // Script is loading or already loaded
          existingScript.addEventListener("load", () => {
            if (container && typeof (window as any).TradingView !== "undefined") {
              new (window as any).TradingView.widget({
                width: "100%",
                height: 600,
                symbol: `KRAKEN:${selectedPair}`,
                interval: selectedInterval,
                timezone: "Etc/UTC",
                theme: "dark",
                style: "1",
                locale: "en",
                toolbar_bg: "#0F1419",
                enable_publishing: false,
                hide_side_toolbar: false,
                allow_symbol_change: false,
                container_id: containerId,
                backgroundColor: "#0F1419",
                gridColor: "#1f2937",
                hide_top_toolbar: false,
                hide_legend: false,
                save_image: false,
                studies: [],
              })
              setTimeout(() => setIsLoading(false), 1500)
            }
          })
        } else {
          // Create and load script
          const script = document.createElement("script")
          script.src = "https://s3.tradingview.com/tv.js"
          script.async = true
          script.onload = () => {
            if (container && typeof (window as any).TradingView !== "undefined") {
              new (window as any).TradingView.widget({
                width: "100%",
                height: 600,
                symbol: `KRAKEN:${selectedPair}`,
                interval: selectedInterval,
                timezone: "Etc/UTC",
                theme: "dark",
                style: "1",
                locale: "en",
                toolbar_bg: "#0F1419",
                enable_publishing: false,
                hide_side_toolbar: false,
                allow_symbol_change: false,
                container_id: containerId,
                backgroundColor: "#0F1419",
                gridColor: "#1f2937",
                hide_top_toolbar: false,
                hide_legend: false,
                save_image: false,
                studies: [],
              })
              setTimeout(() => setIsLoading(false), 1500)
            }
          }
          script.onerror = () => {
            console.error("Failed to load TradingView script")
            setIsLoading(false)
          }
          document.head.appendChild(script)
        }
      }
    }, 200)

    return () => {
      clearTimeout(timeout)
    }
  }, [isOpen, selectedPair, selectedInterval])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] h-[90vh] p-0 gap-0 bg-sidebar border-sidebar-border">
        <DialogHeader className="px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#00b8e6]" />
              <DialogTitle className="text-lg font-semibold text-sidebar-foreground">Market Chart</DialogTitle>
            </div>
            <div className="flex items-center gap-3">
              {/* Pair Selection */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground whitespace-nowrap">Pair:</label>
                <Select value={selectedPair} onValueChange={setSelectedPair}>
                  <SelectTrigger className="h-9 w-32 bg-card border-sidebar-border text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRADING_PAIRS.map((pair) => (
                      <SelectItem key={pair.value} value={pair.value}>
                        {pair.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Interval Selection */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground whitespace-nowrap">Timeframe:</label>
                <Select value={selectedInterval} onValueChange={setSelectedInterval}>
                  <SelectTrigger className="h-9 w-28 bg-card border-sidebar-border text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVALS.map((interval) => (
                      <SelectItem key={interval.value} value={interval.value}>
                        {interval.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Chart Container */}
        <div className="flex-1 overflow-hidden p-6 relative">
          <Card className="h-full border-sidebar-border bg-card/50 overflow-hidden relative">
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-sidebar-border rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-[#00b8e6] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium text-foreground">Loading Chart...</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedPair} • {INTERVALS.find(i => i.value === selectedInterval)?.label}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div ref={widgetRef} className="w-full h-full" />
          </Card>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            Powered by TradingView • Live data from Kraken Exchange
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
