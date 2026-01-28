import { ApiResponse } from './request';

/**
 * API请求工具函数
 */
export class ApiUtils {
  /**
   * 执行API请求并返回标准化响应
   * @param {Function} apiCall - API调用函数
   * @returns {Promise<ApiResponse>} 标准化响应
   */
  static async executeRequest(apiCall) {
    try {
      const result = await apiCall();
      return ApiResponse.success(result.data, '请求成功', result.status);
    } catch (error) {
      return ApiResponse.error(
        error.message || '请求失败',
        error.error || error,
        error.status
      );
    }
  }

  /**
   * 创建资源
   * @param {Function} createFn - 创建函数
   * @param {Object} data - 创建数据
   * @returns {Promise<ApiResponse>}
   */
  static async createResource(createFn, data) {
    return this.executeRequest(() => createFn(data));
  }

  /**
   * 获取单个资源
   * @param {Function} getFn - 获取函数
   * @param {string|number} id - 资源ID
   * @returns {Promise<ApiResponse>}
   */
  static async getResource(getFn, id) {
    return this.executeRequest(() => getFn(id));
  }

  /**
   * 获取资源列表
   * @param {Function} listFn - 列表函数
   * @param {Object} params - 查询参数
   * @returns {Promise<ApiResponse>}
   */
  static async listResources(listFn, params = {}) {
    return this.executeRequest(() => listFn(params));
  }

  /**
   * 更新资源
   * @param {Function} updateFn - 更新函数
   * @param {string|number} id - 资源ID
   * @param {Object} data - 更新数据
   * @returns {Promise<ApiResponse>}
   */
  static async updateResource(updateFn, id, data) {
    return this.executeRequest(() => updateFn(id, data));
  }

  /**
   * 删除资源
   * @param {Function} deleteFn - 删除函数
   * @param {string|number} id - 资源ID
   * @returns {Promise<ApiResponse>}
   */
  static async deleteResource(deleteFn, id) {
    return this.executeRequest(() => deleteFn(id));
  }

  /**
   * 批量操作
   * @param {Function} batchFn - 批量操作函数
   * @param {Array} ids - ID列表
   * @param {Object} data - 操作数据
   * @returns {Promise<ApiResponse>}
   */
  static async batchOperation(batchFn, ids, data = {}) {
    return this.executeRequest(() => batchFn({ ids, ...data }));
  }
}

/**
 * 分页数据包装类
 */
export class PaginatedResponse {
  constructor(items, pagination) {
    this.items = items;
    this.pagination = {
      page: pagination.page || 1,
      size: pagination.size || 10,
      total: pagination.total || 0,
      totalPages: Math.ceil(pagination.total / pagination.size),
      hasNext: (pagination.page || 1) < Math.ceil(pagination.total / (pagination.size || 10)),
      hasPrev: (pagination.page || 1) > 1
    };
  }

  static fromApiResponse(data, meta) {
    return new PaginatedResponse(data, meta);
  }
}

/**
 * 统一错误处理
 */
export class ApiErrorHandler {
  static handle(error, customMessages = {}) {
    const status = error.status || error.originalError?.response?.status;
    
    const defaultMessages = {
      400: '请求参数错误',
      401: '未授权访问，请重新登录',
      403: '权限不足，无法执行此操作',
      404: '请求的资源不存在',
      500: '服务器内部错误',
      default: '网络请求失败，请稍后重试'
    };

    const message = customMessages[status] || defaultMessages[status] || defaultMessages.default;
    
    console.error('API Error:', { status, message, error });
    
    return {
      success: false,
      message,
      status,
      error
    };
  }
}