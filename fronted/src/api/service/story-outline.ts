// 故事大纲管理相关API
import apiClient from '../request.ts';
import {ApiUtils} from '../utils.ts';
import { StoryOutline, CreateOrUpdateStoryOutlineData } from '../types/outline-types.ts';

// 故事大纲服务接口
class StoryOutlineService {
  // 获取项目大纲
  async getOutlineByProjectId(projectId: string) {
    return ApiUtils.getResource(
      (projId: string) => apiClient.get(`/api/v1/projects/${projId}/outline`),
      projectId
    );
  }

  // 创建或更新项目大纲
  async createOrUpdateOutline(projectId: string, outlineData: CreateOrUpdateStoryOutlineData) {
    return ApiUtils.createResource(
      (data: CreateOrUpdateStoryOutlineData) => apiClient.post(`/api/v1/projects/${projectId}/outline`, data),
      outlineData
    );
  }

  // 更新项目大纲
  async updateOutline(projectId: string, id: string, outlineData: Partial<StoryOutline>) {
    return ApiUtils.updateResource(
      (outlineId: string, data: Partial<StoryOutline>) => apiClient.put(`/api/v1/projects/${projectId}/outline/${outlineId}`, data),
      id,
      outlineData
    );
  }

  // 删除项目大纲
  async deleteOutline(projectId: string, id: string) {
    return ApiUtils.deleteResource(
      (outlineId: string) => apiClient.delete(`/api/v1/projects/${projectId}/outline/${outlineId}`),
      id
    );
  }
}

// 导出故事大纲服务实例
export const storyOutlineApi = new StoryOutlineService();