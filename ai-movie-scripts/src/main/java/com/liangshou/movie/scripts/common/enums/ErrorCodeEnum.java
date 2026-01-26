package com.liangshou.movie.scripts.common.enums;

import lombok.Getter;

/**
 * 错误码枚举类
 */
@Getter
@SuppressWarnings({"unused"})
public enum ErrorCodeEnum {
    // 通用错误码: SRP-COM-XXXX
    SUCCESS("SUC0000", "操作成功"),
    SYSTEM_ERROR("SRP-COM-1001", "系统内部错误"),
    PARAMETER_ERROR("SRP-COM-1002", "参数错误"),
    DATA_NOT_FOUND("SRP-COM-1003", "数据不存在"),
    REQUEST_METHOD_NOT_SUPPORTED("SRP-COM-1004", "请求方法不支持"),
    MEDIA_TYPE_NOT_SUPPORTED("SRP-COM-1005", "媒体类型不支持"),
    VALIDATE_FAILED("SRP-COM-1006", "参数校验失败"),
    UNAUTHORIZED("SRP-COM-1007", "未登录或登录已过期"),
    FORBIDDEN("SRP-COM-1008", "权限不足"),
    RESOURCE_NOT_FOUND("SRP-COM-1009", "资源不存在"),
    DUPLICATE_KEY("SRP-COM-1010", "数据重复"),
    BUSINESS_ERROR("SRP-COM-1011", "业务异常"),
    ILLEGAL_PARAMETER("SRP-COM-1012", "非法参数"),
    OPERATION_FAILED("SRP-COM-1013", "操作失败"),

    // 脚本项目相关错误码 : SRP-PRJ-XXXX
    PROJECT_NOT_FOUND("SRP-PRJ-1101", "项目不存在"),
    PROJECT_NAME_DUPLICATED("SRP-PRJ-1102", "项目名称重复"),
    PROJECT_CREATE_FAILED("SRP-PRJ-1103", "项目创建失败"),
    PROJECT_UPDATE_FAILED("SRP-PRJ-1104", "项目更新失败"),
    PROJECT_DELETE_FAILED("SRP-PRJ-1105", "项目删除失败"),

    // 角色相关错误码 : SRP-CHR-XXXX (修正前缀)
    CHARACTER_NOT_FOUND("SRP-CHR-2101", "角色不存在"),
    CHARACTER_NAME_DUPLICATED("SRP-CHR-2102", "角色名称重复"),
    CHARACTER_CREATE_FAILED("SRP-CHR-2103", "角色创建失败"),
    CHARACTER_UPDATE_FAILED("SRP-CHR-2104", "角色更新失败"),
    CHARACTER_DELETE_FAILED("SRP-CHR-2105", "角色删除失败"),

    // 剧情大纲相关错误码: SRP-OTL-XXXX
    OUTLINE_NOT_FOUND("SRP-OTL-3101", "剧情大纲不存在"),
    OUTLINE_CREATE_FAILED("SRP-OTL-3102", "剧情大纲创建失败"),
    OUTLINE_UPDATE_FAILED("SRP-OTL-3103", "剧情大纲更新失败"),
    OUTLINE_DELETE_FAILED("SRP-OTL-3104", "剧情大纲删除失败"),

    // 章节相关错误码 : SRP-CHP-XXXX (修正前缀)
    CHAPTER_NOT_FOUND("SRP-CHAP-4101", "章节不存在"),
    CHAPTER_CREATE_FAILED("SRP-CHAP-4102", "章节创建失败"),
    CHAPTER_UPDATE_FAILED("SRP-CHAP-4103", "章节更新失败"),
    CHAPTER_DELETE_FAILED("SRP-CHAP-4104", "章节删除失败"),

    // AI生成相关错误码 : SRP-AIG-XXXX
    AI_GENERATION_FAILED("SRP-AIG-5101", "AI生成失败"),
    AI_MODEL_CONFIG_ERROR("SRP-AIG-5102", "AI模型配置错误"),
    PROMPT_TEMPLATE_ERROR("SRP-AIG-5103", "提示词模板错误"),
    PROMPT_LOADER_ERROR("SRP-AIG-5104", "提示词加载错误"),

    // 数据访问相关错误码 : SRP-DAT-XXXX (修正前缀)
    DATABASE_ACCESS_ERROR("SRP-DAT-6001", "数据库访问错误"),
    DATA_INTEGRITY_VIOLATION("SRP-DAT-6002", "数据完整性约束违反"),
    CONNECTION_POOL_EXHAUSTED("SRP-DAT-6003", "连接池耗尽"),

    // 文件操作相关错误码 : SRP-FIL-XXXX (修正前缀)
    FILE_UPLOAD_FAILED("SRP-FIL-7001", "文件上传失败"),
    FILE_DOWNLOAD_FAILED("SRP-FIL-7002", "文件下载失败"),
    FILE_NOT_FOUND("SRP-FIL-7003", "文件不存在"),
    FILE_SIZE_EXCEEDED("SRP-FIL-7004", "文件大小超出限制"),
    UNSUPPORTED_FILE_TYPE("SRP-FIL-7005", "不支持的文件类型");

    private final String code;
    private final String message;

    ErrorCodeEnum(String code, String message) {
        this.code = code;
        this.message = message;
    }

}
