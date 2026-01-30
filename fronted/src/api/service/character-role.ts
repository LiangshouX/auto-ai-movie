// 角色管理相关API
import apiClient from '../request.ts';
import {ApiUtils} from '../utils.ts';
import { CharacterRole, CreateCharacterRoleData } from '../types/character-role-types.ts';

// 角色服务接口
class CharacterRoleService {
  // 创建角色
  async createCharacter(characterData: CreateCharacterRoleData & { projectId: string }) {
    return ApiUtils.createResource(
      (data: CreateCharacterRoleData & { projectId: string }) => apiClient.post(`/v1/characters`, data),
      characterData
    );
  }

  // 根据ID获取角色
  async getCharacterById(characterData: { id: string }) {
    return ApiUtils.createResource(
      (data: { id: string }) => apiClient.post(`/v1/characters/get-by-id`, data),
      characterData
    );
  }

  // 获取项目的所有角色
  async getAllCharacters(characterData: { projectId: string }) {
    return ApiUtils.createResource(
      (data: { projectId: string }) => apiClient.post(`/v1/characters/list-by-project`, data),
      characterData
    );
  }

  // 更新角色
  async updateCharacter(characterData: CharacterRole) {
    return ApiUtils.createResource(
      (data: CharacterRole) => apiClient.post(`/v1/characters/update`, data),
      characterData
    );
  }

  // 删除角色
  async deleteCharacter(characterData: { id: string }) {
    return ApiUtils.createResource(
      (data: { id: string }) => apiClient.post(`/v1/characters/delete`, data),
      characterData
    );
  }
}

// 导出角色服务实例
export const characterRoleApi = new CharacterRoleService();