import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Settings, Key, Network, Lock, FileText,
  MessageSquare, RefreshCw, Download, Upload, Trash2,
  AlertTriangle, X
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { projectsApi } from '../lib/api'


const SETTINGS_MENU = [
  { title: 'Edit Configuration', desc: 'Manage project configuration details and properties', icon: Settings, to: '/project/configure' },
  { title: 'Key Storage', desc: 'Manage passwords and private keys for authentication', icon: Key, to: '/project/keys' },
  { title: 'Edit Nodes', desc: 'Configure node sources and their respective settings', icon: Network, to: '/project/edit-nodes' },
  { title: 'Access Control', desc: 'Manage ACL policies for this specific project', icon: Lock, to: '/project/acl' },
  { title: 'Edit Readme', desc: 'Update the project readme file displayed on the home page', icon: FileText, to: '/project/readme' },
  { title: 'Edit Message of the Day', desc: 'Set the project MOTD to display announcements', icon: MessageSquare, to: '/project/motd' },
  { title: 'Setup SCM', desc: 'Configure Source Control Management integrations', icon: RefreshCw, to: '/project/scm' },
  { title: 'Export Archive', desc: 'Export the project to a portable archive file', icon: Download, to: '/project/export' },
  { title: 'Import Archive', desc: 'Import jobs and configurations from an archive file', icon: Upload, to: '/project/import' },
]

function DeleteProjectModal({ onClose, onConfirm, projectName }) {
  const [typed, setTyped] = useState('')
  const [deleting, setDeleting] = useState(false)
  const confirmed = typed === projectName

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleDelete = async () => {
    if (!confirmed) return
    setDeleting(true)
    await new Promise(r => setTimeout(r, 1200))
    onConfirm()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-50 overflow-hidden">

        {/* Red header stripe */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/40 rounded-full">
              <Trash2 size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Project</h3>
          </div>
          <button onClick={onClose} className="text-red-200 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Warning box */}
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm text-red-700 dark:text-red-400 space-y-1">
              <p className="font-bold">This action is permanent and cannot be undone.</p>
              <p>Deleting <span className="font-mono font-bold">{projectName}</span> will permanently remove:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-red-600 dark:text-red-500">
                <li>All jobs and their definitions</li>
                <li>All execution history and logs</li>
                <li>All project configuration and ACL policies</li>
                <li>All webhooks and SCM configuration</li>
              </ul>
            </div>
          </div>

          {/* Typed confirmation */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Type <span className="font-mono text-red-600 dark:text-red-400">{projectName}</span> to confirm deletion:
            </label>
            <input
              type="text"
              value={typed}
              onChange={e => setTyped(e.target.value)}
              placeholder={projectName}
              className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none font-mono transition-colors bg-white dark:bg-slate-800"
              style={{
                borderColor: confirmed ? '#22c55e' : (typed.length > 0 ? '#ef4444' : 'var(--border)'),
                color: 'var(--text)',
              }}
              autoFocus
            />
            {typed.length > 0 && !confirmed && (
              <p className="text-xs text-red-500 mt-1.5">Project name does not match.</p>
            )}
            {confirmed && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
                ✓ Name confirmed — you may now delete.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!confirmed || deleting}
            className="px-5 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: confirmed ? '#dc2626' : '#f87171' }}
          >
            {deleting
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting…</>
              : <><Trash2 size={15} /> Delete Project</>
            }
          </button>
        </div>
      </div>
    </>
  )
}

export default function ProjectSettingsPage() {
  const navigate = useNavigate()
  const addToast = useAppStore(s => s.addToast)
  const activeProject = useAppStore(s => s.activeProject)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true)
      await projectsApi.delete(activeProject)
      setShowDeleteModal(false)
      addToast({ type: 'success', title: 'Project Deleted', message: `"${activeProject}" has been permanently deleted.` })
      navigate('/projects')
    } catch (err) {
      setDeleting(false)
      addToast({ type: 'error', title: 'Error', message: 'Failed to delete project' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
        <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-xl">
          <Settings size={32} className="text-slate-700 dark:text-slate-300" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Project Settings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage configuration, security, and administrative settings for the current project.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SETTINGS_MENU.map(({ title, desc, icon: Icon, to }) => (
          <div
            key={title}
            onClick={() => navigate(to)}
            className="border rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-all duration-200 group flex flex-col h-full"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-[#1e58c8] group-hover:text-white transition-colors duration-200">
                <Icon size={24} />
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#1e58c8] dark:group-hover:text-[#5c9dff] transition-colors">{title}</h3>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{desc}</p>
          </div>
        ))}

        {/* Delete Project Danger Card */}
        <div
          onClick={() => setShowDeleteModal(true)}
          className="border border-red-200 dark:border-red-900/50 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-red-400 dark:hover:border-red-500 cursor-pointer transition-all duration-200 group flex flex-col h-full"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors duration-200">
              <Trash2 size={24} />
            </div>
            <div className="pt-1">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">Delete Project</h3>
            </div>
          </div>
          <p className="text-sm text-red-400/80 dark:text-red-400/60 leading-relaxed flex-1">Permanently delete this project and all of its associated data. This action cannot be undone.</p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteProjectModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          projectName={activeProject}
        />
      )}
    </div>
  )
}

