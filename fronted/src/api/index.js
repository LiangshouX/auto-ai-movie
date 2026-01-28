import {projectApi} from "./ai-scripts.js";
import apiClient, {ApiResponse} from './request.js';
import {ApiErrorHandler, ApiUtils, PaginatedResponse} from './utils.js';

export default {
    projectApi,
    // 导出核心API工具
    apiClient,
    ApiResponse,
    ApiUtils,
    PaginatedResponse,
    ApiErrorHandler
}