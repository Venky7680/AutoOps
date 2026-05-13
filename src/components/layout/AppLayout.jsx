import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface)' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{
            background: 'var(--surface)',
            backgroundImage: 'radial-gradient(ellipse at 10% 10%, var(--brand-glow) 0%, transparent 55%)'
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
