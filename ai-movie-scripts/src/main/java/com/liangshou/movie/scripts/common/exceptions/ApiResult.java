package com.liangshou.movie.scripts.common.exceptions;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.liangshou.movie.scripts.common.enums.ErrorCodeEnum;

import java.time.LocalDateTime;

/**
 * API统一响应结果类
 *
 * @param <T> 响应数据类型
 */
public class ApiResult<T> {

    /**
     * 响应时间戳
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    /**
     * 响应状态码
     */
    private String code;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    private ApiResult() {
        this.timestamp = LocalDateTime.now();
    }

    private ApiResult(T data) {
        this();
        this.code = ErrorCodeEnum.SUCCESS.getCode();
        this.message = ErrorCodeEnum.SUCCESS.getMessage();
        this.data = data;
    }

    private ApiResult(ErrorCodeEnum errorCode) {
        this();
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    private ApiResult(ErrorCodeEnum errorCode, String customMessage) {
        this();
        this.code = errorCode.getCode();
        this.message = customMessage;
    }

    private ApiResult(String code, String message) {
        this();
        this.code = code;
        this.message = message;
    }

    /**
     * 成功响应，带数据
     */
    public static <T> ApiResult<T> success(T data) {
        return new ApiResult<>(data);
    }

    /**
     * 成功响应，无数据
     */
    public static <T> ApiResult<T> success() {
        return new ApiResult<>((T) null);
    }

    /**
     * 失败响应，使用预定义错误码
     */
    public static <T> ApiResult<T> error(ErrorCodeEnum errorCode) {
        return new ApiResult<>(errorCode);
    }

    /**
     * 失败响应，使用预定义错误码和自定义消息
     */
    public static <T> ApiResult<T> error(ErrorCodeEnum errorCode, String customMessage) {
        return new ApiResult<>(errorCode, customMessage);
    }

    /**
     * 失败响应，使用自定义错误码和消息
     */
    public static <T> ApiResult<T> error(String code, String message) {
        return new ApiResult<>(code, message);
    }

    /**
     * 失败响应，从异常构建
     */
    public static <T> ApiResult<T> error(BizException exception) {
        return new ApiResult<>(exception.getCode(), exception.getMessage());
    }

    // Getters and Setters
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}