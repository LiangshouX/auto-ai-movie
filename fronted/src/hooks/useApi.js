import { useState, useCallback } from 'react';
import api from '../api/index.js';

/**
 * 通用API Hook，提供状态管理和错误处理
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 执行API调用的函数
   * @param {Function} apiCall - API调用函数
   * @param {Object} options - 选项配置
   * @param {Function} options.onSuccess - 成功回调
   * @param {Function} options.onError - 错误回调
   * @returns {Promise<any>} API响应数据
   */
  const execute = useCallback(async (apiCall, options = {}) => {
    const { onSuccess, onError } = options;
    
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (response.success) {
        if (onSuccess) {
          onSuccess(response.data);
        }
        return response.data;
      } else {
        throw new Error(response.message || '请求失败');
      }
    } catch (err) {
      const errorMessage = err.message || '请求失败';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute, setError };
};

/**
 * 专门用于项目管理的Hook
 */
export const useProjectApi = () => {
  const { loading, error, execute } = useApi();

  const getAllProjects = useCallback(async (onSuccess, onError) => {
    return execute(() => api.projectApi.getAllProjects(), { onSuccess, onError });
  }, [execute]);

  const createProject = useCallback(async (projectData, onSuccess, onError) => {
    return execute(() => api.projectApi.createProject(projectData), { onSuccess, onError });
  }, [execute]);

  const getProjectById = useCallback(async (id, onSuccess, onError) => {
    return execute(() => api.projectApi.getProjectById(id), { onSuccess, onError });
  }, [execute]);

  const updateProject = useCallback(async (id, projectData, onSuccess, onError) => {
    return execute(() => api.projectApi.updateProject(id, projectData), { onSuccess, onError });
  }, [execute]);

  const deleteProject = useCallback(async (id, onSuccess, onError) => {
    return execute(() => api.projectApi.deleteProject(id), { onSuccess, onError });
  }, [execute]);

  const updateProjectTheme = useCallback(async (id, theme, onSuccess, onError) => {
    return execute(() => api.projectApi.updateProjectTheme(id, theme), { onSuccess, onError });
  }, [execute]);

  const updateProjectSummary = useCallback(async (id, summary, onSuccess, onError) => {
    return execute(() => api.projectApi.updateProjectSummary(id, summary), { onSuccess, onError });
  }, [execute]);

  const updateProjectStatus = useCallback(async (id, status, onSuccess, onError) => {
    return execute(() => api.projectApi.updateProjectStatus(id, status), { onSuccess, onError });
  }, [execute]);

  return {
    // 状态
    loading,
    error,
    // 项目API方法
    getAllProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    updateProjectTheme,
    updateProjectSummary,
    updateProjectStatus
  };
};