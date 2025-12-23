import { Handle, Position } from "reactflow"
import { TrendingUp, TrendingDown, X } from "lucide-react"

export function OrderNode({ data, id }: any) {
  const side = (data.type || data.side || "buy").toUpperCase()
  const isBuy = side === "BUY"

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (data.onDelete) {
      data.onDelete(id)
    }
  }

  // Get display text based on action type
  const getActionLabel = () => {
    if (data.actionType === "amend-order") return "Amend Order"
    if (data.actionType === "cancel-order") return "Cancel Order"
    if (data.actionType === "cancel-all-orders") return "Cancel All Orders"
    if (data.actionType === "cancel-all-orders-after") return `Cancel All After ${data.timeout || 60}s`
    if (data.actionType === "batch-add") return `Batch Add (${data.orders?.length || 0} orders)`
    if (data.actionType === "batch-cancel") return `Batch Cancel (${data.orders?.length || 0} orders)`
    return data.label
  }

  const getSubLabel = () => {
    if (data.actionType === "add-order") {
      const orderType = data.ordertype || "market"
      const volume = data.volume || "0"
      const price = data.price ? ` @ $${data.price}` : ""
      return `${orderType.toUpperCase()}${price} · ${volume} ${data.pair || "XBTUSD"}`
    }
    if (data.actionType === "amend-order") {
      return data.txid ? `ID: ${data.txid.substring(0, 8)}...` : "No order ID"
    }
    if (data.actionType === "cancel-order") {
      return data.txid ? `ID: ${data.txid.toString().substring(0, 8)}...` : "No order ID"
    }
    return data.pair || "XBTUSD"
  }

  return (
    <div className="trading-node order group relative">
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
        title="Delete node"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-start gap-3">
        {isBuy ? (
          <TrendingUp className="w-5 h-5 mt-0.5 text-cyan-400 flex-shrink-0" />
        ) : (
          <TrendingDown className="w-5 h-5 mt-0.5 text-red-400 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground mb-1 truncate">{getActionLabel()}</p>
          <div className="flex flex-col gap-0.5">
            {data.actionType === "add-order" && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded self-start ${
                isBuy ? "bg-cyan-500/20 text-cyan-400" : "bg-red-500/20 text-red-400"
              }`}>
                {side}
              </span>
            )}
            <span className="text-xs text-muted-foreground truncate">{getSubLabel()}</span>
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
