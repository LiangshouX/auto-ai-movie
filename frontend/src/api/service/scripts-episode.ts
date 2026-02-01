// 桥段内容管理相关API
import apiClient from '../request.ts';
import {ApiUtils} from '../utils.ts';
import {
  BatchDeleteEpisodesData,
  CreateScriptEpisodeData,
  UpdateEpisodeContentData,
  UpdateEpisodeTitleData,
  UpdateScriptEpisodeData,
  UpdateWordCountData
} from '@/api';

// 桥段内容服务接口
class ScriptsEpisodeService {
  // 创建桥段内容
  async createEpisode(episodeData: CreateScriptEpisodeData) {
    return ApiUtils.createResource(
      (data: CreateScriptEpisodeData) => apiClient.post('/v1/episodes', data),
      episodeData
    );
  }

  // 根据ID获取桥段内容
  async getEpisodeById(episodeData: { id: string }) {
    return ApiUtils.createResource(
      (data: { id: string }) => apiClient.get(`/v1/episodes/${data.id}`),
      episodeData
    );
  }

  // 根据项目ID获取桥段内容
  async getEpisodesByProject(episodeData: { projectId: string }) {
    return ApiUtils.createResource(
      (data: { projectId: string }) => apiClient.get(`/v1/episodes/project/${data.projectId}`),
      episodeData
    );
  }

  // 根据章节ID获取桥段内容
  async getEpisodesByChapter(episodeData: { chapterId: string }) {
    return ApiUtils.createResource(
      (data: { chapterId: string }) => apiClient.get(`/v1/episodes/chapter/${data.chapterId}`),
      episodeData
    );
  }

  // 根据项目ID和章节ID获取桥段内容
  async getEpisodesByProjectAndChapter(episodeData: { projectId: string; chapterId: string }) {
    return ApiUtils.createResource(
      (data: { projectId: string; chapterId: string }) => 
        apiClient.get(`/v1/episodes/project/${data.projectId}/chapter/${data.chapterId}`),
      episodeData
    );
  }

  // 获取所有桥段内容
  async getAllEpisodes() {
    return ApiUtils.createResource(
      () => apiClient.get('/v1/episodes'),
      {}
    );
  }

  // 更新桥段内容
  async updateEpisode(episodeData: UpdateScriptEpisodeData) {
    return ApiUtils.createResource(
      (data: UpdateScriptEpisodeData) => apiClient.put(`/v1/episodes/${data.id}`, data),
      episodeData
    );
  }

  // 删除桥段内容
  async deleteEpisode(episodeData: { id: string }) {
    return ApiUtils.createResource(
      (data: { id: string }) => apiClient.delete(`/v1/episodes/${data.id}`),
      episodeData
    );
  }

  // 批量删除桥段内容
  async batchDeleteEpisodes(episodeData: BatchDeleteEpisodesData) {
    return ApiUtils.createResource(
      (data: BatchDeleteEpisodesData) => apiClient.delete('/v1/episodes/batch', { data }),
      episodeData
    );
  }

  // 更新桥段标题
  async updateEpisodeTitle(episodeData: { id: string; titleData: UpdateEpisodeTitleData }) {
    return ApiUtils.createResource(
      (data: { id: string; titleData: UpdateEpisodeTitleData }) => 
        apiClient.patch(`/v1/episodes/${data.id}/title`, data.titleData),
      episodeData
    );
  }

  // 更新桥段内容文本
  async updateEpisodeContent(episodeData: { id: string; contentData: UpdateEpisodeContentData }) {
    return ApiUtils.createResource(
      (data: { id: string; contentData: UpdateEpisodeContentData }) => 
        apiClient.patch(`/v1/episodes/${data.id}/content`, data.contentData),
      episodeData
    );
  }

  // 更新字数统计
  async updateWordCount(episodeData: { id: string; wordCountData: UpdateWordCountData }) {
    return ApiUtils.createResource(
      (data: { id: string; wordCountData: UpdateWordCountData }) => 
        apiClient.patch(`/v1/episodes/${data.id}/word-count`, data.wordCountData),
      episodeData
    );
  }
}

// 导出桥段内容服务实例
export const scriptsEpisodeApi = new ScriptsEpisodeService();