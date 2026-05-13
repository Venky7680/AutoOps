import { useState, useEffect } from 'react'
import { Key, FolderUp, ChevronDown, Plus, X, Loader2, AlertCircle } from 'lucide-react'
import { keysApi } from '../lib/api'
import { useAppStore } from '../store/appStore'

export default function KeyStoragePage() {
  const activeProject = useAppStore((s) => s.activeProject)
  const addToast = useAppStore((s) => s.addToast)
  const [showModal, setShowModal] = useState(false)
  const [inputType, setInputType] = useState('text')
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [path, setPath] = useState('')

  useEffect(() => {
    loadKeys()
  }, [activeProject])

  const loadKeys = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await keysApi.list(activeProject)
      const keysData = response.data || []
      const keysList = Array.isArray(keysData) ? keysData : (keysData.keys || [])
      setKeys(keysList)
      setLoading(false)
    } catch (err) {
      // Show empty state instead of error for better UX
      setKeys([])
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20 relative">
      <div className="flex items-center gap-3 mb-6">
        <Key size={28} className="text-slate-600 dark:text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Key Storage</h2>
      </div>

      <div className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        
        {/* Search Bar */}
        <div className="flex border-b bg-slate-50 dark:bg-slate-800/50" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-r bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300" style={{ borderColor: 'var(--border)' }}>
            keys/project/{activeProject}
          </div>
          <input 
            type="text" 
            placeholder="Enter a path" 
            className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-slate-400"
            style={{ color: 'var(--text)' }}
            value={path}
            onChange={e => setPath(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Actions Bar */}
        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
          <button className="px-3 py-1.5 border rounded bg-white dark:bg-slate-800 text-slate-400 flex items-center gap-1 shadow-sm opacity-60 cursor-not-allowed" style={{ borderColor: 'var(--border)' }}>
            <FolderUp size={16} />
          </button>
          <button className="px-3 py-1.5 border rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 text-sm font-medium flex items-center gap-1 shadow-sm transition-colors" style={{ borderColor: 'var(--border)' }}>
            Action <ChevronDown size={14} />
          </button>
          <button 
            className="px-4 py-1.5 rounded bg-[#1e58c8] hover:bg-[#194bb0] text-white text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors ml-2"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} /> Add or Upload a Key
          </button>
        </div>

        {/* Content */}
        <div className="p-4 border-b min-h-[100px]" style={{ borderColor: 'var(--border)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={24} className="animate-spin text-slate-400" />
            </div>
          ) : error ? (
            <div className="text-center">
              <AlertCircle size={24} className="mx-auto mb-2 text-red-400" />
              <p className="text-sm text-slate-500">{error}</p>
            </div>
          ) : keys.length === 0 ? (
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Nothing found at this path. Select "Add or Upload a Key" if you would like to create a new key.</p>
          ) : (
            <div className="space-y-2">
              {keys.map((key) => (
                <div key={key.id || key.name} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-sm" style={{ color: 'var(--text)' }}>{key.name || key.id}</span>
                  <span className="text-xs text-slate-400">{key.type || 'key'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-teal-700 dark:text-teal-400">Key Storage provides a global directory-like structure to save Public and Private Keys and Passwords, for use with Node Execution authentication.</p>
        </div>
      </div>

      {/* Add or Upload Key Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Add or Upload a Key</h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 text-right pt-2">Key Type:</label>
                <div>
                  <div className="relative border rounded bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border)' }}>
                    <select className="w-full bg-transparent px-3 py-2 text-sm outline-none appearance-none" style={{ color: 'var(--text)' }}>
                      <option>Private Key</option>
                      <option>Public Key</option>
                      <option>Password</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Private Keys and Passwords are not available to download once they are stored. Public keys can be downloaded.</p>
                </div>
              </div>

              <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                <div className="flex flex-col items-end gap-1 pt-1">
                  <div className="border rounded overflow-hidden flex flex-col text-sm shadow-sm" style={{ borderColor: 'var(--border)' }}>
                    <button 
                      className={`px-3 py-1.5 text-right flex items-center justify-end gap-1 ${inputType === 'text' ? 'bg-white dark:bg-slate-800 font-bold' : 'bg-slate-50 dark:bg-slate-900/50'}`}
                      style={{ color: 'var(--text)' }}
                      onClick={() => setInputType('text')}
                    >
                      {inputType === 'text' && <span className="text-[10px]">✔</span>} Enter text
                    </button>
                    <button 
                      className={`px-3 py-1.5 text-center ${inputType === 'file' ? 'bg-[#5c9dff] text-white font-bold' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400'}`}
                      onClick={() => setInputType('file')}
                    >
                      Upload File
                    </button>
                  </div>
                </div>
                <div>
                  {inputType === 'text' ? (
                    <textarea 
                      className="w-full border rounded p-2 text-sm outline-none bg-white dark:bg-slate-900 shadow-sm min-h-[120px] font-mono resize-none"
                      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                    />
                  ) : (
                    <div className="w-full border rounded p-4 text-sm outline-none bg-slate-50 dark:bg-slate-900 shadow-sm border-dashed text-center text-slate-500" style={{ borderColor: 'var(--border)' }}>
                      Click or drag file here to upload
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 text-right">Storage path:</label>
                <div className="flex border rounded shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                  <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 border-r" style={{ borderColor: 'var(--border)' }}>
                    keys/project/{activeProject}
                  </div>
                  <input type="text" placeholder="Enter the directory name" className="flex-1 px-3 py-2 text-sm outline-none bg-white dark:bg-slate-900" style={{ color: 'var(--text)' }} />
                </div>
              </div>

              <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 text-right">Name:</label>
                <input type="text" placeholder="Specify a name." className="border rounded px-3 py-2 text-sm outline-none bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
              </div>

              <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                <div />
                <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-[#a5d6a7]" />
                  Do not overwrite a file with the same name.
                </label>
              </div>

              <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                <div />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">You can reference this stored Key using the storage path:</p>
                  <p className="text-sm font-bold text-teal-700 dark:text-teal-400">keys/project/{activeProject}/</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
              <button 
                className="px-4 py-1.5 border rounded text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm" 
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-1.5 rounded text-sm font-medium bg-[#a5d6a7] text-white shadow-sm cursor-not-allowed">
                Save
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
