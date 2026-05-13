import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import clsx from 'clsx'

const ICONS = {
  success: <CheckCircle size={16} className="text-emerald-400" />,
  error:   <AlertCircle  size={16} className="text-red-400" />,
  warning: <AlertTriangle size={16} className="text-amber-400" />,
  info:    <Info size={16} className="text-brand-400" />,
}

const BG = {
  success: 'border-emerald-500/20 bg-emerald-500/10',
  error:   'border-red-500/20 bg-red-500/10',
  warning: 'border-amber-500/20 bg-amber-500/10',
  info:    'border-brand-500/20 bg-brand-500/10',
}

function Toast({ toast }) {
  const removeToast = useAppStore((s) => s.removeToast)
  const type = toast.type || 'info'

  return (
    <div
      className={clsx(
        'toast-enter flex items-start gap-3 w-80 max-w-sm px-4 py-3 rounded-xl border backdrop-blur-sm shadow-2xl',
        BG[type]
      )}
    >
      <span className="mt-0.5 shrink-0">{ICONS[type]}</span>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text)' }}>{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--muted)' }}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 transition-colors"
        style={{ color: 'var(--muted)' }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts)
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  )
}
