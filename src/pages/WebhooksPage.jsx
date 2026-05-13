import { useState, useEffect } from 'react'
import { Plug, Search, ChevronDown, CheckSquare, Loader2, AlertCircle, X, Check } from 'lucide-react'
import { webhooksApi } from '../lib/api'
import { useAppStore } from '../store/appStore'

export default function WebhooksPage() {
  const activeProject = useAppStore((s) => s.activeProject)
  const [activeTab, setActiveTab] = useState('General')
  const [showPluginDropdown, setShowPluginDropdown] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  
  const [formData, setFormData] = useState({
    name: 'New Hook',
    user: '',
    roles: '',
    enabled: true,
    useAuth: false
  })

  const [webhooks, setWebhooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWebhooks()
  }, [activeProject])

  const loadWebhooks = async () => {
    try {
      setLoading(true)
      const response = await webhooksApi.list(activeProject)
      const data = response.data || []
      setWebhooks(Array.isArray(data) ? data : (data.webhooks || []))
    } catch (err) {
      setWebhooks([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] -mx-6 -my-6 overflow-hidden bg-[#f3f6f8] dark:bg-slate-950">
      
      {/* Left Sidebar */}
      <div className="w-[300px] bg-white dark:bg-slate-900 border-r flex flex-col shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="p-4 flex items-center gap-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
          <Plug size={18} className="text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Webhooks</h2>
        </div>
        
        <div className="p-2 border-b bg-slate-50/50 dark:bg-slate-800/30" style={{ borderColor: 'var(--border)' }}>
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter Webhooks" 
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 size={24} className="animate-spin text-brand-500" />
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Loading...</span>
            </div>
          ) : webhooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Plug size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-400">No webhooks configured</p>
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {webhooks.map((w) => (
                <button
                  key={w.id}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group relative overflow-hidden"
                  style={{ color: 'var(--text)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                    <span className="font-medium">{w.name || 'Untitled Webhook'}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-800/30" style={{ borderColor: 'var(--border)' }}>
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98]"
          >
            <span className="text-xl leading-none mt-[-2px]">+</span> Create Webhook
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-slate-950/50 relative">
        {!isCreating ? (
           <div className="h-full flex items-center justify-center opacity-40">
             {/* Empty State Background or Illustration can go here */}
           </div>
        ) : (
          <div className="max-w-5xl mx-auto p-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">New Hook</h1>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-2 border rounded-xl text-sm font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center gap-2" 
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  <X size={16} /> Cancel
                </button>
                <button className="px-8 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95">
                  <Check size={16} /> Save
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b mb-8" style={{ borderColor: 'var(--border)' }}>
              {[
                { id: 'General', label: 'General' },
                { id: 'Handler Configuration', label: 'Handler Configuration' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  className={`px-6 py-4 text-sm font-black border-b-2 transition-all relative ${activeTab === tab.id ? 'border-red-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'General' && (
                <>
                  {/* High Fidelity Info Blocks */}
                  <div className="border-2 rounded-2xl bg-teal-50/30 dark:bg-teal-900/5 overflow-hidden transition-all hover:shadow-md" style={{ borderColor: '#d1fae5' }}>
                    <div className="p-6 border-b" style={{ borderColor: '#d1fae5' }}>
                      <h3 className="font-black text-sm text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wider">Post URL</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">When a HTTP POST request to this URL is received, the Webhook Plugin chosen below will receive the data.</p>
                      <div className="bg-white/80 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 p-4 text-sm text-slate-400 font-medium rounded-xl italic">
                        URL will be generated after the Webhook is created
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-black text-sm text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wider">HTTP Authorization String</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">[Optional] A Webhook authorization string can be generated to increase security of this webhook. All posts will need to include the generated string in the Authorization header.</p>
                      <label className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer group">
                        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${formData.useAuth ? 'bg-slate-700 border-slate-700 dark:bg-slate-400 dark:border-slate-400' : 'border-slate-300 group-hover:border-slate-400'}`}>
                          {formData.useAuth && <Check size={14} className="text-white dark:text-slate-900" strokeWidth={4} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.useAuth} onChange={e => setFormData({...formData, useAuth: e.target.checked})} />
                        Use Authorization Header
                      </label>
                    </div>
                  </div>

                  {/* Form Core Card */}
                  <div className="border rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none p-8 space-y-8" style={{ borderColor: 'var(--border)' }}>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-6">
                      <label className="text-sm font-black text-slate-500 text-right uppercase tracking-wider">Name</label>
                      <input 
                        type="text" 
                        className="w-full border-2 rounded-xl px-4 py-3 text-sm bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        style={{ borderColor: 'var(--border)', color: 'var(--text)' }} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-[120px_1fr] items-start gap-6">
                      <label className="text-sm font-black text-slate-500 text-right uppercase tracking-wider pt-3">User</label>
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          className="w-full border-2 rounded-xl px-4 py-3 text-sm bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" 
                          style={{ borderColor: 'var(--border)', color: 'var(--text)' }} 
                        />
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">The authorization username assumed when running this webhook. All ACL policies matching this username will apply.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-start gap-6">
                      <label className="text-sm font-black text-slate-500 text-right uppercase tracking-wider pt-3">Roles</label>
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          className="w-full border-2 rounded-xl px-4 py-3 text-sm bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all" 
                          style={{ borderColor: 'var(--border)', color: 'var(--text)' }} 
                        />
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">The authorization roles assumed when running this webhook (comma separated). All ACL policies matching these roles will apply.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-6">
                      <div />
                      <label className="flex items-center gap-3 text-sm font-black text-slate-700 dark:text-slate-300 cursor-pointer group">
                        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${formData.enabled ? 'bg-slate-800 border-slate-800 dark:bg-white dark:border-white' : 'border-slate-300 group-hover:border-slate-400'}`}>
                          {formData.enabled && <Check size={14} className="text-white dark:text-slate-900" strokeWidth={4} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.enabled} onChange={e => setFormData({...formData, enabled: e.target.checked})} />
                        Enabled
                      </label>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Handler Configuration' && (
                <div className="border rounded-2xl bg-white dark:bg-slate-900 shadow-xl p-8 min-h-[300px]" style={{ borderColor: 'var(--border)' }}>
                  <div className="relative inline-block w-full max-w-md">
                    <button 
                      className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm font-black px-5 py-3 rounded-xl flex items-center justify-between shadow-lg transition-all active:scale-95"
                      onClick={() => setShowPluginDropdown(!showPluginDropdown)}
                    >
                      Choose Webhook Plugin <ChevronDown size={18} className={`transition-transform duration-300 ${showPluginDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showPluginDropdown && (
                      <div className="absolute top-full left-0 mt-3 w-[450px] bg-white dark:bg-slate-800 border-2 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200" style={{ borderColor: 'var(--border)' }}>
                        {[
                          { title: 'Log Events', desc: "Logs incoming webhook events to log4j logger 'org.rundeck.webhook.events'" },
                          { title: 'Run Job', desc: "Run a job on webhook event. This plugin expects the incoming payload to be JSON" }
                        ].map((p, i) => (
                          <button 
                            key={p.title}
                            className={`flex items-start gap-4 w-full text-left px-5 py-4 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${i === 0 ? 'border-b-2' : ''}`} 
                            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                          >
                            <div className="mt-1 flex-shrink-0 w-3 h-3 bg-slate-800 dark:bg-slate-400 rotate-45 shadow-sm" />
                            <div>
                              <span className="font-black block text-slate-800 dark:text-slate-200 mb-1">{p.title}</span>
                              <span className="text-[11px] text-slate-500 font-medium leading-relaxed">{p.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-20 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 gap-4 select-none">
                    <Plug size={48} className="opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest opacity-30">Plugin Configuration will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
