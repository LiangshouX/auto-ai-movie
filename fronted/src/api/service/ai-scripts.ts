// AI 剧本相关API
import apiClient from '../request.ts';
import {ApiUtils} from '../utils.ts';
import {API_ENDPOINTS} from '../constants.ts';
import { ScriptProject, CreateScriptProjectData, ProjectStatus } from '../types/project-types.ts';

// 项目管理接口
class ProjectService {
    // 创建项目
    async createProject(projectData: CreateScriptProjectData) {
        return ApiUtils.createResource(
            (data: CreateScriptProjectData) => apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, data),
            projectData
        );
    }

    // 根据ID获取项目
    async getProjectById(id: string) {
        return ApiUtils.getResource(
            (projectId: string) => apiClient.get(API_ENDPOINTS.PROJECTS.GET_BY_ID(projectId)),
            id
        );
    }

    // 获取所有项目
    async getAllProjects() {
        return ApiUtils.listResources(
            () => apiClient.get(API_ENDPOINTS.PROJECTS.GET_ALL)
        );
    }

    // 更新项目
    async updateProject(id: string, projectData: Partial<ScriptProject>) {
        return ApiUtils.updateResource(
            (projectId: string, data: Partial<ScriptProject>) => apiClient.put(API_ENDPOINTS.PROJECTS.UPDATE(projectId), data),
            id,
            projectData
        );
    }

    // 删除项目
    async deleteProject(id: string) {
        return ApiUtils.deleteResource(
            (projectId: string) => apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(projectId)),
            id
        );
    }

    // 更新项目主题
    async updateProjectTheme(id: string, theme: string) {
        return ApiUtils.updateResource(
            (projectId: string, data: { theme: string }) => apiClient.patch(API_ENDPOINTS.PROJECTS.UPDATE_THEME(projectId), data),
            id,
            {theme}
        );
    }

    // 更新项目摘要
    async updateProjectSummary(id: string, summary: string) {
        return ApiUtils.updateResource(
            (projectId: string, data: { summary: string }) => apiClient.patch(API_ENDPOINTS.PROJECTS.UPDATE_SUMMARY(projectId), data),
            id,
            {summary}
        );
    }

    // 更新项目状态
    async updateProjectStatus(id: string, status: ProjectStatus) {
        return ApiUtils.updateResource(
            (projectId: string, data: { status: ProjectStatus }) => apiClient.patch(API_ENDPOINTS.PROJECTS.UPDATE_STATUS(projectId), data),
            id,
            {status}
        );
    }
}

// 导出项目服务实例
export const projectApi = new ProjectService();

// 其他API服务可以按类似方式定义
// 例如：脚本服务、场景服务等