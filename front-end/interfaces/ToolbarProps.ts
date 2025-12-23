export interface ToolbarProps {
  onRun: () => void
  strategyName: string
  onStrategyNameChange: (name: string) => void
  onMetadataClick: () => void
  onRunClick: () => void
  nodes: any[]
  edges: any[]
  onChartToggle: () => void
  isChartOpen: boolean
}