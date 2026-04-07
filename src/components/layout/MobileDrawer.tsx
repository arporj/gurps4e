import { X } from 'lucide-react'
interface Props { open: boolean; onClose: () => void; children: React.ReactNode }

export default function MobileDrawer({ open, onClose, children }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 shadow-xl flex flex-col">
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="btn-ghost p-1"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
