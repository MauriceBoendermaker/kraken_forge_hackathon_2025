import { Handle, Position } from "reactflow"
import { GitBranch, X } from "lucide-react"

export function LogicNode({ data, id }: any) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (data.onDelete) {
      data.onDelete(id)
    }
  }

  return (
    <div className="trading-node logic group relative">
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
        title="Delete node"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-start gap-2">
        <GitBranch className="w-4 h-4 mt-1 text-green-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">{data.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{data.logicType || "Control Flow"}</p>
        </div>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} id="primary" />
      <Handle type="source" position={Position.Bottom} id="secondary" style={{ left: "66%" }} />
    </div>
  )
}
