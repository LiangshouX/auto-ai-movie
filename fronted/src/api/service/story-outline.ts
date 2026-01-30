// 故事大纲管理相关API
import apiClient from '../request.ts';
import {ApiUtils} from '../utils.ts';
import { StoryOutline, CreateOrUpdateStoryOutlineData } from '../types/outline-types.ts';

// 故事大纲服务接口
class StoryOutlineService {
  // 获取项目大纲
  // 从请求体中获取项目ID
  async getOutlineByProjectId(outlineData: { projectId: string }) {
    return ApiUtils.createResource(
      (data: { projectId: string }) => apiClient.post(`/api/v1/story-outline/get-by-project`, data),
      outlineData
    );
  }

  // 创建或更新项目大纲
  // 项目ID从请求体中获取
  async createOrUpdateOutline(outlineData: CreateOrUpdateStoryOutlineData) {
    return ApiUtils.createResource(
      (data: CreateOrUpdateStoryOutlineData) => apiClient.post(`/api/v1/story-outline`, data),
      outlineData
    );
  }

  // 更新项目大纲
  // 从请求体中获取大纲ID进行更新
  async updateOutline(outlineData: StoryOutline) {
    return ApiUtils.createResource(
      (data: StoryOutline) => apiClient.post(`/api/v1/story-outline/update`, data),
      outlineData
    );
  }

  // 删除项目大纲
  // 从请求体中获取大纲ID
  async deleteOutline(outlineData: { id: string }) {
    return ApiUtils.createResource(
      (data: { id: string }) => apiClient.post(`/api/v1/story-outline/delete`, data),
      outlineData
    );
  }
}

// 导出故事大纲服务实例
export const storyOutlineApi = new StoryOutlineService();