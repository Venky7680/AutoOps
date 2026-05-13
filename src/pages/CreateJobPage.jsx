import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Save, X, ChevronRight, Upload, Plus, Search,
  TerminalSquare, FileCode2, PlaySquare, Settings,
  Undo, Redo, MoreHorizontal, ChevronDown, ChevronUp,
  Diamond, Terminal, Database, Book, AlertCircle, RefreshCw, Clock, CheckCircle2, FolderOpen,
  Target, Shield, Edit2, VolumeX
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { jobsApi } from '../lib/api'

const TABS = [
  'Details', 'Workflow', 'Nodes', 'Schedule',
  'Notifications', 'Execution Plugins', 'Other'
]

function Field({ label, hint, children }) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-start gap-4 mb-5">
      <label className="text-sm font-medium text-right pt-2" style={{ color: 'var(--text)' }}>{label}</label>
      <div>
        {children}
        {hint && <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>{hint}</p>}
      </div>
    </div>
  )
}

function RadioGroup({ options, value, onChange, name }) {
  return (
    <div className="flex items-center gap-6 mt-2">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
          <input
            type="radio"
            name={name}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-brand-500 w-4 h-4"
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

export default function CreateJobPage() {
  const navigate = useNavigate()
  const activeProject = useAppStore((s) => s.activeProject)
  const addToast = useAppStore((s) => s.addToast)

  const [activeTab, setActiveTab] = useState('Details')
  const [saving, setSaving] = useState(false)

  // Job Form State
  const [showAddOption, setShowAddOption] = useState(false)

  const [job, setJob] = useState({
    name: '',
    description: '',
    group: '',

    // Workflow
    wfSubTab: 'Node Steps',
    steps: [],

    // Nodes
    nodeExecution: 'dispatch',
    nodeFilter: '',
    excludeFilter: '',
    showExcluded: 'No',
    editableFilter: 'No',
    threadCount: '',
    rankAttribute: '',
    rankOrder: 'Ascending',
    ifNodeFails: 'failStep',
    ifNodeSetEmpty: 'failJob',
    nodeSelection: 'default',
    orchestrator: '',

    // Schedule
    enableScheduling: false,
    enableExecution: true,

    // Execution Plugins
    killTracked: false,
    killChildren: false,
    killOnlyFailure: false,

    // Other
    logLevel: 'Normal',
    multipleExecutions: 'No',
    limitMultiple: '',
    timeout: '',
    retry: '',
    retryDelay: '',
    logOutputLimit: '',
    logLimitAction: 'halt',
    logHaltStatus: '',
    defaultTab: 'Nodes'
  })

  const [showLogFilterModal, setShowLogFilterModal] = useState(false)
  const [activeLogFilter, setActiveLogFilter] = useState(null)
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  const update = (key, val) => setJob(prev => ({ ...prev, [key]: val }))

  const addStep = (type) => {
    setJob(prev => ({
      ...prev,
      steps: [...(prev.steps || []), { id: Date.now(), type }]
    }))
  }

  const removeStep = (id) => {
    setJob(prev => ({
      ...prev,
      steps: (prev.steps || []).filter(s => s.id !== id)
    }))
  }

  const handleCreate = async () => {
    try {
      setSaving(true)
      await jobsApi.create({
        project: activeProject,
        name: job.name,
        description: job.description,
        group: job.group
      })
      addToast({ type: 'success', title: 'Job Created', message: `Job "${job.name}" created.` })
      navigate('/jobs')
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to create job' })
    } finally {
      setSaving(false)
    }
  }


  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Create New Job in <span className="uppercase text-brand-500">{activeProject}</span>
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Job Name: <span className="font-semibold">{job.name}</span></p>
        </div>
        <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => navigate('/jobs/upload')}>
          <Upload size={14} /> Upload Definition
        </button>
      </div>

      {/* Main Form Container */}
      <div className="card overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b hide-scrollbar" style={{ borderColor: 'var(--border)', background: 'var(--surface-card)' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? '' : 'border-transparent'}`}
              style={{
                color: activeTab === tab ? 'var(--brand)' : 'var(--muted)',
                borderBottomColor: activeTab === tab ? 'var(--brand)' : 'transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[500px]">

          {/* 1. DETAILS */}
          {activeTab === 'Details' && (
            <div className="space-y-6 max-w-3xl">
              <Field label={<>Job Name <span className="text-red-400">*</span></>}>
                <input type="text" className="input text-sm" placeholder="Enter Job name" value={job.name} onChange={e => update('name', e.target.value)} />
              </Field>
              <Field label="Group Path">
                <input type="text" className="input text-sm" value={job.group} onChange={e => update('group', e.target.value)} />
              </Field>
              <Field label="Description" hint="The first line will be shown in plain text, the rest rendered with Markdown.">
                <textarea className="input text-sm min-h-[120px]" value={job.description} onChange={e => update('description', e.target.value)} />
              </Field>
            </div>
          )}

          {/* 2. WORKFLOW */}
          {activeTab === 'Workflow' && (
            <div className="max-w-5xl space-y-8">

              {/* Options Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Options</h3>
                  <div className="flex gap-1">
                    <button className="btn-secondary text-[10px] px-2 py-1 flex items-center gap-1 opacity-50 cursor-not-allowed">
                      <Undo size={12} /> Undo
                    </button>
                    <button className="btn-secondary text-[10px] px-2 py-1 flex items-center gap-1 opacity-50 cursor-not-allowed">
                      <Redo size={12} /> Redo
                    </button>
                  </div>
                </div>
                {!showAddOption ? (
                  <div className="card p-6 bg-slate-50/50 dark:bg-slate-900/20 border-dashed">
                    <p className="text-xs text-slate-500 mb-4">No Options are defined. Add an option to provide runtime parameters for this job.</p>
                    <button
                      onClick={() => setShowAddOption(true)}
                      className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-2 border border-slate-300 dark:border-slate-700"
                    >
                      <Plus size={14} /> Add an option
                    </button>
                  </div>
                ) : (
                  <div className="card border-2 border-brand-glow/20 bg-white dark:bg-slate-900/40 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                      <h4 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Add New Option</h4>
                    </div>

                    <div className="p-8 space-y-6 max-w-4xl">
                      <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                        <label className="text-sm font-bold text-right" style={{ color: 'var(--text)' }}>Option Type</label>
                        <div className="relative max-w-md">
                          <select className="input text-sm appearance-none pr-10">
                            <option>Text</option>
                            <option>File</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                        <label className="text-sm font-bold text-right" style={{ color: 'var(--text)' }}>Option Name</label>
                        <input type="text" className="input text-sm max-w-md" placeholder="Option Name" />
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                        <label className="text-sm font-bold text-right" style={{ color: 'var(--text)' }}>Option Label</label>
                        <input type="text" className="input text-sm max-w-md" placeholder="Option Label" />
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <label className="text-sm font-bold text-right pt-2" style={{ color: 'var(--text)' }}>Description</label>
                        <div className="space-y-1">
                          <div className="flex border rounded-lg overflow-hidden bg-white dark:bg-slate-950/50" style={{ borderColor: 'var(--border)' }}>
                            <div className="bg-slate-100 dark:bg-slate-900 px-2 py-3 border-r text-[10px] font-mono text-slate-400 select-none" style={{ borderColor: 'var(--border)' }}>1</div>
                            <textarea className="flex-1 p-3 text-sm min-h-[100px] outline-none bg-transparent" />
                          </div>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">The description will be rendered with Markdown. <AlertCircle size={10} className="text-brand-500" /></p>
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                        <label className="text-sm font-bold text-right" style={{ color: 'var(--text)' }}>Default Value</label>
                        <input type="text" className="input text-sm max-w-md" placeholder="Default value" />
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <label className="text-sm font-bold text-right pt-1" style={{ color: 'var(--text)' }}>Input Type</label>
                        <div className="space-y-2">
                          {[
                            { id: 'plain', label: 'Plain text' },
                            { id: 'date', label: 'Date', sub: 'The date will pass to your job as a string formatted this way: mm/dd/yy HH:MM' },
                            { id: 'secure', label: 'Secure', sub: 'Password input, value exposed in scripts and commands.', red: true },
                            { id: 'secure_remote', label: 'Secure Remote Authentication', sub: 'Password input, value not exposed in scripts or commands, used only by Node Executors for authentication.', red: true },
                          ].map(t => (
                            <label key={t.id} className="flex items-start gap-2.5 group cursor-pointer">
                              <input type="radio" name="input_type" className="accent-brand-500 mt-1" defaultChecked={t.id === 'plain'} />
                              <div className="text-sm">
                                <b style={{ color: 'var(--text)' }}>{t.label}</b>
                                {t.sub && <p className="text-[11px] text-slate-500">{t.red && <span className="text-red-500 font-bold mr-1">†</span>}{t.sub}</p>}
                              </div>
                            </label>
                          ))}
                          <p className="text-[10px] text-slate-500 italic"><span className="text-red-500 font-bold mr-1">†</span>Secure input values are not stored by Rundeck after use...</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <label className="text-sm font-bold text-right pt-1" style={{ color: 'var(--text)' }}>Allowed Values</label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                              <input type="radio" name="allowed" className="accent-brand-500 w-4 h-4" defaultChecked /> List
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                              <input type="radio" name="allowed" className="accent-brand-500 w-4 h-4" /> Remote URL
                            </label>
                          </div>
                          <input type="text" className="input text-sm" placeholder="Delimiter separated list (comma by default)" />
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <label className="text-sm font-bold text-right pt-1" style={{ color: 'var(--text)' }}>Sort Values</label>
                        <div className="space-y-4">
                          <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                              <input type="radio" name="sort" className="accent-brand-500 w-4 h-4" defaultChecked /> No
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                              <input type="radio" name="sort" className="accent-brand-500 w-4 h-4" /> Yes
                            </label>
                          </div>
                          <p className="text-[10px] text-slate-500">Sort list Allowed Values</p>
                          <div className="flex items-center gap-4">
                            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-500 border-r" style={{ borderColor: 'var(--border)' }}>List Delimiter</div>
                              <input type="text" className="bg-white dark:bg-slate-900 w-24 px-3 outline-none text-sm" />
                            </div>
                            <span className="text-[10px] text-slate-500">Set the delimiter for Allowed Values</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <label className="text-sm font-bold text-right pt-1" style={{ color: 'var(--text)' }}>Restrictions</label>
                        <div className="space-y-2">
                          {[
                            { id: 'none', label: 'None', sub: 'Any values can be used' },
                            { id: 'enforced', label: 'Enforced from Allowed Values' },
                            { id: 'regex', label: 'Match Regular Expression' },
                          ].map(r => (
                            <label key={r.id} className="flex items-start gap-2.5 cursor-pointer">
                              <input type="radio" name="restrictions" className="accent-brand-500 mt-1" defaultChecked={r.id === 'none'} />
                              <div className="text-sm">
                                <b style={{ color: 'var(--text)' }}>{r.label}</b>
                                {r.sub && <span className="text-slate-500 ml-1.5">{r.sub}</span>}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <label className="text-sm font-bold text-right pt-1" style={{ color: 'var(--text)' }}>Required</label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                              <input type="radio" name="required" className="accent-brand-500 w-4 h-4" defaultChecked /> No
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                              <input type="radio" name="required" className="accent-brand-500 w-4 h-4" /> Yes
                            </label>
                          </div>
                          <p className="text-[10px] text-slate-500">Require this option to have a non-blank value when running the Job</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <label className="text-sm font-bold text-right pt-1" style={{ color: 'var(--text)' }}>Should be hidden</label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                              <input type="radio" name="hidden" className="accent-brand-500 w-4 h-4" defaultChecked /> No
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                              <input type="radio" name="hidden" className="accent-brand-500 w-4 h-4" /> Yes
                            </label>
                          </div>
                          <p className="text-[10px] text-slate-500">Should be hidden from job run page</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <label className="text-sm font-bold text-right pt-1" style={{ color: 'var(--text)' }}>Multi-valued</label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                              <input type="radio" name="multi" className="accent-brand-500 w-4 h-4" defaultChecked /> No
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                              <input type="radio" name="multi" className="accent-brand-500 w-4 h-4" /> Yes
                            </label>
                          </div>
                          <p className="text-[10px] text-slate-500">Allow multiple input values to be chosen.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
                      <button
                        onClick={() => setShowAddOption(false)}
                        className="btn-secondary px-6 py-1.5 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Workflow Settings */}
              <div className="space-y-4 border-t pt-8" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Workflow</h3>

                <Field label="If a step fails:">
                  <div className="flex items-center gap-8 mt-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                      <input type="radio" name="wffail" className="accent-brand-500 w-4 h-4" defaultChecked /> Stop at the failed step.
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                      <input type="radio" name="wffail" className="accent-brand-500 w-4 h-4" /> Run remaining steps before failing.
                    </label>
                  </div>
                </Field>

                <Field label="Strategy:">
                  <div className="flex items-center gap-2 mt-1">
                    <div className="relative inline-block">
                      <select className="appearance-none input text-sm w-40 px-3 py-1.5 bg-white dark:bg-slate-900 border" style={{ borderColor: 'var(--border)' }}>
                        <option>Node First</option>
                        <option>Parallel</option>
                        <option>Sequential</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-brand-500 font-medium">Execute all steps on a node before proceeding to the next node.</p>
                    <button className="text-xs text-slate-500 flex items-center gap-1 hover:text-brand-500 transition-colors">
                      Explain <ChevronRight size={12} />
                    </button>
                  </div>
                </Field>

                <Field label={<span className="font-bold">Global Log Filters</span>}>
                  <button onClick={() => { setShowLogFilterModal(true); setActiveLogFilter(null); setShowMoreInfo(false); }} className="btn-secondary text-xs px-3 py-1 flex items-center gap-1.5 border border-slate-300 dark:border-slate-700">
                    <Plus size={12} /> add
                  </button>
                </Field>
              </div>

              {/* Workflow Steps Section */}
              <div className="border-t pt-8" style={{ borderColor: 'var(--border)' }}>
                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <div />
                  <div className="space-y-6">
                    <div className="flex gap-1">
                      <button className="btn-secondary text-[10px] px-2 py-1 flex items-center gap-1 opacity-50 cursor-not-allowed">
                        <Undo size={12} /> Undo
                      </button>
                      <button className="btn-secondary text-[10px] px-2 py-1 flex items-center gap-1 opacity-50 cursor-not-allowed">
                        <Redo size={12} /> Redo
                      </button>
                    </div>

                    {(!job.steps || job.steps.length === 0) && (
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>No Workflow steps</p>
                    )}

                    {(job.steps || []).map((step, idx) => (
                      <div key={step.id} className="flex gap-4 items-start">
                        <span className="text-sm font-bold text-slate-400 mt-1">{idx + 1}.</span>
                        <div className="border rounded flex-1 bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border)' }}>
                          <div className="flex items-center gap-2 p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                            {step.type === 'command' && <TerminalSquare size={16} className="text-emerald-600" />}
                            {step.type === 'script' && <AlertCircle size={16} className="text-slate-500" />}
                            {step.type === 'scriptfile' && <FileCode2 size={16} className="text-slate-500" />}
                            {step.type === 'jobref' && <Book size={16} className="text-slate-600 dark:text-slate-400" />}
                            {step.type === 'ansible_inline' && <Diamond size={16} className="text-slate-800 dark:text-slate-200 fill-slate-800 dark:fill-slate-200" />}
                            {step.type === 'ansible_playbook' && <Diamond size={16} className="text-slate-800 dark:text-slate-200 fill-slate-800 dark:fill-slate-200" />}
                            {step.type === 'copy_file' && <FileCode2 size={16} className="text-slate-600 dark:text-slate-400" />}
                            {step.type === 'local_command' && <TerminalSquare size={16} className="text-emerald-600" />}
                            {step.type === 'data_node' && <Database size={16} className="text-slate-600 dark:text-slate-400" />}
                            <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                              {step.type === 'command' && 'Command'}
                              {step.type === 'script' && 'Script'}
                              {step.type === 'scriptfile' && 'Script file or URL'}
                              {step.type === 'jobref' && 'Job Reference'}
                              {step.type === 'ansible_inline' && 'Ansible Playbook Inline Workflow Node Step'}
                              {step.type === 'ansible_playbook' && 'Ansible Playbook Workflow Node Step.'}
                              {step.type === 'copy_file' && 'Copy File'}
                              {step.type === 'local_command' && 'Local Command'}
                              {step.type === 'data_node' && 'Data Node Step'}
                            </span>
                          </div>

                          <div className="p-5">
                            <p className="text-xs text-slate-500 mb-6">
                              {step.type === 'command' && 'Execute a remote command'}
                              {step.type === 'script' && 'Execute an inline script'}
                              {step.type === 'scriptfile' && 'Execute a local script file or a script from a URL'}
                              {step.type === 'jobref' && 'Execute another Job'}
                              {step.type === 'ansible_inline' && 'Runs an Inline Ansible Playbook.'}
                              {step.type === 'ansible_playbook' && 'Runs an Ansible Playbook'}
                              {step.type === 'copy_file' && 'Copy a file to a destination on a remote node'}
                              {step.type === 'local_command' && 'Run a command locally on the server'}
                              {step.type === 'data_node' && 'Produce data values for a node'}
                            </p>

                            <div className="space-y-4">
                              {step.type === 'command' && (
                                <>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Command</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Enter the shell command, e.g.: echo this is a test" />
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Step Label</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Label or description of this step" />
                                  </Field>
                                </>
                              )}

                              {step.type === 'copy_file' && (
                                <>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Source Path</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">Path on the rundeck server for the file or base directory (recursive/wildcard search).</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Destination Path</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">Path on the remote node for the file destination. If the path ends with a /, the same filename as the source will be used.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Pattern</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">Wildcard pattern (optional). E.g: `**/*.txt`</p>
                                  </Field>
                                  <Field label="">
                                    <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                      <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" defaultChecked />
                                      <div>
                                        <span className="font-bold text-slate-600 dark:text-slate-300">Recursive copy</span>
                                        <p className="text-xs text-slate-500 mt-0.5">Recursively copy source dir, or matched files and dirs to the destination path.</p>
                                      </div>
                                    </label>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Print transfer information</span>}>
                                    <div className="flex flex-col gap-1 text-sm mb-1" style={{ color: 'var(--text)' }}>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name={`print_info_${step.id}`} className="accent-brand-500 w-4 h-4" defaultChecked />
                                        <span>True</span>
                                      </label>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name={`print_info_${step.id}`} className="accent-brand-500 w-4 h-4" />
                                        <span>False</span>
                                      </label>
                                    </div>
                                    <p className="text-xs text-slate-500">Log information about the file copy</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Step Label</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Label or description of this step" />
                                  </Field>
                                </>
                              )}

                              {step.type === 'local_command' && (
                                <>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Command</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">The command (runs locally)</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Step Label</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Label or description of this step" />
                                  </Field>
                                </>
                              )}

                              {step.type === 'data_node' && (
                                <>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Data</span>}>
                                    <div className="flex border rounded overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                                      <div className="bg-slate-200 dark:bg-slate-800 px-2 py-2 text-xs text-slate-500 font-mono text-center border-r w-8" style={{ borderColor: 'var(--border)' }}>1</div>
                                      <textarea className="w-full bg-slate-100 dark:bg-slate-950/50 p-2 text-sm outline-none min-h-[100px]" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Properties formatted data to set for the current node</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Format</span>}>
                                    <div className="relative mb-1">
                                      <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                                        <option>properties</option>
                                        <option>json</option>
                                        <option>yaml</option>
                                      </select>
                                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                    <p className="text-xs text-slate-500">Format for the data</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Step Label</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Label or description of this step" />
                                  </Field>
                                </>
                              )}

                              {step.type === 'script' && (
                                <>
                                  <Field label="Script">
                                    <div className="flex border rounded overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                                      <div className="bg-slate-200 dark:bg-slate-800 px-2 py-2 text-xs text-slate-500 font-mono text-center border-r w-8" style={{ borderColor: 'var(--border)' }}>1</div>
                                      <textarea className="w-full bg-slate-100 dark:bg-slate-950/50 p-2 text-sm outline-none min-h-[100px]" placeholder="Enter the entire script to execute" />
                                    </div>
                                  </Field>
                                  <Field label="Arguments">
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Enter the commandline arguments for the script" />
                                  </Field>
                                  <Field label="Invocation String">
                                    <div>
                                      <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                      <p className="text-xs text-slate-500 mt-1">Leave blank to run script directly <span className="text-brand-500 cursor-pointer">More...</span></p>
                                    </div>
                                  </Field>
                                  <Field label="">
                                    <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                      <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                                      <div>
                                        <span>Quote arguments to script invocation string?</span>
                                        <p className="text-[11px] text-slate-500 mt-0.5">If arguments are quoted, then the arguments passed to the invocation string will be quoted as one string. <span className="text-brand-500 cursor-pointer">More...</span></p>
                                      </div>
                                    </label>
                                  </Field>
                                  <Field label="File Extension">
                                    <div>
                                      <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                      <p className="text-xs text-slate-500 mt-1">Leave blank to use the default for the target node. <span className="text-brand-500 cursor-pointer">More...</span></p>
                                    </div>
                                  </Field>
                                  <Field label="Step Label">
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Label or description of this step" />
                                  </Field>
                                </>
                              )}

                              {step.type === 'scriptfile' && (
                                <>
                                  <Field label="File Path or URL">
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Enter the path to a script file on the server or a URL" />
                                  </Field>
                                  <Field label="Arguments">
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Enter the commandline arguments for the script" />
                                  </Field>
                                  <Field label="Invocation String">
                                    <div>
                                      <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                      <p className="text-xs text-slate-500 mt-1">Leave blank to run script directly <span className="text-brand-500 cursor-pointer">More...</span></p>
                                    </div>
                                  </Field>
                                  <Field label="">
                                    <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                      <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                                      <div>
                                        <span>Expand variables in script file</span>
                                      </div>
                                    </label>
                                  </Field>
                                  <Field label="">
                                    <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                      <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                                      <div>
                                        <span>Quote arguments to script invocation string?</span>
                                        <p className="text-[11px] text-slate-500 mt-0.5">If arguments are quoted, then the arguments passed to the invocation string will be quoted as one string. <span className="text-brand-500 cursor-pointer">More...</span></p>
                                      </div>
                                    </label>
                                  </Field>
                                  <Field label="File Extension">
                                    <div>
                                      <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                      <p className="text-xs text-slate-500 mt-1">Leave blank to use the default for the target node. <span className="text-brand-500 cursor-pointer">More...</span></p>
                                    </div>
                                  </Field>
                                  <Field label="Step Label">
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Label or description of this step" />
                                  </Field>
                                </>
                              )}

                              {step.type === 'jobref' && (
                                <>
                                  <Field label="Select job by">
                                    <div className="space-y-3 mt-1">
                                      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                        <input type="radio" name={`sjob_${step.id}`} className="accent-brand-500 w-4 h-4" />
                                        <span>Name <span className="text-slate-500">Use Name and group to search the job.</span></span>
                                      </label>
                                      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                        <input type="radio" name={`sjob_${step.id}`} className="accent-brand-500 w-4 h-4" defaultChecked />
                                        <span>UUID <span className="text-slate-500">Use jobs UUID to search the job.</span></span>
                                      </label>
                                    </div>
                                  </Field>
                                  <Field label="Job Name/Group">
                                    <div className="flex gap-2 mb-2">
                                      <div className="relative flex-1">
                                        <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8">
                                          <option>Current Project (NEW)</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                      </div>
                                      <button className="btn-secondary px-4 text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700">Choose A Job...</button>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">Select an existing job by using the Project selector and "Choose a Job..." button above or by typing the job name and/or group in the boxes below.</p>
                                    <div className="flex gap-4">
                                      <input type="text" className="input text-sm flex-1 bg-slate-100 dark:bg-slate-800/50 border-transparent pointer-events-none opacity-50" placeholder="Job Name" readOnly />
                                      <input type="text" className="input text-sm flex-1 bg-slate-100 dark:bg-slate-800/50 border-transparent pointer-events-none opacity-50" placeholder="Group Path" readOnly />
                                    </div>
                                  </Field>
                                  <Field label="UUID">
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50 mb-2" placeholder="Enter UUID, e.g. 5910b723-2436-4497-96d5-49a08db95d2b" />
                                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">You can enter a job name or UUID, but if both UUID and job name are specified they must correspond to the same job.</p>
                                  </Field>
                                  <Field label="Arguments">
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Enter arguments, e.g. -option1 value -option2 value" />
                                  </Field>
                                  <Field label="">
                                    <div className="space-y-4">
                                      <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                        <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                                        <div>
                                          <span>Import options? <span className="text-slate-500">Pass as argument the parent job option values that match the options on the referenced job.</span></span>
                                        </div>
                                      </label>
                                      <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                        <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                                        <div>
                                          <span>Skip notifications <span className="text-slate-500">Skip any notification in the referenced job.</span></span>
                                        </div>
                                      </label>
                                      <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                        <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                                        <div>
                                          <span>Fail on disabled execution? <span className="text-slate-500">If the referenced job has disabled execution, it will be considered a failure.</span></span>
                                        </div>
                                      </label>
                                      <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                        <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                                        <div>
                                          <span>Use referenced job's nodes. <span className="text-slate-500">If the referenced job is from another project, you can use referenced job node list instead of the parent's nodes.</span></span>
                                        </div>
                                      </label>
                                    </div>
                                  </Field>
                                  <Field label="">
                                    <p className="text-xs font-bold cursor-pointer" style={{ color: 'var(--text)' }}>Override Node Filters? <ChevronRight size={12} className="inline" /></p>
                                  </Field>
                                  <Field label="Run as a">
                                    <div className="space-y-2 mt-1">
                                      <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                        <input type="radio" name={`runas_${step.id}`} className="accent-brand-500 w-4 h-4 mt-0.5" defaultChecked />
                                        <div>
                                          <span>Node Step <span className="text-slate-500">Executes for each Node and allows use of node context variables as arguments to the job.</span></span>
                                        </div>
                                      </label>
                                      <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                        <input type="radio" name={`runas_${step.id}`} className="accent-brand-500 w-4 h-4 mt-0.5" />
                                        <div>
                                          <span>Workflow Step <span className="text-slate-500">Executes only once and has no node context information.</span></span>
                                        </div>
                                      </label>
                                    </div>
                                  </Field>
                                  <Field label="Step Label">
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Label or description of this step" />
                                  </Field>
                                </>
                              )}

                              {step.type === 'ansible_inline' && (
                                <>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Ansible binaries directory path</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">Set ansible binaries directory path.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Ansible base directory path</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">Set ansible base directory path.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Playbook</span>}>
                                    <div className="flex border rounded overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                                      <div className="bg-slate-200 dark:bg-slate-800 px-2 py-2 text-xs text-slate-500 font-mono text-center border-r w-8" style={{ borderColor: 'var(--border)' }}>1</div>
                                      <textarea className="w-full bg-slate-100 dark:bg-slate-950/50 p-2 text-sm outline-none min-h-[100px]" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Inline Ansible Playbook</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Extra Variables</span>}>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Syntax Mode:</span>
                                      <div className="relative">
                                        <select className="appearance-none input text-sm bg-slate-50 dark:bg-slate-950/50 pr-8 py-1 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                                          <option>-None-</option>
                                          <option>batchfile</option>
                                          <option>diff</option>
                                          <option>dockerfile</option>
                                          <option>golang</option>
                                          <option>groovy</option>
                                          <option>html</option>
                                          <option>java</option>
                                          <option>javascript</option>
                                          <option>json</option>
                                          <option>markdown</option>
                                          <option>perl</option>
                                          <option>php</option>
                                          <option>powershell</option>
                                          <option>properties</option>
                                          <option>python</option>
                                          <option>ruby</option>
                                          <option>sh</option>
                                          <option>sql</option>
                                          <option>xml</option>
                                          <option>yaml</option>

                                        </select>
                                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="flex border rounded overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                                      <div className="bg-slate-200 dark:bg-slate-800 px-2 py-2 text-xs text-slate-500 font-mono text-center border-r w-8" style={{ borderColor: 'var(--border)' }}>1</div>
                                      <textarea className="w-full bg-slate-100 dark:bg-slate-950/50 p-2 text-sm outline-none min-h-[100px]" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Set additional playbook YAML or JSON variables.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Vault Key File path</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">File Path to the ansible vault Key to use</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Vault Pass Storage Path</span>}>
                                    <div className="flex gap-2 mb-1">
                                      <input type="text" className="input text-sm flex-1 bg-slate-50 dark:bg-slate-950/50" />
                                      <button className="btn-secondary px-3 text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700 flex items-center gap-1">Select... <FolderOpen size={14} /></button>
                                    </div>
                                    <p className="text-xs text-slate-500">Path to the Vault Key to use within Rundeck Storage. E.g. "keys/path/ansible.vault"</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Extra Ansible arguments</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">Additional ansible raw command line arguments to be appended to the executed command.</p>
                                  </Field>

                                  <div className="border-t my-6" style={{ borderColor: 'var(--border)' }} />
                                  <div className="mb-4 text-slate-500 font-bold text-lg">SSH Connection</div>

                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Authentication</span>}>
                                    <div className="relative mb-1">
                                      <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                                        <option>-none selected-</option>
                                      </select>
                                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                    <p className="text-xs text-slate-500">Type of SSH Authentication to use.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH User</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">SSH User to authenticate as (default=rundeck).</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Password Storage Path</span>}>
                                    <div className="flex gap-2 mb-1">
                                      <input type="text" className="input text-sm flex-1 bg-slate-50 dark:bg-slate-950/50" />
                                      <button className="btn-secondary px-3 text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700 flex items-center gap-1">Select... <FolderOpen size={14} /></button>
                                    </div>
                                    <p className="text-xs text-slate-500">Path to the ssh Password to use within Rundeck Storage.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Key File path</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">File Path to the SSH Key to use</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Key Storage Path</span>}>
                                    <div className="flex gap-2 mb-1">
                                      <input type="text" className="input text-sm flex-1 bg-slate-50 dark:bg-slate-950/50" />
                                      <button className="btn-secondary px-3 text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700 flex items-center gap-1">Select... <FolderOpen size={14} /></button>
                                    </div>
                                    <p className="text-xs text-slate-500">Path to the SSH Key to use within Rundeck Storage. E.g. "keys/path/key1.pem"</p>
                                  </Field>
                                  <Field label="">
                                    <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                      <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                                      <div>
                                        <span>Use ssh-agent.</span>
                                        <p className="text-xs text-slate-500 mt-0.5">Use ssh-agent to connect with a private key plus a passphrase.</p>
                                      </div>
                                    </label>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Passphrase for private key</span>}>
                                    <div className="flex gap-2 mb-1">
                                      <input type="text" className="input text-sm flex-1 bg-slate-50 dark:bg-slate-950/50" />
                                      <button className="btn-secondary px-3 text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700 flex items-center gap-1">Select... <FolderOpen size={14} /></button>
                                    </div>
                                    <p className="text-xs text-slate-500">SSH Passphrase for private key, it just works if the ssh-agent is used.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Passphrase from secure option</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" defaultValue="option.password" />
                                    <p className="text-xs text-slate-500 mt-1">SSH Passphrase from secure option on a job, it just works if the ssh-agent is used.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Timeout</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">SSH timeout, override the SSH timeout in seconds (default=10).</p>
                                  </Field>

                                  <div className="border-t my-6" style={{ borderColor: 'var(--border)' }} />
                                  <div className="mb-4 text-slate-500 font-bold text-lg">Privilege Escalation</div>

                                  <Field label="">
                                    <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                      <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                                      <div>
                                        <span>Use become privilege escalation.</span>
                                        <p className="text-xs text-slate-500 mt-0.5">Run operations with become (nopasswd implied).</p>
                                      </div>
                                    </label>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Privilege escalation method.</span>}>
                                    <div className="relative mb-1">
                                      <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                                        <option>-none selected-</option>
                                        <option>doas</option>
                                        <option>dzdo</option>
                                        <option>ksu</option>
                                        <option>machinectl</option>
                                        <option>runas</option>
                                        <option>pbrun</option>
                                        <option>pfexec</option>
                                        <option>sudo</option>
                                        <option>su</option>
                                      </select>
                                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                    <p className="text-xs text-slate-500">Privilege escalation method to use (default=sudo).</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Privilege escalation user</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">run operations as this user (default=root).</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Privilege escalation Password Storage Path.</span>}>
                                    <div className="flex gap-2 mb-1">
                                      <input type="text" className="input text-sm flex-1 bg-slate-50 dark:bg-slate-950/50" />
                                      <button className="btn-secondary px-3 text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700 flex items-center gap-1">Select... <FolderOpen size={14} /></button>
                                    </div>
                                    <p className="text-xs text-slate-500">Become password used for privilege escalation.</p>
                                  </Field>

                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Step Label</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Label or description of this step" />
                                  </Field>
                                </>
                              )}

                              {step.type === 'ansible_playbook' && (
                                <>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Ansible binaries directory path</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">Set ansible binaries directory path.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Ansible base directory path</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">Set ansible base directory path.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Playbook</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">Path to a playbook</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Extra Variables</span>}>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Syntax Mode:</span>
                                      <div className="relative">
                                        <select className="appearance-none input text-sm bg-slate-50 dark:bg-slate-950/50 pr-8 py-1 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                                          <option>-None-</option>
                                          <option>batchfile</option>
                                          <option>diff</option>
                                          <option>dockerfile</option>
                                          <option>golang</option>
                                          <option>groovy</option>
                                          <option>html</option>
                                          <option>java</option>
                                          <option>javascript</option>
                                          <option>json</option>
                                          <option>markdown</option>
                                          <option>perl</option>
                                          <option>php</option>
                                          <option>powershell</option>
                                          <option>properties</option>
                                          <option>python</option>
                                          <option>ruby</option>
                                          <option>sh</option>
                                          <option>sql</option>
                                          <option>xml</option>
                                          <option>yaml</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="flex border rounded overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                                      <div className="bg-slate-200 dark:bg-slate-800 px-2 py-2 text-xs text-slate-500 font-mono text-center border-r w-8" style={{ borderColor: 'var(--border)' }}>1</div>
                                      <textarea className="w-full bg-slate-100 dark:bg-slate-950/50 p-2 text-sm outline-none min-h-[100px]" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Set additional playbook YAML or JSON variables.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Vault Key File path</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">File Path to the ansible vault Key to use</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Vault Pass Storage Path</span>}>
                                    <div className="flex gap-2 mb-1">
                                      <input type="text" className="input text-sm flex-1 bg-slate-50 dark:bg-slate-950/50" />
                                      <button className="btn-secondary px-3 text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700 flex items-center gap-1">Select... <FolderOpen size={14} /></button>
                                    </div>
                                    <p className="text-xs text-slate-500">Path to the Vault Key to use within Rundeck Storage. E.g. "keys/path/ansible.vault"</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Extra Ansible arguments</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">Additional ansible raw command line arguments to be appended to the executed command.</p>
                                  </Field>

                                  <div className="border-t my-6" style={{ borderColor: 'var(--border)' }} />
                                  <div className="mb-4 text-slate-500 font-bold text-lg">SSH Connection</div>

                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Authentication</span>}>
                                    <div className="relative mb-1">
                                      <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                                        <option>-none selected-</option>
                                      </select>
                                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                    <p className="text-xs text-slate-500">Type of SSH Authentication to use.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH User</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">SSH User to authenticate as (default=rundeck).</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Password Storage Path</span>}>
                                    <div className="flex gap-2 mb-1">
                                      <input type="text" className="input text-sm flex-1 bg-slate-50 dark:bg-slate-950/50" />
                                      <button className="btn-secondary px-3 text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700 flex items-center gap-1">Select... <FolderOpen size={14} /></button>
                                    </div>
                                    <p className="text-xs text-slate-500">Path to the ssh Password to use within Rundeck Storage.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Key File path</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">File Path to the SSH Key to use</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Key Storage Path</span>}>
                                    <div className="flex gap-2 mb-1">
                                      <input type="text" className="input text-sm flex-1 bg-slate-50 dark:bg-slate-950/50" />
                                      <button className="btn-secondary px-3 text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700 flex items-center gap-1">Select... <FolderOpen size={14} /></button>
                                    </div>
                                    <p className="text-xs text-slate-500">Path to the SSH Key to use within Rundeck Storage. E.g. "keys/path/key1.pem"</p>
                                  </Field>
                                  <Field label="">
                                    <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                      <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                                      <div>
                                        <span>Use ssh-agent.</span>
                                        <p className="text-xs text-slate-500 mt-0.5">Use ssh-agent to connect with a private key plus a passphrase.</p>
                                      </div>
                                    </label>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Passphrase for private key</span>}>
                                    <div className="flex gap-2 mb-1">
                                      <input type="text" className="input text-sm flex-1 bg-slate-50 dark:bg-slate-950/50" />
                                      <button className="btn-secondary px-3 text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700 flex items-center gap-1">Select... <FolderOpen size={14} /></button>
                                    </div>
                                    <p className="text-xs text-slate-500">SSH Passphrase for private key, it just works if the ssh-agent is used.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Passphrase from secure option</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" defaultValue="option.password" />
                                    <p className="text-xs text-slate-500 mt-1">SSH Passphrase from secure option on a job, it just works if the ssh-agent is used.</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">SSH Timeout</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">SSH timeout, override the SSH timeout in seconds (default=10).</p>
                                  </Field>

                                  <div className="border-t my-6" style={{ borderColor: 'var(--border)' }} />
                                  <div className="mb-4 text-slate-500 font-bold text-lg">Privilege Escalation</div>

                                  <Field label="">
                                    <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                                      <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                                      <div>
                                        <span>Use become privilege escalation.</span>
                                        <p className="text-xs text-slate-500 mt-0.5">Run operations with become (nopasswd implied).</p>
                                      </div>
                                    </label>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Privilege escalation method.</span>}>
                                    <div className="relative mb-1">
                                      <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                                        <option>-none selected-</option>
                                        <option>doas</option>
                                        <option>dzdo</option>
                                        <option>ksu</option>
                                        <option>machinectl</option>
                                        <option>runas</option>
                                        <option>pbrun</option>
                                        <option>pfexec</option>
                                        <option>sudo</option>
                                        <option>su</option>
                                      </select>
                                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                    <p className="text-xs text-slate-500">Privilege escalation method to use (default=sudo).</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Privilege escalation user</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                                    <p className="text-xs text-slate-500 mt-1">run operations as this user (default=root).</p>
                                  </Field>
                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Privilege escalation Password Storage Path.</span>}>
                                    <div className="flex gap-2 mb-1">
                                      <input type="text" className="input text-sm flex-1 bg-slate-50 dark:bg-slate-950/50" />
                                      <button className="btn-secondary px-3 text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700 flex items-center gap-1">Select... <FolderOpen size={14} /></button>
                                    </div>
                                    <p className="text-xs text-slate-500">Become password used for privilege escalation.</p>
                                  </Field>

                                  <Field label={<span className="text-slate-600 font-bold dark:text-slate-300">Step Label</span>}>
                                    <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" placeholder="Label or description of this step" />
                                  </Field>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-3 mt-8 ml-[160px]">
                              <button className="btn-secondary px-5 text-sm h-8" onClick={() => removeStep(step.id)}>Cancel</button>
                              <button className="btn-success px-5 text-sm h-8">Save</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 text-center border-b border-slate-200 dark:border-slate-800">
                        <h4 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Add a Step</h4>
                        <p className="text-sm text-slate-500">Click on a Step type to add.</p>
                      </div>

                      <div className="p-6 space-y-6">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold whitespace-nowrap" style={{ color: 'var(--text)' }}>Search step</span>
                          <div className="flex items-center relative flex-1 max-w-xl">
                            <input type="text" placeholder="Enter a step filter string." className="input text-sm pr-20 bg-slate-50 dark:bg-slate-950/50" />
                            <div className="absolute right-0 top-0 bottom-0 flex items-center">
                              <button className="px-3 text-slate-400 hover:text-slate-600"><AlertCircle size={14} /></button>
                              <button className="px-4 border-l text-sm font-bold h-full hover:bg-slate-100 dark:hover:bg-slate-800" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Search</button>
                            </div>
                          </div>
                        </div>

                        {/* Plugin Tabs */}
                        <div className="space-y-4">
                          <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
                            {['Node Steps', 'Workflow Steps'].map(sub => (
                              <button
                                key={sub}
                                className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors ${job.wfSubTab === sub ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                onClick={() => update('wfSubTab', sub)}
                              >
                                {sub}
                              </button>
                            ))}
                          </div>

                          <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                            <div className="p-3 bg-teal-50/50 dark:bg-teal-900/10 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                              <div className="w-1.5 h-4 bg-teal-500 rounded-full" />
                              <span className="text-teal-700 dark:text-teal-400 font-bold text-sm">
                                {job.wfSubTab === 'Node Steps' ? 'Runs once for each node in the workflow.' : 'Runs only once in a workflow.'}
                              </span>
                            </div>

                            <div className="divide-y max-h-[300px] overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
                              {job.wfSubTab === 'Node Steps' ? (
                                <>
                                  {[
                                    { id: 'command', icon: <div className="w-5 h-5 bg-black rounded flex items-center justify-center text-emerald-500"><Terminal size={12} /></div>, title: 'Command', desc: 'Execute a remote command' },
                                    { id: 'script', icon: <div className="w-5 h-5 bg-slate-500 rounded flex items-center justify-center text-white"><AlertCircle size={12} /></div>, title: 'Script', desc: 'Execute an inline script' },
                                    { id: 'scriptfile', icon: <div className="w-5 h-5 bg-slate-300 rounded flex items-center justify-center text-white"><FileCode2 size={12} /></div>, title: 'Script file or URL', desc: 'Execute a local script file or a script from a URL' },
                                    { id: 'jobref', icon: <div className="w-5 h-5 bg-slate-600 rounded flex items-center justify-center text-white"><Book size={12} /></div>, title: 'Job Reference', desc: 'Run a job on the remote node' },
                                  ].map(p => (
                                    <div key={p.title} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-3 group transition-colors" onClick={() => addStep(p.id)}>
                                      <div className="shrink-0">{p.icon}</div>
                                      <div className="text-xs">
                                        <b className="text-slate-700 dark:text-slate-200">{p.title}</b>
                                        <span className="text-slate-500 ml-1.5">- {p.desc}</span>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="p-2 bg-slate-50 dark:bg-slate-800/30 text-[11px] font-bold text-teal-600 dark:text-teal-400 px-3 border-y" style={{ borderColor: 'var(--border)' }}>5 Node Step Plugins</div>
                                  {[
                                    { id: 'ansible_inline', title: 'Ansible Playbook Inline Workflow Node Step', desc: 'Runs an Inline Ansible Playbook.' },
                                    { id: 'ansible_playbook', title: 'Ansible Playbook Workflow Node Step.', desc: 'Runs an Ansible Playbook' },
                                    { id: 'copy_file', title: 'Copy File', desc: 'Copy a file to a destination on a remote node' },
                                    { id: 'local_command', title: 'Local Command', desc: 'Run a command locally on the server' },
                                  ].map(p => (
                                    <div key={p.title} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-3" onClick={() => p.id && addStep(p.id)}>
                                      <Diamond size={12} className="text-slate-800 dark:text-slate-200 fill-slate-800 dark:fill-slate-200 shrink-0" />
                                      <div className="text-xs">
                                        <b className="text-slate-700 dark:text-slate-200">{p.title}</b>
                                        <span className="text-slate-500 ml-1.5">- {p.desc}</span>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-3" onClick={() => addStep('data_node')}>
                                    <Database size={14} className="text-slate-600 shrink-0" />
                                    <div className="text-xs">
                                      <b className="text-slate-700 dark:text-slate-200">Data Node Step</b>
                                      <span className="text-slate-500 ml-1.5">- Produce data values for a node</span>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-3 text-brand font-bold text-xs">
                                    <div className="w-5 h-5 bg-slate-600 rounded flex items-center justify-center text-white shrink-0"><Book size={12} /></div>
                                    Job Reference <span className="font-normal text-slate-500 ml-1.5">- Execute another Job</span>
                                  </div>
                                  <div className="p-2 bg-slate-50 dark:bg-slate-800/30 text-[11px] font-bold text-teal-600 dark:text-teal-400 px-3 border-y" style={{ borderColor: 'var(--border)' }}>10 Workflow Step Plugins</div>
                                  {[
                                    { title: 'Global Variable', desc: 'Creates a global variable to be used on other steps.' },
                                    { title: 'Flow Control', desc: 'Control Workflow execution behavior.' },
                                    { title: 'Job State Conditional', desc: 'Assert that another Job is or is not running.' },
                                  ].map(p => (
                                    <div key={p.title} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-3">
                                      <Diamond size={12} className="text-slate-800 dark:text-slate-200 fill-slate-800 dark:fill-slate-200 shrink-0" />
                                      <div className="text-xs">
                                        <b className="text-slate-700 dark:text-slate-200">{p.title}</b>
                                        <span className="text-slate-500 ml-1.5">- {p.desc}</span>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <button className="btn-secondary px-8 text-xs font-bold h-9">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}


          {/* 3. NODES */}
          {activeTab === 'Nodes' && (
            <div className="max-w-4xl">
              <Field label="Nodes">
                <RadioGroup
                  name="nodeExecution"
                  options={[{ label: 'Dispatch to Nodes', value: 'dispatch' }, { label: 'Execute locally', value: 'local' }]}
                  value={job.nodeExecution}
                  onChange={v => update('nodeExecution', v)}
                />
              </Field>

              {job.nodeExecution === 'dispatch' && (
                <>
                  <Field label="Node Filter">
                    <div className="flex">
                      <select className="input rounded-r-none border-r-0 w-12 px-1 text-center"><option>▼</option></select>
                      <input type="text" className="input rounded-none flex-1" placeholder="Enter a node filter, or .* for all nodes" value={job.nodeFilter} onChange={e => update('nodeFilter', e.target.value)} />
                      <button className="input rounded-l-none border-l-0 w-20 bg-slate-50 dark:bg-slate-800">Search</button>
                    </div>
                  </Field>
                  <Field label="Exclude Filter">
                    <div className="flex">
                      <select className="input rounded-r-none border-r-0 w-12 px-1 text-center"><option>▼</option></select>
                      <input type="text" className="input rounded-none flex-1" placeholder="Enter a node filter, or .* for all nodes" value={job.excludeFilter} onChange={e => update('excludeFilter', e.target.value)} />
                      <button className="input rounded-l-none border-l-0 w-20 bg-slate-50 dark:bg-slate-800">Search</button>
                    </div>
                  </Field>
                  <Field label="Show Excluded Nodes" hint="If true, the excluded nodes will be indicated when running the Job. Otherwise they will not be shown at all.">
                    <RadioGroup name="showExc" options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} value={job.showExcluded} onChange={v => update('showExcluded', v)} />
                  </Field>
                  <Field label="Matched Nodes">
                    <div className="bg-slate-100 dark:bg-slate-800/50 border rounded-lg p-3 flex justify-end" style={{ borderColor: 'var(--border)' }}>
                      <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 shadow-sm"><RefreshCw size={12} /> refresh</button>
                    </div>
                  </Field>
                  <Field label="Editable filter">
                    <RadioGroup name="editF" options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} value={job.editableFilter} onChange={v => update('editableFilter', v)} />
                  </Field>
                  <Field label="Thread Count" hint="Maximum number of parallel threads to use. (Default: 1)">
                    <input type="number" className="input text-sm w-1/2" value={job.threadCount} onChange={e => update('threadCount', e.target.value)} />
                  </Field>
                  <Field label="Rank Attribute" hint="Node attribute to order by. Default is node name.">
                    <input type="text" className="input text-sm w-1/2" value={job.rankAttribute} onChange={e => update('rankAttribute', e.target.value)} />
                  </Field>
                  <Field label="Rank Order">
                    <RadioGroup name="rankO" options={[{ label: 'Ascending', value: 'Ascending' }, { label: 'Descending', value: 'Descending' }]} value={job.rankOrder} onChange={v => update('rankOrder', v)} />
                  </Field>
                  <Field label="If a node fails">
                    <div className="space-y-3 mt-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}><input type="radio" checked={job.ifNodeFails === 'failStep'} onChange={() => update('ifNodeFails', 'failStep')} className="accent-brand-500 w-4 h-4" /> Fail the step without running on any remaining nodes.</label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}><input type="radio" checked={job.ifNodeFails === 'continue'} onChange={() => update('ifNodeFails', 'continue')} className="accent-brand-500 w-4 h-4" /> Continue running on any remaining nodes before failing the step.</label>
                    </div>
                  </Field>
                  <Field label="If node set empty">
                    <div className="space-y-3 mt-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}><input type="radio" checked={job.ifNodeSetEmpty === 'failJob'} onChange={() => update('ifNodeSetEmpty', 'failJob')} className="accent-brand-500 w-4 h-4" /> Fail the job.</label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}><input type="radio" checked={job.ifNodeSetEmpty === 'continue'} onChange={() => update('ifNodeSetEmpty', 'continue')} className="accent-brand-500 w-4 h-4" /> Continue execution.</label>
                    </div>
                  </Field>
                  <Field label="Node selection">
                    <div className="space-y-3 mt-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}><input type="radio" checked={job.nodeSelection === 'default'} onChange={() => update('nodeSelection', 'default')} className="accent-brand-500 w-4 h-4" /> Target nodes are selected by default</label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}><input type="radio" checked={job.nodeSelection === 'explicit'} onChange={() => update('nodeSelection', 'explicit')} className="accent-brand-500 w-4 h-4" /> The user has to explicitly select target nodes</label>
                    </div>
                  </Field>

                  <Field label="Orchestrator">
                    <div className="relative group max-w-sm">
                      <div className="flex items-center relative">
                        <select className="appearance-none input text-sm pl-4 pr-10 py-2 w-full bg-white dark:bg-slate-900 border transition-all hover:bg-slate-50 dark:hover:bg-slate-800" style={{ borderColor: 'var(--border)' }}>
                          <option>Select an Orchestrator</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>

                      {/* Dropdown Menu (Simulated for high fidelity) */}
                      <div className="mt-2 border rounded-xl shadow-2xl bg-white dark:bg-slate-950 overflow-hidden divide-y" style={{ borderColor: 'var(--border)' }}>
                        {[
                          { title: 'Max Percentage', desc: 'Will never process more than the given percentage of nodes per run at one time regardless of how high threads are configured' },
                          { title: 'Rank Tiered', desc: 'Process nodes tiered by rank.' },
                          { title: 'Random Subset', desc: 'Chooses only a random subset of the target nodes.' },
                        ].map(o => (
                          <div key={o.title} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer group transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                              <Diamond size={12} className="text-slate-800 dark:text-slate-200 fill-slate-800 dark:fill-slate-200" />
                              <b className="text-sm font-bold" style={{ color: 'var(--text)' }}>{o.title}</b>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed ml-5">{o.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Field>
                </>
              )}
            </div>
          )}

          {/* 4. SCHEDULE */}
          {activeTab === 'Schedule' && (
            <div className="space-y-8 max-w-3xl">
              <Field label="Schedule to run repeatedly?">
                <RadioGroup name="sched" options={[{ label: 'No', value: false }, { label: 'Yes', value: true }]} value={job.enableScheduling} onChange={v => update('enableScheduling', v)} />
              </Field>
              <Field label="Enable Scheduling?" hint="Allow this Job to be scheduled?">
                <RadioGroup name="enSched" options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} value={job.enableScheduling2 ?? true} onChange={v => update('enableScheduling2', v)} />
              </Field>
              <Field label="Enable Execution?" hint="Allow this Job to be executed?">
                <RadioGroup name="exec" options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} value={job.enableExecution} onChange={v => update('enableExecution', v)} />
              </Field>
            </div>
          )}

          {/* 5. NOTIFICATIONS */}
          {activeTab === 'Notifications' && (
            <div className="max-w-5xl">
              <div className="mb-4 text-sm" style={{ color: 'var(--text)' }}>Notifications can be triggered by different events during the Job Execution.</div>
              <div className="flex gap-2 mb-4">
                <button className="btn-secondary text-xs px-2 py-1 opacity-50 cursor-not-allowed border-r-0 rounded-r-none">↶ Undo</button>
                <button className="btn-secondary text-xs px-2 py-1 opacity-50 cursor-not-allowed rounded-l-none">↷ Redo</button>
              </div>
              <div className="text-sm mb-4" style={{ color: 'var(--muted)' }}>No Notifications are defined. Click an event below to add a Notification for that Trigger.</div>

              <div className="space-y-4">
                {[
                  { id: 'start', label: 'On Start', icon: <PlaySquare size={16} className="text-teal-500" /> },
                  { id: 'success', label: 'On Success', icon: <CheckCircle2 size={16} className="text-green-500" /> },
                  { id: 'failure', label: 'On Failure', icon: <X size={16} className="bg-red-500 text-white rounded-full p-0.5" /> },
                  { id: 'retryable', label: 'On Retryable Failure', icon: <RefreshCw size={16} className="text-orange-500" /> },
                ].map(evt => (
                  <div key={evt.id} className="border rounded-lg p-3 flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2" style={{ color: 'var(--muted)' }}>
                      {evt.icon}
                      <span className="font-medium text-sm">{evt.label}</span>
                    </div>
                    <button className="btn-secondary text-xs py-1 px-3 border border-slate-300 dark:border-slate-600"><Plus size={14} className="inline mr-1" /> Add Notification</button>
                  </div>
                ))}

                <div className="border rounded-lg p-3 flex justify-between items-center bg-slate-50 dark:bg-slate-800/20" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--muted)' }}>
                      <Clock size={16} />
                      <span className="font-medium text-sm">Average Duration Exceeded</span>
                    </div>
                    <div className="flex items-center bg-white dark:bg-slate-900 border rounded pr-2 w-80" style={{ borderColor: 'var(--border)' }}>
                      <span className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border-r" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Threshold</span>
                      <input type="text" placeholder="leave blank for Job Average duration" className="flex-1 bg-transparent px-3 text-xs outline-none" />
                      <AlertCircle size={14} className="text-slate-400" />
                    </div>
                  </div>
                  <button className="btn-secondary text-xs py-1 px-3 border border-slate-300 dark:border-slate-600 h-fit"><Plus size={14} className="inline mr-1" /> Add Notification</button>
                </div>
              </div>
            </div>
          )}

          {/* 6. EXECUTION PLUGINS */}
          {activeTab === 'Execution Plugins' && (
            <div className="max-w-5xl">
              <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>Selected Plugins will be enabled for this Job.</p>

              <div className="border rounded-lg p-6 bg-white dark:bg-slate-900/20" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-4">
                  <input type="checkbox" className="w-5 h-5 mt-0.5 accent-brand-500 rounded border-slate-300" checked={job.killTracked} onChange={e => update('killTracked', e.target.checked)} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Diamond size={12} className="text-slate-800 dark:text-slate-200 fill-slate-800 dark:fill-slate-200" />
                      <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>Kill tracked processes after execution</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Kill all processes collected by the 'Capture Process IDs' log filter
                      <button className="text-brand-500 hover:underline ml-1">More...</button>
                    </p>

                    <div className="mt-6 ml-10 space-y-6">
                      <label className="flex items-start gap-4 group cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 mt-0.5 accent-brand-500 rounded border-slate-300" checked={job.killChildren} onChange={e => update('killChildren', e.target.checked)} />
                        <div className="flex-1">
                          <span className="text-sm font-bold block" style={{ color: 'var(--text)' }}>Kill Children</span>
                          <span className="text-[11px] block mt-1 text-slate-500">Also kill processes whose process SID matches the tracked PIDs</span>
                        </div>
                      </label>
                      <label className="flex items-start gap-4 group cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 mt-0.5 accent-brand-500 rounded border-slate-300" checked={job.killOnlyFailure} onChange={e => update('killOnlyFailure', e.target.checked)} />
                        <div className="flex-1">
                          <span className="text-sm font-bold block" style={{ color: 'var(--text)' }}>Kill only on job failure</span>
                          <span className="text-[11px] block mt-1 text-slate-500">Kill processes only if job failed or is killed</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. OTHER */}
          {activeTab === 'Other' && (
            <div className="max-w-4xl">
              <Field label="Log level" hint="Debug level produces more output">
                <RadioGroup name="logLvl" options={[{ label: 'Normal', value: 'Normal' }, { label: 'Debug', value: 'Debug' }]} value={job.logLevel} onChange={v => update('logLevel', v)} />
              </Field>
              <Field label="Multiple Executions?" hint="Allow this Job to be executed more than one time simultaneously?">
                <RadioGroup name="multiEx" options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} value={job.multipleExecutions} onChange={v => update('multipleExecutions', v)} />
              </Field>
              <Field label="Limit Multiple Executions?" hint="Max number of multiple executions. Use blank or 0 to indicate no limit.">
                <input type="text" className="input text-sm w-full" value={job.limitMultiple} onChange={e => update('limitMultiple', e.target.value)} />
              </Field>
              <Field label="Timeout" hint="The maximum time for an execution to run. Time in seconds, or specify time units: '120m', '2h', '3d'. Use blank or 0 to indicate no timeout. Can include option value references like '${option.timeout}'.">
                <input type="text" className="input text-sm w-full" value={job.timeout} onChange={e => update('timeout', e.target.value)} />
              </Field>

              <div className="grid grid-cols-[160px_1fr_160px_1fr] items-start gap-4 mb-5">
                <label className="text-sm font-medium text-right pt-2" style={{ color: 'var(--text)' }}>Retry</label>
                <div>
                  <input type="text" className="input text-sm w-full" value={job.retry} onChange={e => update('retry', e.target.value)} />
                  <p className="text-[11px] mt-1.5" style={{ color: 'var(--muted)' }}>Maximum number of times to retry execution when this job is directly invoked. Retry will occur if the job fails or times out, but not if it is manually killed. Can use an option value reference like "{'${option.retry}'}".</p>
                </div>
                <label className="text-sm font-medium text-right pt-2" style={{ color: 'var(--text)' }}>Retry Delay</label>
                <div>
                  <input type="text" className="input text-sm w-full" value={job.retryDelay} onChange={e => update('retryDelay', e.target.value)} />
                  <p className="text-[11px] mt-1.5" style={{ color: 'var(--muted)' }}>The time between the failed execution and the retry. Time in seconds, or specify time units: "120m", "2h", "3d". Use blank or 0 to indicate no delay. Can include option value references like "{'${option.delay}'}".</p>
                </div>
              </div>

              <div className="grid grid-cols-[160px_1fr_160px_1fr] items-start gap-4 mb-5">
                <label className="text-sm font-medium text-right pt-2" style={{ color: 'var(--text)' }}>Log Output Limit</label>
                <div>
                  <input type="text" className="input text-sm w-full mb-2" placeholder="E.g as '100', '100/node' or '100MB'" value={job.logOutputLimit} onChange={e => update('logOutputLimit', e.target.value)} />
                  <p className="text-[11px]" style={{ color: 'var(--muted)' }}>Enter either maximum total line-count (e.g. "100"), maximum per-node line-count ("100/node"), or maximum log file size ("100MB", "100KB", etc.), using "GB","MB","KB","B" as Giga- Mega- Kilo- and bytes.</p>
                </div>
                <label className="text-sm font-medium text-right pt-2" style={{ color: 'var(--text)' }}>Log Limit Action</label>
                <div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer mb-2" style={{ color: 'var(--text)' }}>
                    <input type="radio" name="llAction" checked={job.logLimitAction === 'halt'} onChange={() => update('logLimitAction', 'halt')} className="accent-brand-500 w-4 h-4" /> Halt with status:
                  </label>
                  <input type="text" className="input text-sm w-full mb-3 ml-6 w-[calc(100%-24px)]" placeholder="'failed', 'aborted', or any" value={job.logHaltStatus} onChange={e => update('logHaltStatus', e.target.value)} disabled={job.logLimitAction !== 'halt'} />
                  <label className="flex items-center gap-2 text-sm cursor-pointer mb-2" style={{ color: 'var(--text)' }}>
                    <input type="radio" name="llAction" checked={job.logLimitAction === 'truncate'} onChange={() => update('logLimitAction', 'truncate')} className="accent-brand-500 w-4 h-4" /> Truncate and continue
                  </label>
                  <p className="text-[11px] mt-1.5" style={{ color: 'var(--muted)' }}>Action to perform if the output limit is reached.</p>
                </div>
              </div>

              <Field label="Default Tab" hint="Default tab to display when you follow an execution.">
                <RadioGroup name="dTab" options={[{ label: 'Nodes', value: 'Nodes' }, { label: 'Log Output', value: 'Log Output' }, { label: 'HTML', value: 'HTML' }]} value={job.defaultTab} onChange={v => update('defaultTab', v)} />
              </Field>

              <Field label="UUID">
                <input type="text" className="input text-sm w-full" placeholder="Add UUID" value={job.uuid || ''} onChange={e => update('uuid', e.target.value)} />
              </Field>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t flex items-center gap-3 bg-black/5" style={{ borderColor: 'var(--border)' }}>
          <button className="btn-secondary" onClick={() => navigate('/jobs')}>
            Cancel
          </button>
          <button className="btn-success px-6" onClick={handleCreate} disabled={saving}>
            {saving ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      {showLogFilterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[85vh] animate-slide-up border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                Add Log Filter Plugin for Step: <span className="text-teal-600 dark:text-teal-400 font-normal">All workflow steps</span>
              </h2>
              <button onClick={() => setShowLogFilterModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={20} />
              </button>
            </div>

            {!activeLogFilter ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {[
                    { id: 'key_value_data', title: 'Key Value Data', desc: 'Captures simple Key/Value data using a simple text format', hasMoreInfo: true },
                    { id: 'quiet_output', title: 'Quiet Output', desc: 'Quiets all output which does or does not match a certain pattern by changing its log level.' },
                    { id: 'highlight_output', title: 'Highlight Output', desc: 'Highlights all output which matches the given regular expression.' },
                    { id: 'capture_process_ids', title: 'Capture Process IDs', desc: 'Captures process id numbers for later cleanup by the Kill Handler Plugin.', hasMoreInfo: true },
                    { id: 'mask_passwords', title: 'Mask Passwords', desc: 'Masks secure input option values from being emitted in the logs.' },
                    { id: 'render_formatted_data', title: 'Render Formatted Data', desc: 'Allows marking formatted data as a certain data type, for rendering in the Log Output.', hasMoreInfo: true },
                    { id: 'mask_log_output_by_regex', title: 'Mask Log Output By Regex', desc: 'Mask sensitive output that match the defined Regex' },
                    { id: 'ansible_set_stats', title: 'Ansible set_stats', desc: 'Parses the output of the ansible set_stats module and generates the corresponding data context variables.', hasMoreInfo: true, extendedDesc: (
                      <>
                        <p>To display the output of the set_stats module, you must set show_custom_stats in section [defaults] in ansible.cfg or by defining environment variable ANSIBLE_SHOW_CUSTOM_STATS to true.</p>
                        <p>See the <a href="#" className="text-brand hover:underline">official Ansible documentation.</a></p>
                      </>
                    ) },
                    { id: 'multiline_regex_data_capture', title: 'Multiline Regex Data Capture', desc: 'Captures Multiline Regex Key/Value data using a simple text format', hasMoreInfo: true }
                  ].map((filter, i) => (
                    <div key={i} onClick={() => { setActiveLogFilter(filter); setShowMoreInfo(false); }} className="flex gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                      {filter.id === 'quiet_output' ? <VolumeX size={16} className="text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" /> :
                        filter.id === 'highlight_output' ? <Edit2 size={16} className="text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" /> :
                          filter.id === 'capture_process_ids' ? <Target size={16} className="text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" /> :
                            filter.id === 'mask_passwords' ? <Shield size={16} className="text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" /> :
                              <Diamond size={16} className="text-slate-700 dark:text-slate-300 fill-slate-700 dark:fill-slate-300 shrink-0 mt-0.5" />}
                      <div className="text-sm">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{filter.title}</span> <span className="text-slate-500">- {filter.desc}</span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 text-sm text-slate-600 dark:text-slate-400">
                    Choose Log Filter Plugin to add to the Step
                  </div>
                </div>

                <div className="p-4 border-t flex justify-start" style={{ borderColor: 'var(--border)' }}>
                  <button onClick={() => setShowLogFilterModal(false)} className="btn-secondary px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-sm rounded">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-6 border-b flex items-start gap-3" style={{ borderColor: 'var(--border)' }}>
                  {activeLogFilter.id === 'quiet_output' ? <VolumeX size={20} className="text-slate-700 dark:text-slate-300 mt-1 shrink-0" /> :
                    activeLogFilter.id === 'highlight_output' ? <Edit2 size={20} className="text-slate-700 dark:text-slate-300 mt-1 shrink-0" /> :
                      activeLogFilter.id === 'capture_process_ids' ? <Target size={20} className="text-slate-700 dark:text-slate-300 mt-1 shrink-0" /> :
                        activeLogFilter.id === 'mask_passwords' ? <Shield size={20} className="text-slate-700 dark:text-slate-300 mt-1 shrink-0" /> :
                          <Diamond size={20} className="text-slate-700 dark:text-slate-300 fill-slate-700 dark:fill-slate-300 mt-1 shrink-0" />}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{activeLogFilter.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {activeLogFilter.desc}
                      {activeLogFilter.hasMoreInfo && (
                        <button onClick={() => setShowMoreInfo(!showMoreInfo)} className="text-brand hover:underline ml-1">
                          {showMoreInfo ? 'Less' : 'More information'}
                        </button>
                      )}
                    </p>
                    {showMoreInfo && activeLogFilter.hasMoreInfo && (
                      <div className="text-sm text-slate-500 mt-3 space-y-3">
                        {activeLogFilter.extendedDesc || <p>Further documentation and detailed usage instructions for {activeLogFilter.title} go here.</p>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {activeLogFilter.id === 'key_value_data' && (
                    <>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Pattern</span>}>
                        <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" defaultValue="^RUNDECK:DATA:\s*([^\s]+?)\s*=\s*(.+)$" />
                        <div className="text-xs text-slate-500 mt-2 space-y-2">
                          <p>Regular Expression for matching key/value data. <a href="#" className="text-brand hover:underline">Less</a></p>
                          <p>The regular expression must define two Capturing Groups. The first group matched defines the data key, and the second group defines the data value.</p>
                          <p>See the <a href="#" className="text-brand hover:underline">Java Pattern</a> documentation.</p>
                        </div>
                      </Field>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Name Data</span>}>
                        <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                        <p className="text-xs text-slate-500 mt-1">If only one groups is provided, the name of the captured variable</p>
                      </Field>
                      <Field label="">
                        <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                          <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-600 dark:text-slate-300">Log Data</span>
                            <p className="text-xs text-slate-500 mt-0.5">If true, log the captured data</p>
                          </div>
                        </label>
                      </Field>
                      <div className="pt-2">
                        <button className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
                          Advanced <ChevronDown size={16} />
                        </button>
                        <div className="mt-4 space-y-6">
                          <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Invalid Character Pattern</span>}>
                            <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" defaultValue="\s|\$|\{|\}\\" />
                            <p className="text-xs text-slate-500 mt-1">Regular expression pattern to match invalid characters in the Key. Any matched characters will be replaced by an underscore character. Default: white space and special characters.</p>
                          </Field>
                          <Field label="">
                            <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                              <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                              <div>
                                <span className="font-bold text-slate-600 dark:text-slate-300">Replace filtered data</span>
                                <p className="text-xs text-slate-500 mt-0.5">If checked, the data will be replaced with a defined value below</p>
                              </div>
                            </label>
                          </Field>
                          <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Replace Invalid Character Patterns With</span>}>
                            <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                            <p className="text-xs text-slate-500 mt-1">If the Invalid Character Pattern matches, the string will be replaced with an underscore by default, unless you specify which value do you want to replace the invalid character pattern with.</p>
                          </Field>
                        </div>
                      </div>
                    </>
                  )}

                  {activeLogFilter.id === 'quiet_output' && (
                    <>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Pattern</span>}>
                        <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                        <div className="text-xs text-slate-500 mt-2 space-y-2">
                          <p>Regular Expression to test. If blank, all lines will match. <a href="#" className="text-brand hover:underline">Less</a></p>
                          <p>See the <a href="#" className="text-brand hover:underline">Java Pattern</a> documentation.</p>
                        </div>
                      </Field>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Test Log Level</span>}>
                        <div className="relative mb-1">
                          <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                            <option>-- NONE --</option>
                            <option>error</option>
                            <option>warning</option>
                            <option>normal</option>
                            <option>verbose</option>
                            <option>debug</option>
                            <option>all</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <p className="text-xs text-slate-500">Test the pattern against only log lines of the given log level. (Default: normal). <a href="#" className="text-brand hover:underline">More...</a></p>
                      </Field>
                      <Field label="">
                        <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                          <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-600 dark:text-slate-300">Quiet Matched Output</span>
                            <p className="text-xs text-slate-500 mt-0.5">If true, quiet matching lines. Otherwise quiet non-matching lines</p>
                          </div>
                        </label>
                      </Field>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Result Log Level</span>}>
                        <div className="relative mb-1">
                          <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                            <option>-- NONE --</option>
                            <option>error</option>
                            <option>warning</option>
                            <option>verbose</option>
                            <option>normal</option>
                            <option>debug</option>

                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <p className="text-xs text-slate-500">Quieted lines will be changed to this log level. (Default: verbose)</p>
                      </Field>
                    </>
                  )}

                  {activeLogFilter.id === 'highlight_output' && (
                    <>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Pattern</span>}>
                        <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                        <div className="text-xs text-slate-500 mt-2 space-y-3">
                          <p>Regular Expression to test. Use groups to selectively highlight. <a href="#" className="text-brand hover:underline">Less</a></p>
                          <p>Use a non-grouped pattern to highlight entire match:</p>
                          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                            <li>regex: <code className="bg-slate-100 dark:bg-slate-800 text-pink-500 px-1 rounded">test</code></li>
                            <li>message: <code className="bg-slate-100 dark:bg-slate-800 text-pink-500 px-1 rounded">this is a test</code></li>
                            <li>result: this is a <i>test</i></li>
                          </ul>
                          <p>Use regex groups to only highlight grouped sections:</p>
                          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                            <li>regex: <code className="bg-slate-100 dark:bg-slate-800 text-pink-500 px-1 rounded">this (is) a (test)</code></li>
                            <li>result: this <i>is</i> a <i>test</i></li>
                          </ul>
                          <p>See the <a href="#" className="text-brand hover:underline">Java Pattern</a> documentation.</p>
                        </div>
                      </Field>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Foreground Color</span>}>
                        <div className="relative mb-1">
                          <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                            <option>-none selected-</option>
                            <option>green</option>
                            <option>red</option>
                            <option>yellow</option>
                            <option>blue</option>
                            <option>magenta</option>
                            <option>cyan</option>
                            <option>white</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <p className="text-xs text-slate-500">ANSI color applied to replacement text.</p>
                      </Field>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Background Color</span>}>
                        <div className="relative mb-1">
                          <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                            <option>-none selected-</option>
                            <option>black</option>
                            <option>red</option>
                            <option>green</option>
                            <option>yellow</option>
                            <option>blue</option>
                            <option>magenta</option>
                            <option>cyan</option>

                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <p className="text-xs text-slate-500">ANSI color applied to replacement text background.</p>
                      </Field>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Mode</span>}>
                        <div className="relative mb-1">
                          <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                            <option>-none selected-</option>
                            <option>bold</option>
                            <option>underline</option>
                            <option>blink</option>
                            <option>reverse</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <p className="text-xs text-slate-500">ANSI color mode applied to replacement text.</p>
                      </Field>
                    </>
                  )}

                  {activeLogFilter.id === 'capture_process_ids' && (
                    <>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Pattern</span>}>
                        <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" defaultValue="^RUNDECK:PID:\h*(\d+)\h*$" />
                        <div className="text-xs text-slate-500 mt-2 space-y-2">
                          <p>Regular Expression for matching process ids. <a href="#" className="text-brand hover:underline">Less</a></p>
                          <p>The regular expression must define one Capturing Group. The first group matched defines the process id to parse, and the text matched must be a valid integer number.</p>
                          <p>See the <a href="#" className="text-brand hover:underline">Java Pattern</a> documentation.</p>
                        </div>
                      </Field>
                    </>
                  )}

                  {activeLogFilter.id === 'mask_passwords' && (
                    <>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Replacement</span>}>
                        <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" defaultValue="[SECURE]" />
                        <p className="text-xs text-slate-500 mt-1">Text to replace secure values</p>
                      </Field>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Color</span>}>
                        <div className="relative mb-1">
                          <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                            <option>-none selected-</option>
                            <option>green</option>
                            <option>red</option>
                            <option>yellow</option>
                            <option>blue</option>
                            <option>magenta</option>
                            <option>cyan</option>
                            <option>white</option>

                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <p className="text-xs text-slate-500">ANSI color applied to replacement text.</p>
                      </Field>
                    </>
                  )}

                  {activeLogFilter.id === 'render_formatted_data' && (
                    <>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Data type</span>}>
                        <div className="flex gap-2 mb-1">
                          <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                          <div className="relative w-48 shrink-0">
                            <select className="appearance-none input text-sm w-full bg-slate-50 dark:bg-slate-950/50 pr-8 border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                              <option>-choose a value-</option>
                              <option>JSON</option>
                              <option>Java Properties</option>
                              <option>CSV</option>
                              <option>HTML</option>
                              <option>Markdown</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">Enter a data type to use by default. <a href="#" className="text-brand hover:underline">More...</a></p>
                      </Field>
                      <Field label="">
                        <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                          <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-600 dark:text-slate-300">Table striped</span>
                            <p className="text-xs text-slate-500 mt-0.5">Display the rows striped.</p>
                          </div>
                        </label>
                      </Field>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Sanitize HTML</span>}>
                        <div className="space-y-2 mb-2">
                          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                            <input type="radio" name="sanitizeHtml" className="accent-brand-500 w-4 h-4" defaultChecked />
                            <span>True</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                            <input type="radio" name="sanitizeHtml" className="accent-brand-500 w-4 h-4" />
                            <span>False</span>
                          </label>
                        </div>
                        <p className="text-xs text-slate-500">HTML that is emitted is run through the HTML sanitizer to remove potentially unsafe tags. Note: Unsanitized HTML must be enabled in the framework and project properties before this setting will take effect.</p>
                      </Field>
                    </>
                  )}

                  {activeLogFilter.id === 'mask_log_output_by_regex' && (
                    <>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Pattern</span>}>
                        <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                        <p className="text-xs text-slate-500 mt-1">Regular Expression for matching output data.</p>
                      </Field>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Replacement</span>}>
                        <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" defaultValue="[SECURE]" />
                        <p className="text-xs text-slate-500 mt-1">Text to replace secure values</p>
                      </Field>
                      <Field label="">
                        <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                          <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-600 dark:text-slate-300">Mask only value on key/value text based</span>
                            <p className="text-xs text-slate-500 mt-0.5">If true, will mask only value on a key/value text based. The regular expression must define two Capturing Groups.</p>
                          </div>
                        </label>
                      </Field>
                    </>
                  )}

                  {activeLogFilter.id === 'ansible_set_stats' && (
                    <>
                      <Field label="">
                        <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                          <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-600 dark:text-slate-300">Log Data</span>
                            <p className="text-xs text-slate-500 mt-0.5">If true, log the captured data</p>
                          </div>
                        </label>
                      </Field>
                    </>
                  )}

                  {activeLogFilter.id === 'multiline_regex_data_capture' && (
                    <>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Pattern</span>}>
                        <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" defaultValue="^(.+?)\s*=\s*(.+)" />
                        <div className="text-xs text-slate-500 mt-2 space-y-2">
                          <p>Regular Expression for matching key/value data. <a href="#" className="text-brand hover:underline">Less</a></p>
                          <p>The regular expression must define two Capturing Groups. The first group matched defines the data key, and the second group defines the data value. If it just capture one group, the name parameter must be defined. See the <a href="#" className="text-brand hover:underline">Java Pattern</a> documentation.</p>
                        </div>
                      </Field>
                      <Field label={<span className="font-bold text-sm text-slate-600 dark:text-slate-300">Name Data</span>}>
                        <input type="text" className="input text-sm w-full bg-slate-50 dark:bg-slate-950/50" />
                        <p className="text-xs text-slate-500 mt-1">If only one groups is provided, the name of the captured variable</p>
                      </Field>
                      <Field label="">
                        <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                          <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-600 dark:text-slate-300">Hide Output</span>
                            <p className="text-xs text-slate-500 mt-0.5">If true, log output will be hidden</p>
                          </div>
                        </label>
                      </Field>
                      <Field label="">
                        <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                          <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-600 dark:text-slate-300">Capture multiple values</span>
                            <p className="text-xs text-slate-500 mt-0.5">If true, each line is scanned separately to match the regex, capturing multiple key/value pairs. <a href="#" className="text-brand hover:underline">More...</a></p>
                          </div>
                        </label>
                      </Field>
                      <Field label="">
                        <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
                          <input type="checkbox" className="accent-brand-500 w-4 h-4 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-600 dark:text-slate-300">Log Data</span>
                            <p className="text-xs text-slate-500 mt-0.5">If true, log the captured data</p>
                          </div>
                        </label>
                      </Field>
                    </>
                  )}

                  {/* Fallback for other unconfigured plugins */}
                  {!['key_value_data', 'quiet_output', 'highlight_output', 'capture_process_ids', 'mask_passwords', 'render_formatted_data', 'mask_log_output_by_regex', 'ansible_set_stats', 'multiline_regex_data_capture'].includes(activeLogFilter.id) && (
                    <div className="py-8 text-center text-slate-500">
                      Configuration for this plugin is not yet supported in this UI.
                    </div>
                  )}

                </div>

                <div className="p-4 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                  <button onClick={() => setActiveLogFilter(null)} className="btn-secondary px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-sm rounded">
                    Cancel
                  </button>
                  <button onClick={() => setShowLogFilterModal(false)} className="btn-success px-4 py-2 text-sm font-bold rounded shadow-sm">
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
