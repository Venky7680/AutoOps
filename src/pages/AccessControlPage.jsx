import { Lock, Upload, Plus } from 'lucide-react'

export default function AccessControlPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Lock size={28} className="text-slate-600 dark:text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Access Control</h2>
      </div>

      <div className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">ACL Policies for project {activeProject}</h3>
            <span className="bg-slate-600 dark:bg-slate-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">0</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border rounded text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 shadow-sm transition-colors" style={{ borderColor: 'var(--border)' }}>
              <Upload size={14} /> Upload
            </button>
            <button className="px-3 py-1.5 rounded text-xs font-bold bg-[#1e58c8] hover:bg-[#194bb0] text-white flex items-center gap-1.5 shadow-sm transition-colors">
              <Plus size={14} /> Create ACL Policy
            </button>
          </div>
        </div>

        <div className="p-16 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 min-h-[300px]">
          {/* Empty State */}
          <p className="text-slate-500 dark:text-slate-400 font-medium">No ACL Policies found.</p>
        </div>
      </div>
    </div>
  )
}
