import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Projects
      activeProject: '',
      projects: [],
      setActiveProject: (project) => set({ activeProject: project }),
      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((s) => ({ 
        projects: s.projects.includes(project) ? s.projects : [...s.projects, project] 
      })),

      // Theme
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        document.documentElement.className = next
      },

      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // Toasts
      toasts: [],
      addToast: (toast) => {
        const id = Date.now()
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
        setTimeout(() => get().removeToast(id), toast.duration || 4000)
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      
      // Notifications
      notifications: [
        { id: 1, type: 'success', title: 'Job Completed', body: 'AWS-EBS-Cleanup finished successfully in 2m 14s.', time: '2 min ago',  read: false },
        { id: 2, type: 'error',   title: 'Job Failed',    body: 'IAM-Access-Audit failed: connection timeout.', time: '18 min ago', read: false },
        { id: 3, type: 'info',    title: 'Node Added',    body: 'Node "prod-server-07" joined the AWS-AUTOMATION project.', time: '1 hr ago',  read: true },
        { id: 4, type: 'success', title: 'Webhook Fired', body: 'Webhook "deploy-trigger" executed successfully.', time: '3 hrs ago', read: true },
      ],
      markAllNotificationsRead: () => set((s) => ({ 
        notifications: s.notifications.map(n => ({ ...n, read: true })) 
      })),
      dismissNotification: (id) => set((s) => ({ 
        notifications: s.notifications.filter(n => n.id !== id) 
      })),
    }),
    {
      name: 'autoops-ui-store-v2',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        activeProject: state.activeProject,
        projects: state.projects,
        notifications: state.notifications,
      }),
    }
  )
)
