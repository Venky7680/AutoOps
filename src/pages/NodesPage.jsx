import { useState, useEffect } from 'react'
import { Network, ChevronDown, HelpCircle, Asterisk, Loader2, AlertCircle } from 'lucide-react'
import { nodesApi } from '../lib/api'
import { useAppStore } from '../store/appStore'

export default function NodesPage() {
  const activeProject = useAppStore((s) => s.activeProject)
  const addToast = useAppStore((s) => s.addToast)
  const [showDropdown, setShowDropdown] = useState(false)
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    loadNodes()
  }, [activeProject])

  const loadNodes = async () => {
    try {
      setLoading(true)
      const response = await nodesApi.list(activeProject)
      const nodesData = response.data || []
      const nodesList = Array.isArray(nodesData) ? nodesData : (nodesData.nodes || [])
      setNodes(nodesList)
      setLoading(false)
    } catch (err) {
      // Show empty state instead of error for better UX
      setNodes([])
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Network size={28} className="text-slate-600 dark:text-slate-400" />
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Nodes</h2>
      </div>

      {/* Search Bar Block */}
      <div className="flex items-stretch bg-slate-200/70 dark:bg-slate-800/80 rounded border shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="relative flex">
          <div className="flex">
            <button className="px-4 py-2 bg-transparent text-sm font-medium" style={{ color: 'var(--text)' }}>
              Nodes
            </button>
            <button 
              className="px-2 bg-slate-700 dark:bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <ChevronDown size={14} />
            </button>
          </div>
          
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border rounded shadow-lg z-10 py-1" style={{ borderColor: 'var(--border)' }}>
              <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50" style={{ color: 'var(--text)' }}>
                <Asterisk size={14} /> Show all nodes
              </button>
            </div>
          )}
        </div>
        
        <input 
          type="text" 
          placeholder="Enter a node filter, or .* for all nodes" 
          className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-slate-400"
          style={{ color: 'var(--text)' }}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        
        <button className="px-3 py-2 border-l bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 transition-colors flex items-center justify-center" style={{ borderColor: 'var(--border)' }}>
          <HelpCircle size={14} className="text-slate-600 dark:text-slate-400" />
        </button>
        <button className="px-6 py-2 bg-[#81c784] hover:bg-[#66bb6a] text-white font-medium text-sm transition-colors rounded-r">
          Search
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--brand)' }} />
        </div>
      )}

      {!loading && (
        <>
          {/* Content Card */}
          <div className="card overflow-hidden">
            {/* Card Header Tabs */}
            <div className="flex items-center justify-between border-b px-2" style={{ borderColor: 'var(--border)' }}>
              <div className="flex gap-6 px-4">
                <button className="px-2 py-3 text-sm font-bold border-b-[3px] border-red-500 text-slate-800 dark:text-slate-200">
                  Browse
                </button>
                <button className="px-2 py-3 text-sm font-medium text-slate-500 border-b-[3px] border-transparent">
                  Result: <span className="text-teal-600 dark:text-teal-400 font-bold">{nodes.length}</span> Nodes
                </button>
              </div>
              <div className="px-4">
                <button className="flex items-center gap-1 border rounded px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                  Actions <ChevronDown size={14} className="ml-1 text-slate-500" />
                </button>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="p-6">
              {nodes.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--muted)' }}>
                  No nodes found in this project
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4 uppercase tracking-wide">Tags</h3>
                    <p className="text-sm" style={{ color: 'var(--text)' }}>None</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4 uppercase tracking-wide">Filters</h3>
                    <div className="mb-4">
                      <button className="flex items-center justify-between border rounded px-3 py-1.5 text-sm bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors min-w-[140px]" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                        <span>All Nodes {nodes.length}</span>
                        <ChevronDown size={14} className="text-slate-500" />
                      </button>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text)' }}>None</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
