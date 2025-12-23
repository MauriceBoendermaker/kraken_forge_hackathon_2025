export interface AdvancedConfigModalProps {
  isOpen: boolean
  onClose: () => void
  nodeType: string
  nodeData: any
  onSave: (data: any) => void
}