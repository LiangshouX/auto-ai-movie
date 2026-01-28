/**
 * 剧本项目数据传输对象类型定义
 * 对应后端 ScriptProjectDTO 类和 script_projects 表结构
 */
export const ScriptProject = {
  // 只保留默认值，用于初始化新项目
  create: (data = {}) => ({
    id: data.id || null,
    title: data.title || '',
    description: data.description || '',
    theme: data.theme || '',
    summary: data.summary || '',
    status: data.status || 'CREATED', // 默认状态
    authorId: data.authorId || null,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null
  }),

  // 验证项目数据的完整性
  validate: (project) => {
    const errors = [];
    
    if (project.title && project.title.length > 255) {
      errors.push('标题长度不能超过255个字符');
    }
    
    if (project.description && project.description.length > 65535) { // TEXT字段限制
      errors.push('描述长度不能超过65535个字符');
    }
    
    if (project.theme && project.theme.length > 65535) {
      errors.push('主题背景长度不能超过65535个字符');
    }
    
    if (project.summary && project.summary.length > 65535) {
      errors.push('剧情梗概长度不能超过65535个字符');
    }
    
    if (project.status && project.status.length > 50) {
      errors.push('状态长度不能超过50个字符');
    }
    
    if (project.authorId && project.authorId.length > 36) {
      errors.push('作者ID长度不能超过36个字符');
    }
    
    if (project.id && project.id.length > 36) {
      errors.push('项目ID长度不能超过36个字符');
    }
    
    return errors;
  },

  // 转换为API请求体格式
  toRequestBody: (project) => {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      theme: project.theme,
      summary: project.summary,
      status: project.status,
      authorId: project.authorId
    };
  },

  // 从API响应创建实例
  fromApiResponse: (responseData) => {
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

/**
 * 项目状态枚举
 */
export const ProjectStatus = {
  CREATED: 'CREATED',           // 已创建
  DRAFT: 'DRAFT',              // 草稿
  IN_PROGRESS: 'IN_PROGRESS',  // 进行中
  REVIEW: 'REVIEW',            // 审核中
  COMPLETED: 'COMPLETED',      // 已完成
  ARCHIVED: 'ARCHIVED',        // 已归档
  DELETED: 'DELETED'           // 已删除
};