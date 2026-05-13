import { useState, useEffect } from 'react'
import { FileText, Eye, Loader2, AlertCircle } from 'lucide-react'
import { projectsApi } from '../lib/api'
import { useAppStore } from '../store/appStore'

export default function EditReadmePage() {
  const activeProject = useAppStore((s) => s.activeProject)
  const addToast = useAppStore((s) => s.addToast)
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadReadme()
  }, [activeProject])

  const loadReadme = async () => {
    try {
      setLoading(true)
      const response = await projectsApi.readme(activeProject)
      const readmeContent = response.data?.content || response.data || ''
      setContent(readmeContent)
      setLoading(false)
    } catch (err) {
      // Show empty content instead of error for better UX
      setContent('')
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await projectsApi.updateReadme(activeProject, content)
      addToast({ type: 'success', title: 'Readme Saved', message: 'Project readme updated successfully' })
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save readme' })
    } finally {
      setSaving(false)
    }
  }

  // Very simple markdown → HTML renderer (headings, bold, bullets, paragraphs)
  function renderMarkdown(md) {
    return md
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-5 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-2 border-b pb-1">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n\n/g, '<br/><br/>')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--brand)' }} />
        </div>
      )}

      {!loading && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <FileText size={28} className="text-slate-600 dark:text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Edit Readme</h2>
          </div>

          <div className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Edit the readme for this project using <a href="#" className="text-blue-600 hover:underline">Markdown</a> syntax.
                  The readme is displayed on the project home page and/or projects list.
                </p>
              </div>
              <button
                onClick={() => setPreview(p => !p)}
                className="flex items-center gap-2 px-3 py-1.5 border rounded text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <Eye size={14} /> {preview ? 'Edit' : 'Preview'}
              </button>
            </div>

            <div className="p-6">
              {preview ? (
                <div
                  className="min-h-[360px] prose prose-slate dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 p-4 border rounded bg-slate-50 dark:bg-slate-800/50"
                  style={{ borderColor: 'var(--border)' }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
              ) : (
                <textarea
                  className="w-full min-h-[360px] bg-slate-50 dark:bg-slate-800/50 border rounded px-4 py-3 text-sm outline-none font-mono resize-y"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Enter project readme in Markdown..."
                />
              )}
            </div>

            <div className="px-6 py-4 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
              <button className="px-4 py-1.5 border rounded text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Cancel</button>
              <button 
                className="px-4 py-1.5 rounded text-sm font-medium bg-[#28a745] hover:bg-[#218838] text-white shadow-sm transition-colors disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
