import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Play, Search, ChevronDown, Plus, CheckCircle2, ChevronRight, Loader2, AlertCircle, XCircle, Settings
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { jobsApi, executionsApi } from '../lib/api'

export default function JobsPage() {
  const navigate = useNavigate()
  const activeProject = useAppStore((s) => s.activeProject)
  const addToast = useAppStore((s) => s.addToast)
  const [jobs, setJobs] = useState([])
  const [activity, setActivity] = useState([])
  const [expanded, setExpanded] = useState({})
  const [loading, setLoading] = useState(true)
  const [showJobActions, setShowJobActions] = useState(false)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  
  // Advanced Search Form State
  const [searchForm, setSearchForm] = useState({
    name: '',
    group: '',
    description: '',
    scheduled: 'All',
    uuid: ''
  })
  
  useEffect(() => {
    loadData()
  }, [activeProject])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [jobsResponse, execsResponse] = await Promise.all([
        jobsApi.list(activeProject),
        executionsApi.list(activeProject)
      ])
      
      const jobsData = jobsResponse.data || []
      const jobsList = Array.isArray(jobsData) ? jobsData : (jobsData.jobs || [])
      setJobs(jobsList)
      
      const execsData = execsResponse.data?.executions || []
      const formattedActivity = execsData.slice(0, 10).map(ex => ({
        id: ex.id,
        date: new Date(ex.startedAt || ex.date).toLocaleString(),
        status: ex.status === 'succeeded' ? 'ok' : ex.status,
        duration: ex.duration || '—',
        user: ex.user || 'system',
        job: ex.job?.name || ex.jobName || 'Unknown'
      }))
      setActivity(formattedActivity)
      
      setLoading(false)
    } catch (err) {
      // Show empty state instead of error for better UX
      setJobs([])
      setActivity([])
      setLoading(false)
    }
  }
  
  const toggleExpand = (job) => {
    setExpanded(prev => ({ ...prev, [job]: !prev[job] }))
  }

  const handleRunJob = async (jobId) => {
    try {
      addToast({ type: 'info', title: 'Starting Job', message: 'Job execution initiated' })
      await jobsApi.run(jobId, {})
      addToast({ type: 'success', title: 'Job Started', message: 'Job is now running' })
      loadData()
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to start job' })
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            All Jobs
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500 text-white">
              {jobs.length}
            </span>
          </h2>
          <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Project: <span className="uppercase text-brand-500">{activeProject}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAdvancedSearch(true)}
            className="btn-secondary text-sm font-semibold h-9 px-4"
          >
            Advanced
          </button>
          <div className="flex items-center relative group">
            <Search size={14} className="absolute left-3 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="input text-sm pl-9 rounded-r-none w-48 lg:w-64 focus:ring-2 focus:ring-brand-glow" 
            />
            <button className="btn-primary rounded-l-none text-sm px-5 h-9 font-bold">Search</button>
          </div>
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
          {/* Jobs List Card */}
          <div className="card overflow-visible">
            <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
              <div className="flex gap-4 text-xs font-medium" style={{ color: 'var(--text)' }}>
                <button className="hover:underline">Expand All</button>
                <button className="hover:underline">Collapse All</button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button 
                    onClick={() => setShowJobActions(!showJobActions)}
                    className={`btn text-sm h-9 rounded shadow-sm flex items-center gap-2 px-4 transition-all ${showJobActions ? 'bg-slate-700 ring-2 ring-slate-400' : 'bg-slate-600 hover:bg-slate-700'} text-white`}
                  >
                    Job Actions <ChevronDown size={14} className={`transition-transform ${showJobActions ? 'rotate-180' : ''}`} />
                  </button>
                  {showJobActions && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowJobActions(false)} />
                      <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#0a1224] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-20 animate-in fade-in zoom-in duration-100 origin-top-right">
                        <button 
                          onClick={() => { navigate('/jobs/upload'); setShowJobActions(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2.5 transition-colors" 
                          style={{ color: 'var(--text)' }}
                        >
                          <Play size={14} className="rotate-90 text-brand-500"/> Upload Definition
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2"/>
                        <button 
                          onClick={() => setShowJobActions(false)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2.5 transition-colors" 
                          style={{ color: 'var(--text)' }}
                        >
                           <Settings size={14} className="text-slate-400"/> Bulk Edit
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <button className="btn-primary text-sm h-9 flex items-center gap-2 px-4 font-bold shadow-md" onClick={() => navigate('/jobs/create')}>
                  <Plus size={16} /> New Job
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {jobs.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--muted)' }}>
                  No jobs found in this project
                </div>
              ) : (
                jobs.map((job) => {
                  const jobName = job.name || job.id
                  const jobId = job.id
                  return (
                    <div key={jobId} className="flex items-center gap-3 group/item cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <div className="w-6 h-6 flex items-center justify-center rounded bg-emerald-100 dark:bg-emerald-900/30" onClick={() => toggleExpand(jobName)}>
                        <Play 
                          size={12} 
                          className={`text-emerald-600 dark:text-emerald-400 transition-transform duration-200 ${expanded[jobName] ? 'rotate-90' : ''}`} 
                          fill="currentColor"
                        />
                      </div>
                      <span 
                        className="text-sm font-semibold group-hover/item:text-brand-500 transition-colors flex-1" 
                        style={{ color: 'var(--text)' }}
                        onClick={() => navigate(`/jobs/${jobId}`)}
                      >
                        {jobName}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Activity Section */}
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>Activity for Jobs</h2>
            <div className="card overflow-hidden">
              <div className="p-3 border-b flex justify-between items-center text-xs" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                  1 - 10 of <span className="font-bold mx-1" style={{ color: 'var(--brand)' }}>{activity.length}</span> Executions
                  <button className="text-brand-500 ml-1 font-medium">any time <ChevronDown size={10} className="inline"/></button>
                  <button className="btn-secondary text-[10px] py-0.5 px-2 ml-2">Save Filter...</button>
                </div>
                <button className="btn-secondary text-[10px] py-0.5 px-2">Bulk Delete</button>
              </div>
              
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {activity.length === 0 ? (
                  <div className="text-center py-8" style={{ color: 'var(--muted)' }}>
                    No recent activity
                  </div>
                ) : (
                  activity.map((act) => (
                    <div key={act.id} className="grid grid-cols-[30px_220px_60px_100px_100px_1fr_60px] gap-4 px-4 py-3 items-center text-xs table-row-hover">
                      <CheckCircle2 size={16} className={act.status === 'ok' ? 'text-green-500' : 'text-red-500'} />
                      <div style={{ color: 'var(--muted)' }}>
                        <span className="font-mono text-[11px] mr-2">{act.date}</span>
                      </div>
                      <div style={{ color: 'var(--text)' }}>1 {act.status}</div>
                      <div style={{ color: 'var(--muted)' }}>{act.duration}</div>
                      <div style={{ color: 'var(--muted)' }}>by {act.user}</div>
                      <div className="font-medium" style={{ color: 'var(--text)' }}>{act.job}</div>
                      <div className="text-right font-mono" style={{ color: 'var(--muted)' }}>#{act.id}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {/* ─ Advanced Search Modal ─ */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white dark:bg-[#0a1224] w-full max-w-2xl rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 relative z-10 animate-in fade-in zoom-in duration-200 overflow-hidden pointer-events-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Search Jobs</h3>
              <button onClick={() => setShowAdvancedSearch(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-right" style={{ color: 'var(--text)' }}>Name</label>
                <input 
                  type="text" 
                  className="input" 
                  value={searchForm.name} 
                  onChange={e => setSearchForm({...searchForm, name: e.target.value})}
                  placeholder="Filter by job name"
                />
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-right" style={{ color: 'var(--text)' }}>Group</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <AlertCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      className="input pl-9" 
                      value={searchForm.group} 
                      onChange={e => setSearchForm({...searchForm, group: e.target.value})}
                      placeholder="Filter by group path"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-right" style={{ color: 'var(--text)' }}>Description</label>
                <input 
                  type="text" 
                  className="input" 
                  value={searchForm.description} 
                  onChange={e => setSearchForm({...searchForm, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-right" style={{ color: 'var(--text)' }}>Scheduled</label>
                <div className="flex items-center gap-6">
                  {['Yes', 'No', 'All'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                      <input 
                        type="radio" 
                        name="scheduled" 
                        checked={searchForm.scheduled === opt}
                        onChange={() => setSearchForm({...searchForm, scheduled: opt})}
                        className="accent-brand-500 w-4 h-4"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-right" style={{ color: 'var(--text)' }}>Server Node UUID</label>
                <input 
                  type="text" 
                  className="input" 
                  value={searchForm.uuid} 
                  onChange={e => setSearchForm({...searchForm, uuid: e.target.value})}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t flex justify-start gap-3" style={{ borderColor: 'var(--border)' }}>
              <button 
                onClick={() => setShowAdvancedSearch(false)}
                className="btn-secondary px-6"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAdvancedSearch(false)}
                className="btn-primary px-8 font-bold bg-[#10b981] hover:bg-[#059669] border-[#10b981] shadow-lg"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
