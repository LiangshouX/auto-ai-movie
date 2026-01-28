// 项目状态枚举
export enum ProjectStatus {
  CREATED = 'CREATED',           // 已创建
  DRAFT = 'DRAFT',               // 草稿
  IN_PROGRESS = 'IN_PROGRESS',   // 进行中
  REVIEW = 'REVIEW',             // 审核中
  COMPLETED = 'COMPLETED',       // 已完成
  ARCHIVED = 'ARCHIVED',         // 已归档
  DELETED = 'DELETED'            // 已删除
}

// 项目类型定义
export interface ScriptProject {
  id: string | null;
  title: string;
  description: string;
  theme: string;
  summary: string;
  status: ProjectStatus;
  authorId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// 创建项目时的数据接口
export interface CreateScriptProjectData {
  id?: string | null;
  title?: string;
  description?: string;
  theme?: string;
  summary?: string;
  status?: ProjectStatus;
  authorId?: string | null;
}

// 用于API请求的项目数据接口
export interface ScriptProjectRequestData {
  id?: string;
  title: string;
  description: string;
  theme: string;
  summary: string;
  status: ProjectStatus;
  authorId?: string;
}

/**
 * 剧本项目数据传输对象类型定义
 * 对应后端 ScriptProjectDTO 类和 script_projects 表结构
 */
export const ScriptProjectType = {
  // 创建项目实例
  create: (data: Partial<CreateScriptProjectData> = {}): ScriptProject => <ScriptProject>({
    id: data.id || null,
    title: data.title || '',
    description: data.description || '',
    theme: data.theme || '',
    summary: data.summary || '',
    status: data.status || ProjectStatus.CREATED, // 默认状态
    authorId: data.authorId || null,
  }),

// 转换为API请求体格式
  toRequestBody: (project: ScriptProject): ScriptProjectRequestData => {
    return {
      id: project.id || undefined,
      title: project.title,
      description: project.description,
      theme: project.theme,
      summary: project.summary,
      status: project.status,
      authorId: project.authorId || undefined
    };
  },

  // 从API响应创建实例
  fromApiResponse: (responseData: any): ScriptProject => {
    return {
      id: responseData.id,
      title: responseData.title,
      description: responseData.description,
      theme: responseData.theme,
      summary: responseData.summary,
      status: responseData.status,
      authorId: responseData.authorId,
      createdAt: responseData.createdAt,
      updatedAt: responseData.updatedAt
    };
  }
};