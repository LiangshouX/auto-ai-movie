// AI 剧本相关API
import axios from 'axios'

// 根据环境变量设置 API 基础 URL
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/v1' // 生产环境使用相对路径，适用于前后端部署在同一域名下
    : '/api' // 开发环境使用代理，Vite代理会将/api转发到http://localhost:8080/api

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器，用于添加认证token等
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error.response || error.message)
    return Promise.reject(error)
  }
)

// 项目管理接口
export const projectApi = {
  // 创建项目
  createProject: (projectData) => {
    return apiClient.post('/v1/projects', projectData)
  },

  // 根据ID获取项目
  getProjectById: (id) => {
    return apiClient.get(`/v1/projects/${id}`)
  },

  // 获取所有项目
  getAllProjects: () => {
    return apiClient.get('/v1/projects')
  },

  // 更新项目
  updateProject: (id, projectData) => {
    return apiClient.put(`/v1/projects/${id}`, projectData)
  },

  // 删除项目
  deleteProject: (id) => {
    return apiClient.delete(`/v1/projects/${id}`)
  },

  // 更新项目主题
  updateProjectTheme: (id, theme) => {
    return apiClient.patch(`/v1/projects/${id}/theme`, { theme })
  },

  // 更新项目摘要
  updateProjectSummary: (id, summary) => {
    return apiClient.patch(`/v1/projects/${id}/summary`, { summary })
  },

  // 更新项目状态
  updateProjectStatus: (id, status) => {
    return apiClient.patch(`/v1/projects/${id}/status`, { status })
  },
}