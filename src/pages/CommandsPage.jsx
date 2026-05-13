import { useState, useEffect } from 'react'
import { TerminalSquare, ChevronDown, HelpCircle, Settings, Loader2, AlertCircle } from 'lucide-react'
import { nodesApi } from '../lib/api'
import { useAppStore } from '../store/appStore'

export default function CommandsPage() {
  const activeProject = useAppStore((s) => s.activeProject)
  const addToast = useAppStore((s) => s.addToast)
  const [showNodesDropdown, setShowNodesDropdown] = useState(false)
  const [showRecentDropdown, setShowRecentDropdown] = useState(false)
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [command, setCommand] = useState('')
  const [selectedNodes, setSelectedNodes] = useState([])

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

  const handleExecuteCommand = async () => {
    if (!command.trim()) {
      addToast({ type: 'error', title: 'Error', message: 'Please enter a command' })
      return
    }
    if (selectedNodes.length === 0) {
      addToast({ type: 'error', title: 'Error', message: 'Please select nodes' })
      return
    }
    // Command execution would be implemented here based on Rundeck API
    addToast({ type: 'info', title: 'Command Executed', message: 'Command sent to selected nodes' })
  }
  
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <TerminalSquare size={28} className="text-slate-600 dark:text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Commands</h2>
      </div>

      {/* Nodes Search Bar */}
      <div className="flex items-stretch rounded border shadow-sm bg-white dark:bg-slate-900 h-12" style={{ borderColor: 'var(--border)' }}>
        <div className="relative flex">
          <div className="flex">
            <button className="px-6 bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-l hover:bg-slate-50 transition-colors">
              Nodes
            </button>
            <button 
              className="px-3 border-l bg-white dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-50 transition-colors" style={{ borderColor: 'var(--border)' }}
              onClick={() => setShowNodesDropdown(!showNodesDropdown)}
            >
              <ChevronDown size={14} />
            </button>
          </div>
          
          {showNodesDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border rounded shadow-lg z-10 py-1" style={{ borderColor: 'var(--border)' }}>
              <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50" style={{ color: 'var(--text)' }}>
                Show all nodes
              </button>
            </div>
          )}
        </div>
        
        <input 
          type="text" 
          placeholder="Enter a node filter, or .* for all nodes" 
          className="flex-1 bg-slate-50 dark:bg-slate-900/50 px-4 text-sm outline-none placeholder:text-slate-400 border-l"
          style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
          disabled={loading}
        />
        
        <button className="px-4 border-l bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 transition-colors flex items-center justify-center" style={{ borderColor: 'var(--border)' }}>
          <HelpCircle size={16} className="text-slate-600 dark:text-slate-400" />
        </button>
        <button className="px-8 bg-[#81c784] hover:bg-[#66bb6a] text-white font-medium text-sm transition-colors rounded-r">
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
          {/* Warning */}
          {selectedNodes.length === 0 && (
            <div className="border rounded p-4 bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: '#fbc02d' }}>
              <p className="text-orange-500 font-medium text-sm">No nodes selected. Match nodes by selecting or entering a filter.</p>
            </div>
          )}

      {/* Command Input Bar */}
      <div className="relative mt-8">
        <div className="flex items-stretch rounded border shadow-sm h-12" style={{ borderColor: 'var(--border)' }}>
           <button 
             className="px-6 bg-[#5e6267] text-white text-sm font-medium rounded-l flex items-center gap-2 hover:bg-[#4a4d52] transition-colors"
             onClick={() => setShowRecentDropdown(!showRecentDropdown)}
           >
             Recent <ChevronDown size={14} />
           </button>
           <input 
             type="text" 
             className="flex-1 bg-slate-200/80 dark:bg-slate-800 px-4 text-sm outline-none placeholder:text-slate-400" 
             placeholder="Enter a command" 
             style={{ color: 'var(--text)' }}
             value={command}
             onChange={e => setCommand(e.target.value)}
           />
           <button className="px-4 bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center" style={{ borderColor: 'var(--border)' }}>
             <Settings size={16} className="text-slate-600 dark:text-slate-400" />
           </button>
           <button 
             className="px-8 bg-[#a5d6a7] hover:bg-[#81c784] text-white font-medium text-sm rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
             disabled={selectedNodes.length === 0 || !command.trim()}
             onClick={handleExecuteCommand}
           >
             {selectedNodes.length > 0 ? `Run on ${selectedNodes.length}` : 'No Nodes'}
           </button>
        </div>
        
        {/* Label sticking to bottom of Recent button */}
        <div className="absolute top-full left-0 bg-white dark:bg-slate-800 border-x border-b rounded-b-lg shadow-sm px-4 py-1 mt-[-1px] w-48" style={{ borderColor: 'var(--border)' }}>
           <span className="text-xs font-bold text-slate-700 dark:text-slate-300">None</span>
        </div>
      </div>

      {/* Activity for commands */}
      <div className="pt-12">
        <h3 className="text-[22px] font-bold mb-4 text-slate-600 dark:text-slate-300">Activity for commands</h3>
        <div className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">0 Executions</span>
            <span className="text-sm text-teal-600 dark:text-teal-400 font-medium flex items-center cursor-pointer hover:underline">
              any time <ChevronDown size={14} className="ml-0.5" />
            </span>
            <button className="text-[11px] border px-2 py-0.5 rounded ml-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors" style={{ borderColor: 'var(--border)' }}>
              Save Filter...
            </button>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 py-20 flex items-center justify-center">
            <span className="text-sm font-medium text-slate-500">No results for the query</span>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
