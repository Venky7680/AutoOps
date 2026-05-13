import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Folder, ChevronRight, Plus, Activity, AlertCircle, PlayCircle, Loader2 } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { projectsApi } from '../lib/api'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const activeProject = useAppStore((s) => s.activeProject)
  const setActiveProject = useAppStore((s) => s.setActiveProject)
  const addToast = useAppStore((s) => s.addToast)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await projectsApi.list()
      const projectsData = response.data || []
      const projectsList = Array.isArray(projectsData) ? projectsData : (projectsData.projects || [])
      setProjects(projectsList)
    } catch (err) {
      // Show empty state instead of error for better UX
      setProjects([])
      // Don't show toast on initial load - only on user actions
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (project) => {
    setActiveProject(project.name || project)
    navigate('/dashboard')
  }

  const getProjectStats = (project) => {
    return {
      execs: project.executionsCount || 0,
      failed: project.failedCount || 0,
      jobs: project.jobsCount || 0
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text)' }}>
            Projects
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}>
              {projects.length}
            </span>
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Select a project to manage its jobs, nodes, and executions.</p>
        </div>
        <button className="btn-primary text-xs px-4" onClick={() => navigate('/projects/create')}>
          <Plus size={14} /> New Project
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--brand)' }} />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: '#ef4444' }} />
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{error}</h3>
          <button className="btn-primary mt-4" onClick={loadProjects}>Retry</button>
        </div>
      )}

      {/* Project Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => {
            const stats = getProjectStats(p)
            const projectName = p.name || p
            const isActive = projectName === activeProject
            
            return (
              <button
                key={projectName}
                onClick={() => handleSelect(p)}
                className="card text-left flex flex-col group transition-all duration-200 relative overflow-hidden"
                style={{
                  borderColor: isActive ? 'var(--brand)' : 'var(--border)',
                  boxShadow: isActive ? '0 0 0 1px var(--brand)' : 'none',
                }}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'var(--brand)' }} />
                )}
                
                <div className="p-5 border-b" style={{ borderColor: 'var(--border)', background: isActive ? 'var(--brand-glow)' : 'transparent' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" 
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <Folder size={20} style={{ color: isActive ? 'var(--brand)' : 'var(--muted)' }} />
                    </div>
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--brand)', color: '#fff' }}>
                        Active Context
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold truncate mb-1" style={{ color: 'var(--text)' }}>{projectName}</h3>
                  <p className="text-xs line-clamp-1" style={{ color: 'var(--muted)' }}>
                    {stats.jobs} configured automation jobs
                  </p>
                </div>
                
                <div className="p-4 grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium mb-1" style={{ color: 'var(--muted)' }}>
                      <Activity size={12} /> Executions (24h)
                    </div>
                    <p className="text-xl font-semibold" style={{ color: 'var(--text)' }}>{stats.execs}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium mb-1" style={{ color: 'var(--muted)' }}>
                      <AlertCircle size={12} /> Failed
                    </div>
                    <p className="text-xl font-semibold" style={{ color: stats.failed > 0 ? '#ef4444' : 'var(--text)' }}>
                      {stats.failed}
                    </p>
                  </div>
                </div>
                
                <div className="px-5 py-3 border-t flex items-center justify-between transition-colors" 
                  style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--nav-border)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)' }}
                >
                  <span className="text-xs font-medium" style={{ color: 'var(--brand)' }}>Enter Project</span>
                  <ChevronRight size={14} style={{ color: 'var(--brand)' }} className="transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
