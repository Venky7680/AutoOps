import { useState } from 'react'
import {
  Server, Key, Bell, Shield, Save, Eye, EyeOff,
  CheckCircle2, Loader2, Globe, Clock
} from 'lucide-react'
import { useAppStore } from '../store/appStore'

function Section({ title, description, icon: Icon, children }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface-card)' }}>
        <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
          <Icon size={15} className="text-brand-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{title}</h3>
          {description && <p className="text-[11px]" style={{ color: 'var(--muted)' }}>{description}</p>}
        </div>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  )
}

function SettingRow({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="sm:w-52 shrink-0">
        <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{label}</p>
        {hint && <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const addToast = useAppStore((s) => s.addToast)
  const theme    = useAppStore((s) => s.theme)
  const toggle   = useAppStore((s) => s.toggleTheme)

  const [saving, setSaving]     = useState(false)
  const [showToken, setShow]    = useState(false)
  const [saved, setSaved]       = useState(false)

  const [config, setConfig] = useState({
    rundeckUrl: 'https://rundeck.company.internal',
    apiVersion: '43',
    apiToken:   '••••••••••••••••••••••••••',
    project:    'Production',
    timeout:    '30',
    pollInterval: '5',
  })

  const [notifs, setNotifs] = useState({
    onSuccess: true,
    onFailure: true,
    onAbort:   false,
    email:     '',
    slack:     '',
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    setSaved(true)
    addToast({ type: 'success', title: 'Settings saved', message: 'Your configuration has been updated.' })
    setTimeout(() => setSaved(false), 3000)
  }

  const update = (key, val) => setConfig((p) => ({ ...p, [key]: val }))
  const updateN = (key, val) => setNotifs((p) => ({ ...p, [key]: val }))

  return (
    <div className="space-y-5 max-w-4xl animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Settings</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Manage your platform configuration</p>
      </div>

      {/* API Configuration */}
      <Section title="API Configuration" description="Connect to your Rundeck instance" icon={Server}>
        <SettingRow label="Rundeck URL" hint="Base URL of your Rundeck server">
          <div className="relative">
            <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
            <input
              id="setting-rundeck-url"
              className="input pl-8 text-xs"
              style={{ color: 'var(--text)' }}
              value={config.rundeckUrl}
              onChange={(e) => update('rundeckUrl', e.target.value)}
              placeholder="https://rundeck.example.com"
            />
          </div>
        </SettingRow>

        <SettingRow label="API Version" hint="Rundeck API version (default: 43)">
          <input
            id="setting-api-version"
            className="input text-xs max-w-28"
            style={{ color: 'var(--text)' }}
            value={config.apiVersion}
            onChange={(e) => update('apiVersion', e.target.value)}
          />
        </SettingRow>

        <SettingRow label="API Token" hint="Stored securely as an environment variable — not transmitted">
          <div className="relative">
            <Key size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
            <input
              id="setting-api-token"
              type={showToken ? 'text' : 'password'}
              className="input pl-8 pr-10 text-xs font-mono"
              style={{ color: 'var(--text)' }}
              value={config.apiToken}
              onChange={(e) => update('apiToken', e.target.value)}
              placeholder="Enter API token"
            />
            <button
              type="button"
              onClick={() => setShow((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)' }}
            >
              {showToken ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
          <p className="text-[11px] mt-1.5" style={{ color: 'var(--muted)' }}>
            <Shield size={10} className="inline mr-1" />
            Token is only used server-side and never exposed to the browser.
          </p>
        </SettingRow>

        <SettingRow label="Default Project">
          <input
            id="setting-project"
            className="input text-xs"
            style={{ color: 'var(--text)' }}
            value={config.project}
            onChange={(e) => update('project', e.target.value)}
          />
        </SettingRow>
      </Section>

      {/* Polling */}
      <Section title="Polling & Performance" description="Control request frequency and timeouts" icon={Clock}>
        <SettingRow label="Request Timeout" hint="Seconds before a request is aborted">
          <div className="flex items-center gap-2">
            <input
              id="setting-timeout"
              className="input text-xs max-w-24"
              style={{ color: 'var(--text)' }}
              type="number"
              min={5}
              max={120}
              value={config.timeout}
              onChange={(e) => update('timeout', e.target.value)}
            />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>seconds</span>
          </div>
        </SettingRow>
        <SettingRow label="Poll Interval" hint="How often to auto-refresh execution status">
          <div className="flex items-center gap-2">
            <input
              id="setting-poll"
              className="input text-xs max-w-24"
              style={{ color: 'var(--text)' }}
              type="number"
              min={3}
              max={60}
              value={config.pollInterval}
              onChange={(e) => update('pollInterval', e.target.value)}
            />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>seconds</span>
          </div>
        </SettingRow>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" description="Configure alerts and channels" icon={Bell}>
        {[
          { key: 'onSuccess', label: 'Notify on success' },
          { key: 'onFailure', label: 'Notify on failure' },
          { key: 'onAbort',   label: 'Notify on abort' },
        ].map(({ key, label }) => (
          <SettingRow key={key} label={label}>
            <button
              id={`toggle-${key}`}
              onClick={() => updateN(key, !notifs[key])}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200`}
              style={{ background: notifs[key] ? 'var(--brand)' : 'var(--nav-border)' }}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${notifs[key] ? 'translate-x-5' : ''}`} />
            </button>
          </SettingRow>
        ))}
        <SettingRow label="Email Address" hint="Receive email alerts for job events">
          <input
            id="setting-email"
            className="input text-xs"
            style={{ color: 'var(--text)' }}
            type="email"
            value={notifs.email}
            onChange={(e) => updateN('email', e.target.value)}
            placeholder="ops@company.com"
          />
        </SettingRow>
        <SettingRow label="Slack Webhook" hint="Post notifications to a Slack channel">
          <input
            id="setting-slack"
            className="input text-xs"
            style={{ color: 'var(--text)' }}
            value={notifs.slack}
            onChange={(e) => updateN('slack', e.target.value)}
            placeholder="https://hooks.slack.com/services/…"
          />
        </SettingRow>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" description="Display preferences" icon={Shield}>
        <SettingRow label="Color Theme" hint="Toggle between dark and light mode">
          <div className="flex gap-2">
            {['dark', 'light'].map((t) => (
              <button
                key={t}
                id={`theme-${t}`}
                onClick={() => { if (theme !== t) toggle() }}
                className="px-4 py-2 rounded-lg text-xs font-medium border transition-all"
                style={
                  theme === t
                    ? { background: 'var(--brand-glow)', borderColor: 'var(--brand)', color: 'var(--brand)' }
                    : { background: 'transparent', borderColor: 'var(--border)', color: 'var(--muted)' }
                }
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </SettingRow>
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          id="save-settings"
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-6"
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> Saving…</>
          ) : saved ? (
            <><CheckCircle2 size={14} /> Saved!</>
          ) : (
            <><Save size={14} /> Save Settings</>
          )}
        </button>
      </div>
    </div>
  )
}
