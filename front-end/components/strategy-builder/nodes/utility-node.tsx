import { Handle, Position } from "reactflow"
import { Clock, X } from "lucide-react"

export function UtilityNode({ data, id }: any) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (data.onDelete) {
      data.onDelete(id)
    }
  }

  const getUtilityDisplay = () => {
    const utilType = data.utilityType || "wait"

    if (utilType === "wait") {
      const duration = data.duration || 60
      const minutes = Math.floor(duration / 60)
      const seconds = duration % 60
      if (minutes > 0) {
        return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`
      }
      return `${seconds}s`
    }

    if (utilType === "log") {
      return data.message ? `"${data.message.substring(0, 20)}${data.message.length > 20 ? "..." : ""}"` : "No message"
    }

    if (utilType === "fetch-ticker") {
      return data.pair || "XBTUSD"
    }

    if (utilType === "get-balance") {
      return "Account Balance"
    }

    return utilType
  }

  const getUtilityType = () => {
    const utilType = data.utilityType || "wait"
    if (utilType === "wait") return "Wait"
    if (utilType === "log") return "Log"
    if (utilType === "fetch-ticker") return "Fetch Ticker"
    if (utilType === "get-balance") return "Get Balance"
    return data.label
  }

  return (
    <div className="trading-node utility group relative">
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
        title="Delete node"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-start gap-2">
        <Clock className="w-4 h-4 mt-1 text-purple-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">{getUtilityType()}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{getUtilityDisplay()}</p>
        </div>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
