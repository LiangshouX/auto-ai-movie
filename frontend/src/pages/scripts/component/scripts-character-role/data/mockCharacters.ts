import { CharacterRole } from '../../../../../api/types/character-role-types.ts';

// Mock数据：基于提供的SQL示例创建的角色数据
export const mockCharacters: CharacterRole[] = [
  {
    id: '111111111111111',
    projectId: '07ca8285a4bfa47abd869415cf9fe404',
    name: '张三1',
    age: 10,
    gender: 'male',
    personalityTags: ['勇敢', '聪明'],
    roleInStory: '主角，一个勇敢的小男孩',
    skills: ['跑步', '攀爬'],
    characterSetting: '来自普通家庭的孩子，有着不平凡的梦想',
    characterRelationships: [
      {
        relatedCharacterId: '222222222222222',
        relatedCharacterName: '李四',
        relationshipType: 'friend',
        description: '最好的朋友，一起冒险'
      },
      {
        relatedCharacterId: '333333333333333',
        relatedCharacterName: '王老师',
        relationshipType: 'mentor',
        description: '学校的老师，给予指导和帮助'
      }
    ],
    createdAt: '2026-01-29T22:50:02Z',
    updatedAt: '2026-01-30T22:22:10Z'
  },
  {
    id: '222222222222222',
    projectId: '07ca8285a4bfa47abd869415cf9fe404',
    name: '李四',
    age: 11,
    gender: 'male',
    personalityTags: ['机智', '幽默'],
    roleInStory: '配角，张三的好朋友',
    skills: ['讲故事', '绘画'],
    characterSetting: '性格开朗，善于交际',
    characterRelationships: [
      {
        relatedCharacterId: '111111111111111',
        relatedCharacterName: '张三1',
        relationshipType: 'friend',
        description: '最好的朋友，形影不离'
      }
    ],
    createdAt: '2026-01-29T23:15:30Z',
    updatedAt: '2026-01-30T20:45:22Z'
  },
  {
    id: '333333333333333',
    projectId: '07ca8285a4bfa47abd869415cf9fe404',
    name: '王老师',
    age: 35,
    gender: 'female',
    personalityTags: ['温和', '智慧', '耐心'],
    roleInStory: '导师角色，引导主角成长',
    skills: ['教学', '心理咨询', '人生指导'],
    characterSetting: '经验丰富的教师，深受学生喜爱',
    characterRelationships: [
      {
        relatedCharacterId: '111111111111111',
        relatedCharacterName: '张三1',
        relationshipType: 'mentor',
        description: '关心学生的成长，给予人生指导'
      }
    ],
    createdAt: '2026-01-30T09:30:15Z',
    updatedAt: '2026-01-30T16:20:45Z'
  },
  {
    id: '444444444444444',
    projectId: '07ca8285a4bfa47abd869415cf9fe404',
    name: '小红',
    age: 9,
    gender: 'female',
    personalityTags: ['善良', '细心', '好奇'],
    roleInStory: '重要配角，带来新的视角',
    skills: ['观察力强', '手工制作'],
    characterSetting: '好奇心旺盛的女孩，总能发现别人注意不到的细节',
    characterRelationships: [
      {
        relatedCharacterId: '111111111111111',
        relatedCharacterName: '张三1',
        relationshipType: 'acquaintance',
        description: '同班同学，在一次活动中认识'
      },
      {
        relatedCharacterId: '222222222222222',
        relatedCharacterName: '李四',
        relationshipType: 'friend',
        description: '共同的兴趣爱好让她们成为好朋友'
      }
    ],
    createdAt: '2026-01-30T11:20:10Z',
    updatedAt: '2026-01-30T18:35:30Z'
  },
  {
    id: '555555555555555',
    projectId: '07ca8285a4bfa47abd869415cf9fe404',
    name: '校长',
    age: 50,
    gender: 'male',
    personalityTags: ['严肃', '公正', '有威严'],
    roleInStory: '权威角色，学校的重要决策者',
    skills: ['领导力', '决策制定', '危机处理'],
    characterSetting: '学校的最高管理者，以严格著称但内心关爱学生',
    characterRelationships: [
      {
        relatedCharacterId: '333333333333333',
        relatedCharacterName: '王老师',
        relationshipType: 'colleague',
        description: '同事关系，经常讨论教育问题'
      }
    ],
    createdAt: '2026-01-30T14:10:25Z',
    updatedAt: '2026-01-30T19:45:15Z'
  }
];

// 工具函数：根据ID查找角色
export const findCharacterById = (id: string): CharacterRole | undefined => {
  return mockCharacters.find(character => character.id === id);
};

// 工具函数：根据项目ID查找所有角色
export const findCharactersByProjectId = (projectId: string): CharacterRole[] => {
  return mockCharacters.filter(character => character.projectId === projectId);
};

// 工具函数：添加新角色
export const addCharacter = (character: Omit<CharacterRole, 'id' | 'createdAt' | 'updatedAt'>): CharacterRole => {
  const newCharacter: CharacterRole = {
    ...character,
    id: Date.now().toString(), // 简单的ID生成方式
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockCharacters.push(newCharacter);
  return newCharacter;
};

// 工具函数：更新角色
export const updateCharacter = (id: string, updates: Partial<CharacterRole>): CharacterRole | undefined => {
  const index = mockCharacters.findIndex(character => character.id === id);
  if (index !== -1) {
    mockCharacters[index] = {
      ...mockCharacters[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return mockCharacters[index];
  }
  return undefined;
};

// 工具函数：删除角色
export const deleteCharacter = (id: string): boolean => {
  const index = mockCharacters.findIndex(character => character.id === id);
  if (index !== -1) {
    mockCharacters.splice(index, 1);
    return true;
  }
  return false;
};