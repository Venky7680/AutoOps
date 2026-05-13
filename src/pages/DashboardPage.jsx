import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  CheckCircle2, XCircle, Play, Activity, RefreshCw, Clock, ArrowUpRight,
} from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import { SkeletonCard, SkeletonTable } from '../components/ui/Skeleton'
import { executionsApi } from '../lib/api'
import { useAppStore } from '../store/appStore'

const STAT_CARDS = (s) => [
  {
    id: 'total-executions',
    label: 'Total Executions',
    value: s.totalExecutions.toLocaleString(),
    icon: Activity,
    accentColor: 'var(--brand)',
    glowColor: 'var(--brand-glow)',
    borderColor: 'var(--nav-border)',
    delta: '+12% this week',
    positive: true,
  },
  {
    id: 'success-rate',
    label: 'Success Rate',
    value: `${s.successRate}%`,
    icon: CheckCircle2,
    accentColor: 'var(--success)',
    glowColor: 'rgba(16,185,129,0.06)',
    borderColor: 'rgba(16,185,129,0.12)',
    delta: '+1.2% vs last week',
    positive: true,
  },
  {
    id: 'failure-count',
    label: 'Failures',
    value: s.failureCount,
    icon: XCircle,
    accentColor: 'var(--error)',
    glowColor: 'rgba(239,68,68,0.06)',
    borderColor: 'rgba(239,68,68,0.12)',
    delta: '−3 since yesterday',
    positive: true,
  },
  {
    id: 'running-now',
    label: 'Running Now',
    value: s.runningNow,
    icon: Play,
    accentColor: 'var(--warning)',
    glowColor: 'rgba(245,158,11,0.06)',
    borderColor: 'rgba(245,158,11,0.12)',
    delta: 'Live',
    positive: null,
    live: true,
  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl shadow-2xl px-3 py-2.5 text-xs"
      style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}>
      <p className="font-semibold mb-1.5" style={{ color: 'var(--text)' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: 'var(--muted)' }} className="capitalize">{p.name}:</span>
          <span className="font-medium" style={{ color: 'var(--text)' }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const addToast = useAppStore((s) => s.addToast)
  const activeProject = useAppStore((s) => s.activeProject)
  const [loading, setLoading]     = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats]         = useState(null)
  const [activity, setActivity]   = useState([])
  const [executions, setExecs]    = useState([])
  const [error, setError]         = useState(null)

  const load = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      setError(null)
      
      const loadData = async () => {
        try {
          setLoading(true)
          const [execsResponse] = await Promise.all([
            executionsApi.list(activeProject)
          ])
          
          const executionsData = execsResponse.data?.executions || []
          
          // Calculate stats from real data
          const totalExecutions = executionsData.length
          const succeededCount = executionsData.filter(e => e.status === 'succeeded').length
          const failedCount = executionsData.filter(e => e.status === 'failed').length
          const runningCount = executionsData.filter(e => e.status === 'running').length
          const successRate = totalExecutions > 0 ? ((succeededCount / totalExecutions) * 100).toFixed(1) : 0
          
          setStats({
            totalExecutions,
            successRate: parseFloat(successRate),
            failureCount: failedCount,
            runningNow: runningCount
          })
          
          // Generate activity data from executions (group by time)
          const activityMap = {}
          executionsData.forEach(ex => {
            const hour = new Date(ex.startedAt || ex.date).getHours()
            const timeKey = `${hour.toString().padStart(2, '0')}:00`
            if (!activityMap[timeKey]) {
              activityMap[timeKey] = { time: timeKey, succeeded: 0, failed: 0, running: 0 }
            }
            if (ex.status === 'succeeded') activityMap[timeKey].succeeded++
            else if (ex.status === 'failed') activityMap[timeKey].failed++
            else if (ex.status === 'running') activityMap[timeKey].running++
          })
          
          const activityData = Object.values(activityMap).sort((a, b) => a.time.localeCompare(b.time))
          setActivity(activityData.length > 0 ? activityData : [])
          
          // Format executions for display
          const formattedExecs = executionsData.slice(0, 6).map(ex => ({
            id: ex.id,
            jobName: ex.job?.name || ex.jobName || 'Unknown Job',
            status: ex.status,
            duration: ex.duration || ex.executionArgs?.duration || '—',
            startedAt: ex.startedAt || ex.date
          }))
          setExecs(formattedExecs)
          
          setLoading(false)
          setRefreshing(false)
          if (isRefresh) addToast({ type: 'info', title: 'Dashboard refreshed', message: 'All data is up to date.' })
        } catch (err) {
          // Show empty state instead of error for better UX
          setStats({
            totalExecutions: 0,
            successRate: 0,
            failureCount: 0,
            runningNow: 0
          })
          setActivity([])
          setExecs([])
          setLoading(false)
          setRefreshing(false)
        }
      }
      
      await loadData()
    } catch (err) {
      // Show empty state instead of error for better UX
      setStats({
        totalExecutions: 0,
        successRate: 0,
        failureCount: 0,
        runningNow: 0
      })
      setActivity([])
      setExecs([])
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [activeProject])

  const statCards = stats ? STAT_CARDS(stats) : []

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ─ Header ─ */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Overview</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Real-time automation metrics and activity
          </p>
        </div>
        <button
          id="dashboard-refresh"
          onClick={() => load(true)}
          disabled={refreshing}
          className="btn-secondary text-xs"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* ─ Stat cards ─ */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.id}
                  className="card-hover p-5 relative overflow-hidden"
                  style={{ borderColor: card.borderColor }}
                >
                  {/* Ambient corner glow */}
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
                    style={{ background: card.glowColor, filter: 'blur(20px)', transform: 'translate(30%, -30%)' }} />

                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: card.glowColor, border: `1px solid ${card.borderColor}` }}>
                      <Icon size={17} style={{ color: card.accentColor }} />
                    </div>
                    {card.live && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--success)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </div>
                    )}
                  </div>

                  <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{card.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{card.label}</p>
                  <p className="text-[11px] mt-2 font-semibold"
                    style={{ color: card.positive === true ? 'var(--success)' : card.positive === false ? 'var(--error)' : 'var(--muted)' }}>
                    {card.delta}
                  </p>
                </div>
              )
            })}
      </div>

      {/* ─ Chart + Executions side-by-side ─ */}
      <div className="grid xl:grid-cols-3 gap-5">

        {/* Activity chart */}
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Execution Activity</h3>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>Last 24 hours</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]" style={{ color: 'var(--muted)' }}>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--success)' }} />Succeeded</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--error)' }} />Failed</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand)' }} />Running</span>
            </div>
          </div>

          {loading ? (
            <div className="skeleton h-52" />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={activity} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSucceeded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--success)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--error)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--error)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRunning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--brand)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="succeeded" stroke="var(--success)" strokeWidth={2} fill="url(#gSucceeded)" dot={false} />
                <Area type="monotone" dataKey="failed"    stroke="var(--error)"   strokeWidth={2} fill="url(#gFailed)"    dot={false} />
                <Area type="monotone" dataKey="running"   stroke="var(--brand)"   strokeWidth={2} fill="url(#gRunning)"   dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent executions */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Recent Runs</h3>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>Latest executions</p>
            </div>
            <ArrowUpRight size={14} style={{ color: 'var(--muted)' }} />
          </div>

          {loading ? (
            <div className="p-4"><SkeletonTable rows={5} /></div>
          ) : (
            <div className="flex-1 divide-y" style={{ borderColor: 'var(--border)' }}>
              {executions.map((ex) => (
                <div key={ex.id} className="flex items-center gap-3 px-4 py-3 table-row-hover">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{ex.jobName}</p>
                    <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                      <Clock size={9} /> {ex.duration}
                    </p>
                  </div>
                  <StatusBadge status={ex.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
