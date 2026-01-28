/**
 * 剧本项目数据传输对象类型定义
 * 对应后端 ScriptProjectDTO 类和 script_projects 表结构
 */
export class ScriptProject {
  /**
   * @param {Object} data - 项目数据
   * @param {string} [data.id] - 项目唯一标识
   * @param {string} [data.title] - 剧本标题
   * @param {string} [data.description] - 剧本描述
   * @param {string} [data.theme] - 主题背景
   * @param {string} [data.summary] - 剧情梗概
   * @param {string} [data.status] - 项目状态
   * @param {string} [data.authorId] - 作者ID
   * @param {string} [data.createdAt] - 创建时间
   * @param {string} [data.updatedAt] - 更新时间
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.theme = data.theme || '';
    this.summary = data.summary || '';
    this.status = data.status || 'CREATED'; // 默认状态
    this.authorId = data.authorId || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  /**
   * 验证项目数据的完整性
   * @returns {Array<string>} 验证错误信息数组
   */
  validate() {
    const errors = [];
    
    if (this.title && this.title.length > 255) {
      errors.push('标题长度不能超过255个字符');
    }
    
    if (this.description && this.description.length > 65535) { // TEXT字段限制
      errors.push('描述长度不能超过65535个字符');
    }
    
    if (this.theme && this.theme.length > 65535) {
      errors.push('主题背景长度不能超过65535个字符');
    }
    
    if (this.summary && this.summary.length > 65535) {
      errors.push('剧情梗概长度不能超过65535个字符');
    }
    
    if (this.status && this.status.length > 50) {
      errors.push('状态长度不能超过50个字符');
    }
    
    if (this.authorId && this.authorId.length > 36) {
      errors.push('作者ID长度不能超过36个字符');
    }
    
    if (this.id && this.id.length > 36) {
      errors.push('项目ID长度不能超过36个字符');
    }
    
    return errors;
  }

  /**
   * 转换为API请求体格式
   * @returns {Object}
   */
  toRequestBody() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      theme: this.theme,
      summary: this.summary,
      status: this.status,
      authorId: this.authorId
    };
  }

  /**
   * 从API响应创建实例
   * @param {Object} responseData - API响应数据
   * @returns {ScriptProject}
   */
  static fromApiResponse(responseData) {
    return new ScriptProject({
      id: responseData.id,
      title: responseData.title,
      description: responseData.description,
      theme: responseData.theme,
      summary: responseData.summary,
      status: responseData.status,
      authorId: responseData.authorId,
      createdAt: responseData.createdAt,
      updatedAt: responseData.updatedAt
    });
  }
}

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