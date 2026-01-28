// 章节管理相关API
import apiClient from '../request.ts';
import {ApiUtils} from '../utils.ts';
import { ScriptChapter, CreateScriptChapterData } from '../types/chapter-types.ts';

// 章节服务接口
class ScriptChapterService {
  // 创建章节
  async createChapter(projectId: string, chapterData: CreateScriptChapterData) {
    return ApiUtils.createResource(
      (data: CreateScriptChapterData) => apiClient.post(`/api/v1/projects/${projectId}/chapters`, data),
      chapterData
    );
  }

  // 根据ID获取章节
  async getChapterById(projectId: string, id: string) {
    return ApiUtils.getResource(
      (chapterId: string) => apiClient.get(`/api/v1/projects/${projectId}/chapters/${chapterId}`),
      id
    );
  }

  // 获取项目的所有章节
  async getAllChapters(projectId: string) {
    return ApiUtils.listResources(
      () => apiClient.get(`/api/v1/projects/${projectId}/chapters`)
    );
  }

  // 根据章节号获取特定章节
  async getChapterByNumber(projectId: string, chapterNumber: number) {
    return ApiUtils.getResource(
      (num: number) => apiClient.get(`/api/v1/projects/${projectId}/chapters/number/${num}`),
      chapterNumber
    );
  }

  // 更新章节
  async updateChapter(projectId: string, id: string, chapterData: Partial<ScriptChapter>) {
    return ApiUtils.updateResource(
      (chapterId: string, data: Partial<ScriptChapter>) => apiClient.put(`/api/v1/projects/${projectId}/chapters/${chapterId}`, data),
      id,
      chapterData
    );
  }

  // 删除章节
  async deleteChapter(projectId: string, id: string) {
    return ApiUtils.deleteResource(
      (chapterId: string) => apiClient.delete(`/api/v1/projects/${projectId}/chapters/${chapterId}`),
      id
    );
  }
}

// 导出章节服务实例
export const scriptChapterApi = new ScriptChapterService();