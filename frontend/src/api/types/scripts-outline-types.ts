// 故事大纲管理类型定义

// 大纲桥段数据传输对象
export interface OutlineEpisodeDTO {
  episodeId: string;
  episodeTitle: string;
  episodeNumber: number;
}

// 大纲章节数据传输对象
export interface OutlineChapterDTO {
  chapterId: string;
  chapterTitle: string;
  chapterSummary: string;
  chapterNumber: number;
  episodeCount: number;
  wordCount: number;
  episodes: OutlineEpisodeDTO[];
  createdAt: string; // ISO时间戳
  updatedAt: string; // ISO时间戳
}

// 大纲章节结构数据传输对象
export interface OutlineSectionDTO {
  sectionId: string;
  sectionTitle: string;
  description: string;
  sequence: number;
  chapterCount: number;
  chapters: OutlineChapterDTO[];
  createdAt: string; // ISO时间戳
  updatedAt: string; // ISO时间戳
}

// 故事大纲数据传输对象
export interface StoryOutlineDTO {
  id: string;
  projectId: string;
  structureType: 'BEGINNING_RISING_ACTION_CLIMAX_END' | 'HOOK_RISE_CONTINUATION_TURN_CONCLUSION';
  sections: OutlineSectionDTO[];
  createdAt: string; // ISO时间戳
  updatedAt: string; // ISO时间戳
}

// 创建故事大纲的请求数据
export interface CreateStoryOutlineData {
  projectId: string;
  structureType: 'BEGINNING_RISING_ACTION_CLIMAX_END' | 'HOOK_RISE_CONTINUATION_TURN_CONCLUSION';
  sections?: OutlineSectionDTO[];
}

// 更新故事大纲的请求数据
export interface UpdateStoryOutlineData extends Partial<StoryOutlineDTO> {
  id: string;
}

// 更新大纲结构类型的请求数据
export interface UpdateStructureTypeData {
  structureType: 'BEGINNING_RISING_ACTION_CLIMAX_END' | 'HOOK_RISE_CONTINUATION_TURN_CONCLUSION';
}

// 更新大纲章节结构的请求数据
export interface UpdateSectionsData {
  sections: OutlineSectionDTO[];
}

// 查询参数类型
export interface OutlineQueryParams {
  projectId?: string;
}

// 结构类型枚举
export enum StructureType {
  BEGINNING_RISING_ACTION_CLIMAX_END = 'BEGINNING_RISING_ACTION_CLIMAX_END',
  HOOK_RISE_CONTINUATION_TURN_CONCLUSION = 'HOOK_RISE_CONTINUATION_TURN_CONCLUSION'
}

// 结构类型描述映射
export const STRUCTURE_TYPE_DESCRIPTIONS = {
  [StructureType.BEGINNING_RISING_ACTION_CLIMAX_END]: '起承转合结构',
  [StructureType.HOOK_RISE_CONTINUATION_TURN_CONCLUSION]: '钩子递进延续转折结局结构'
};

// 工具函数：创建默认故事大纲对象
export const createDefaultStoryOutline = (): StoryOutlineDTO => ({
  id: '',
  projectId: '',
  structureType: StructureType.BEGINNING_RISING_ACTION_CLIMAX_END,
  sections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// 工具函数：从数据创建故事大纲对象
export const createStoryOutlineFromData = (data: Partial<StoryOutlineDTO>): StoryOutlineDTO => ({
  id: data.id || '',
  projectId: data.projectId || '',
  structureType: data.structureType || StructureType.BEGINNING_RISING_ACTION_CLIMAX_END,
  sections: data.sections || [],
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString()
});

// 工具函数：创建默认章节结构对象
export const createDefaultOutlineSection = (): OutlineSectionDTO => ({
  sectionId: '',
  sectionTitle: '',
  description: '',
  sequence: 1,
  chapterCount: 0,
  chapters: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// 工具函数：创建默认章节对象
export const createDefaultOutlineChapter = (): OutlineChapterDTO => ({
  chapterId: '',
  chapterTitle: '',
  chapterSummary: '',
  chapterNumber: 1,
  episodeCount: 0,
  wordCount: 0,
  episodes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// 工具函数：创建默认桥段对象
export const createDefaultOutlineEpisode = (): OutlineEpisodeDTO => ({
  episodeId: '',
  episodeTitle: '',
  episodeNumber: 1
});