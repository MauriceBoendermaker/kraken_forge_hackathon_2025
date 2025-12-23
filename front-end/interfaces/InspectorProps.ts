export interface InspectorProps {
  node: any
  onUpdateNode: (nodeId: string, data: any) => void
  onDeleteNode: (nodeId: string) => void
}