import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const projectsApi = {
  list: () => api.get('/projects'),
  detail: (id) => api.get(`/project/${id}`),
  config: (id) => api.get(`/project/${id}/config`),
  updateConfig: (id, data) => api.put(`/project/${id}/config`, data),
  delete: (id) => api.delete(`/project/${id}`),
  readme: (id) => api.get(`/project/${id}/readme`),
  updateReadme: (id, content) => api.put(`/project/${id}/readme`, { content }),
}

export const jobsApi = {
  list: (project) => api.get(`/jobs`, { params: { project } }),
  run: (id) => api.post(`/job/${id}/run`),
  detail: (id) => api.get(`/job/${id}`),
  executions: (id, params) => api.get(`/job/${id}/executions`, { params }),
  create: (data) => api.post(`/jobs`, data),
}

export const executionsApi = {
  list: (project) => api.get('/executions', { params: { project } }),
  logs: (id) => api.get(`/logs/${id}`),
}

export const nodesApi = {
  list: (project) => api.get('/nodes', { params: { project } }),
}

export const keysApi = {
  list: (project) => api.get('/keys', { params: { project } }),
}

export const webhooksApi = {
  list: (project) => api.get('/webhooks', { params: { project } }),
}

export const authApi = {
  login: (creds) => api.post('/auth/login', creds),
}

export default api
