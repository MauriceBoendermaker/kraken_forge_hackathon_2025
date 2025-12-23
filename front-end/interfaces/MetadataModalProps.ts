export interface MetadataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  metadata: {
    name: string
    description: string
    version: string
    tags: string[]
  }
  onSave: (metadata: any) => void
}