import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Save, Folder } from 'lucide-react'
import { useAppStore } from '../store/appStore'

const TABS = [
  'Details',
  'Execution History Clean',
  'Execution Mode',
  'User Interface',
  'Default Node Executor',
  'Default File Copier'
]

function Field({ label, hint, children }) {
  return (
    <div className="mb-5">
      {label && <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>{label}</label>}
      {children}
      {hint && <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>{hint}</p>}
    </div>
  )
}

function Checkbox({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer mb-3">
      <div className="mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ width: 16, height: 16, accentColor: 'var(--brand)' }}
        />
      </div>
      <div>
        <span className="text-sm font-medium block" style={{ color: 'var(--text)' }}>{label}</span>
        {hint && <span className="text-xs block mt-0.5" style={{ color: 'var(--muted)' }}>{hint}</span>}
      </div>
    </label>
  )
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-4 mt-8 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{title}</h3>
      {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{subtitle}</p>}
    </div>
  )
}

export default function CreateProjectPage() {
  const navigate = useNavigate()
  const addToast = useAppStore((s) => s.addToast)
  const addProject = useAppStore((s) => s.addProject)
  const setActiveProject = useAppStore((s) => s.setActiveProject)

  const [activeTab, setActiveTab] = useState('Details')
  const [saving, setSaving] = useState(false)

  // Project Form State
  const [project, setProject] = useState({
    name: '',
    displayName: '',
    description: '',

    // Execution History Clean
    historyCleanEnable: false,
    historyCleanDays: '',
    historyCleanMin: '',
    historyCleanMax: '',
    historyCleanCron: '',

    // Execution Mode
    execDisableLater: false,
    execDisableTime: '',
    execEnableLater: false,
    execEnableTime: '',
    schedDisableLater: false,
    schedDisableTime: '',
    schedEnableLater: false,
    schedEnableTime: '',
    execDisableNow: false,
    schedDisableNow: false,

    // User Interface
    uiJobExpansion: '1',
    uiReadmeList: false,
    uiReadmeHome: false,
    uiMotdList: false,
    uiMotdHome: false,
    uiMotdNav: false,
    uiHtml: false,

    // Default Node Executor
    nodeExecutor: 'SSHJ-SSH',
    sshAuthType: 'privateKey',
    sshPasswordPath: '',
    sshKeyFilePath: '',
    sshKeyPath: '',
    sshPassphrasePath: '',
    sshKeepAlive: '',
    sshRetryEnable: false,
    sshRetryNum: '3',

    // Default File Copier
    fileCopier: 'SSHJ-SCP',
    scpKeyFilePath: '',
    scpKeyPath: '',
    scpPasswordPath: '',
    scpAuthType: 'privateKey',
    scpPassphrasePath: '',
    scpKeepAlive: '',
    scpRetryNum: '3',
  })

  const update = (key, val) => setProject(prev => ({ ...prev, [key]: val }))

  const handleCreate = async () => {
    if (!project.name) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Project Name is required' })
      setActiveTab('Details')
      return
    }
    setSaving(true)

    // Simulate API call
    await new Promise(r => setTimeout(r, 800))

    // Add to global store
    addProject(project.name)
    setActiveProject(project.name)

    addToast({ type: 'success', title: 'Project Created', message: `Project "${project.name}" created successfully.` })
    navigate('/dashboard')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Create a new Project</h2>
        </div>
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
              onMouseEnter={(e) => { if (activeTab !== tab) e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={(e) => { if (activeTab !== tab) e.currentTarget.style.color = 'var(--muted)' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8 min-h-[450px]">

          {/* 1. DETAILS */}
          {activeTab === 'Details' && (
            <div className="space-y-6 max-w-2xl">
              <Field label="Project Name">
                <input
                  type="text"
                  className="input text-sm"
                  value={project.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="e.g. DATA-PIPELINES"
                />
              </Field>
              <Field label="Project Display Name">
                <input
                  type="text"
                  className="input text-sm"
                  value={project.displayName}
                  onChange={e => update('displayName', e.target.value)}
                  placeholder="Optional display name"
                />
              </Field>
              <Field label="Description">
                <textarea
                  className="input text-sm min-h-[100px] resize-y"
                  value={project.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Project description..."
                />
              </Field>
            </div>
          )}

          {/* 2. EXECUTION HISTORY CLEAN */}
          {activeTab === 'Execution History Clean' && (
            <div className="max-w-3xl">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Execution History Clean:</h3>
              <Checkbox
                label="Enable"
                hint="Enable cleaner executions history"
                checked={project.historyCleanEnable}
                onChange={e => update('historyCleanEnable', e.target.checked)}
              />
              <div className="mt-6 space-y-4 opacity-100 transition-opacity">
                <Field label="Days to keep executions. Default: 60">
                  <input type="text" className="input text-sm" value={project.historyCleanDays} onChange={e => update('historyCleanDays', e.target.value)} />
                </Field>
                <Field label="Minimum executions to keep. Default: 50">
                  <input type="text" className="input text-sm" value={project.historyCleanMin} onChange={e => update('historyCleanMin', e.target.value)} />
                </Field>
                <Field label="Maximum size of the deletion. Default: 500">
                  <input type="text" className="input text-sm" value={project.historyCleanMax} onChange={e => update('historyCleanMax', e.target.value)} />
                </Field>
                <Field
                  label="Schedule clean history job (Cron expression). Default: 0 0 0 1/1 * ? * (Every days on 12:00 AM)"
                  hint='Ranges: 1-3. Lists: 1,4,6. Increments: 0/15 "every 15 units starting at 0".'
                >
                  <div className="flex gap-2">
                    <input type="text" className="input text-sm flex-1" value={project.historyCleanCron} onChange={e => update('historyCleanCron', e.target.value)} />
                    <select className="input text-sm w-64" onChange={e => { if (e.target.value) update('historyCleanCron', e.target.value) }}>
                      <option value="">-choose an example-</option>
                      <option value="0 0 0 * * ?">Daily at 00:00</option>
                      <option value="0 0 23 ? * FRI">Weekly (Every Fridays 11PM)</option>
                      <option value="0 0 0 ? * MON,FRI">Weekly (Two days a week)</option>
                      <option value="0 0 0 1 1/2 ?">Every 2 months (Day 1)</option>
                    </select>
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* 3. EXECUTION MODE */}
          {activeTab === 'Execution Mode' && (
            <div className="max-w-3xl">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>Execution Mode</h3>
              <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>Job execution and schedule configuration at project level.</p>

              <SectionHeading title="Enable/Disable Execution Later" />
              <div className="pl-2 space-y-4">
                <Checkbox label="Disable Execution Later" checked={project.execDisableLater} onChange={e => update('execDisableLater', e.target.checked)} />
                <Field label="Disable Execution after time" hint="Time to disable execution : 2h, 2m, 30s">
                  <input type="text" className="input text-sm" value={project.execDisableTime} onChange={e => update('execDisableTime', e.target.value)} placeholder="0" />
                </Field>
                <Checkbox label="Enable Execution Later" checked={project.execEnableLater} onChange={e => update('execEnableLater', e.target.checked)} />
                <Field label="Enable Execution after time" hint="Time to enable execution : 2h, 2m, 30s">
                  <input type="text" className="input text-sm" value={project.execEnableTime} onChange={e => update('execEnableTime', e.target.value)} />
                </Field>
              </div>

              <SectionHeading title="Enable/Disable Schedule Later" />
              <div className="pl-2 space-y-4">
                <Checkbox label="Disable Scheduled Later" checked={project.schedDisableLater} onChange={e => update('schedDisableLater', e.target.checked)} />
                <Field label="Disable Scheduled after Time" hint="Time to disable schedule : 2h, 2m, 30s">
                  <input type="text" className="input text-sm" value={project.schedDisableTime} onChange={e => update('schedDisableTime', e.target.value)} />
                </Field>
                <Checkbox label="Enable Scheduled Later" checked={project.schedEnableLater} onChange={e => update('schedEnableLater', e.target.checked)} />
                <Field label="Enable Scheduled after time" hint="Time to enable schedule : 2h, 2m, 30s">
                  <input type="text" className="input text-sm" value={project.schedEnableTime} onChange={e => update('schedEnableTime', e.target.value)} />
                </Field>
              </div>

              <SectionHeading title="Enable/Disable Execution Now" />
              <div className="pl-2 space-y-2">
                <Checkbox label="Disable Execution" checked={project.execDisableNow} onChange={e => update('execDisableNow', e.target.checked)} />
                <Checkbox label="Disable Schedule" checked={project.schedDisableNow} onChange={e => update('schedDisableNow', e.target.checked)} />
              </div>
            </div>
          )}

          {/* 4. USER INTERFACE */}
          {activeTab === 'User Interface' && (
            <div className="max-w-3xl">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>User Interface</h3>
              <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>Additional configuration for the user interface for this project</p>

              <Field label="Job Group Expansion Level" hint="In the Jobs page, expand Job groups to this depth by default.">
                <input type="number" className="input text-sm" value={project.uiJobExpansion} onChange={e => update('uiJobExpansion', e.target.value)} />
              </Field>

              <div className="mb-6 mt-6">
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text)' }}>Display the Project Readme</label>
                <div className="pl-2 space-y-1">
                  <Checkbox label="Projects List" checked={project.uiReadmeList} onChange={e => update('uiReadmeList', e.target.checked)} />
                  <Checkbox label="Project Home Page" checked={project.uiReadmeHome} onChange={e => update('uiReadmeHome', e.target.checked)} />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text)' }}>Display the Project MOTD</label>
                <div className="pl-2 space-y-1">
                  <Checkbox label="Projects List" checked={project.uiMotdList} onChange={e => update('uiMotdList', e.target.checked)} />
                  <Checkbox label="Project Home Page" checked={project.uiMotdHome} onChange={e => update('uiMotdHome', e.target.checked)} />
                  <Checkbox label="Navbar Indicator" checked={project.uiMotdNav} onChange={e => update('uiMotdNav', e.target.checked)} />
                </div>
              </div>

              <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                <Checkbox
                  label="Allow Unsanitized HTML output"
                  hint="If enabled, and a command's log filter specifies the no-strip meta tag, the output from the command will not be run through the tag sanitizer."
                  checked={project.uiHtml}
                  onChange={e => update('uiHtml', e.target.checked)}
                />
              </div>
            </div>
          )}

          {/* 5. DEFAULT NODE EXECUTOR */}
          {activeTab === 'Default Node Executor' && (
            <div className="max-w-3xl">
              <p className="text-sm mb-6" style={{ color: 'var(--text)' }}>The Node Executor is responsible for executing commands and scripts on remote nodes.</p>

              <div className="mb-8">
                <select
                  className="input text-sm w-64 bg-brand-500 text-white font-medium"
                  style={{ background: 'var(--brand)', borderColor: 'var(--brand)', color: '#fff' }}
                  value={project.nodeExecutor}
                  onChange={e => update('nodeExecutor', e.target.value)}
                >
                  <option value="SSH">SSH</option>
                  <option value="Local">Local</option>
                  <option value="SSHJ-SSH">SSHJ-SSH</option>
                  <option value="Stub">Stub</option>
                  <option value="Script Execution">Script Execution</option>
                  <option value="Ansible">Ansible Ad-Hoc Node Executor</option>
                  <option value="OpenSSH / Executor">OpenSSH / Executor</option>
                  <option value="WinRM Node Executor Python">WinRM Node Executor Python</option>
                </select>
                <span className="ml-4 text-sm font-medium" style={{ color: 'var(--brand)' }}>Node Executor using {project.nodeExecutor.replace('SSHJ-SSH', 'SSHJ library')}</span>
              </div>

              {project.nodeExecutor === 'SSHJ-SSH' && (
                <div className="space-y-6 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  <Field label="SSH Password Storage Path" hint='Path to the Password to use within Rundeck Storage. E.g. "keys/path/my.password". Can be overridden by a Node attribute named "ssh-password-storage-path".'>
                    <div className="flex gap-2">
                      <input type="text" className="input text-sm flex-1" value={project.sshPasswordPath} onChange={e => update('sshPasswordPath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="SSH Authentication" hint="Type of SSH Authentication to use">
                    <select className="input text-sm" value={project.sshAuthType} onChange={e => update('sshAuthType', e.target.value)}>
                      <option value="privateKey">privateKey</option>
                      <option value="password">password</option>
                    </select>
                  </Field>
                  <Field label="SSH Key File path" hint="File Path to the SSH Key to use">
                    <input type="text" className="input text-sm" value={project.sshKeyFilePath} onChange={e => update('sshKeyFilePath', e.target.value)} />
                  </Field>
                  <Field label="SSH Key Storage Path" hint='Path to the SSH Key to use within Rundeck Storage. E.g. "keys/path/key1.pem"'>
                    <div className="flex gap-2">
                      <input type="text" className="input text-sm flex-1" value={project.sshKeyPath} onChange={e => update('sshKeyPath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="SSH Key Passphrase Storage Path" hint='Path to the key&apos;s Passphrase to use within Rundeck Storage. Can be overridden by a Node attribute named "ssh-key-passphrase-storage-path".'>
                    <div className="flex gap-2">
                      <input type="text" className="input text-sm flex-1" value={project.sshPassphrasePath} onChange={e => update('sshPassphrasePath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="Keep Alive Interval" hint="Keep Alive Interval">
                    <input type="text" className="input text-sm" value={project.sshKeepAlive} onChange={e => update('sshKeepAlive', e.target.value)} />
                  </Field>

                  <Checkbox
                    label="Enable retry on fail?"
                    hint="Enable a connection retry when the connection fails"
                    checked={project.sshRetryEnable}
                    onChange={e => update('sshRetryEnable', e.target.checked)}
                  />
                  <Field label="Number of retries" hint="Set retries limit in case the connection fail (just for Transport Exceptions)">
                    <input type="number" className="input text-sm" value={project.sshRetryNum} onChange={e => update('sshRetryNum', e.target.value)} />
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* 6. DEFAULT FILE COPIER */}
          {activeTab === 'Default File Copier' && (
            <div className="max-w-3xl">
              <p className="text-sm mb-6" style={{ color: 'var(--text)' }}>The File Copier is responsible for copying scripts as files to remote nodes before they are executed.</p>

              <div className="mb-8">
                <select
                  className="input text-sm w-64 bg-brand-500 text-white font-medium"
                  style={{ background: 'var(--brand)', borderColor: 'var(--brand)', color: '#fff' }}
                  value={project.fileCopier}
                  onChange={e => update('fileCopier', e.target.value)}
                >
                  <option value="Local">Local</option>
                  <option value="SCP">SCP</option>
                  <option value="Script Execution">Script Execution</option>
                  <option value="Ansible File Copier">Ansible File Copier</option>
                  <option value="Stub">Stub</option>
                  <option value="SSHJ-SCP">SSHJ-SCP</option>
                  <option value="WinRM Python File Copier">WinRM Python File Copier</option>
                  <option value="openssh / file-copier">openssh / file-copier</option>
                </select>
                <span className="ml-4 text-sm font-medium" style={{ color: 'var(--brand)' }}>Copies a script file to a remote node via {project.fileCopier.replace('SSHJ-SCP', 'SCP')}.</span>
              </div>

              {project.fileCopier === 'SSHJ-SCP' && (
                <div className="space-y-6 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  <Field label="SSH Key File path" hint="File Path to the SSH Key to use">
                    <input type="text" className="input text-sm" value={project.scpKeyFilePath} onChange={e => update('scpKeyFilePath', e.target.value)} />
                  </Field>
                  <Field label="SSH Key Storage Path" hint='Path to the SSH Key to use within Rundeck Storage. E.g. "keys/path/key1.pem"'>
                    <div className="flex gap-2">
                      <input type="text" className="input text-sm flex-1" value={project.scpKeyPath} onChange={e => update('scpKeyPath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="SSH Password Storage Path" hint='Path to the Password to use within Rundeck Storage. E.g. "keys/path/my.password". Can be overridden by a Node attribute named "ssh-password-storage-path".'>
                    <div className="flex gap-2">
                      <input type="text" className="input text-sm flex-1" value={project.scpPasswordPath} onChange={e => update('scpPasswordPath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="SSH Authentication" hint="Type of SSH Authentication to use">
                    <select className="input text-sm" value={project.scpAuthType} onChange={e => update('scpAuthType', e.target.value)}>
                      <option value="privateKey">privateKey</option>
                      <option value="password">password</option>
                    </select>
                  </Field>
                  <Field label="SSH Key Passphrase Storage Path" hint='Path to the key&apos;s Passphrase to use within Rundeck Storage. E.g. "keys/path/my.password". Can be overridden by a Node attribute named "ssh-key-passphrase-storage-path".'>
                    <div className="flex gap-2">
                      <input type="text" className="input text-sm flex-1" value={project.scpPassphrasePath} onChange={e => update('scpPassphrasePath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="Keep Alive Interval" hint="Keep Alive Interval">
                    <input type="text" className="input text-sm" value={project.scpKeepAlive} onChange={e => update('scpKeepAlive', e.target.value)} />
                  </Field>
                  <Field label="Number of retries" hint="Set retries limit in case the connection fail (just for Transport Exceptions)">
                    <input type="number" className="input text-sm" value={project.scpRetryNum} onChange={e => update('scpRetryNum', e.target.value)} />
                  </Field>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions (Visible on all tabs now) */}
        <div className="px-6 py-4 border-t flex items-center gap-3" style={{ borderColor: 'var(--border)', background: 'var(--surface-card)' }}>
          <button className="btn-secondary" onClick={() => navigate('/projects')}>
            Cancel
          </button>
          <button 
            className="px-6 py-2 rounded-lg text-sm font-bold bg-[#28a745] hover:bg-[#218838] text-white shadow-md transition-all disabled:opacity-50"
            onClick={handleCreate} 
            disabled={saving}
          >
            {saving ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}
