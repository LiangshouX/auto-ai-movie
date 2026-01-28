// 角色管理相关API
import apiClient from '../request.ts';
import {ApiUtils} from '../utils.ts';
import { CharacterRole, CreateCharacterRoleData } from '../types/character-role-types.ts';

// 角色服务接口
class CharacterRoleService {
  // 创建角色
  async createCharacter(projectId: string, characterData: CreateCharacterRoleData) {
    return ApiUtils.createResource(
      (data: CreateCharacterRoleData) => apiClient.post(`/api/v1/projects/${projectId}/characters`, data),
      characterData
    );
  }

  // 根据ID获取角色
  async getCharacterById(projectId: string, id: string) {
    return ApiUtils.getResource(
      (characterId: string) => apiClient.get(`/api/v1/projects/${projectId}/characters/${characterId}`),
      id
    );
  }

  // 获取项目的所有角色
  async getAllCharacters(projectId: string) {
    return ApiUtils.listResources(
      () => apiClient.get(`/api/v1/projects/${projectId}/characters`)
    );
  }

  // 更新角色
  async updateCharacter(projectId: string, id: string, characterData: Partial<CharacterRole>) {
    return ApiUtils.updateResource(
      (characterId: string, data: Partial<CharacterRole>) => apiClient.put(`/api/v1/projects/${projectId}/characters/${characterId}`, data),
      id,
      characterData
    );
  }

  // 删除角色
  async deleteCharacter(projectId: string, id: string) {
    return ApiUtils.deleteResource(
      (characterId: string) => apiClient.delete(`/api/v1/projects/${projectId}/characters/${characterId}`),
      id
    );
  }
}

// 导出角色服务实例
export const characterRoleApi = new CharacterRoleService();