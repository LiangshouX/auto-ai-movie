import { projectApi } from "./ai-scripts.js";
import { ScriptProject, ProjectStatus } from "./types.js";
import apiClient, { ApiResponse } from './request.js';
import { ApiUtils, PaginatedResponse, ApiErrorHandler } from './utils.js';

export default {
    projectApi,
    ScriptProject,
    ProjectStatus,
    // 导出核心API工具
    apiClient,
    ApiResponse,
    ApiUtils,
    PaginatedResponse,
    ApiErrorHandler
}