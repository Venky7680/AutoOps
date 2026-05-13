import { useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, Bell, User, LogOut, ChevronDown, ChevronRight, Check, AlertCircle, Info, X } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { useState, useRef, useEffect } from 'react'

// ─── Route metadata ─────────────────────────────────────────────────────────
const ROUTE_META = {
  '/dashboard':          { label: 'Dashboard' },
  '/projects':           { label: 'Projects' },
  '/projects/create':    { label: 'Create Project',       parent: { label: 'Projects', to: '/projects' } },
  '/jobs':               { label: 'Jobs' },
  '/jobs/create':        { label: 'Create Job',           parent: { label: 'Jobs', to: '/jobs' } },
  '/jobs/upload':        { label: 'Upload Job',           parent: { label: 'Jobs', to: '/jobs' } },
  '/nodes':              { label: 'Nodes' },
  '/commands':           { label: 'Commands' },
  '/executions':         { label: 'Activity' },
  '/webhooks':           { label: 'Webhooks' },
  '/settings':           { label: 'General Settings' },
  '/project-settings':   { label: 'Project Settings' },
  '/project/configure':  { label: 'Edit Configuration',  parent: { label: 'Project Settings', to: '/project-settings' } },
  '/project/keys':       { label: 'Key Storage',         parent: { label: 'Project Settings', to: '/project-settings' } },
  '/project/edit-nodes': { label: 'Edit Nodes',          parent: { label: 'Project Settings', to: '/project-settings' } },
  '/project/acl':        { label: 'Access Control',      parent: { label: 'Project Settings', to: '/project-settings' } },
  '/project/readme':     { label: 'Edit Readme',         parent: { label: 'Project Settings', to: '/project-settings' } },
  '/project/motd':       { label: 'Edit MOTD',           parent: { label: 'Project Settings', to: '/project-settings' } },
  '/project/scm':        { label: 'Setup SCM',           parent: { label: 'Project Settings', to: '/project-settings' } },
  '/project/export':     { label: 'Export Archive',      parent: { label: 'Project Settings', to: '/project-settings' } },
  '/project/import':     { label: 'Import Archive',      parent: { label: 'Project Settings', to: '/project-settings' } },
}

// ─── Sample notifications ───────────────────────────────────────────────────
const SAMPLE_NOTIFICATIONS = [
  { id: 1, type: 'success', title: 'Job Completed', body: 'AWS-EBS-Cleanup finished successfully in 2m 14s.', time: '2 min ago',  read: false },
  { id: 2, type: 'error',   title: 'Job Failed',    body: 'IAM-Access-Audit failed: connection timeout.', time: '18 min ago', read: false },
  { id: 3, type: 'info',    title: 'Node Added',    body: 'Node "prod-server-07" joined the AWS-AUTOMATION project.', time: '1 hr ago',  read: true },
  { id: 4, type: 'success', title: 'Webhook Fired', body: 'Webhook "deploy-trigger" executed successfully.', time: '3 hrs ago', read: true },
]

