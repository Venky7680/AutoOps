import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Briefcase, Activity, Settings, Settings2,
  ChevronLeft, ChevronRight, Server, TerminalSquare, Plug, Folder, ChevronDown, Check, Plus
} from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { projectsApi } from '../../lib/api'
import aiopsLogo from '../../AIOps-logo.png'
import darkLogo from '../../AutoOps-Darklogo.png'
import darkText from '../../Dark-text.png'
import lightText from '../../Light-text.png'

const NAV = [
  { to: '/projects',   icon: Folder,           label: 'Projects' },
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jobs',       icon: Briefcase,        label: 'Jobs' },
  { to: '/nodes',      icon: Server,           label: 'Nodes' },
  { to: '/commands',   icon: TerminalSquare,   label: 'Commands' },
  { to: '/executions', icon: Activity,         label: 'Activity' },
  { to: '/webhooks',   icon: Plug,             label: 'Webhooks' },
]

export default function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggle    = useAppStore((s) => s.toggleSidebar)
  const theme     = useAppStore((s) => s.theme)
  
  const currentLogo = theme === 'dark' ? darkLogo : aiopsLogo
  const currentText = theme === 'dark' ? darkText : lightText
  const logoBlend = theme === 'light' ? 'multiply' : 'normal'

  const activeProject = useAppStore((s) => s.activeProject)
  const projects = useAppStore((s) => s.projects)
  const setActiveProject = useAppStore((s) => s.setActiveProject)
  const setProjectsStore = useAppStore((s) => s.setProjects)
  const [showProjectPicker, setShowProjectPicker] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await projectsApi.list()
        const list = Array.isArray(data) ? data : (data.projects || [])
        const names = list.map(p => p.name || p)
        setProjectsStore(names)
      } catch (e) {
        // Fallback to existing or empty
      }
    }
    fetchProjects()
  }, [])

  return (
    <aside
      style={{
        width: collapsed ? 64 : 230,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--nav-border)',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}
      className="flex flex-col shrink-0 overflow-visible"
    >

      {/* ─ Brand ─ */}
      <div
        style={{
          borderBottom: '1px solid var(--nav-border)',
          minHeight: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0' : '0 12px',
          overflow: 'hidden',
        }}
      >
        {collapsed ? (
          /* Collapsed: show only the icon mark (left ~35% of the logo image) */
          <div style={{
            width: 44, height: 44,
            overflow: 'hidden',
            flexShrink: 0,
            position: 'relative',
          }}>
            <img
              src={currentLogo}
              alt="AIOps Logo"
              style={{
                height: 32,
                width: 'auto',
                display: 'block',
                mixBlendMode: logoBlend
              }}
            />
          </div>
        ) : (
          /* Expanded: full logo + text + collapse button */
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: 150,
              overflow: 'hidden',
            }}>
              <img
                src={currentLogo}
                alt="AIOps"
                style={{
                  height: 30,
                  width: 'auto',
                  display: 'block',
                  mixBlendMode: logoBlend
                }}
              />
              <img
                src={currentText}
                alt="AIOps"
                style={{
                  height: 16,
                  width: 'auto',
                  display: 'block'
                }}
              />
            </div>
            {/* Collapse toggle arrow */}
            <button
              onClick={toggle}
              className="flex items-center justify-center rounded-lg transition-colors"
              style={{
                width: 28, height: 28,
                color: 'var(--muted)',
                background: 'transparent',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
            >
              <ChevronLeft size={16} />
            </button>
          </>
        )}
      </div>

      {/* ─ Project Selector ─ */}
      <div className="px-2 py-3 border-b relative" style={{ borderColor: 'var(--nav-border)' }}>
        <button 
          onClick={() => setShowProjectPicker(!showProjectPicker)}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 border ${showProjectPicker ? 'border-brand bg-brand-glow' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Folder size={16} style={{ color: 'var(--brand)' }} />
          </div>
          {!collapsed && (
            <div className="flex-1 text-left min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--text)' }}>Project</p>
              <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{activeProject}</p>
            </div>
          )}
          {!collapsed && <ChevronDown size={14} style={{ color: 'var(--muted)', transform: showProjectPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
        </button>

        {showProjectPicker && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowProjectPicker(false)} />
            <div className="absolute left-2 right-2 top-[calc(100%+4px)] bg-white dark:bg-[#0a1224] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1 z-20 animate-in fade-in zoom-in duration-200 origin-top">
              {projects.map(p => (
                <button
                  key={p}
                  onClick={() => { setActiveProject(p); setShowProjectPicker(false); }}
                  className={`w-full text-left px-3 py-2.5 text-xs flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${p === activeProject ? 'font-bold' : ''}`}
                  style={{ color: p === activeProject ? 'var(--brand)' : 'var(--text)' }}
                >
                  <span className="truncate">{p}</span>
                  {p === activeProject && <Check size={12} />}
                </button>
              ))}
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
              <button
                onClick={() => { navigate('/projects'); setShowProjectPicker(false); }}
                className="w-full text-left px-3 py-2.5 text-xs text-slate-400 hover:text-brand-500 flex items-center gap-2 transition-colors"
              >
                <Plus size={12} /> View all projects
              </button>
            </div>
          </>
        )}
      </div>
      <nav className="flex-1 p-2 space-y-0.5 mt-2 overflow-y-auto hide-scrollbar">
        {/* If collapsed, show the expand toggle at the top of the nav */}
        {collapsed && (
          <button
            onClick={toggle}
            className="w-full flex items-center justify-center rounded-xl py-2 mb-2 transition-colors"
            style={{ color: 'var(--muted)', background: 'var(--surface-card)', border: '1px solid var(--border)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)' }}
            title="Expand"
          >
            <ChevronRight size={16} />
          </button>
        )}
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            style={collapsed ? { justifyContent: 'center', padding: '10px 0' } : {}}
          >
            <Icon size={17} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ─ Settings Footer ─ */}
      <div className="p-2 space-y-0.5 border-t" style={{ borderColor: 'var(--nav-border)' }}>
        
        {/* Project Settings */}
        <NavLink 
          to="/project-settings" 
          title={collapsed ? 'Project Settings' : undefined}
          className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
          style={collapsed ? { justifyContent: 'center', padding: '10px 0' } : {}}
        >
          <Settings size={17} className="shrink-0" />
          {!collapsed && <span className="uppercase text-xs font-bold tracking-wider opacity-80">Project Settings</span>}
        </NavLink>

        {/* General Settings */}
        <NavLink 
          to="/settings" 
          title={collapsed ? 'General Settings' : undefined}
          className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
          style={collapsed ? { justifyContent: 'center', padding: '10px 0' } : {}}
        >
          <Settings2 size={17} className="shrink-0" />
          {!collapsed && <span className="uppercase text-xs font-bold tracking-wider opacity-80">General Settings</span>}
        </NavLink>
      </div>

      {/* ─ Version ─ */}
      {!collapsed && (
        <div style={{ padding: '0 16px 14px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--muted)' }}>v1.0.0-beta</span>
        </div>
      )}
    </aside>
  )
}
