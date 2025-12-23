import { BlockCategory } from "@/types/BlockCategory"
import { CategoryKey } from "@/types/CategoryKey"
import { TrendingUp, Zap, Clock, Lock } from "lucide-react"

export const BLOCK_CATEGORIES: Record<CategoryKey, BlockCategory> = {
  orders: {
    label: "Order Actions",
    icon: TrendingUp,
    color: "text-cyan-400",
    blocks: [
  { id: "place-order", label: "Place Order", description: "Create a new order", type: "order" },
  { id: "amend-order", label: "Amend Order", description: "Modify an existing order", type: "order" },
  { id: "cancel-order", label: "Cancel Order", description: "Cancel a single order", type: "order" },
  { id: "cancel-all-orders", label: "Cancel All Orders", description: "Cancel all open orders", type: "order" },
  { id: "cancel-all-orders-after", label: "Cancel All After X", description: "Dead man's switch timer", type: "order" },
  { id: "batch-add", label: "Batch Add Orders", description: "Add multiple orders at once", type: "order" },
  { id: "batch-cancel", label: "Batch Cancel Orders", description: "Cancel multiple orders at once", type: "order" },
],
  },
  conditions: {
    label: "Conditions",
    icon: Zap,
    color: "text-yellow-400",
    blocks: [
      { id: "if-else", label: "If/Else", description: "Condition", type: "condition" },
      { id: "compare", label: "Compare", description: "Compare", type: "condition" },
      { id: "time-check", label: "Time Check", description: "Time", type: "condition" },
      { id: "price-threshold", label: "Price Threshold", description: "Price", type: "condition" },
    ],
  },
  utilities: {
    label: "Utilities",
    icon: Clock,
    color: "text-purple-400",
    blocks: [
      { id: "wait", label: "Wait", description: "Delay", type: "utility" },
      { id: "log", label: "Log", description: "Debug", type: "utility" },
      { id: "get-balance", label: "Get Balance", description: "Data", type: "utility" },
      { id: "fetch-ticker", label: "Fetch Ticker", description: "Data", type: "utility" },
    ],
  },
  system: {
    label: "System",
    icon: Lock,
    color: "text-purple-500",
    blocks: [
      { id: "get-token", label: "Get WebSocket Token", description: "Auth", type: "system" },
      { id: "authenticate", label: "Authenticate", description: "Auth", type: "system" },
      { id: "error-handler", label: "Error Handler", description: "Error", type: "system" },
    ],
  },
}