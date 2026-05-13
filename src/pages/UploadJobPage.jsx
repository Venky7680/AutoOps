import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { useAppStore } from '../store/appStore'

function RadioGroup({ options, value, onChange, name }) {
  return (
    <div className="flex flex-col gap-2 mt-2 mb-6">
      {options.map(opt => (
        <label key={opt.value} className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
          <input 
            type="radio" 
            name={name} 
            checked={value === opt.value} 
            onChange={() => onChange(opt.value)} 
            className="accent-brand-500 w-4 h-4 mt-0.5" 
          />
          <div>
            <span className="font-medium block">{opt.label}</span>
            {opt.hint && <span className="block mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>{opt.hint}</span>}
          </div>
        </label>
      ))}
    </div>
  )
}

export default function UploadJobPage() {
  const navigate = useNavigate()
  const activeProject = useAppStore((s) => s.activeProject)
  const addToast = useAppStore((s) => s.addToast)
  const [uploading, setUploading] = useState(false)
  
  const [form, setForm] = useState({
    file: null,
    format: 'xml',
    duplicate: 'update',
    uuids: 'preserve',
    validate: 'no_validate'
  })

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleUpload = async () => {
    setUploading(true)
    await new Promise(r => setTimeout(r, 800))
    addToast({ type: 'success', title: 'Job Uploaded', message: `Job definition uploaded successfully.` })
    navigate('/jobs')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Upload Job Definition to project <span className="uppercase text-brand-500">{activeProject}</span>
          </h2>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6">
          <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>Select a Jobs definition file.</label>
          <div className="flex items-center border rounded-lg bg-slate-50 dark:bg-slate-800/20 mb-6" style={{ borderColor: 'var(--border)' }}>
            <button className="bg-white dark:bg-slate-700 border-r px-3 py-2 text-sm font-medium" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Choose file</button>
            <span className="px-3 text-sm" style={{ color: 'var(--muted)' }}>No file chosen</span>
          </div>

          <RadioGroup 
            name="format"
            options={[
              {label: 'XML format', value: 'xml'},
              {label: 'YAML format', value: 'yaml'},
              {label: 'JSON format', value: 'json'}
            ]}
            value={form.format}
            onChange={v => update('format', v)}
          />

          <label className="block text-sm font-bold mt-4" style={{ color: 'var(--text)' }}>When a Job with the same name already exists:</label>
          <RadioGroup 
            name="duplicate"
            options={[
              {label: 'Update the existing Job', value: 'update'},
              {label: 'Skip the uploaded Job', value: 'skip'},
              {label: 'Always Create a new Job', value: 'create'}
            ]}
            value={form.duplicate}
            onChange={v => update('duplicate', v)}
          />

          <label className="block text-sm font-bold mt-4" style={{ color: 'var(--text)' }}>Imported Jobs:</label>
          <RadioGroup 
            name="uuids"
            options={[
              {label: 'Preserve UUIDs', hint: 'Preserve the imported Job UUIDs. Note: If a job with the same UUID exists in another project, the new job will not be imported.', value: 'preserve'},
              {label: 'Remove UUIDs', hint: 'Strip UUIDs from imported jobs.', value: 'remove'}
            ]}
            value={form.uuids}
            onChange={v => update('uuids', v)}
          />

          <label className="block text-sm font-bold mt-4" style={{ color: 'var(--text)' }}>Validate Referenced Jobs:</label>
          <RadioGroup 
            name="validate"
            options={[
              {label: 'Do not Validate', hint: 'Import referenced jobs without validating existence.', value: 'no_validate'},
              {label: 'Validate Referenced Jobs', hint: 'Throw errors when using a referenced job that does not exist.', value: 'validate'}
            ]}
            value={form.validate}
            onChange={v => update('validate', v)}
          />
        </div>
        
        {/* Footer Actions */}
        <div className="px-6 py-4 border-t flex items-center gap-3 bg-black/5" style={{ borderColor: 'var(--border)' }}>
          <button className="btn-secondary" onClick={() => navigate('/jobs')}>
            Cancel
          </button>
          <button className="btn-success px-6 flex items-center gap-2" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}
