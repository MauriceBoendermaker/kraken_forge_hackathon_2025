import { BaseNodeData } from "@/types/BaseNodeData"

export type ConditionNodeData = BaseNodeData & {
  conditionType: string
  operator: string
  value: number
}