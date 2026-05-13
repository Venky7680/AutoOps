import { useState, useEffect, useMemo } from 'react'
import { Search, Clock, User, Filter, Download, Activity, AlertCircle, Loader2 } from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import { SkeletonTable } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import { executionsApi } from '../lib/api'
import { useAppStore } from '../store/appStore'

const STATUS_OPTIONS = ['all', 'succeeded', 'running', 'failed', 'aborted']

export default function ExecutionsPage() {
  const activeProject = useAppStore((s) => s.activeProject)
  const addToast = useAppStore((s) => s.addToast)
  const [loading, setLoading]     = useState(true)
  const [executions, setExecs]    = useState([])
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('all')

  useEffect(() => {
    loadExecutions()
  }, [activeProject])

  const loadExecutions = async () => {
    try {
      setLoading(true)
      const response = await executionsApi.list(activeProject)
      const execsData = response.data?.executions || []
      const formattedExecs = execsData.map(ex => ({
        id: ex.id,
        jobName: ex.job?.name || ex.jobName || 'Unknown Job',
        status: ex.status,
        duration: ex.duration || '—',
        startedAt: ex.startedAt || ex.date,
        user: ex.user || 'system'
      }))
      setExecs(formattedExecs)
      setLoading(false)
    } catch (err) {
      // Show empty state instead of error for better UX
      setExecs([])
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let list = [...executions]
    if (search) list = list.filter((e) =>
      e.jobName.toLowerCase().includes(search.toLowerCase()) ||
      e.user.toLowerCase().includes(search.toLowerCase())
    )
    if (statusFilter !== 'all') list = list.filter((e) => e.status === statusFilter)
    return list
  }, [executions, search, statusFilter])

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Executions</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{executions.length} total records</p>
        </div>
        <button className="btn-secondary text-xs" id="export-executions">
          <Download size={13} /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
          <input
            id="exec-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search executions…"
            className="input pl-9 text-xs"
            style={{ color: 'var(--text)' }}
          />
        </div>
        <div className="relative">
          <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
          <select
            id="exec-status-filter"
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value)}
            className="input pl-8 text-xs pr-8 appearance-none min-w-36 cursor-pointer"
            style={{ color: 'var(--text)' }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} style={{ background: 'var(--surface)' }}>
                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--brand)' }} />
        </div>
      )}

      {!loading && (
        <>
          {/* Table */}
          <div className="card overflow-hidden">
            <div className="grid grid-cols-[1fr_140px_120px_120px] gap-2 px-5 py-3 border-b text-[11px] font-medium uppercase tracking-wide"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
              <span>Job</span>
              <span>Status</span>
              <span>Duration</span>
              <span>Started At</span>
            </div>
            {filtered.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No executions found"
                subtitle="No executions match your current filters. Try adjusting the search or status filter."
              />
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {filtered.map((ex) => (
                  <div
                    key={ex.id}
                    className="grid grid-cols-[1fr_140px_120px_120px] gap-2 px-5 py-3.5 items-center table-row-hover"
                  >
                    <div>
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{ex.jobName}</p>
                      <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                        <User size={10} /> {ex.user}
                      </p>
                    </div>
                    <StatusBadge status={ex.status} />
                    <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--muted)' }}>
                      <Clock size={11} style={{ color: 'var(--muted)' }} />
                      {ex.duration}
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                      {new Date(ex.startedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
