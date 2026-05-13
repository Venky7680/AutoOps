import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Activity, GitBranch, Terminal, Sun, Moon } from 'lucide-react'
import aiopsLogo from '../AIOps-logo.png'
import darkLogo from '../AutoOps-Darklogo.png'
import darkText from '../Dark-text.png'
import lightText from '../Light-text.png'

const FEATURES = [
  'Real-time job monitoring',
  'Secure API proxy layer',
  'Multi-project support',
  'Full execution audit log',
  'Team collaboration',
]

const STATS = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '12ms', label: 'Avg latency' },
  { value: '50K+', label: 'Jobs/month' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAppStore((s) => s.login)
  const addToast = useAppStore((s) => s.addToast)
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  const currentLogo = theme === 'dark' ? darkLogo : aiopsLogo
  const currentText = theme === 'dark' ? darkText : lightText
  const logoBlend = theme === 'light' ? 'multiply' : 'normal'

  const [form, setForm] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    if (!form.username || !form.password) { setError('Please enter your credentials.'); return }
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    if (form.username === 'admin' && form.password === 'admin') {
      login({ name: 'Admin User', email: 'admin@autoops.local', role: 'Administrator' })
      addToast({ type: 'success', title: 'Welcome to AutoOps!', message: 'Logged in successfully.' })
      navigate('/dashboard')
    } else {
      setError('Invalid credentials.')
      addToast({ type: 'error', title: 'Authentication failed' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: 'var(--surface)' }}>

      {/* ════════════════════════════════════════════
          LEFT — Hero panel
      ════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col justify-between w-[54%] relative px-16 py-14 overflow-hidden">

        {/* ── Ambient blobs ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-48 -left-48 w-[720px] h-[720px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(26,111,245,0.16) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] rounded-full"
            style={{ background: theme === 'dark' ? 'radial-gradient(circle, rgba(13,27,53,0.95) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(26,111,245,0.15) 0%, transparent 70%)' }} />
          <div className="absolute top-1/3 right-0 w-[280px] h-[380px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(26,111,245,0.06) 0%, transparent 70%)' }} />
        </div>

        {/* ── Dot grid ── */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* ── Diagonal blue lines ── */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg, #1a6ff5 0px, #1a6ff5 1px, transparent 1px, transparent 60px)' }} />

        {/* ── TOP: Real logo — large ── */}
        <div className="relative z-10 flex items-center gap-4">
          <img
            src={currentLogo}
            alt="AIOps"
            style={{
              height: 52,
              width: 'auto',
              display: 'block',
              mixBlendMode: logoBlend
            }}
          />
          <img
            src={currentText}
            alt="AIOps"
            style={{
              height: 36,
              width: 'auto',
              display: 'block'
            }}
          />
        </div>

        {/* ── CENTER: Hero copy ── */}
        <div className="relative z-10 space-y-7">
          {/* Eyebrow */}
          <p style={{
            fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)',
            fontWeight: 700, textTransform: 'uppercase',
          }}>
            The Automation Platform
          </p>

          {/* Headline */}
          <div style={{ lineHeight: 1.06 }}>
            <h1 style={{ fontSize: 50, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', margin: 0 }}>Automate.</h1>
            <h1 style={{
              fontSize: 50, fontWeight: 800, letterSpacing: '-0.03em', margin: 0,
              background: 'linear-gradient(90deg, #93c5fd 0%, #1a6ff5 60%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Orchestrate.</h1>
            <h1 style={{ fontSize: 50, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', margin: 0 }}>Succeed.</h1>
          </div>

          {/* Subtitle */}
          <p style={{ fontSize: 15, color: 'var(--muted)', maxWidth: 400, lineHeight: 1.7 }}>
            Manage, schedule, and monitor Rundeck automation workflows with
            real-time insights, secure token handling, and full execution history.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {FEATURES.map((f) => (
              <span key={f} style={{
                padding: '5px 14px', borderRadius: 99, fontSize: 11, fontWeight: 500,
                background: 'rgba(26,111,245,0.08)',
                border: '1px solid rgba(26,111,245,0.2)',
                color: '#60a5fa',
              }}>{f}</span>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, paddingTop: 4 }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', margin: 0 }}>{value}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM: Terminal preview ── */}
        <div className="relative z-10">
          <div style={{
            borderRadius: 14, overflow: 'hidden',
            background: 'rgba(26,111,245,0.04)',
            border: '1px solid rgba(26,111,245,0.12)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
              borderBottom: '1px solid rgba(26,111,245,0.08)',
            }}>
              {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.75, display: 'inline-block' }} />
              ))}
              <span style={{ marginLeft: 8, fontSize: 10, fontFamily: 'monospace', color: '#1e3a6e' }}>execution.log</span>
            </div>
            <div style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 11, lineHeight: 1.8 }}>
              <div><span style={{ color: '#1e3a6e' }}>[10:30:01]</span> <span style={{ color: '#22c55e' }}>SUCCESS</span> <span style={{ color: '#475569' }}> Database Backup — 4m 22s</span></div>
              <div><span style={{ color: '#1e3a6e' }}>[10:31:05]</span> <span style={{ color: '#60a5fa' }}>RUNNING</span> <span style={{ color: '#475569' }}> Deploy Frontend → prod cluster</span></div>
              <div><span style={{ color: '#1e3a6e' }}>[10:31:08]</span> <span style={{ color: '#334155' }}>INFO   </span><span style={{ color: '#2a3f5f' }}> Health check sweep initiated…</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          RIGHT — Sign-in form panel
      ════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', position: 'relative' }}>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-lg transition-colors z-20"
          style={{ color: 'var(--muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-card)'; e.currentTarget.style.color = 'var(--text)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Right glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(26,111,245,0.05) 0%, transparent 70%)' }} />

        {/* Vertical divider */}
        <div className="hidden lg:block absolute left-0 top-0 h-full w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(26,111,245,0.18) 30%, rgba(26,111,245,0.18) 70%, transparent)' }} />

        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 360 }}>

          {/* Mobile logo */}
          <div className="relative z-10 mb-8 sm:mb-10 flex items-center gap-4">
            <img
              src={currentLogo}
              alt="AIOps"
              style={{ height: 42, width: 'auto', mixBlendMode: logoBlend }}
            />
            <img
              src={currentText}
              alt="AIOps"
              style={{ height: 26, width: 'auto' }}
            />
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.025em', margin: 0 }}>Sign in</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 5 }}>Access your automation dashboard</p>
          </div>

          {/* Form card */}
          <div style={{
            borderRadius: 18, padding: 24,
            background: 'rgba(26,111,245,0.04)',
            border: '1px solid rgba(26,111,245,0.14)',
            backdropFilter: 'blur(12px)',
          }}>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
                color: '#f87171', fontSize: 12,
              }}>{error}</div>
            )}

            {/* Username */}
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="username" style={{
                display: 'block', fontSize: 10, fontWeight: 700,
                color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6,
              }}>Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                placeholder="Enter username"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14,
                  background: 'var(--surface)', border: '1px solid rgba(26,111,245,0.18)',
                  color: 'var(--text)', outline: 'none', transition: 'all 0.15s', boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(26,111,245,0.65)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,111,245,0.1)' }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(26,111,245,0.18)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="password" style={{
                display: 'block', fontSize: 10, fontWeight: 700,
                color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6,
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  placeholder="Enter password"
                  style={{
                    width: '100%', padding: '12px 42px 12px 14px', borderRadius: 12, fontSize: 14,
                    background: 'var(--surface)', border: '1px solid rgba(26,111,245,0.18)',
                    color: 'var(--text)', outline: 'none', transition: 'all 0.15s', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(26,111,245,0.65)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,111,245,0.1)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(26,111,245,0.18)'; e.target.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    color: '#334155', background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                  }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              id="login-submit"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                color: '#ffffff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg, #1a6ff5 0%, #1447c7 100%)',
                boxShadow: '0 4px 20px rgba(26,111,245,0.4)',
                transition: 'all 0.2s', opacity: loading ? 0.65 : 1,
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(26,111,245,0.55)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,111,245,0.4)' }}
            >
              {loading
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Authenticating…</>
                : <>Sign in <ArrowRight size={15} /></>
              }
            </button>
          </div>

          {/* Demo hint */}


          {/* Feature icons */}
          <div style={{ display: 'flex', gap: 20, marginTop: 18 }}>
            {[
              { icon: Activity, label: 'Live metrics' },
              { icon: GitBranch, label: 'Multi-project' },
              { icon: Terminal, label: 'Log streaming' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted)' }}>
                <Icon size={12} style={{ color: 'var(--brand)' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
