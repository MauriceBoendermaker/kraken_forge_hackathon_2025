"use client"

import { AdvancedConfigModalProps } from "@/interfaces/AdvancedConfigModalProps"

import { useState } from "react"
import { X, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function AdvancedConfigModal({ isOpen, onClose, nodeType, nodeData = {}, onSave }: AdvancedConfigModalProps) {
  const [formData, setFormData] = useState(nodeData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (nodeType === "order") {
      if (!formData.pair) newErrors.pair = "Trading pair is required"
      if (!formData.type) newErrors.type = "Order type is required"
      if (formData.size && formData.size <= 0) newErrors.size = "Size must be greater than 0"
      if (formData.price && formData.price <= 0) newErrors.price = "Price must be greater than 0"
    }

    if (nodeType === "condition") {
      if (!formData.operator) newErrors.operator = "Condition operator is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-card border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-bold text-foreground capitalize">Advanced {nodeType} Configuration</h2>
            <p className="text-sm text-muted-foreground mt-1">Fine-tune your strategy parameters</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {nodeType === "order" && (
            <>
              {/* Order Settings */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-1 h-1 bg-accent rounded-full" />
                  Order Settings
                </h3>
                <div className="grid grid-cols-2 gap-4 space-y-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Trading Pair</label>
                    <Input
                      placeholder="e.g., BTC/USD"
                      value={formData.pair || ""}
                      onChange={(e) => handleChange("pair", e.target.value)}
                      className={`bg-muted border ${errors.pair ? "border-destructive" : "border-border"}`}
                    />
                    {errors.pair && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.pair}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Order Type</label>
                    <select
                      value={formData.type || "limit"}
                      onChange={(e) => handleChange("type", e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="limit">Limit</option>
                      <option value="market">Market</option>
                      <option value="stop">Stop Loss</option>
                      <option value="take-profit">Take Profit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Time in Force</label>
                    <select
                      value={formData.tif || "GTC"}
                      onChange={(e) => handleChange("tif", e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="GTC">Good Till Canceled</option>
                      <option value="IOC">Immediate Or Cancel</option>
                      <option value="FOK">Fill Or Kill</option>
                      <option value="GTD">Good Till Date</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Size</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.size || ""}
                      onChange={(e) => handleChange("size", e.target.value)}
                      className={`bg-muted border ${errors.size ? "border-destructive" : "border-border"}`}
                    />
                    {errors.size && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.size}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.price || ""}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className={`bg-muted border ${errors.price ? "border-destructive" : "border-border"}`}
                    />
                    {errors.price && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.price}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.reduceOnly || false}
                        onChange={(e) => handleChange("reduceOnly", e.target.checked)}
                        className="w-4 h-4 rounded border-border cursor-pointer"
                      />
                      <span className="text-sm font-medium text-foreground">Reduce-Only (close positions only)</span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {nodeType === "condition" && (
            <>
              {/* Conditional Triggers */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full" />
                  Conditional Triggers
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Condition Type</label>
                    <select
                      value={formData.conditionType || "price"}
                      onChange={(e) => handleChange("conditionType", e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="price">Price Threshold</option>
                      <option value="volume">Volume</option>
                      <option value="time">Time Check</option>
                      <option value="technical">Technical Indicator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Operator</label>
                    <select
                      value={formData.operator || "greater"}
                      onChange={(e) => handleChange("operator", e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="greater">Greater than</option>
                      <option value="less">Less than</option>
                      <option value="equal">Equal to</option>
                      <option value="between">Between</option>
                    </select>
                    {errors.operator && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.operator}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Value</label>
                    <Input
                      placeholder="Enter threshold value"
                      value={formData.value || ""}
                      onChange={(e) => handleChange("value", e.target.value)}
                      className="bg-muted border border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Branching Outputs */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  If/Else Branches
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                    <p className="text-sm font-medium text-green-400 mb-2">True Path (Condition Met)</p>
                    <p className="text-xs text-muted-foreground">
                      Connect to block that executes when condition is true
                    </p>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <p className="text-sm font-medium text-red-400 mb-2">False Path (Condition Not Met)</p>
                    <p className="text-xs text-muted-foreground">
                      Connect to block that executes when condition is false
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {nodeType === "logic" && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1 h-1 bg-cyan-500 rounded-full" />
                Logic Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Logic Operator</label>
                  <select
                    value={formData.logicOp || "AND"}
                    onChange={(e) => handleChange("logicOp", e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="AND">AND (All conditions)</option>
                    <option value="OR">OR (Any condition)</option>
                    <option value="NOT">NOT (Inverse logic)</option>
                  </select>
                </div>
                <p className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
                  Use AND to require all connected inputs. Use OR to trigger on any input.
                </p>
              </div>
            </div>
          )}

          {/* Validation Status */}
          {Object.keys(errors).length > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">Configuration errors detected</p>
                <p className="text-xs text-muted-foreground mt-1">Please fix the highlighted fields below</p>
              </div>
            </div>
          )}

          {Object.keys(errors).length === 0 && Object.keys(formData).length > 0 && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-green-400">Configuration is valid</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border bg-card/50 sticky bottom-0">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
          >
            Save Configuration
          </Button>
        </div>
      </Card>
    </div>
  )
}
