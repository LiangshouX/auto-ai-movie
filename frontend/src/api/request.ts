import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 根据环境变量设置 API 基础 URL
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/v1' // 生产环境使用相对路径，适用于前后端部署在同一域名下
    : '/api'; // 开发环境使用代理，Vite代理会将/api转发到http://localhost:8080/api

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 统一请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加认证token（如果存在）
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 统一响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回响应数据，保持一致的数据结构
    return {
      success: true,
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config
    };
  },
  (error: any) => {
    // 统一处理错误响应
    const errorResponse = {
      success: false,
      error: error.response?.data || error.message || '网络请求失败',
      status: error.response?.status || null,
      message: error.response?.data?.message || error.message || '请求失败',
      originalError: error
    };

    // 错误日志记录
    console.error('API Error:', errorResponse);
    
    // 可以在这里添加全局错误处理逻辑，比如：
    // - 登录过期处理
    // - 网络异常处理
    if (error.response?.status === 401) {
      // 处理未授权错误，跳转到登录页
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    return Promise.reject(errorResponse);
  }
);

export default apiClient;

// API响应结果包装类
export class ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  status?: number | null;

  constructor(success: boolean, data: T, message?: string, status?: number | null) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.status = status;
  }

  static success<T>(data: T, message = '请求成功', status?: number | null) {
    return new ApiResponse<T>(true, data, message, status);
  }

  static error(message = '请求失败', error: any = null, status?: number | null) {
    return new ApiResponse(false, error, message, status);
  }
}