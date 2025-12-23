import { Handle, Position } from "reactflow"
import { Zap, X } from "lucide-react"

export function ConditionNode({ data, id }: any) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (data.onDelete) {
      data.onDelete(id)
    }
  }

  const getConditionDisplay = () => {
    const condType = data.conditionType || "price"

    if (condType === "if-else") {
      return data.expression ? `if (${data.expression})` : "if (condition)"
    }

    if (condType === "time") {
      const timeCondition = data.timeCondition || "after"
      const time = data.time || "09:00"
      if (timeCondition === "between" && data.endTime) {
        return `${time} - ${data.endTime}`
      }
      return `${timeCondition} ${time}`
    }

    if (condType === "price" || condType === "compare") {
      const operator = data.operator || ">"
      const value = data.value || 0
      const pair = condType === "price" ? ` (${data.pair || "XBTUSD"})` : ""
      return `${operator} ${value}${pair}`
    }

    return `${data.operator || ">"} ${data.value || 0}`
  }

  const getConditionType = () => {
    const condType = data.conditionType || "price"
    if (condType === "if-else") return "If/Else"
    if (condType === "time") return "Time"
    if (condType === "price") return "Price"
    if (condType === "compare") return "Compare"
    return condType
  }

  return (
    <div className="trading-node condition group relative">
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
        title="Delete node"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-start gap-2">
        <Zap className="w-4 h-4 mt-1 text-yellow-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">{getConditionType()}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {getConditionDisplay()}
          </p>
        </div>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} id="true" />
      <Handle type="source" position={Position.Bottom} id="false" style={{ left: "66%" }} />
    </div>
  )
}
