import { Handle, Position } from "reactflow"
import { Shield, X } from "lucide-react"

export function SystemNode({ data, id }: any) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (data.onDelete) {
      data.onDelete(id)
    }
  }

  const getSystemDisplay = () => {
    const utilType = data.utilityType

    if (utilType === "error-handler") {
      const action = data.errorAction || "log"
      const retries = data.retryCount || 3
      if (action === "retry") {
        return `${action} (${retries}x)`
      }
      return action
    }

    if (utilType === "get-websocket-token") {
      return "WebSocket Auth"
    }

    if (utilType === "authenticate") {
      return "API Authentication"
    }

    return "System Action"
  }

  const getSystemType = () => {
    const utilType = data.utilityType
    if (utilType === "error-handler") return "Error Handler"
    if (utilType === "get-websocket-token") return "Get WS Token"
    if (utilType === "authenticate") return "Authenticate"
    return data.label
  }

  return (
    <div className="trading-node system group relative">
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
        title="Delete node"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-start gap-2">
        <Shield className="w-4 h-4 mt-1 text-purple-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">{getSystemType()}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {getSystemDisplay()}
          </p>
        </div>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
