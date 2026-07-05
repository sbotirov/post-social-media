'use client'

interface Props {
  isOpen: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
}

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel' }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="glass p-6 rounded-2xl max-w-sm w-full mx-4 shadow-xl border" style={{ borderColor: 'hsl(224 15% 20%)', background: 'hsl(224 20% 10%)' }}>
        <p className="text-sm font-medium mb-6 text-center">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors hover:bg-white/10"
            style={{ color: 'hsl(215 15% 55%)' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 rounded-xl text-sm font-medium text-white transition-all hover:scale-[1.02]"
            style={{ background: 'hsl(0 72% 60%)' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
