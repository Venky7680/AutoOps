import clsx from 'clsx'

const DOT = {
  succeeded: 'bg-emerald-400',
  running:   'bg-brand-400 animate-pulse',
  failed:    'bg-red-400',
  aborted:   'bg-amber-400',
  scheduled: 'bg-slate-400',
  unknown:   'bg-slate-600',
}

const BADGE_CLASS = {
  succeeded: 'badge-success',
  running:   'badge-info',
  failed:    'badge-error',
  aborted:   'badge-warning',
  scheduled: 'badge-neutral',
  unknown:   'badge-neutral',
}

export default function StatusBadge({ status, showDot = true }) {
  const key = status?.toLowerCase() || 'unknown'
  return (
    <span className={clsx('badge', BADGE_CLASS[key] || 'badge-neutral')}>
      {showDot && <span className={clsx('w-1.5 h-1.5 rounded-full', DOT[key] || 'bg-slate-600')} />}
      {key.charAt(0).toUpperCase() + key.slice(1)}
    </span>
  )
}
