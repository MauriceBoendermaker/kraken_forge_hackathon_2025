import { BlockDefinition } from "@/types/BlockDefinition"
import { type LucideIcon } from "lucide-react"

export type BlockCategory = {
  label: string
  icon: LucideIcon
  color: string
  blocks: BlockDefinition[]
}