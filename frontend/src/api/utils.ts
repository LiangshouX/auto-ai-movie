import { ApiResponse } from './request';

interface PaginationMeta {
  page?: number;
  size?: number;
  total?: number;
}

interface PaginationResult {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface CustomMessages {
  [key: number]: string;
}

/**
 * API请求工具函数
 */
export class ApiUtils {
  /**
   * 执行API请求并返回标准化响应
   * @param apiCall - API调用函数
   * @returns {Promise<ApiResponse>} 标准化响应
   */
  static async executeRequest<T>(apiCall: () => Promise<any>): Promise<ApiResponse<T>> {
    try {
      const result = await apiCall();
      return ApiResponse.success<T>(result.data, '请求成功', result.status);
    } catch (error: any) {
      return ApiResponse.error(
        error.message || '请求失败',
        error.error || error,
        error.status
      );
    }
  }

  /**
   * 创建资源
   * @param createFn - 创建函数
   * @param data - 创建数据
   * @returns {Promise<ApiResponse>}
   */
  static async createResource<T>(createFn: (data: any) => Promise<any>, data: any): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(() => createFn(data));
  }

  /**
   * 获取单个资源
   * @param getFn - 获取函数
   * @param id - 资源ID
   * @returns {Promise<ApiResponse>}
   */
  static async getResource<T>(getFn: (id: string) => Promise<any>, id: string): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(() => getFn(id));
  }

  /**
   * 获取资源列表
   * @param listFn - 列表函数
   * @param params - 查询参数
   * @returns {Promise<ApiResponse>}
   */
  static async listResources<T>(listFn: (params?: any) => Promise<any>, params: any = {}): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(() => listFn(params));
  }

  /**
   * 更新资源
   * @param updateFn - 更新函数
   * @param id - 资源ID
   * @param data - 更新数据
   * @returns {Promise<ApiResponse>}
   */
  static async updateResource<T>(updateFn: (id: string, data: any) => Promise<any>, id: string, data: any): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(() => updateFn(id, data));
  }

  /**
   * 删除资源
   * @param deleteFn - 删除函数
   * @param id - 资源ID
   * @returns {Promise<ApiResponse>}
   */
  static async deleteResource<T>(deleteFn: (id: string) => Promise<any>, id: string): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(() => deleteFn(id));
  }

  /**
   * 批量操作
   * @param batchFn - 批量操作函数
   * @param ids - ID列表
   * @param data - 操作数据
   * @returns {Promise<ApiResponse>}
   */
  static async batchOperation<T>(batchFn: (payload: any) => Promise<any>, ids: string[], data: any = {}): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(() => batchFn({ ids, ...data }));
  }
}

/**
 * 分页数据包装类
 */
export class PaginatedResponse<T = any> {
  items: T[];
  pagination: PaginationResult;

  constructor(items: T[], pagination: PaginationMeta) {
    this.items = items;
    this.pagination = {
      page: pagination.page || 1,
      size: pagination.size || 10,
      total: pagination.total || 0,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.size || 10)),
      hasNext: (pagination.page || 1) < Math.ceil((pagination.total || 0) / (pagination.size || 10)),
      hasPrev: (pagination.page || 1) > 1
    };
  }

  static fromApiResponse<T>(data: T[], meta: PaginationMeta): PaginatedResponse<T> {
    return new PaginatedResponse<T>(data, meta);
  }
}

/**
 * 统一错误处理
 */
export class ApiErrorHandler {
  static handle(error: any, customMessages: CustomMessages = {}) {
    const status = error.status || error.originalError?.response?.status;
    
    const defaultMessages = {
      400: '请求参数错误',
      401: '未授权访问，请重新登录',
      403: '权限不足，无法执行此操作',
      404: '请求的资源不存在',
      500: '服务器内部错误',
      default: '网络请求失败，请稍后重试'
    };

    const message = customMessages[status as keyof CustomMessages] || (defaultMessages as any)[status] || defaultMessages.default;
    
    console.error('API Error:', { status, message, error });
    
    return {
      success: false,
      message,
      status,
      error
    };
  }
}