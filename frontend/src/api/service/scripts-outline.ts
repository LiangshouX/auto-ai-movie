// 故事大纲管理相关API
import apiClient from '../request.ts';
import {ApiUtils} from '../utils.ts';
import {
  CreateStoryOutlineData,
  UpdateSectionsData,
  UpdateStoryOutlineData,
  UpdateStructureTypeData
} from '@/api';

const sanitizeSections = (sections: any[]) =>
  (sections || []).map((section) => {
    const { createdAt: _createdAt, updatedAt: _updatedAt, ...sectionRest } = section || {};
    return {
      ...sectionRest,
      chapters: (sectionRest.chapters || []).map((chapter: any) => {
        const { createdAt: _cAt, updatedAt: _uAt, ...chapterRest } = chapter || {};
        return {
          ...chapterRest,
          episodes: (chapterRest.episodes || []).map((episode: any) => {
            const { createdAt: _eAt, updatedAt: _eUt, ...episodeRest } = episode || {};
            return episodeRest;
          })
        };
      })
    };
  });

const sanitizeCreateOutline = (data: CreateStoryOutlineData) => {
  if (!data?.sections) return data;
  return {
    ...data,
    sections: sanitizeSections(data.sections as any[])
  };
};

// 故事大纲服务接口
class ScriptsOutlineService {
  // 创建故事大纲
  async createOutline(outlineData: CreateStoryOutlineData) {
    return ApiUtils.createResource(
      (data: CreateStoryOutlineData) => apiClient.post('/v1/outlines', sanitizeCreateOutline(data)),
      outlineData
    );
  }

  // 根据ID获取故事大纲
  async getOutlineById(outlineData: { id: string }) {
    return ApiUtils.createResource(
      (data: { id: string }) => apiClient.get(`/v1/outlines/${data.id}`),
      outlineData
    );
  }

  // 根据项目ID获取故事大纲
  async getOutlineByProject(outlineData: { projectId: string }) {
    return ApiUtils.createResource(
      (data: { projectId: string }) => apiClient.get(`/v1/outlines/project/${data.projectId}`),
      outlineData
    );
  }

  // 获取所有故事大纲
  async getAllOutlines() {
    return ApiUtils.createResource(
      () => apiClient.get('/v1/outlines'),
      {}
    );
  }

  // 更新故事大纲
  async updateOutline(outlineData: UpdateStoryOutlineData) {
    return ApiUtils.createResource(
      (data: UpdateStoryOutlineData) => apiClient.put(`/v1/outlines/${data.id}`, data),
      outlineData
    );
  }

  // 删除故事大纲
  async deleteOutline(outlineData: { id: string }) {
    return ApiUtils.createResource(
      (data: { id: string }) => apiClient.delete(`/v1/outlines/${data.id}`),
      outlineData
    );
  }

  // 更新大纲结构类型
  async updateStructureType(outlineData: { id: string; structureTypeData: UpdateStructureTypeData }) {
    return ApiUtils.createResource(
      (data: { id: string; structureTypeData: UpdateStructureTypeData }) => 
        apiClient.patch(`/v1/outlines/${data.id}/structure-type`, data.structureTypeData),
      outlineData
    );
  }

  // 更新大纲章节结构
  async updateSections(outlineData: UpdateSectionsData) {
    return ApiUtils.createResource(
      (data: UpdateSectionsData) => 
        apiClient.post('/v1/outlines/sections', { ...data, sections: sanitizeSections(data.sections as any[]) }),
      outlineData
    );
  }
}

// 导出故事大纲服务实例
export const scriptsOutlineApi = new ScriptsOutlineService();
