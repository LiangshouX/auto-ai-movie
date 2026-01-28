import {projectApi} from "./ai-scripts";
import apiClient, {ApiResponse} from './request';
import {ApiErrorHandler, ApiUtils, PaginatedResponse} from './utils';

export default {
    projectApi,
    // 导出核心API工具
    apiClient,
    ApiResponse,
    ApiUtils,
    PaginatedResponse,
    ApiErrorHandler
}