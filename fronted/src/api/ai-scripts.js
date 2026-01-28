// AI 剧本相关API
import apiClient from './request';
import { ApiUtils } from './utils';
import { API_ENDPOINTS } from './constants';

// 项目管理接口
class ProjectService {
  // 创建项目
  async createProject(projectData) {
    return ApiUtils.createResource(
      (data) => apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, data), 
      projectData
    );
  }

  // 根据ID获取项目
  async getProjectById(id) {
    return ApiUtils.getResource(
      (projectId) => apiClient.get(API_ENDPOINTS.PROJECTS.GET_BY_ID(projectId)), 
      id
    );
  }

  // 获取所有项目
  async getAllProjects() {
    return ApiUtils.listResources(
      () => apiClient.get(API_ENDPOINTS.PROJECTS.GET_ALL)
    );
  }

  // 更新项目
  async updateProject(id, projectData) {
    return ApiUtils.updateResource(
      (projectId, data) => apiClient.put(API_ENDPOINTS.PROJECTS.UPDATE(projectId), data), 
      id, 
      projectData
    );
  }

  // 删除项目
  async deleteProject(id) {
    return ApiUtils.deleteResource(
      (projectId) => apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(projectId)), 
      id
    );
  }

  // 更新项目主题
  async updateProjectTheme(id, theme) {
    return ApiUtils.updateResource(
      (projectId, data) => apiClient.patch(API_ENDPOINTS.PROJECTS.UPDATE_THEME(projectId), data), 
      id, 
      { theme }
    );
  }

  // 更新项目摘要
  async updateProjectSummary(id, summary) {
    return ApiUtils.updateResource(
      (projectId, data) => apiClient.patch(API_ENDPOINTS.PROJECTS.UPDATE_SUMMARY(projectId), data), 
      id, 
      { summary }
    );
  }

  // 更新项目状态
  async updateProjectStatus(id, status) {
    return ApiUtils.updateResource(
      (projectId, data) => apiClient.patch(API_ENDPOINTS.PROJECTS.UPDATE_STATUS(projectId), data), 
      id, 
      { status }
    );
  }
}

// 导出项目服务实例
export const projectApi = new ProjectService();

// 其他API服务可以按类似方式定义
// 例如：脚本服务、场景服务等