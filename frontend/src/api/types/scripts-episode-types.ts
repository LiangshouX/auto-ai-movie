// 桥段内容管理类型定义

// 桥段内容数据传输对象
export interface ScriptEpisodeDTO {
  id: string;
  projectId: string;
  chapterId: string;
  episodeNumber: number;
  episodeTitle: string;
  episodeContent: string;
  wordCount: number;
  createdAt: string; // ISO时间戳
  updatedAt: string; // ISO时间戳
}

// 创建桥段内容的请求数据
export interface CreateScriptEpisodeData {
  projectId: string;
  chapterId: string;
  episodeNumber: number;
  episodeTitle: string;
  episodeContent: string;
  wordCount?: number;
}

// 更新桥段内容的请求数据
export interface UpdateScriptEpisodeData extends Partial<ScriptEpisodeDTO> {
  id: string;
}

// 更新桥段标题的请求数据
export interface UpdateEpisodeTitleData {
  episodeTitle: string;
}

// 更新桥段内容文本的请求数据
export interface UpdateEpisodeContentData {
  episodeContent: string;
}

// 更新字数统计的请求数据
export interface UpdateWordCountData {
  wordCount: number;
}

// 批量删除桥段的请求数据
export interface BatchDeleteEpisodesData {
  ids: string[];
}

// 查询参数类型
export interface EpisodeQueryParams {
  projectId?: string;
  chapterId?: string;
}

// 工具函数：创建默认桥段对象
export const createDefaultScriptEpisode = (): ScriptEpisodeDTO => ({
  id: '',
  projectId: '',
  chapterId: '',
  episodeNumber: 1,
  episodeTitle: '',
  episodeContent: '',
  wordCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// 工具函数：从数据创建桥段对象
export const createScriptEpisodeFromData = (data: Partial<ScriptEpisodeDTO>): ScriptEpisodeDTO => ({
  id: data.id || '',
  projectId: data.projectId || '',
  chapterId: data.chapterId || '',
  episodeNumber: data.episodeNumber || 1,
  episodeTitle: data.episodeTitle || '',
  episodeContent: data.episodeContent || '',
  wordCount: data.wordCount || 0,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString()
});

// 工具函数：计算字数
export const calculateWordCount = (content: string): number => {
  // 简单的字数统计，可以根据需要调整算法
  return content.replace(/\s+/g, '').length;
};