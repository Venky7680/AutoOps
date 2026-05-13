export default function ComingSoonPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in text-center p-8">
      <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center"
        style={{ background: 'var(--brand-glow)', border: '1px solid var(--border)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      </div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>{title}</h2>
      <p className="text-sm max-w-md" style={{ color: 'var(--muted)' }}>
        This page is currently under development. It will be available in a future release once backend API integration is complete.
      </p>
    </div>
  )
}
