import { useState } from 'react'
import { Download, Info } from 'lucide-react'

const INCLUDE_ITEMS = [
  { key: 'jobs',      label: 'Jobs' },
  { key: 'executions', label: 'Executions' },
  { key: 'config',   label: 'Configuration' },
  { key: 'readmeMotd', label: 'Readme/Motd' },
  { key: 'acl',      label: 'ACL Policies' },
  { key: 'scm',      label: 'SCM configuration' },
  { key: 'webhooks', label: 'Webhooks' },
]

export default function ExportArchivePage() {
  const [all, setAll] = useState(true)
  const [include, setInclude] = useState({
    jobs: true, executions: true, config: true,
    readmeMotd: true, acl: true, scm: true, webhooks: true,
  })
  const [referencedJobs, setReferencedJobs] = useState('none')
  const [webhookTokens, setWebhookTokens] = useState(false)
  const [exporting, setExporting] = useState(false)

  const toggleAll = checked => {
    setAll(checked)
    const next = {}
    INCLUDE_ITEMS.forEach(i => { next[i.key] = checked })
    setInclude(next)
  }

  const toggleItem = key => {
    const next = { ...include, [key]: !include[key] }
    setInclude(next)
    setAll(Object.values(next).every(Boolean))
  }

  const handleExport = async () => {
    setExporting(true)
    await new Promise(r => setTimeout(r, 1000))
    setExporting(false)
  }

  const Row = ({ label, children }) => (
    <div className="flex border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <div className="w-48 shrink-0 py-4 px-6 text-sm font-bold text-slate-700 dark:text-slate-300 text-right border-r" style={{ borderColor: 'var(--border)' }}>
        {label}
      </div>
      <div className="flex-1 py-4 px-6 text-sm text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Download size={22} className="text-slate-600 dark:text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Export Archive</h2>
      </div>

      <div className="border rounded bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border)' }}>

        {/* Project Row */}
        <Row label="Project:">
          <span className="font-medium">AWS-AUTOMATION</span>
        </Row>

        {/* Include Row */}
        <Row label="Include">
          <div className="space-y-1.5">
            {/* All checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={all}
                onChange={e => toggleAll(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">All</span>
            </label>
            <div className="mt-3 space-y-1.5 pl-2 border-l-2 ml-1.5" style={{ borderColor: 'var(--border)' }}>
              {INCLUDE_ITEMS.map(item => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={include[item.key]}
                    onChange={() => toggleItem(item.key)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </Row>

        {/* Referenced Jobs Row */}
        <Row label="Referenced Jobs:">
          <div className="space-y-2">
            {[
              { val: 'none',       label: 'Do not modify referenced jobs at export.' },
              { val: 'stripNames', label: 'Strip Names. If possible, use only the UUID on referenced jobs.' },
              { val: 'stripUUID',  label: 'Strip UUID. If possible, use only the group/name on referenced jobs.' },
            ].map(opt => (
              <label key={opt.val} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="referencedJobs"
                  value={opt.val}
                  checked={referencedJobs === opt.val}
                  onChange={() => setReferencedJobs(opt.val)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{opt.label}</span>
              </label>
            ))}
          </div>
        </Row>
      </div>

      {/* Webhooks Section */}
      <div className="border rounded bg-white dark:bg-slate-900 shadow-sm mt-4" style={{ borderColor: 'var(--border)' }}>
        <div className="px-6 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Webhooks</h3>
        </div>
        <div className="p-6 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={webhookTokens}
              onChange={e => setWebhookTokens(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Include Webhook Auth Tokens</span>
          </label>
          <p className="text-sm text-slate-500 dark:text-slate-400 pl-6">If not included, tokens will be regenerated upon import.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 border rounded text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-1.5 rounded text-sm font-bold bg-[#28a745] hover:bg-[#218838] text-white flex items-center gap-2 shadow-sm transition-colors disabled:opacity-70"
          >
            {exporting
              ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Exporting…</>
              : <><Download size={14} /> Export Archive <Info size={13} className="opacity-70" /></>
            }
          </button>
        </div>
        <button
          className="px-3 py-1.5 border rounded text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          Export To Another Instance...
        </button>
      </div>
    </div>
  )
}