const NOTIF_ICONS = {
  success: { icon: Check,        bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  error:   { icon: AlertCircle,  bg: 'bg-red-100 dark:bg-red-900/30',         text: 'text-red-600 dark:text-red-400' },
  info:    { icon: Info,         bg: 'bg-blue-100 dark:bg-blue-900/30',        text: 'text-blue-600 dark:text-blue-400' },
}

// ─── Notification Panel ──────────────────────────────────────────────────────
function NotificationsPanel({ onClose }) {
  const navigate = useNavigate()
  const notifs = useAppStore(s => s.notifications)
  const markAllRead = useAppStore(s => s.markAllNotificationsRead)
  const dismiss = useAppStore(s => s.dismissNotification)
  
  const unread = notifs.filter(n => !n.read).length

  return (
    <div
      className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl animate-fade-in overflow-hidden"
      style={{ background: 'var(--surface-card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Notifications</h3>
          {unread > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: 'var(--brand)' }}>
              {unread}
            </span>
          )}
        </div>
        <button onClick={markAllRead} className="text-xs font-medium hover:underline" style={{ color: 'var(--brand)' }}>
          Mark all read
        </button>
      </div>

      {/* Items */}
      <div className="max-h-80 overflow-y-auto">
        {notifs.length === 0 ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--muted)' }}>No notifications</div>
        ) : (
          notifs.map(n => {
            const meta = NOTIF_ICONS[n.type]
            const Icon = meta.icon
            return (
              <div
                key={n.id}
                className="flex items-start gap-3 px-4 py-3 border-b transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  background: n.read ? 'transparent' : 'rgba(26,111,245,0.04)',
                }}
              >
                <div className={`p-1.5 rounded-full shrink-0 ${meta.bg}`}>
                  <Icon size={13} className={meta.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color: 'var(--text)' }}>{n.title}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>{n.body}</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>{n.time}</p>
                </div>
                <button
                  onClick={() => dismiss(n.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                  style={{ color: 'var(--muted)' }}
                >
                  <X size={13} />
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={() => { navigate('/executions'); onClose() }}
          className="text-xs font-medium hover:underline" 
          style={{ color: 'var(--brand)' }}
        >
          View all notifications
        </button>
      </div>
    </div>
  )
}

// ─── Main Topbar ─────────────────────────────────────────────────────────────
export default function Topbar() {
  const location = useLocation()
  const navigate  = useNavigate()
  const theme     = useAppStore(s => s.theme)
  const toggle    = useAppStore(s => s.toggleTheme)
  const user      = useAppStore(s => s.user)
  const logout    = useAppStore(s => s.logout)

  const [userMenuOpen,  setUserMenu]  = useState(false)
  const [notifsOpen,    setNotifs]    = useState(false)
  const unread = useAppStore(s => s.notifications.filter(n => !n.read).length)

  const notifsRef = useRef(null)
  const userRef   = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = e => {
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setNotifs(false)
      if (userRef.current   && !userRef.current.contains(e.target))   setUserMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ─ Breadcrumb logic ─
  const path = location.pathname
  const meta = ROUTE_META[path] || (path.startsWith('/jobs/') ? { label: 'Job Detail', parent: { label: 'Jobs', to: '/jobs' } } : { label: 'Dashboard' })

  const IconBtn = ({ onClick, title, children, active }) => (
    <button
      onClick={onClick}
      title={title}
      className="relative flex items-center justify-center rounded-xl transition-all duration-150"
      style={{ width: 34, height: 34, color: active ? 'var(--brand)' : 'var(--muted)', background: active ? 'var(--brand-glow)' : 'transparent' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-glow)'; e.currentTarget.style.color = 'var(--brand)' }}
      onMouseLeave={e => { e.currentTarget.style.background = active ? 'var(--brand-glow)' : 'transparent'; e.currentTarget.style.color = active ? 'var(--brand)' : 'var(--muted)' }}
    >
      {children}
    </button>
  )

  return (
    <header
      className="flex items-center justify-between px-6 sticky top-0"
      style={{ height: 56, background: 'var(--topbar-bg)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--nav-border)', zIndex: 10 }}
    >
      {/* ─ Breadcrumbs ─ */}
      <div className="flex items-center gap-1.5">
        {meta.parent && (
          <>
            <button
              onClick={() => navigate(meta.parent.to)}
              className="text-xs font-medium hover:underline transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              {meta.parent.label}
            </button>
            <ChevronRight size={12} style={{ color: 'var(--muted)' }} />
          </>
        )}
        <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{meta.label}</span>
      </div>

      {/* ─ Right controls ─ */}
      <div className="flex items-center gap-1">

        {/* Theme toggle */}
        <IconBtn onClick={toggle} title="Toggle theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </IconBtn>

        {/* Notifications */}
        <div className="relative" ref={notifsRef}>
          <IconBtn onClick={() => { setNotifs(p => !p); setUserMenu(false) }} title="Notifications" active={notifsOpen}>
            <Bell size={15} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse-dot" style={{ background: 'var(--brand)' }} />
            )}
          </IconBtn>
          {notifsOpen && <NotificationsPanel onClose={() => setNotifs(false)} />}
        </div>

        {/* Divider */}
        <div className="mx-2 w-px h-4" style={{ background: 'var(--nav-border)' }} />

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserMenu(p => !p); setNotifs(false) }}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-150"
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-card)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--brand-glow)', border: '1px solid var(--border)' }}>
              <User size={13} style={{ color: 'var(--brand)' }} />
            </div>
            <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--muted)' }}>{user?.name || 'Admin'}</span>
            <ChevronDown size={12} style={{ color: 'var(--muted)', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 w-52 py-1 rounded-xl shadow-2xl animate-fade-in"
              style={{ background: 'var(--surface-card)', border: '1px solid var(--border)', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}
            >
              <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{user?.name || 'Admin User'}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>{user?.email || 'admin@autoops.local'}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: 'var(--brand-glow)', color: 'var(--brand)', border: '1px solid var(--border)' }}>
                  {user?.role || 'Administrator'}
                </span>
              </div>
              <button
                onClick={() => { logout(); setUserMenu(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors"
                style={{ color: '#f87171' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <LogOut size={13} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
