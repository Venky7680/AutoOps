import { useState } from 'react'
import { MessageSquare, Eye } from 'lucide-react'

export default function EditMotdPage() {
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(false)

  function renderMarkdown(md) {
    return md
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-3">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n\n/g, '<br/><br/>')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={28} className="text-slate-600 dark:text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Edit Message of the Day</h2>
      </div>

      <div className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Edit the message of the day (MOTD) for this project using <a href="#" className="text-blue-600 hover:underline">Markdown</a> syntax.
            The MOTD can appear on the projects list, project home page, and as a navbar indicator.
          </p>
          <button
            onClick={() => setPreview(p => !p)}
            className="ml-4 flex items-center gap-2 px-3 py-1.5 border rounded text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors shrink-0"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <Eye size={14} /> {preview ? 'Edit' : 'Preview'}
          </button>
        </div>

        <div className="p-6">
          {preview ? (
            <div
              className="min-h-[280px] text-sm text-slate-700 dark:text-slate-300 p-4 border rounded bg-slate-50 dark:bg-slate-800/50"
              style={{ borderColor: 'var(--border)' }}
              dangerouslySetInnerHTML={{ __html: content ? renderMarkdown(content) : '<span class="text-slate-400 italic">Nothing to preview.</span>' }}
            />
          ) : (
            <textarea
              className="w-full min-h-[280px] bg-slate-50 dark:bg-slate-800/50 border rounded px-4 py-3 text-sm outline-none font-mono resize-y"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Enter message of the day in Markdown..."
            />
          )}
        </div>

        <div className="px-6 py-4 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
          <button className="px-4 py-1.5 border rounded text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Cancel</button>
          <button className="px-4 py-1.5 rounded text-sm font-medium bg-[#28a745] hover:bg-[#218838] text-white shadow-sm transition-colors">Save</button>
        </div>
      </div>
    </div>
  )
}
