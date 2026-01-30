// 章节管理相关API
import apiClient from '../request.ts';
import {ApiUtils} from '../utils.ts';
import { ScriptChapter, CreateScriptChapterData } from '../types/chapter-types.ts';

// 章节服务接口
class ScriptChapterService {
  // 创建章节
  async createChapter(chapterData: CreateScriptChapterData & { projectId: string }) {
    return ApiUtils.createResource(
      (data: CreateScriptChapterData & { projectId: string }) => apiClient.post(`/api/v1/script-chapter`, data),
      chapterData
    );
  }

  // 根据ID获取章节
  async getChapterById(chapterData: { id: string }) {
    return ApiUtils.createResource(
      (data: { id: string }) => apiClient.post(`/api/v1/script-chapter/get-by-id`, data),
      chapterData
    );
  }

  // 获取项目的所有章节
  async getAllChapters(chapterData: { projectId: string }) {
    return ApiUtils.createResource(
      (data: { projectId: string }) => apiClient.post(`/api/v1/script-chapter/list-by-project`, data),
      chapterData
    );
  }

  // 根据章节号获取特定章节
  async getChapterByNumber(chapterData: { projectId: string; chapterNumber: number }) {
    return ApiUtils.createResource(
      (data: { projectId: string; chapterNumber: number }) => apiClient.post(`/api/v1/script-chapter/list-by-project-and-number`, data),
      chapterData
    );
  }

  // 更新章节
  async updateChapter(chapterData: ScriptChapter) {
    return ApiUtils.createResource(
      (data: ScriptChapter) => apiClient.post(`/api/v1/script-chapter/update`, data),
      chapterData
    );
  }

  // 删除章节
  async deleteChapter(chapterData: { id: string }) {
    return ApiUtils.createResource(
      (data: { id: string }) => apiClient.post(`/api/v1/script-chapter/delete`, data),
      chapterData
    );
  }
}

// 导出章节服务实例
export const scriptChapterApi = new ScriptChapterService();