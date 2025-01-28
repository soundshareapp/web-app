export interface DialogModalProps {
  title: string
  message: string
  dangerMode?: boolean
  dangerMessage?: string
  primaryAction?: number
  dangerAction?: number
  actions: string[]
  actionCallbacks: (() => void)[]
}
