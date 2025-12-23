import { RunStatus } from "@/types/RunStatus";

export interface RunResult {
  status: RunStatus
  message: string
  details?: string
  logs?: Array<{
    timestamp: string
    level: "info" | "warning" | "error" | "success"
    message: string
    nodeId?: string
  }>
  executedNodes?: number
  totalNodes?: number
  duration?: number
  errors?: Array<{
    nodeId: string
    nodeName: string
    error: string
  }>
}