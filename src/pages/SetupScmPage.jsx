import { useState } from 'react'
import { RefreshCw, Github, GitBranch, Check, X } from 'lucide-react'

const PLUGINS = [
  { id: 'git-export', name: 'Git Export', desc: 'Export job definitions to a Git repository on each change.' },
  { id: 'git-import', name: 'Git Import', desc: 'Import job definitions from a Git repository.' },
]

export default function SetupScmPage() {
  const [activePlugin, setActivePlugin] = useState(null)
  const [gitUrl, setGitUrl] = useState('')
  const [branch, setBranch] = useState('main')
  const [fetchMode, setFetchMode] = useState('MERGE')

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-3 mb-6">
        <RefreshCw size={28} className="text-slate-600 dark:text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Setup SCM</h2>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 -mt-2">
        Configure Source Control Management (SCM) integrations for this project.
        SCM allows you to export and import job definitions using a Git repository.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLUGINS.map(plugin => (
          <div
            key={plugin.id}
            className={`border rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm cursor-pointer transition-all duration-200 group ${activePlugin === plugin.id ? 'border-blue-500 ring-2 ring-blue-500/30' : 'hover:border-slate-400 dark:hover:border-slate-500'}`}
            style={{ borderColor: activePlugin === plugin.id ? undefined : 'var(--border)' }}
            onClick={() => setActivePlugin(plugin.id === activePlugin ? null : plugin.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${activePlugin === plugin.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'} transition-colors`}>
                  <Github size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{plugin.name}</h3>
              </div>
              {activePlugin === plugin.id && (
                <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  <Check size={12} /> Selected
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{plugin.desc}</p>
          </div>
        ))}
      </div>

      {activePlugin && (
        <div className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <div className="p-5 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <GitBranch size={18} className="text-slate-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-200">
              {PLUGINS.find(p => p.id === activePlugin)?.name} Configuration
            </h3>
          </div>
          <div className="p-6 space-y-5 max-w-3xl">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Git Repository URL</label>
              <input
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-800/50 border rounded px-4 py-2 text-sm outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                placeholder="https://github.com/org/repo.git"
                value={gitUrl}
                onChange={e => setGitUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Branch</label>
              <input
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-800/50 border rounded px-4 py-2 text-sm outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                placeholder="main"
                value={branch}
                onChange={e => setBranch(e.target.value)}
              />
            </div>
            {activePlugin === 'git-import' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Fetch Automatically</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border rounded px-4 py-2 text-sm outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  value={fetchMode}
                  onChange={e => setFetchMode(e.target.value)}
                >
                  <option value="MERGE">MERGE – Automatically fetch and merge</option>
                  <option value="PULL">PULL – Automatically pull on changes</option>
                  <option value="NONE">NONE – Manual fetch only</option>
                </select>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setActivePlugin(null)}
              className="px-4 py-1.5 border rounded text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <X size={14} /> Cancel
            </button>
            <button className="px-4 py-1.5 rounded text-sm font-medium bg-[#28a745] hover:bg-[#218838] text-white flex items-center gap-1.5 shadow-sm transition-colors">
              <Check size={14} /> Save &amp; Enable SCM
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
