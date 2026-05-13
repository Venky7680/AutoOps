import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Clock, User, Terminal, RefreshCw, ChevronDown, ChevronUp, AlertCircle, Loader2 } from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import { SkeletonText } from '../components/ui/Skeleton'
import { jobsApi, executionsApi } from '../lib/api'
import { useAppStore } from '../store/appStore'

const LOG_COLORS = {
  'INFO':    'text-slate-300',
  'SUCCESS': 'text-emerald-400',
  'ERROR':   'text-red-400',
  'WARNING': 'text-amber-400',
}

function colorLine(line) {
  for (const [key, cls] of Object.entries(LOG_COLORS)) {
    if (line.includes(key)) return cls
  }
  return 'text-slate-500'
}

export default function JobDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const addToast = useAppStore((s) => s.addToast)

  const [job, setJob]           = useState(null)
  const [history, setHistory]   = useState([])
  const [logs, setLogs]         = useState('')
  const [loading, setLoading]   = useState(true)
  const [logsLoading, setLogsL] = useState(false)
  const [running, setRunning]   = useState(false)
  const [logsOpen, setLogsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('Log Output')

  useEffect(() => {
    loadJobData()
  }, [id])

  const loadJobData = async () => {
    try {
      setLoading(true)
      
      const [jobResponse, historyResponse] = await Promise.all([
        jobsApi.detail(id),
        jobsApi.executions(id, { max: 5 })
      ])
      
      const jobData = jobResponse.data
      setJob(jobData)
      
      const historyData = historyResponse.data?.executions || []
      const formattedHistory = historyData.map(ex => ({
        id: ex.id,
        status: ex.status,
        duration: ex.duration || '—',
        user: ex.user || 'system',
        startedAt: ex.startedAt || ex.date
      }))
      setHistory(formattedHistory)
      
      // Get logs from the most recent execution if available
      if (formattedHistory.length > 0) {
        const latestExec = formattedHistory[0]
        try {
          const logsResponse = await executionsApi.logs(latestExec.id)
          setLogs(logsResponse.data?.output || logsResponse.data?.log || 'No logs available')
        } catch (err) {
          setLogs('No logs available')
        }
      } else {
        setLogs('No executions yet')
      }
      
      setLoading(false)
    } catch (err) {
      // Show empty state instead of error for better UX
      setJob({ name: 'Unknown Job', id: id })
      setHistory([])
      setLogs('No data available')
      setLoading(false)
    }
  }

  const handleRun = async () => {
    try {
      setRunning(true)
      await jobsApi.run(id, {})
      setRunning(false)
      addToast({ type: 'success', title: 'Job triggered', message: `"${job?.name || id}" is now running.` })
      loadJobData()
    } catch (err) {
      setRunning(false)
      addToast({ type: 'error', title: 'Error', message: 'Failed to run job' })
    }
  }

  const refreshLogs = async () => {
    if (history.length === 0) return
    try {
      setLogsL(true)
      const latestExec = history[0]
      const logsResponse = await executionsApi.logs(latestExec.id)
      setLogs(logsResponse.data?.output || logsResponse.data?.log || 'No logs available')
      setLogsL(false)
    } catch (err) {
      setLogsL(false)
      addToast({ type: 'error', title: 'Error', message: 'Failed to refresh logs' })
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--brand)' }} />
        </div>
      )}

      {!loading && (
        <>
          {/* Back + header */}
          <div className="flex items-start gap-4">
            <button
              id="back-to-jobs"
              onClick={() => navigate('/jobs')}
              className="btn-secondary mt-0.5 px-2.5 py-2"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">{job?.name || job?.id || 'Unknown Job'}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{job?.group || 'N/A'} · {job?.project || 'N/A'}</p>
                </div>
                <StatusBadge status={job?.status || 'unknown'} />
              </div>
            </div>
            <button
              id="run-job-detail"
              onClick={handleRun}
              disabled={running || job?.status === 'running'}
              className="btn-primary"
            >
              {running
                ? <><RefreshCw size={13} className="animate-spin" /> Running…</>
                : <><Play size={13} /> Run Job</>
              }
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] mb-6">
            {['Log Output', 'Details'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Meta cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Avg Duration',  value: job.avgDuration || 'N/A', icon: Clock },
              { label: 'Success Rate',  value: job.successRate ? `${job.successRate}%` : 'N/A', icon: null },
              { label: 'Project',       value: job.project || 'N/A',    icon: null },
              { label: 'Group',         value: job.group || 'N/A',      icon: null },
            ].map(({ label, value }) => (
              <div key={label} className="card p-4">
                <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-semibold text-slate-200">{value}</p>
              </div>
            ))}
          </div>

          {activeTab === 'Log Output' && (
            <div className="grid lg:grid-cols-5 gap-5">
              {/* Execution history */}
              <div className="lg:col-span-2 card">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-slate-200">Execution History</h3>
                </div>
                {history.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-500">No executions found</div>
                ) : (
                  <div className="relative px-5 py-4">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-4 bottom-4 w-px bg-white/[0.06]" />
                    <div className="space-y-4">
                      {history.map((ex, i) => (
                        <div key={ex.id} className="relative flex items-start gap-4">
                          {/* Dot */}
                          <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ${
                            ex.status === 'succeeded' ? 'bg-emerald-500/20 border-emerald-500' :
                            ex.status === 'failed'    ? 'bg-red-500/20 border-red-500' :
                            ex.status === 'running'   ? 'bg-brand-500/20 border-brand-500' :
                            'bg-slate-500/20 border-slate-500'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              ex.status === 'succeeded' ? 'bg-emerald-400' :
                              ex.status === 'failed'    ? 'bg-red-400' :
                              ex.status === 'running'   ? 'bg-brand-400 animate-pulse' :
                              'bg-slate-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={ex.status} showDot={false} />
                              <span className="text-[11px] text-slate-500">{ex.duration}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                              <User size={10} /> {ex.user} ·{' '}
                              {new Date(ex.startedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Logs viewer */}
              <div className="lg:col-span-3 card flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-200">Execution Logs</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id="refresh-logs"
                      onClick={refreshLogs}
                      disabled={logsLoading}
                      className="btn-secondary text-[11px] px-2.5 py-1.5"
                    >
                      <RefreshCw size={11} className={logsLoading ? 'animate-spin' : ''} />
                      Refresh
                    </button>
                    <button
                      onClick={() => setLogsOpen((p) => !p)}
                      className="btn-secondary text-[11px] px-2 py-1.5"
                    >
                      {logsOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>
                  </div>
                </div>

                {logsOpen && (
                  <div className="flex-1 p-4">
                    <div className="terminal max-h-80 overflow-y-auto">
                      {logs.split('\n').map((line, i) => (
                        <div key={i} className={`${colorLine(line)} hover:bg-white/[0.03] px-1 rounded`}>
                          {line || <span className="opacity-0">.</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}



          {activeTab === 'Details' && (
            <div className="card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">Job Details</h3>
              <div className="grid grid-cols-[140px_1fr] gap-y-4 text-sm">
                <div className="text-slate-500">Job Name</div>
                <div className="text-slate-200 font-bold">{job?.name}</div>
                <div className="text-slate-500">Group</div>
                <div className="text-slate-200">{job?.group || 'None'}</div>
                <div className="text-slate-500">Description</div>
                <div className="text-slate-200">{job?.description || 'No description provided.'}</div>
                <div className="text-slate-500">UUID</div>
                <div className="text-slate-400 font-mono text-xs">{id}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
