import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from './store/appStore'

import AppLayout      from './components/layout/AppLayout'
import ToastContainer from './components/ui/ToastContainer'

import LoginPage      from './pages/LoginPage'
import DashboardPage  from './pages/DashboardPage'
import JobsPage       from './pages/JobsPage'
import JobDetailPage  from './pages/JobDetailPage'
import ExecutionsPage from './pages/ExecutionsPage'
import SettingsPage   from './pages/SettingsPage'
import CreateJobPage  from './pages/CreateJobPage'
import UploadJobPage  from './pages/UploadJobPage'
import NodesPage      from './pages/NodesPage'
import CommandsPage   from './pages/CommandsPage'
import WebhooksPage   from './pages/WebhooksPage'
import ProjectsPage   from './pages/ProjectsPage'
import CreateProjectPage from './pages/CreateProjectPage'
import EditConfigurationPage from './pages/EditConfigurationPage'
import KeyStoragePage from './pages/KeyStoragePage'
import EditNodesPage  from './pages/EditNodesPage'
import AccessControlPage from './pages/AccessControlPage'
import ProjectSettingsPage from './pages/ProjectSettingsPage'
import EditReadmePage  from './pages/EditReadmePage'
import EditMotdPage   from './pages/EditMotdPage'
import SetupScmPage   from './pages/SetupScmPage'
import ExportArchivePage from './pages/ExportArchivePage'
import ImportArchivePage from './pages/ImportArchivePage'
import NotFoundPage from './pages/NotFoundPage'
import LandingPage from './pages/LandingPage'

function RequireAuth({ children }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  const theme = useAppStore((s) => s.theme)

  // Sync theme class to <html>
  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/projects"       element={<ProjectsPage />} />
          <Route path="/projects/create" element={<CreateProjectPage />} />
          <Route path="/dashboard"      element={<DashboardPage />} />
          <Route path="jobs"           element={<JobsPage />} />
          <Route path="jobs/create"    element={<CreateJobPage />} />
          <Route path="jobs/upload"    element={<UploadJobPage />} />
          <Route path="jobs/:id"       element={<JobDetailPage />} />
          <Route path="nodes"          element={<NodesPage />} />
          <Route path="commands"       element={<CommandsPage />} />
          <Route path="executions"     element={<ExecutionsPage />} />
          <Route path="webhooks"       element={<WebhooksPage />} />
          <Route path="settings"       element={<SettingsPage />} />
          <Route path="project-settings"   element={<ProjectSettingsPage />} />
          <Route path="project/configure"  element={<EditConfigurationPage />} />
          <Route path="project/keys"       element={<KeyStoragePage />} />
          <Route path="project/edit-nodes" element={<EditNodesPage />} />
          <Route path="project/acl"        element={<AccessControlPage />} />
          <Route path="project/readme"     element={<EditReadmePage />} />
          <Route path="project/motd"       element={<EditMotdPage />} />
          <Route path="project/scm"        element={<SetupScmPage />} />
          <Route path="project/export"     element={<ExportArchivePage />} />
          <Route path="project/import"     element={<ImportArchivePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer />
    </>
  )
}
