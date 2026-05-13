export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-4 w-2/5 rounded" />
      <div className="skeleton h-8 w-3/5 rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="skeleton h-4 w-1/5 rounded" />
      <div className="skeleton h-4 w-1/6 rounded" />
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-7 w-20 rounded-lg ml-auto" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-0.5">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-3 rounded ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  )
}
