import { useState, useEffect } from 'react'
import { Settings, Folder, Loader2, AlertCircle } from 'lucide-react'
import { projectsApi } from '../lib/api'
import { useAppStore } from '../store/appStore'

// Reusable UI Components adapted for Edit Configuration
function Field({ label, hint, children }) {
  return (
    <div className="mb-5">
      {label && <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</label>}
      {children}
      {hint && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{hint}</p>}
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
          className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-slate-600 bg-slate-50 dark:bg-slate-800"
        />
      </div>
      <div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">{label}</span>
        {hint && <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">{hint}</span>}
      </div>
    </label>
  )
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-4 mt-8 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
    </div>
  )
}

export default function EditConfigurationPage() {
  const activeProject = useAppStore((s) => s.activeProject)
  const addToast = useAppStore((s) => s.addToast)
  const [activeTab, setActiveTab] = useState('Details')
  const [loading, setLoading] = useState(true)
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
    execDisableTime: '0',
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
    uiHtml: true,

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

  useEffect(() => {
    loadProjectConfig()
  }, [activeProject])

  const loadProjectConfig = async () => {
    try {
      setLoading(true)
      const response = await projectsApi.config(activeProject)
      const configData = response.data || {}
      setProject(prev => ({
        ...prev,
        name: configData.name || activeProject,
        displayName: configData.displayName || '',
        description: configData.description || ''
      }))
      setLoading(false)
    } catch (err) {
      // Show default values instead of error for better UX
      setProject(prev => ({
        ...prev,
        name: activeProject,
        displayName: '',
        description: ''
      }))
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await projectsApi.updateConfig(activeProject, {
        name: project.name,
        displayName: project.displayName,
        description: project.description
      })
      addToast({ type: 'success', title: 'Configuration Saved', message: 'Project configuration updated successfully' })
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save configuration' })
    } finally {
      setSaving(false)
    }
  }

  const commonInputClass = "w-full bg-slate-50 dark:bg-slate-800/50 border rounded px-4 py-2 outline-none text-sm"
  const commonInputStyle = { borderColor: 'var(--border)', color: 'var(--text)' }

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
            <Settings size={28} className="text-slate-600 dark:text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Edit Configuration</h2>
          </div>

      <div className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-[22px] font-bold text-slate-600 dark:text-slate-300">Configure Project: {project.name}</h3>
          <button className="btn-secondary px-3 py-1.5 text-xs">
            Edit Configuration File
          </button>
        </div>

        <div className="px-6 border-b flex gap-6 overflow-x-auto hide-scrollbar" style={{ borderColor: 'var(--border)' }}>
          {['Details', 'Execution History Clean', 'Execution Mode', 'User Interface', 'Default Node Executor', 'Default File Copier'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-red-500 text-slate-800 dark:text-slate-200' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {/* 1. DETAILS */}
          {activeTab === 'Details' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Project Display Name</label>
                <input type="text" className={commonInputClass} style={commonInputStyle} value={project.displayName} onChange={e => update('displayName', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <input type="text" className={commonInputClass} style={commonInputStyle} value={project.description} onChange={e => update('description', e.target.value)} />
              </div>
            </div>
          )}

          {/* 2. EXECUTION HISTORY CLEAN */}
          {activeTab === 'Execution History Clean' && (
            <div className="max-w-5xl">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Execution History Clean:</h3>
              <Checkbox
                label="Enable"
                hint="Enable cleaner executions history"
                checked={project.historyCleanEnable}
                onChange={e => update('historyCleanEnable', e.target.checked)}
              />
              <div className={`mt-6 space-y-4 transition-opacity ${project.historyCleanEnable ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <Field label="Days to keep executions. Default: 60">
                  <input type="text" className={commonInputClass} style={commonInputStyle} value={project.historyCleanDays} onChange={e => update('historyCleanDays', e.target.value)} />
                </Field>
                <Field label="Minimum executions to keep. Default: 50">
                  <input type="text" className={commonInputClass} style={commonInputStyle} value={project.historyCleanMin} onChange={e => update('historyCleanMin', e.target.value)} />
                </Field>
                <Field label="Maximum size of the deletion. Default: 500">
                  <input type="text" className={commonInputClass} style={commonInputStyle} value={project.historyCleanMax} onChange={e => update('historyCleanMax', e.target.value)} />
                </Field>
                <Field
                  label="Schedule clean history job (Cron expression). Default: 0 0 0 1/1 * ? * (Every days on 12:00 AM)"
                  hint='Ranges: 1-3. Lists: 1,4,6. Increments: 0/15 "every 15 units starting at 0".'
                >
                  <div className="flex gap-2">
                    <input type="text" className={`${commonInputClass} flex-1`} style={commonInputStyle} value={project.historyCleanCron} onChange={e => update('historyCleanCron', e.target.value)} />
                    <select className={`${commonInputClass} w-64`} style={commonInputStyle} onChange={e => { if (e.target.value) update('historyCleanCron', e.target.value) }}>
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
            <div className="max-w-5xl">
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-1">Execution Mode</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Job execution and schedule configuration at project level.</p>

              <SectionHeading title="Enable/Disable Execution Now" />
              <div className="pl-6 space-y-4">
                <Checkbox label="Disable Execution" checked={project.execDisableNow} onChange={e => update('execDisableNow', e.target.checked)} />
                <Checkbox label="Disable Schedule" checked={project.schedDisableNow} onChange={e => update('schedDisableNow', e.target.checked)} />
              </div>

              <SectionHeading title="Enable/Disable Execution Later" />
              <div className="pl-6 space-y-4">
                <Checkbox label="Disable Execution Later" checked={project.execDisableLater} onChange={e => update('execDisableLater', e.target.checked)} />
                <div className="pl-8">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">Disable Execution after time</label>
                    <input type="text" className={commonInputClass} style={commonInputStyle} value={project.execDisableTime} onChange={e => update('execDisableTime', e.target.value)} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 ml-[185px]">Time to disable execution : 2h, 2m, 30s</p>
                </div>
              </div>

              <SectionHeading title="Enable/Disable Schedule Later" />
              <div className="pl-6 space-y-4">
                <Checkbox label="Disable Scheduled Later" checked={project.schedDisableLater} onChange={e => update('schedDisableLater', e.target.checked)} />
                <div className="pl-8">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">Disable Scheduled after Time</label>
                    <input type="text" className={commonInputClass} style={commonInputStyle} value={project.schedDisableTime} onChange={e => update('schedDisableTime', e.target.value)} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 ml-[195px]">Time to disable schedule : 2h, 2m, 30s</p>
                </div>
              </div>
            </div>
          )}

          {/* 4. USER INTERFACE */}
          {activeTab === 'User Interface' && (
            <div className="max-w-5xl">
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-1">User Interface</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Additional configuration for the user interface for this project</p>

              <div className="flex gap-8 mb-8">
                <div className="w-48 text-sm font-bold text-slate-700 dark:text-slate-300 text-right pt-0.5">Display the Project Readme</div>
                <div className="flex-1 space-y-1">
                  <Checkbox label="Projects List" checked={project.uiReadmeList} onChange={e => update('uiReadmeList', e.target.checked)} />
                  <Checkbox label="Project Home Page" checked={project.uiReadmeHome} onChange={e => update('uiReadmeHome', e.target.checked)} />
                </div>
              </div>

              <div className="flex gap-8 mb-8">
                <div className="w-48 text-sm font-bold text-slate-700 dark:text-slate-300 text-right pt-0.5">Display the Project MOTD</div>
                <div className="flex-1 space-y-1">
                  <Checkbox label="Projects List" checked={project.uiMotdList} onChange={e => update('uiMotdList', e.target.checked)} />
                  <Checkbox label="Project Home Page" checked={project.uiMotdHome} onChange={e => update('uiMotdHome', e.target.checked)} />
                  <Checkbox label="Navbar Indicator" checked={project.uiMotdNav} onChange={e => update('uiMotdNav', e.target.checked)} />
                  
                  <div className="pt-6">
                    <Checkbox
                      label="Allow Unsanitized HTML output"
                      checked={project.uiHtml}
                      onChange={e => update('uiHtml', e.target.checked)}
                    />
                    <a href="#" className="text-sm text-blue-600 hover:underline inline-block mb-2">Less</a>
                    <p className="text-sm text-slate-500 dark:text-slate-400">If enabled, and a command's log filter specifies the <code className="bg-red-50 text-red-500 px-1 py-0.5 rounded text-xs">no-strip</code> meta tag, the output from the command will not be run through the tag sanitizer. This option only works if the framework level property is also enabled.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-8 items-center">
                <div className="w-48 text-sm font-bold text-slate-700 dark:text-slate-300 text-right">Job Group Expansion Level</div>
                <div className="flex-1">
                  <input type="number" className={commonInputClass} style={commonInputStyle} value={project.uiJobExpansion} onChange={e => update('uiJobExpansion', e.target.value)} />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">In the Jobs page, expand Job groups to this depth by default. <a href="#" className="text-blue-600 hover:underline">More...</a></p>
                </div>
              </div>
            </div>
          )}

          {/* 5. DEFAULT NODE EXECUTOR */}
          {activeTab === 'Default Node Executor' && (
            <div className="max-w-5xl">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">The Node Executor is responsible for executing commands and scripts on remote nodes.</p>

              <div className="mb-8 flex items-center gap-4">
                <select
                  className="px-4 py-2 border rounded font-medium text-sm outline-none"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-card)', color: 'var(--text)' }}
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
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Node Executor using {project.nodeExecutor.replace('SSHJ-SSH', 'SSHJ library')}</span>
              </div>

              {project.nodeExecutor === 'SSHJ-SSH' && (
                <div className="space-y-6 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  <Field label="SSH Password Storage Path" hint='Path to the Password to use within Rundeck Storage. E.g. "keys/path/my.password". Can be overridden by a Node attribute named "ssh-password-storage-path".'>
                    <div className="flex gap-2">
                      <input type="text" className={`${commonInputClass} flex-1`} style={commonInputStyle} value={project.sshPasswordPath} onChange={e => update('sshPasswordPath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="SSH Authentication" hint="Type of SSH Authentication to use">
                    <select className={commonInputClass} style={commonInputStyle} value={project.sshAuthType} onChange={e => update('sshAuthType', e.target.value)}>
                      <option value="privateKey">privateKey</option>
                      <option value="password">password</option>
                    </select>
                  </Field>
                  <Field label="SSH Key File path" hint="File Path to the SSH Key to use">
                    <input type="text" className={commonInputClass} style={commonInputStyle} value={project.sshKeyFilePath} onChange={e => update('sshKeyFilePath', e.target.value)} />
                  </Field>
                  <Field label="SSH Key Storage Path" hint='Path to the SSH Key to use within Rundeck Storage. E.g. "keys/path/key1.pem"'>
                    <div className="flex gap-2">
                      <input type="text" className={`${commonInputClass} flex-1`} style={commonInputStyle} value={project.sshKeyPath} onChange={e => update('sshKeyPath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="SSH Key Passphrase Storage Path" hint='Path to the key&apos;s Passphrase to use within Rundeck Storage. Can be overridden by a Node attribute named "ssh-key-passphrase-storage-path".'>
                    <div className="flex gap-2">
                      <input type="text" className={`${commonInputClass} flex-1`} style={commonInputStyle} value={project.sshPassphrasePath} onChange={e => update('sshPassphrasePath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="Keep Alive Interval" hint="Keep Alive Interval">
                    <input type="text" className={commonInputClass} style={commonInputStyle} value={project.sshKeepAlive} onChange={e => update('sshKeepAlive', e.target.value)} />
                  </Field>

                  <Checkbox
                    label="Enable retry on fail?"
                    hint="Enable a connection retry when the connection fails"
                    checked={project.sshRetryEnable}
                    onChange={e => update('sshRetryEnable', e.target.checked)}
                  />
                  <Field label="Number of retries" hint="Set retries limit in case the connection fail (just for Transport Exceptions)">
                    <input type="number" className={commonInputClass} style={commonInputStyle} value={project.sshRetryNum} onChange={e => update('sshRetryNum', e.target.value)} />
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* 6. DEFAULT FILE COPIER */}
          {activeTab === 'Default File Copier' && (
            <div className="max-w-5xl">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">The File Copier is responsible for copying scripts as files to remote nodes before they are executed.</p>

              <div className="mb-8 flex items-center gap-4">
                <select
                  className="px-4 py-2 border rounded font-medium text-sm outline-none"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-card)', color: 'var(--text)' }}
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
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Copies a script file to a remote node via {project.fileCopier.replace('SSHJ-SCP', 'SCP')}.</span>
              </div>

              {project.fileCopier === 'SSHJ-SCP' && (
                <div className="space-y-6 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  <Field label="SSH Key File path" hint="File Path to the SSH Key to use">
                    <input type="text" className={commonInputClass} style={commonInputStyle} value={project.scpKeyFilePath} onChange={e => update('scpKeyFilePath', e.target.value)} />
                  </Field>
                  <Field label="SSH Key Storage Path" hint='Path to the SSH Key to use within Rundeck Storage. E.g. "keys/path/key1.pem"'>
                    <div className="flex gap-2">
                      <input type="text" className={`${commonInputClass} flex-1`} style={commonInputStyle} value={project.scpKeyPath} onChange={e => update('scpKeyPath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="SSH Password Storage Path" hint='Path to the Password to use within Rundeck Storage. E.g. "keys/path/my.password". Can be overridden by a Node attribute named "ssh-password-storage-path".'>
                    <div className="flex gap-2">
                      <input type="text" className={`${commonInputClass} flex-1`} style={commonInputStyle} value={project.scpPasswordPath} onChange={e => update('scpPasswordPath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="SSH Authentication" hint="Type of SSH Authentication to use">
                    <select className={commonInputClass} style={commonInputStyle} value={project.scpAuthType} onChange={e => update('scpAuthType', e.target.value)}>
                      <option value="privateKey">privateKey</option>
                      <option value="password">password</option>
                    </select>
                  </Field>
                  <Field label="SSH Key Passphrase Storage Path" hint='Path to the key&apos;s Passphrase to use within Rundeck Storage. E.g. "keys/path/my.password". Can be overridden by a Node attribute named "ssh-key-passphrase-storage-path".'>
                    <div className="flex gap-2">
                      <input type="text" className={`${commonInputClass} flex-1`} style={commonInputStyle} value={project.scpPassphrasePath} onChange={e => update('scpPassphrasePath', e.target.value)} />
                      <button className="btn-secondary whitespace-nowrap flex items-center gap-1.5">Select... <Folder size={14} /></button>
                    </div>
                  </Field>
                  <Field label="Keep Alive Interval" hint="Keep Alive Interval">
                    <input type="text" className={commonInputClass} style={commonInputStyle} value={project.scpKeepAlive} onChange={e => update('scpKeepAlive', e.target.value)} />
                  </Field>
                  <Field label="Number of retries" hint="Set retries limit in case the connection fail (just for Transport Exceptions)">
                    <input type="number" className={commonInputClass} style={commonInputStyle} value={project.scpRetryNum} onChange={e => update('scpRetryNum', e.target.value)} />
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons (Rendered at the bottom of the active tab) */}
          <div className="pt-6 mt-4 flex gap-2">
            <button className="btn-secondary px-4 py-1.5">Cancel</button>
            <button 
              className="px-4 py-1.5 rounded text-sm font-medium bg-[#28a745] hover:bg-[#218838] text-white shadow-sm transition-colors disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>

        </div>
      </div>
        </>
      )}
    </div>
  )
}
