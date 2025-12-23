export interface ExecutionStep {
  id: string
  nodeId: string
  nodeName: string
  status: "success" | "error" | "pending" | "running"
  timestamp: string
  inputs: any
  outputs: any
  logs: string[]
  error?: string
}