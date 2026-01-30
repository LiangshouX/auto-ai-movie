// 故事大纲节点类型定义
export interface OutlineNode {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  level: number;
  order: number;
}

// 故事大纲类型定义
export interface StoryOutline {
  id: string;
  projectId: string;
  title: string;
  content: string;
  structure: string;
  outlineNodes: OutlineNode[]; // JSON格式存储的节点
  createdAt: string; // ISO时间戳
  updatedAt: string; // ISO时间戳
}

// 用于创建/更新大纲的可选参数接口
export interface CreateOrUpdateStoryOutlineData {
  id?: string;
  projectId: string;
  title: string;
  content: string;
  structure: string;
  outlineNodes?: OutlineNode[];
}

// 用于API请求的章节数据接口
export interface StoryOutlineRequestData {
  id?: string;
  projectId: string;
  title: string;
  content: string;
  structure: string;
  outlineNodes?: OutlineNode[];
}

/**
 * 故事大纲数据类型定义
 * 对应后端 StoryOutlineDTO 类
 */
export const StoryOutlineType = {
  // 创建大纲实例
  create: (data: Partial<CreateOrUpdateStoryOutlineData> = {}): StoryOutline => ({
    id: data.id || '',
    projectId: data.projectId || '',
    title: data.title || '',
    content: data.content || '',
    structure: data.structure || '',
    outlineNodes: data.outlineNodes || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),

  // 转换为API请求体格式
  toRequestBody: (outline: StoryOutline): StoryOutlineRequestData => {
    return {
      id: outline.id,
      projectId: outline.projectId,
      title: outline.title,
      content: outline.content,
      structure: outline.structure,
      outlineNodes: outline.outlineNodes,
    };
  },

  // 从API响应创建实例
  fromApiResponse: (responseData: any): StoryOutline => {
    return {
      id: responseData.id,
      projectId: responseData.projectId,
      title: responseData.title,
      content: responseData.content,
      structure: responseData.structure,
      outlineNodes: responseData.outlineNodes || [],
      createdAt: responseData.createdAt,
      updatedAt: responseData.updatedAt
    };
  }
};