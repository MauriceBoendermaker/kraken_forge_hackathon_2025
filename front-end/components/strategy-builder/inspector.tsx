import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, X, Settings } from "lucide-react"
import { Node } from "@xyflow/react"
import { AddOrderParams } from "@/api/add_order"
import { AmendOrderParams } from "@/api/amend_order"
import { CancelOrderParams } from "@/api/cancel_order"
import { CancelAllOrdersAfterParams } from "@/api/cancel_all_orders"
import { AddOrderBatchParams } from "@/api/add_order_batch"
import { CancelOrderBatchParams } from "@/api/cancel_order_batch"
import { NodeType } from "@/types/NodeType"

// Define the actual node data types used in the application
type OrderNodeData = {
  [key: string]: any
  actionType?: string
  label: string
}

type ConditionNodeData = {
  [key: string]: any
  label: string
  conditionType: string
}

type UtilityNodeData = {
  [key: string]: any
  label: string
  utilityType: string
}

type SystemNodeData = {
  [key: string]: any
  label: string
  utilityType: string
}

type StrategyNodeData = {
  [key: string]: any
  label: string
}
type StrategyNode = Node<StrategyNodeData, NodeType>

interface InspectorProps {
  node: StrategyNode | null
  onUpdateNode: (nodeId: string, data: Partial<any>) => void
  onDeleteNode: (nodeId: string) => void
}

