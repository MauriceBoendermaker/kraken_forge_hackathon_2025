export interface ExecutionStep {
  id: string;
  nodeId: string;
  nodeName: string;
  status: "success" | "error" | "running" | "pending";
  timestamp: string;
  inputs: any;
  outputs: any;
  logs: string[];
  error?: string;
}

export interface ExecutionRun {
  id: string;
  timestamp: string;
  duration: number;
  status: "success" | "error" | "running";
  steps: ExecutionStep[];
  totalNodes: number;
  executedNodes: number;
}
