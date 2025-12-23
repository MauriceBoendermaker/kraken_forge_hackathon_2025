import { blockTemplates } from "@/lib/strategy-templates"

type BlockType = keyof typeof blockTemplates

export type BlockDefinition = {
  id: string
  label: string
  description: string
  type: BlockType
}