export function Inspector({ node, onUpdateNode, onDeleteNode }: InspectorProps) {
  const [hasChanges, setHasChanges] = useState(false)

  if (!node) {
    return (
      <div className="w-80 bg-sidebar border-l border-sidebar-border flex flex-col items-center justify-center gap-4 p-6">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-sidebar-foreground">No Block Selected</p>
          <p className="text-xs text-muted-foreground">Click a block on the canvas to configure</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (key: string, value: any) => {
    onUpdateNode(node.id, { [key]: value })
    setHasChanges(true)
  }

  const handleSave = () => {
    setHasChanges(false)
  }

  return (
    <div className="w-80 bg-sidebar border-l border-sidebar-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-sidebar border-b border-sidebar-border p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-sidebar-foreground">{node.data.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">Configure block parameters</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onDeleteNode(node.id)
              setHasChanges(false)
            }}
            className="hover:bg-destructive/20 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Label - Available for all nodes */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Block Label</Label>
          <Input
            value={(node.data as any).label || ""}
            onChange={(e) => handleInputChange("label", e.target.value)}
            placeholder="Enter custom label..."
            className="mt-1.5 bg-card border-sidebar-border text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">Custom name for this block</p>
        </div>

        {/* Add Order */}
        {node.data.actionType === "add-order" && (
          <>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Order Type</Label>
              <Select
                value={(node.data as AddOrderParams).ordertype}
                onValueChange={(value) => handleInputChange("ordertype", value)}
              >
                <SelectTrigger className="mt-1.5 bg-card border-sidebar-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                  <SelectItem value="iceberg">Iceberg</SelectItem>
                  <SelectItem value="stop-loss">Stop Loss</SelectItem>
                  <SelectItem value="take-profit">Take Profit</SelectItem>
                  <SelectItem value="stop-loss-limit">Stop Loss Limit</SelectItem>
                  <SelectItem value="take-profit-limit">Take Profit Limit</SelectItem>
                  <SelectItem value="trailing-stop">Trailing Stop</SelectItem>
                  <SelectItem value="trailing-stop-limit">Trailing Stop Limit</SelectItem>
                  <SelectItem value="settle-position">Settle Position</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Side</Label>
              <Select
                value={(node.data as AddOrderParams).type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="mt-1.5 bg-card border-sidebar-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Trading Pair</Label>
              <Input
                value={(node.data as AddOrderParams).pair}
                onChange={(e) => handleInputChange("pair", e.target.value)}
                placeholder="XBTUSD"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Volume</Label>
              <Input
                value={(node.data as AddOrderParams).volume}
                onChange={(e) => handleInputChange("volume", e.target.value)}
                placeholder="1.0"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            {(node.data as AddOrderParams).ordertype !== "market" && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Price {(node.data as AddOrderParams).ordertype === "limit" ? "(required)" : "(optional)"}
                </Label>
                <Input
                  value={(node.data as AddOrderParams).price || ""}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className="mt-1.5 bg-card border-sidebar-border text-sm"
                />
              </div>
            )}

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Client Order ID (optional)</Label>
              <Input
                value={(node.data as AddOrderParams).cl_ord_id || ""}
                onChange={(e) => handleInputChange("cl_ord_id", e.target.value)}
                placeholder="UUID or custom ID"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Display Volume (iceberg only)</Label>
              <Input
                value={(node.data as AddOrderParams).displayvol || ""}
                onChange={(e) => handleInputChange("displayvol", e.target.value)}
                placeholder="Min 1/15 of volume"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Secondary Price (stop/take-profit limits)</Label>
              <Input
                value={(node.data as any).price2 || ""}
                onChange={(e) => handleInputChange("price2", e.target.value)}
                placeholder="0.00"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Trigger Signal</Label>
              <Select
                value={(node.data as any).trigger || "last"}
                onValueChange={(value) => handleInputChange("trigger", value)}
              >
                <SelectTrigger className="mt-1.5 bg-card border-sidebar-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last">Last Price</SelectItem>
                  <SelectItem value="index">Index Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Time in Force</Label>
              <Select
                value={(node.data as any).timeinforce || "GTC"}
                onValueChange={(value) => handleInputChange("timeinforce", value)}
              >
                <SelectTrigger className="mt-1.5 bg-card border-sidebar-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GTC">Good Till Cancelled</SelectItem>
                  <SelectItem value="IOC">Immediate or Cancel</SelectItem>
                  <SelectItem value="GTD">Good Till Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Leverage (optional)</Label>
              <Input
                value={(node.data as any).leverage || ""}
                onChange={(e) => handleInputChange("leverage", e.target.value)}
                placeholder="e.g., 2, 3, 5"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reduce-only"
                checked={(node.data as any).reduce_only || false}
                onChange={(e) => handleInputChange("reduce_only", e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="reduce-only" className="text-xs font-medium text-muted-foreground cursor-pointer">
                Reduce Only (close position only)
              </Label>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Order Flags (comma separated)</Label>
              <Input
                value={(node.data as any).oflags || ""}
                onChange={(e) => handleInputChange("oflags", e.target.value)}
                placeholder="e.g., post, fcib, fciq"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>
          </>
        )}

        {/* Amend Order */}
        {node.data.actionType === "amend-order" && (
          <>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Order ID (txid)</Label>
              <Input
                value={(node.data as AmendOrderParams).txid || ""}
                onChange={(e) => handleInputChange("txid", e.target.value)}
                placeholder="Order transaction ID"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Client Order ID (alternative)</Label>
              <Input
                value={(node.data as AmendOrderParams).cl_ord_id || ""}
                onChange={(e) => handleInputChange("cl_ord_id", e.target.value)}
                placeholder="Client order ID"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">New Order Quantity</Label>
              <Input
                value={(node.data as AmendOrderParams).order_qty || ""}
                onChange={(e) => handleInputChange("order_qty", e.target.value)}
                placeholder="1.0"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">New Limit Price</Label>
              <Input
                value={(node.data as AmendOrderParams).limit_price || ""}
                onChange={(e) => handleInputChange("limit_price", e.target.value)}
                placeholder="0.00 or +/-/%"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">New Trigger Price</Label>
              <Input
                value={(node.data as AmendOrderParams).trigger_price || ""}
                onChange={(e) => handleInputChange("trigger_price", e.target.value)}
                placeholder="0.00 or +/-/%"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Display Quantity (iceberg)</Label>
              <Input
                value={(node.data as AmendOrderParams).display_qty || ""}
                onChange={(e) => handleInputChange("display_qty", e.target.value)}
                placeholder="Visible order quantity"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Pair (for non-crypto)</Label>
              <Input
                value={(node.data as AmendOrderParams).pair || ""}
                onChange={(e) => handleInputChange("pair", e.target.value)}
                placeholder="e.g., AAPL/USD"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="post-only"
                checked={(node.data as AmendOrderParams).post_only || false}
                onChange={(e) => handleInputChange("post_only", e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="post-only" className="text-xs font-medium text-muted-foreground cursor-pointer">
                Post Only (for limit price amends)
              </Label>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Deadline (RFC3339)</Label>
              <Input
                value={(node.data as AmendOrderParams).deadline || ""}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                placeholder="2024-12-31T23:59:59Z"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>
          </>
        )}

        {/* Cancel Order */}
        {node.data.actionType === "cancel-order" && (
          <>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Order ID (txid)</Label>
              <Input
                value={(node.data as CancelOrderParams).txid?.toString() || ""}
                onChange={(e) => handleInputChange("txid", e.target.value)}
                placeholder="Order transaction ID"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Client Order ID (alternative)</Label>
              <Input
                value={(node.data as CancelOrderParams).cl_ord_id || ""}
                onChange={(e) => handleInputChange("cl_ord_id", e.target.value)}
                placeholder="Client order ID"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
            </div>
          </>
        )}

        {/* Cancel All Orders */}
        {node.data.actionType === "cancel-all-orders" && (
          <div className="text-xs text-muted-foreground">
            This action requires no additional parameters. It will cancel all open orders when executed.
          </div>
        )}

        {/* Cancel All Orders After */}
        {node.data.actionType === "cancel-all-orders-after" && (
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Timeout (seconds)</Label>
            <Input
              type="number"
              value={(node.data as CancelAllOrdersAfterParams).timeout}
              onChange={(e) => handleInputChange("timeout", parseInt(e.target.value))}
              placeholder="60"
              className="mt-1.5 bg-card border-sidebar-border text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">Dead man's switch timer. Set to 0 to disable.</p>
          </div>
        )}

        {/* Add Order Batch */}
        {node.data.actionType === "batch-add" && (
          <>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Trading Pair</Label>
              <Input
                value={(node.data as AddOrderBatchParams).pair}
                onChange={(e) => handleInputChange("pair", e.target.value)}
                placeholder="XBTUSD"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">All orders in batch must use this pair</p>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Asset Class (for non-crypto)</Label>
              <Select
                value={(node.data as AddOrderBatchParams).asset_class || ""}
                onValueChange={(value) => handleInputChange("asset_class", value || undefined)}
              >
                <SelectTrigger className="mt-1.5 bg-card border-sidebar-border text-sm">
                  <SelectValue placeholder="None (crypto)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">None (crypto)</SelectItem>
                  <SelectItem value="tokenized_asset">Tokenized Asset</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Deadline (RFC3339)</Label>
              <Input
                value={(node.data as AddOrderBatchParams).deadline || ""}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                placeholder="2024-12-31T23:59:59Z"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Min now()+2s, max now()+60s</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="validate-only"
                checked={(node.data as AddOrderBatchParams).validate || false}
                onChange={(e) => handleInputChange("validate", e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="validate-only" className="text-xs font-medium text-muted-foreground cursor-pointer">
                Validate Only (don't submit)
              </Label>
            </div>

            <div className="border-t border-sidebar-border pt-3 mt-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Orders in Batch</p>
              <div className="text-xs text-muted-foreground">
                Currently {((node.data as AddOrderBatchParams).orders || []).length} order(s) configured.
                <br />
                <span className="text-xs text-yellow-600">Note: Use API or advanced editor to configure individual orders.</span>
              </div>
            </div>
          </>
        )}

        {/* Cancel Order Batch */}
        {node.data.actionType === "batch-cancel" && (
          <>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Order IDs (comma separated, max 50)</Label>
              <Input
                value={((node.data as CancelOrderBatchParams).orders || []).join(", ")}
                onChange={(e) => handleInputChange("orders", e.target.value.split(",").map(id => id.trim()).filter(Boolean))}
                placeholder="ORDID1, ORDID2, ORDID3"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Transaction IDs or user references</p>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Client Order IDs (comma separated, max 50)</Label>
              <Input
                value={((node.data as CancelOrderBatchParams).cl_ord_ids || []).join(", ")}
                onChange={(e) => handleInputChange("cl_ord_ids", e.target.value.split(",").map(id => id.trim()).filter(Boolean))}
                placeholder="UUID1, UUID2, UUID3"
                className="mt-1.5 bg-card border-sidebar-border text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Optional client order identifiers</p>
            </div>
          </>
        )}

        {/* Get WebSocket Token */}
        {node.data.actionType === "get-websocket-token" && (
          <div className="text-xs text-muted-foreground">
            This action requires no additional parameters. It will retrieve a WebSocket authentication token.
          </div>
        )}

        {/* CONDITION BLOCKS */}
        {node.type === "condition" && (
          <>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Condition Type</Label>
              <Select
                value={(node.data as any).conditionType || "price"}
                onValueChange={(value) => handleInputChange("conditionType", value)}
              >
                <SelectTrigger className="mt-1.5 bg-card border-sidebar-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="if-else">If/Else</SelectItem>
                  <SelectItem value="compare">Compare Values</SelectItem>
                  <SelectItem value="time">Time Check</SelectItem>
                  <SelectItem value="price">Price Threshold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Operator field for compare and price-threshold */}
            {((node.data as any).conditionType === "compare" || (node.data as any).conditionType === "price") && (
              <>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Operator</Label>
                  <Select
                    value={(node.data as any).operator || ">"}
                    onValueChange={(value) => handleInputChange("operator", value)}
                  >
                    <SelectTrigger className="mt-1.5 bg-card border-sidebar-border text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=">">Greater Than (&gt;)</SelectItem>
                      <SelectItem value="<">Less Than (&lt;)</SelectItem>
                      <SelectItem value=">=">Greater or Equal (&gt;=)</SelectItem>
                      <SelectItem value="<=">Less or Equal (&lt;=)</SelectItem>
                      <SelectItem value="==">Equal (==)</SelectItem>
                      <SelectItem value="!=">Not Equal (!=)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    {(node.data as any).conditionType === "price" ? "Price Value" : "Compare Value"}
                  </Label>
                  <Input
                    type="number"
                    value={(node.data as any).value || 0}
                    onChange={(e) => handleInputChange("value", parseFloat(e.target.value))}
                    placeholder="0"
                    className="mt-1.5 bg-card border-sidebar-border text-sm"
                  />
                </div>
              </>
            )}

            {/* Pair field for price threshold */}
            {(node.data as any).conditionType === "price" && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Trading Pair</Label>
                <Input
                  value={(node.data as any).pair || "XBTUSD"}
                  onChange={(e) => handleInputChange("pair", e.target.value)}
                  placeholder="XBTUSD"
                  className="mt-1.5 bg-card border-sidebar-border text-sm"
                />
              </div>
            )}

            {/* Time field for time-check */}
            {(node.data as any).conditionType === "time" && (
              <>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Time Condition</Label>
                  <Select
                    value={(node.data as any).timeCondition || "after"}
                    onValueChange={(value) => handleInputChange("timeCondition", value)}
                  >
                    <SelectTrigger className="mt-1.5 bg-card border-sidebar-border text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="after">After Time</SelectItem>
                      <SelectItem value="before">Before Time</SelectItem>
                      <SelectItem value="between">Between Times</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Time (HH:MM)</Label>
                  <Input
                    type="time"
                    value={(node.data as any).time || "09:00"}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="mt-1.5 bg-card border-sidebar-border text-sm"
                  />
                </div>

                {(node.data as any).timeCondition === "between" && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">End Time (HH:MM)</Label>
                    <Input
                      type="time"
                      value={(node.data as any).endTime || "17:00"}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                      className="mt-1.5 bg-card border-sidebar-border text-sm"
                    />
                  </div>
                )}
              </>
            )}

            {/* Expression for if-else */}
            {(node.data as any).conditionType === "if-else" && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Condition Expression</Label>
                <Input
                  value={(node.data as any).expression || ""}
                  onChange={(e) => handleInputChange("expression", e.target.value)}
                  placeholder="e.g., balance > 1000"
                  className="mt-1.5 bg-card border-sidebar-border text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">JavaScript expression that evaluates to true/false</p>
              </div>
            )}
          </>
        )}

        {/* SYSTEM BLOCKS */}
        {node.type === "system" && (
          <>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">System Type</Label>
              <Select
                value={(node.data as any).utilityType || "get-websocket-token"}
                onValueChange={(value) => handleInputChange("utilityType", value)}
              >
                <SelectTrigger className="mt-1.5 bg-card border-sidebar-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="get-websocket-token">Get WebSocket Token</SelectItem>
                  <SelectItem value="authenticate">Authenticate</SelectItem>
                  <SelectItem value="error-handler">Error Handler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Get WebSocket Token - no additional fields */}
            {(node.data as any).utilityType === "get-websocket-token" && (
              <div className="text-xs text-muted-foreground">
                This utility retrieves a WebSocket authentication token. No additional parameters required.
              </div>
            )}

            {/* Authenticate - no additional fields */}
            {(node.data as any).utilityType === "authenticate" && (
              <div className="text-xs text-muted-foreground">
                This utility handles authentication. No additional parameters required.
              </div>
            )}

            {/* Error Handler */}
            {(node.data as any).utilityType === "error-handler" && (
              <>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Error Action</Label>
                  <Select
                    value={(node.data as any).errorAction || "log"}
                    onValueChange={(value) => handleInputChange("errorAction", value)}
                  >
                    <SelectTrigger className="mt-1.5 bg-card border-sidebar-border text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="log">Log Error</SelectItem>
                      <SelectItem value="stop">Stop Execution</SelectItem>
                      <SelectItem value="retry">Retry Previous Block</SelectItem>
                      <SelectItem value="continue">Continue Execution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Retry Count (if retry selected)</Label>
                  <Input
                    type="number"
                    value={(node.data as any).retryCount || 3}
                    onChange={(e) => handleInputChange("retryCount", parseInt(e.target.value))}
                    placeholder="3"
                    className="mt-1.5 bg-card border-sidebar-border text-sm"
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* UTILITY BLOCKS */}
        {node.type === "utility" && (
          <>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Utility Type</Label>
              <Select
                value={(node.data as any).utilityType || "wait"}
                onValueChange={(value) => handleInputChange("utilityType", value)}
              >
                <SelectTrigger className="mt-1.5 bg-card border-sidebar-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wait">Wait/Delay</SelectItem>
                  <SelectItem value="log">Log Message</SelectItem>
                  <SelectItem value="get-balance">Get Balance</SelectItem>
                  <SelectItem value="fetch-ticker">Fetch Ticker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Wait duration */}
            {(node.data as any).utilityType === "wait" && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Duration (seconds)</Label>
                <Input
                  type="number"
                  value={(node.data as any).duration || 0}
                  onChange={(e) => handleInputChange("duration", parseInt(e.target.value))}
                  placeholder="60"
                  className="mt-1.5 bg-card border-sidebar-border text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">How long to wait before continuing</p>
              </div>
            )}

            {/* Log message */}
            {(node.data as any).utilityType === "log" && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Log Message</Label>
                <Input
                  value={(node.data as any).message || ""}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Enter log message..."
                  className="mt-1.5 bg-card border-sidebar-border text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Message to log during execution</p>
              </div>
            )}

            {/* Get Balance - no additional fields */}
            {(node.data as any).utilityType === "get-balance" && (
              <div className="text-xs text-muted-foreground">
                This utility retrieves account balance information. No additional parameters required.
              </div>
            )}

            {/* Fetch Ticker pair */}
            {(node.data as any).utilityType === "fetch-ticker" && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Trading Pair</Label>
                <Input
                  value={(node.data as any).pair || "XBTUSD"}
                  onChange={(e) => handleInputChange("pair", e.target.value)}
                  placeholder="XBTUSD"
                  className="mt-1.5 bg-card border-sidebar-border text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Pair to fetch ticker data for</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 border-t border-sidebar-border bg-sidebar p-4 space-y-2">
        <Button
          onClick={handleSave}
          className="w-full h-9 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar text-sm font-medium"
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
        {hasChanges && (
          <div className="flex items-center gap-2 text-xs text-sidebar-primary">
            <AlertCircle className="w-3.5 h-3.5" />
            Unsaved changes
          </div>
        )}
      </div>
    </div>
  )
}