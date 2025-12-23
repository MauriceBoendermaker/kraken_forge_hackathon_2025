"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, AlertTriangle, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

const SETTINGS_KEYS = {
  DEBUGGER_ENABLED: "settings-debugger-enabled",
  API_KEY: "settings-api-key",
  API_SECRET: "settings-api-secret",
  THEME: "settings-theme",
  HIGH_CONTRAST: "settings-high-contrast",
}

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [showApiSecret, setShowApiSecret] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [highContrast, setHighContrast] = useState(false)
  const [debuggerEnabled, setDebuggerEnabled] = useState(true)
  const [simulatorEnabled, setSimulatorEnabled] = useState(true)
  const [showResetWarning, setShowResetWarning] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDebugger = localStorage.getItem(SETTINGS_KEYS.DEBUGGER_ENABLED)
      const savedApiKey = localStorage.getItem(SETTINGS_KEYS.API_KEY)
      const savedApiSecret = localStorage.getItem(SETTINGS_KEYS.API_SECRET)
      const savedTheme = localStorage.getItem(SETTINGS_KEYS.THEME) as "dark" | "light" | null
      const savedHighContrast = localStorage.getItem(SETTINGS_KEYS.HIGH_CONTRAST)

      if (savedDebugger !== null) {
        setDebuggerEnabled(savedDebugger === "true")
      }
      if (savedApiKey) {
        setApiKey(savedApiKey)
      } else {
        setApiKey("mock_key_1234567890abcdef")
      }
      if (savedApiSecret) {
        setApiSecret(savedApiSecret)
      } else {
        setApiSecret("mock_secret_abcdefghijklmnop")
      }

      // Set dark as default if no theme is saved
      const themeToApply = savedTheme || "dark"
      setTheme(themeToApply)
      applyTheme(themeToApply)

      if (savedHighContrast !== null) {
        const highContrastValue = savedHighContrast === "true"
        setHighContrast(highContrastValue)
        applyHighContrast(highContrastValue)
      }
    }
  }, [])

  // Apply theme to document
  const applyTheme = (newTheme: "dark" | "light") => {
    if (typeof window !== "undefined") {
      const root = document.documentElement
      if (newTheme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  // Apply high contrast mode
  const applyHighContrast = (enabled: boolean) => {
    if (typeof window !== "undefined") {
      const root = document.documentElement
      if (enabled) {
        root.classList.add("high-contrast")
      } else {
        root.classList.remove("high-contrast")
      }
    }
  }

  // Handle theme change
  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme)
    applyTheme(newTheme)

    // Disable high contrast when switching to light mode
    if (newTheme === "light" && highContrast) {
      setHighContrast(false)
      applyHighContrast(false)
      if (typeof window !== "undefined") {
        localStorage.setItem(SETTINGS_KEYS.HIGH_CONTRAST, "false")
      }
    }

    // Save immediately to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_KEYS.THEME, newTheme)
    }
  }

  // Handle high contrast change
  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled)
    applyHighContrast(enabled)
    // Save immediately to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_KEYS.HIGH_CONTRAST, enabled.toString())
    }
  }

  const handleSave = () => {
    // Save all settings to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_KEYS.DEBUGGER_ENABLED, debuggerEnabled.toString())
      localStorage.setItem(SETTINGS_KEYS.API_KEY, apiKey)
      localStorage.setItem(SETTINGS_KEYS.API_SECRET, apiSecret)
      localStorage.setItem(SETTINGS_KEYS.THEME, theme)
      localStorage.setItem(SETTINGS_KEYS.HIGH_CONTRAST, highContrast.toString())

      alert("Settings saved successfully!")
    }
  }

  const handleResetData = () => {
    if (showResetWarning) {
      // Reset all localStorage data
      if (typeof window !== "undefined") {
        // Clear all strategy data
        localStorage.removeItem("strategy-builder-nodes")
        localStorage.removeItem("strategy-builder-edges")
        localStorage.removeItem("strategy-builder-metadata")
        localStorage.removeItem("execution-history")
        localStorage.removeItem("last-execution")
        localStorage.removeItem("strategy-version-history")
        localStorage.removeItem("validationResult")

        // Keep settings but could also clear them if desired
        // localStorage.clear() would clear everything including settings

        alert("All local data has been reset successfully!")
        setShowResetWarning(false)

        // Optionally redirect to home or reload
        setTimeout(() => {
          window.location.href = "/"
        }, 1000)
      }
    } else {
      setShowResetWarning(true)
    }
  }

  const handleDebuggerToggle = (checked: boolean) => {
    setDebuggerEnabled(checked)
    // Immediately save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_KEYS.DEBUGGER_ENABLED, checked.toString())
    }
  }

  return (
    <div className="min-h-screen bg-background">

      <Navbar/>

      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-12 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">Configure your trading strategy builder</p>
            </div>
            <Button onClick={handleSave} className="gap-2 bg-[#00B8E6] hover:bg-[#009FCC] text-accent-foreground">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* API & Integration */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-1">API & Integration</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Configure API credentials for exchange connections (mock/demo only)
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key" className="text-sm font-medium text-foreground mb-2 block">
                API Key
              </Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10 bg-muted border-border font-mono text-sm"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="api-secret" className="text-sm font-medium text-foreground mb-2 block">
                API Secret
              </Label>
              <div className="relative">
                <Input
                  id="api-secret"
                  type={showApiSecret ? "text" : "password"}
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="pr-10 bg-muted border-border font-mono text-sm"
                />
                <button
                  onClick={() => setShowApiSecret(!showApiSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-400">
                ℹ️ This is a mock/demo environment. API credentials are not used for live trading.
              </p>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-1">Appearance</h2>
          <p className="text-sm text-muted-foreground mb-6">Customize the visual theme and display settings</p>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Theme</Label>
                <p className="text-xs text-muted-foreground mt-1">Choose between light and dark mode</p>
              </div>
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    theme === "light"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Light
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
                    Preview
                  </span>
                </button>
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <Label className="text-sm font-medium text-foreground">High Contrast Mode</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {theme === "light"
                    ? "Only available in dark mode"
                    : "Increase contrast for better readability"}
                </p>
              </div>
              <Switch
                checked={highContrast}
                onCheckedChange={handleHighContrastChange}
                disabled={theme === "light"}
              />
            </div>
          </div>
        </Card>

        {/* Data & Storage */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-1">Data & Storage</h2>
          <p className="text-sm text-muted-foreground mb-6">Manage your local strategy data and storage</p>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Reset All Local Data</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Delete all saved strategies, templates, and preferences
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleResetData} className="gap-2">
                <AlertTriangle className="w-4 h-4" />
                {showResetWarning ? "Confirm Reset" : "Reset Data"}
              </Button>
            </div>

            {showResetWarning && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-sm text-red-400 font-medium mb-2">⚠️ Warning: This action cannot be undone</p>
                <p className="text-xs text-red-400/80">
                  All your saved strategies, templates, and preferences will be permanently deleted.
                </p>
                <Button variant="ghost" size="sm" onClick={() => setShowResetWarning(false)} className="mt-3 text-xs">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Experimental Features */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-1">Experimental Features</h2>
          <p className="text-sm text-muted-foreground mb-6">Enable or disable beta features and testing tools</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex-1">
                <Label className="text-sm font-medium text-foreground">Enable Flow Debugger</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Show the bottom debugger panel for execution tracking
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-1.5 mt-2 inline-block">
                  <p className="text-xs text-green-400 font-medium">✓ Functional</p>
                </div>
              </div>
              <Switch checked={debuggerEnabled} onCheckedChange={handleDebuggerToggle} />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border opacity-60">
              <div className="flex-1">
                <Label className="text-sm font-medium text-foreground">Enable Backtest Simulator</Label>
                <p className="text-xs text-muted-foreground mt-1">Run historical backtests on your strategies</p>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-1.5 mt-2 inline-block">
                  <p className="text-xs text-orange-400 font-medium">🚧 Work in Progress - Coming Soon</p>
                </div>
              </div>
              <Switch
                checked={simulatorEnabled}
                onCheckedChange={() => {}}
                disabled
                className="cursor-not-allowed"
              />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
              <p className="text-sm text-yellow-400">⚡ Experimental features may be unstable and subject to change</p>
            </div>
          </div>
        </Card>
      </div>

      <Footer/>

    </div>
  )
}
