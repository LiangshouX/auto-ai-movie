import { useState, useCallback } from 'react';
import api from '../api/index';
import { ScriptProject, CreateScriptProjectData, ProjectStatus } from '../api/types/project-types';

interface ApiOptions<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

/**
 * 通用API Hook，提供状态管理和错误处理
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 执行API调用的函数
   * @param apiCall - API调用函数
   * @param options - 选项配置
   * @param options.onSuccess - 成功回调
   * @param options.onError - 错误回调
   * @returns {Promise<any>} API响应数据
   */
  const execute = useCallback(async <T,>(apiCall: () => Promise<T>, options: ApiOptions<T> = {}) => {
    const { onSuccess, onError } = options;
    
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if ((response as any).success !== false) {
        if (onSuccess) {
          onSuccess(response);
        }
        return response;
      } else {
        throw new Error((response as any).message || '请求失败');
      }
    } catch (err: any) {
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

  const getAllProjects = useCallback(async (onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
    return execute(() => api.projectApi.getAllProjects(), { onSuccess, onError });
  }, [execute]);

  const createProject = useCallback(async (projectData: CreateScriptProjectData, onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
    return execute(() => api.projectApi.createProject(projectData), { onSuccess, onError });
  }, [execute]);

  const getProjectById = useCallback(async (id: string, onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
    return execute(() => api.projectApi.getProjectById(id), { onSuccess, onError });
  }, [execute]);

  const updateProject = useCallback(async (id: string, projectData: Partial<ScriptProject>, onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
    return execute(() => api.projectApi.updateProject(id, projectData), { onSuccess, onError });
  }, [execute]);

  const deleteProject = useCallback(async (id: string, onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
    return execute(() => api.projectApi.deleteProject(id), { onSuccess, onError });
  }, [execute]);

  const updateProjectTheme = useCallback(async (id: string, theme: string, onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
    return execute(() => api.projectApi.updateProjectTheme(id, theme), { onSuccess, onError });
  }, [execute]);

  const updateProjectSummary = useCallback(async (id: string, summary: string, onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
    return execute(() => api.projectApi.updateProjectSummary(id, summary), { onSuccess, onError });
  }, [execute]);

  const updateProjectStatus = useCallback(async (id: string, status: ProjectStatus, onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
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