import { BaseNodeData } from "@/types/BaseNodeData"

export type OrderNodeData = BaseNodeData & {
  orderType: string
  pair: string
  side: string
  price: number
  size: number
}