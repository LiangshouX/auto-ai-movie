// 角色关系类型定义
export interface CharacterRelationship {
  relatedCharacterId: string;
  relationshipType: string;
  description: string;
}

// 角色类型定义
export interface CharacterRole {
  id: string;
  projectId: string;
  name: string;
  age?: number;
  gender?: string;
  personalityTags: string[];
  roleInStory: string;
  skills: string[];
  characterSetting: string;
  relationships: CharacterRelationship[];
  createdAt: string; // ISO时间戳
  updatedAt: string; // ISO时间戳
}

// 用于创建新角色的可选参数接口
export interface CreateCharacterRoleData {
  id?: string;
  projectId: string;
  name: string;
  age?: number;
  gender?: string;
  personalityTags?: string[];
  roleInStory: string;
  skills?: string[];
  characterSetting: string;
  relationships?: CharacterRelationship[];
}

// 角色相关的枚举类型
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  UNKNOWN = 'unknown'
}

export enum RelationshipType {
  FRIEND = 'friend',
  ENEMY = 'enemy',
  LOVER = 'lover',
  FAMILY = 'family',
  COLLEAGUE = 'colleague',
  ACQUAINTANCE = 'acquaintance',
  RIVAL = 'rival',
  MENTOR = 'mentor',
  PROTEGE = 'protege',
  OTHER = 'other'
}

// 工具函数：创建默认角色对象
export const createDefaultCharacterRole = (): CharacterRole => ({
  id: '',
  projectId: '',
  name: '',
  age: undefined,
  gender: '',
  personalityTags: [],
  roleInStory: '',
  skills: [],
  characterSetting: '',
  relationships: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// 工具函数：从数据创建角色对象
export const createCharacterRoleFromData = (data: Partial<CharacterRole>): CharacterRole => ({
  id: data.id || '',
  projectId: data.projectId || '',
  name: data.name || '',
  age: data.age,
  gender: data.gender || '',
  personalityTags: data.personalityTags || [],
  roleInStory: data.roleInStory || '',
  skills: data.skills || [],
  characterSetting: data.characterSetting || '',
  relationships: data.relationships || [],
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString()
});