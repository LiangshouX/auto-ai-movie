import {projectApi} from "./service/scripts-project.ts";
import {characterRoleApi} from "./service/character-role.ts";
import {scriptsEpisodeApi} from "./service/scripts-episode.ts";
import {scriptsOutlineApi} from "./service/scripts-outline.ts";
import apiClient, {ApiResponse} from './request';
import {ApiErrorHandler, ApiUtils, PaginatedResponse} from './utils';

// 导出所有类型定义
export * from './types/project-types';
export * from './types/character-role-types';
export * from './types/scripts-episode-types';
export * from './types/scripts-outline-types';

// 导出常量
export * from './constants';

export default {
    projectApi,
    characterRoleApi,
    scriptsEpisodeApi,
    scriptsOutlineApi,
    // 导出核心API工具
    apiClient,
    ApiResponse,
    ApiUtils,
    PaginatedResponse,
    ApiErrorHandler
}