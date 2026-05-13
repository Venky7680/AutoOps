import { Inbox } from 'lucide-react'

/**
 * EmptyState — reusable empty state for tables and lists
 *
 * Props:
 *  icon      — Lucide icon component (defaults to Inbox)
 *  title     — main heading text
 *  subtitle  — descriptive subtext
 *  action    — optional { label, onClick } for a CTA button
 */
export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'var(--brand-glow)', border: '1px solid rgba(26,111,245,0.15)' }}
      >
        <Icon size={28} style={{ color: 'var(--brand)' }} strokeWidth={1.5} />
      </div>
      <p className="text-base font-bold mb-1.5" style={{ color: 'var(--text)' }}>{title}</p>
      {subtitle && <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{subtitle}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mt-6"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
