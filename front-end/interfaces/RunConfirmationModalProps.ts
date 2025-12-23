import { RunResult } from "@/interfaces/RunResult";

export interface RunConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  result: RunResult | null
}