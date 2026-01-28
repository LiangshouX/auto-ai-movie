/**
 * API常量定义
 */

// API基础URL配置
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? '/api/v1' 
    : '/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// HTTP方法常量
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

// 常见HTTP状态码
export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// 项目状态常量（与后端保持一致）
export const PROJECT_STATUS = {
  CREATED: 'CREATED',
  DRAFT: 'DRAFT',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
  DELETED: 'DELETED'
};

// 错误消息映射
export const ERROR_MESSAGES = {
  [HTTP_STATUS.BAD_REQUEST]: '请求参数错误',
  [HTTP_STATUS.UNAUTHORIZED]: '未授权访问，请重新登录',
  [HTTP_STATUS.FORBIDDEN]: '权限不足，无法执行此操作',
  [HTTP_STATUS.NOT_FOUND]: '请求的资源不存在',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  NETWORK_ERROR: '网络连接失败',
  TIMEOUT_ERROR: '请求超时',
  DEFAULT_ERROR: '操作失败，请稍后重试'
};

// API端点路径
export const API_ENDPOINTS = {
  PROJECTS: {
    BASE: '/v1/projects',
    GET_ALL: '/v1/projects',
    CREATE: '/v1/projects',
    GET_BY_ID: (id: string): string => `/v1/projects/${id}`,
    UPDATE: (id: string): string => `/v1/projects/${id}`,
    DELETE: (id: string): string => `/v1/projects/${id}`,
    UPDATE_THEME: (id: string): string => `/v1/projects/${id}/theme`,
    UPDATE_SUMMARY: (id: string): string => `/v1/projects/${id}/summary`,
    UPDATE_STATUS: (id: string): string => `/v1/projects/${id}/status`
  }
};