// 章节类型定义
export interface ScriptChapter {
  id: string;
  projectId: string;
  episodeId: string;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  createdAt: string; // ISO时间戳
  updatedAt: string; // ISO时间戳
}

// 用于创建新章节的可选参数接口
export interface CreateScriptChapterData {
  id?: string;
  projectId: string;
  episodeId: string;
  chapterNumber?: number;
  title: string;
  content: string;
  wordCount?: number;
}

// 用于API请求的章节数据接口
export interface ScriptChapterRequestData {
  id?: string;
  projectId: string;
  episodeId: string;
  chapterNumber?: number;
  title: string;
  content: string;
  wordCount?: number;
}

/**
 * 章节数据类型定义
 * 对应后端 ScriptChapterDTO 类
 */
export const ScriptChapterType = {
  // 创建章节实例
  create: (data: Partial<CreateScriptChapterData> = {}): ScriptChapter => ({
    id: data.id || '',
    projectId: data.projectId || '',
    episodeId: data.episodeId || '',
    chapterNumber: data.chapterNumber || 0,
    title: data.title || '',
    content: data.content || '',
    wordCount: data.wordCount || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),

  // 转换为API请求体格式
  toRequestBody: (chapter: ScriptChapter): ScriptChapterRequestData => {
    return {
      id: chapter.id,
      projectId: chapter.projectId,
      episodeId: chapter.episodeId,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      content: chapter.content,
      wordCount: chapter.wordCount,
    };
  },

  // 从API响应创建实例
  fromApiResponse: (responseData: any): ScriptChapter => {
    return {
      id: responseData.id,
      projectId: responseData.projectId,
      episodeId: responseData.episodeId,
      chapterNumber: responseData.chapterNumber,
      title: responseData.title,
      content: responseData.content,
      wordCount: responseData.wordCount,
      createdAt: responseData.createdAt,
      updatedAt: responseData.updatedAt
    };
  }
};