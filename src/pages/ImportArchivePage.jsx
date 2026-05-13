import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'

function Section({ title, children }) {
  return (
    <div className="border rounded bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border)' }}>
      <div className="px-6 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">{title}</h3>
      </div>
      <div className="p-6 space-y-3">{children}</div>
    </div>
  )
}

function RadioPair({ name, val, setVal, optA, descA, optB, descB }) {
  return (
    <div className="space-y-3">
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="radio" name={name} checked={val === 'a'} onChange={() => setVal('a')} className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{optA}</span>
          {descA && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{descA}</p>}
        </div>
      </label>
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="radio" name={name} checked={val === 'b'} onChange={() => setVal('b')} className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{optB}</span>
          {descB && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{descB}</p>}
        </div>
      </label>
    </div>
  )
}

export default function ImportArchivePage() {
  const inputRef = useRef()
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)

  // All section states
  const [uuids, setUuids] = useState('a')            // preserve / remove
  const [executions, setExecutions] = useState('a')  // import all / do not
  const [config, setConfig] = useState('a')          // import / do not
  const [nodeSources, setNodeSources] = useState('a') // import / do not
  const [acl, setAcl] = useState('a')               // import / do not
  const [scm, setScm] = useState('a')               // import / do not
  const [refJobsVal, setRefJobsVal] = useState('a') // do not validate / validate
  const [webhooks, setWebhooks] = useState('a')     // import / do not
  const [webhookToken, setWebhookToken] = useState(false)

  const handleImport = async () => {
    if (!file) return
    setImporting(true)
    await new Promise(r => setTimeout(r, 1200))
    setImporting(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-fade-in pb-20">
      <div className="flex items-center gap-3 mb-2">
        <Upload size={22} className="text-slate-600 dark:text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Import Archive</h2>
      </div>

      {/* File Picker */}
      <div className="border rounded bg-white dark:bg-slate-900 shadow-sm p-5 space-y-3" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Choose a Rundeck archive</p>
        <div className="flex items-center gap-3">
          <input ref={inputRef} type="file" accept=".zip,.tar,.tar.gz,.rdproject" className="hidden" onChange={e => setFile(e.target.files[0] || null)} />
          <button
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1 border rounded text-sm font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Choose file
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">{file ? file.name : 'No file chosen'}</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Existing Jobs in this project that match imported Jobs (group and name match, or UUID matches) will be updated.</p>
      </div>

      {/* Imported Jobs */}
      <Section title="Imported Jobs">
        <RadioPair
          name="uuids"
          val={uuids} setVal={setUuids}
          optA="Preserve UUIDs"
          descA="Preserve the imported Job UUIDs. Note: If a job with the same UUID exists in another project, the new job will not be imported."
          optB="Remove UUIDs"
          descB="Strip UUIDs from imported jobs."
        />
      </Section>

      {/* Executions */}
      <Section title="Executions">
        <RadioPair
          name="executions"
          val={executions} setVal={setExecutions}
          optA="Import All"
          descA="Creates new Executions and History reports from the archive"
          optB="Do Not Import"
          descB="Does not import any Executions or History"
        />
      </Section>

      {/* Configuration */}
      <Section title="Configuration">
        <RadioPair
          name="config"
          val={config} setVal={setConfig}
          optA="Import Project Configuration"
          descA="Overwrites the project configuration with the properties stored in the archive."
          optB="Do Not Import"
          descB="Does not import the project configuration."
        />
      </Section>

      {/* Node Sources */}
      <Section title="Node Sources">
        <RadioPair
          name="nodeSources"
          val={nodeSources} setVal={setNodeSources}
          optA="Import Node Sources"
          descA="Overwrites the Node Sources with the properties stored in the archive."
          optB="Do Not Import"
          descB="Does not import the Node Sources."
        />
      </Section>

      {/* ACL Policies */}
      <Section title="ACL Policies">
        <RadioPair
          name="acl"
          val={acl} setVal={setAcl}
          optA="Import Project ACL Policies"
          descA="Imports any Project ACL Policies, overwriting policies with the same name."
          optB="Do Not Import"
          descB="Does not import ACL Policies."
        />
      </Section>

      {/* SCM */}
      <Section title="Scm">
        <RadioPair
          name="scm"
          val={scm} setVal={setScm}
          optA="Import Project SCM Configuration"
          descA="Import Project SCM Configuration unless the project has SCM configuration."
          optB="Do Not Import"
          descB="Does not import SCM Configuration."
        />
      </Section>

      {/* Referenced Jobs Validation */}
      <Section title="Referenced Jobs Validation">
        <RadioPair
          name="refJobsVal"
          val={refJobsVal} setVal={setRefJobsVal}
          optA="Do not Validate"
          descA="Import referenced jobs without validating existence."
          optB="Validate Referenced Jobs"
          descB="Throw errors when using a referenced job that does not exist."
        />
      </Section>

      {/* Webhooks */}
      <Section title="Webhooks">
        <RadioPair
          name="webhooks"
          val={webhooks} setVal={setWebhooks}
          optA="Import Webhooks"
          descA={null}
          optB="Do Not Import Webhooks"
          descB={null}
        />
        {webhooks === 'a' && (
          <div className="pl-6 pt-1 space-y-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={webhookToken}
                onChange={e => setWebhookToken(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded"
              />
              <div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Create and overwrite a new Webhook Auth Token</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Regenerate all webhook auth tokens. If unchecked only webhooks without defined auth tokens will have their auth tokens regenerated.</p>
              </div>
            </label>
          </div>
        )}
      </Section>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          className="px-3 py-1.5 border rounded text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          Cancel
        </button>
        <button
          onClick={handleImport}
          disabled={!file || importing}
          className="px-4 py-1.5 rounded text-sm font-bold bg-[#28a745] hover:bg-[#218838] text-white flex items-center gap-2 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {importing
            ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Importing…</>
            : done
            ? 'Imported!'
            : 'Import'
          }
        </button>
        {!file && <span className="text-xs text-slate-400">Please choose an archive file first.</span>}
      </div>
    </div>
  )
}
