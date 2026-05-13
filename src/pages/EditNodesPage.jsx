import { useState } from 'react'
import { Server, Settings, Pencil, ArrowUp, ArrowDown, X } from 'lucide-react'

// ---------- helpers ----------

function FormRow({ label, children, hint }) {
  return (
    <div className="flex gap-0 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <div className="w-52 shrink-0 py-4 pr-6 text-sm font-bold text-slate-700 dark:text-slate-300 text-right leading-snug pt-5">
        {label}
      </div>
      <div className="flex-1 py-4 pl-6 space-y-1.5">
        {children}
        {hint && <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>}
      </div>
    </div>
  )
}

function Input({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-100 dark:bg-slate-800 border rounded px-3 py-1.5 text-sm outline-none"
      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
    />
  )
}

function Textarea({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={5}
      className="w-full bg-slate-100 dark:bg-slate-800 border rounded px-3 py-2 text-sm outline-none resize-none"
      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
    />
  )
}

function RadioTF({ name, val, setVal, hint }) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
        <input type="radio" name={name} checked={val === true} onChange={() => setVal(true)} className="w-4 h-4" />
        True
      </label>
      <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
        <input type="radio" name={name} checked={val === false} onChange={() => setVal(false)} className="w-4 h-4" />
        False
      </label>
      {hint && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

// ---------- Enhancer detail form ----------

function AttributeMatchForm({ enhancer, update, onDelete }) {
  return (
    <div className="border rounded bg-white dark:bg-slate-900 shadow-sm mb-4" style={{ borderColor: 'var(--border)' }}>
      <div className="px-5 py-3 border-b text-sm" style={{ borderColor: 'var(--border)' }}>
        <span className="font-bold text-slate-700 dark:text-slate-300">
          1. 🔷 Attribute Match
        </span>{' '}
        <span className="text-slate-500 dark:text-slate-400">Adds new attributes to a node if a match is found.</span>
        <div><button className="text-slate-400 hover:text-blue-600 text-xs mt-0.5">more &rsaquo;</button></div>
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        <FormRow label="Attribute Matches" hint="Attribute name/values to match. All matches must be met to add the additional attributes.">
          <Textarea value={enhancer.attrMatches} onChange={v => update('attrMatches', v)} />
        </FormRow>
        <FormRow label="Attributes to Add" hint="Attribute name=value to add to matching nodes, in Java Properties format">
          <Textarea value={enhancer.attrToAdd} onChange={v => update('attrToAdd', v)} />
        </FormRow>
        <FormRow label="Tags to Add" hint="Comma-separated tags to add">
          <Input value={enhancer.tagsToAdd} onChange={v => update('tagsToAdd', v)} />
        </FormRow>
      </div>
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex gap-1">
          <button className="px-3 py-1 rounded text-sm font-bold bg-[#28a745] hover:bg-[#218838] text-white shadow-sm">Save</button>
          <button className="px-3 py-1 rounded text-sm font-medium bg-white dark:bg-slate-800 border shadow-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Cancel</button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onDelete} className="px-3 py-1 rounded text-xs font-bold bg-[#dc3545] hover:bg-[#c82333] text-white flex items-center gap-1 shadow-sm">
            Delete <span className="text-base leading-none">-</span>
          </button>
          <button className="p-1 border rounded bg-white dark:bg-slate-800 text-slate-400" style={{ borderColor: 'var(--border)' }}><ArrowUp size={13} /></button>
          <button className="p-1 border rounded bg-white dark:bg-slate-800 text-slate-400" style={{ borderColor: 'var(--border)' }}><ArrowDown size={13} /></button>
        </div>
      </div>
    </div>
  )
}

function IconEnhancerForm({ enhancer, update, onDelete }) {
  return (
    <div className="border rounded bg-white dark:bg-slate-900 shadow-sm mb-4" style={{ borderColor: 'var(--border)' }}>
      <div className="px-5 py-3 border-b text-sm" style={{ borderColor: 'var(--border)' }}>
        <span className="font-bold text-slate-700 dark:text-slate-300">
          1. 🔷 Icon
        </span>{' '}
        <span className="text-slate-500 dark:text-slate-400">Adds an icon or badges based on an attribute.</span>
        <div><button className="text-slate-400 hover:text-blue-600 text-xs mt-0.5">more &rsaquo;</button></div>
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        <FormRow label="Attribute Name" hint="Attribute name to look for">
          <Input value={enhancer.attrName} onChange={v => update('attrName', v)} />
        </FormRow>
        <FormRow label="Attribute Value" hint="Exact attribute value to match (optional)">
          <Input value={enhancer.attrValue} onChange={v => update('attrValue', v)} />
        </FormRow>
        <FormRow label="Icon Name" hint={<>Icon name to use, glyphicons start with 'glyphicon-' and font-awesome icons start with 'fa-'. <a href="#" className="text-blue-600 hover:underline">More ...</a></>}>
          <Input value={enhancer.iconName} onChange={v => update('iconName', v)} />
        </FormRow>
        <FormRow label="Icon Color" hint="CSS color for the icon (optional)">
          <Input value={enhancer.iconColor} onChange={v => update('iconColor', v)} />
        </FormRow>
        <FormRow label="Badges" hint="Icon badges to add to the Node. Each badge should start with 'fa-' or 'glyphicon-', *or* the selected Icon Family will be used.">
          <Input value={enhancer.badges} onChange={v => update('badges', v)} />
        </FormRow>
      </div>
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex gap-1">
          <button className="px-3 py-1 rounded text-sm font-bold bg-[#28a745] hover:bg-[#218838] text-white shadow-sm">Save</button>
          <button className="px-3 py-1 rounded text-sm font-medium bg-white dark:bg-slate-800 border shadow-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Cancel</button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onDelete} className="px-3 py-1 rounded text-xs font-bold bg-[#dc3545] hover:bg-[#c82333] text-white flex items-center gap-1 shadow-sm">
            Delete <span className="text-base leading-none">-</span>
          </button>
          <button className="p-1 border rounded bg-white dark:bg-slate-800 text-slate-400" style={{ borderColor: 'var(--border)' }}><ArrowUp size={13} /></button>
          <button className="p-1 border rounded bg-white dark:bg-slate-800 text-slate-400" style={{ borderColor: 'var(--border)' }}><ArrowDown size={13} /></button>
        </div>
      </div>
    </div>
  )
}

// ---------- Main Page ----------

export default function EditNodesPage() {
  const [activeTab, setActiveTab] = useState('Sources')
  const [showEnhancerModal, setShowEnhancerModal] = useState(false)

  // Enhancers state
  const [enhancers, setEnhancers] = useState([])   // [{type:'attributeMatch'|'icon', ...fields}]
  const [hasUnsaved, setHasUnsaved] = useState(false)

  // Configuration state
  const [asyncCache, setAsyncCache] = useState(true)
  const [cacheDelay, setCacheDelay] = useState('30')
  const [syncFirst, setSyncFirst] = useState(true)

  const TABS = [
    { id: 'Edit', icon: <Pencil size={13} /> },
    { id: 'Sources', icon: <Server size={13} /> },
    { id: 'Enhancers', icon: <span className="text-xs">⊕</span> },
    { id: 'Configuration', icon: <Settings size={13} /> },
  ]

  const addEnhancer = type => {
    const base = { type }
    if (type === 'attributeMatch') Object.assign(base, { attrMatches: '', attrToAdd: '', tagsToAdd: '' })
    if (type === 'icon') Object.assign(base, { attrName: '', attrValue: '', iconName: '', iconColor: '', badges: '' })
    setEnhancers(prev => [...prev, base])
    setHasUnsaved(true)
    setShowEnhancerModal(false)
  }

  const removeEnhancer = idx => setEnhancers(prev => prev.filter((_, i) => i !== idx))

  const updateEnhancer = (idx, field, val) => {
    setEnhancers(prev => prev.map((e, i) => i === idx ? { ...e, [field]: val } : e))
    setHasUnsaved(true)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20 relative">
      <div className="flex items-center gap-3 mb-6">
        <Server size={26} className="text-slate-600 dark:text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Edit Nodes</h2>
      </div>

      <div className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border)' }}>

        {/* Tab Bar */}
        <div className="px-4 border-b flex gap-0 overflow-x-auto hide-scrollbar relative" style={{ borderColor: 'var(--border)' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === tab.id ? 'border-red-500 text-slate-800 dark:text-slate-200' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              {tab.icon} {tab.id}
            </button>
          ))}

          {/* Unsaved changes banner */}
          {activeTab === 'Enhancers' && hasUnsaved && (
            <div className="absolute right-4 top-2 flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded text-xs font-bold text-orange-700 dark:text-orange-400">
              You have unsaved changes <Server size={13} /> Enhancers
            </div>
          )}
        </div>

        {/* ─ EDIT TAB ─ */}
        {activeTab === 'Edit' && (
          <div className="p-5 space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">Modifiable Node Sources will appear here.</p>
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm font-medium text-blue-700 dark:text-blue-400">
              ℹ️ No modifiable sources found
            </div>
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/60 border rounded text-sm text-slate-600 dark:text-slate-400" style={{ borderColor: 'var(--border)' }}>
              Use the <span className="inline-flex items-center gap-1 font-bold text-blue-600"><Server size={13} /> Sources</span> Tab to update your Node Sources.
            </div>
          </div>
        )}

        {/* ─ SOURCES TAB ─ */}
        {activeTab === 'Sources' && (
          <div className="p-5 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Node Sources for the project. Sources are loaded in the defined order, with later sources overriding earlier sources.
              (You can use {'${project.name}'} inside configuration values to substitute the project name.)
            </p>
            <div className="border rounded-lg p-4 bg-white dark:bg-slate-800 flex items-center justify-between shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-bold">1.</span>
                  <Server size={14} className="text-slate-500" />
                  <span className="font-bold">Local</span>
                  <span>Provides the local node as the single resource</span>
                </div>
                <button className="px-3 py-1 border rounded text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                  Edit
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 rounded text-xs font-bold bg-[#dc3545] hover:bg-[#c82333] text-white flex items-center gap-1 shadow-sm">
                  Delete <span className="text-base leading-none mb-0.5">-</span>
                </button>
                <button className="p-1 border rounded bg-white dark:bg-slate-800 text-slate-400" style={{ borderColor: 'var(--border)' }}><ArrowUp size={13} /></button>
                <button className="p-1 border rounded bg-white dark:bg-slate-800 text-slate-400" style={{ borderColor: 'var(--border)' }}><ArrowDown size={13} /></button>
              </div>
            </div>
            <button className="px-4 py-2 rounded text-sm font-bold bg-[#1e58c8] hover:bg-[#194bb0] text-white flex items-center gap-1 shadow-sm transition-colors">
              Add a new Node Source <span className="text-lg leading-none ml-1 mb-0.5">+</span>
            </button>
          </div>
        )}

        {/* ─ ENHANCERS TAB ─ */}
        {activeTab === 'Enhancers' && (
          <div className="p-5 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Node Enhancers can modify the data loaded from Node Sources.</p>

            {enhancers.length === 0 ? (
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border rounded text-sm text-slate-500" style={{ borderColor: 'var(--border)' }}>
                None configured. Click <strong>Add a new Node Enhancer</strong> to configure one.
              </div>
            ) : (
              enhancers.map((enh, idx) => (
                enh.type === 'attributeMatch'
                  ? <AttributeMatchForm key={idx} enhancer={enh} update={(f, v) => updateEnhancer(idx, f, v)} onDelete={() => removeEnhancer(idx)} />
                  : <IconEnhancerForm key={idx} enhancer={enh} update={(f, v) => updateEnhancer(idx, f, v)} onDelete={() => removeEnhancer(idx)} />
              ))
            )}

            <button
              onClick={() => setShowEnhancerModal(true)}
              className="px-4 py-2 rounded text-sm font-bold bg-[#1e58c8] hover:bg-[#194bb0] text-white flex items-center gap-1 shadow-sm transition-colors"
            >
              Add a new Node Enhancer <span className="text-lg leading-none ml-1 mb-0.5">+</span>
            </button>
          </div>
        )}

        {/* ─ CONFIGURATION TAB ─ */}
        {activeTab === 'Configuration' && (
          <div className="p-5">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Configuration for the Nodes for this project.</p>
            <div className="divide-y max-w-4xl" style={{ borderColor: 'var(--border)' }}>
              <FormRow label="Use Asynchronous Cache">
                <RadioTF
                  name="asyncCache"
                  val={asyncCache} setVal={setAsyncCache}
                  hint="Use asynchronous cache for all Resource Model Source results in this project"
                />
              </FormRow>
              <FormRow
                label="Cache Delay"
                hint={<>Delay in seconds, at least 30. <a href="#" className="text-blue-600 hover:underline">More...</a></>}
              >
                <input
                  type="text"
                  value={cacheDelay}
                  onChange={e => setCacheDelay(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border rounded px-3 py-1.5 text-sm outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </FormRow>
              <FormRow label="Synchronous First Load">
                <RadioTF
                  name="syncFirst"
                  val={syncFirst} setVal={setSyncFirst}
                  hint="When the cache is empty, forces the first load to happen synchronously to prevent empty node results."
                />
              </FormRow>
            </div>
            <div className="mt-6">
              <button className="px-4 py-1.5 rounded text-sm font-bold bg-[#28a745] hover:bg-[#218838] text-white shadow-sm transition-colors">
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─ Add Enhancer Modal ─ */}
      {showEnhancerModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowEnhancerModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl z-50">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Add a new Node Enhancer</h3>
              <button onClick={() => setShowEnhancerModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => addEnhancer('attributeMatch')}
                className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-500">⊕🔷</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">Attribute Match</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Adds new attributes to a node if a match is found.</p>
              </button>
              <button
                onClick={() => addEnhancer('icon')}
                className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-500">⊕🔷</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">Icon</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Adds an icon or badges based on an attribute.</p>
              </button>
            </div>
            <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setShowEnhancerModal(false)}
                className="px-4 py-1.5 border rounded text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
