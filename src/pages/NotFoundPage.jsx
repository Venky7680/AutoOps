import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Compass } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--surface)' }}>
      <div className="text-center max-w-md px-6 animate-fade-in">
        {/* Graphic */}
        <div className="relative mx-auto mb-8 w-36 h-36">
          <div className="absolute inset-0 rounded-full" style={{ background: 'var(--brand-glow)', animation: 'pulse 3s ease-in-out infinite' }} />
          <div className="relative w-36 h-36 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}>
            <Compass size={56} style={{ color: 'var(--brand)' }} className="opacity-80" />
          </div>
        </div>

        {/* Error code */}
        <p className="text-8xl font-black mb-2 text-gradient leading-none">404</p>

        {/* Message */}
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>Page not found</h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>
          The page you're looking for doesn't exist or may have been moved.
          Check the URL or head back to a known destination.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={15} /> Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary flex items-center gap-2"
          >
            <Home size={15} /> Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
