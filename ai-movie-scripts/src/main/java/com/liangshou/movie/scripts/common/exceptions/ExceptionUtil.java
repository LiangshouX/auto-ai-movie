package com.liangshou.movie.scripts.common.exceptions;

import com.liangshou.movie.scripts.common.enums.ErrorCodeEnum;

/**
 * 异常处理工具类
 */
@SuppressWarnings("unused")
public class ExceptionUtil {

    private ExceptionUtil() {
        // Do Nothing
    }

    /**
     * 抛出业务异常
     */
    public static void throwBusinessException(ErrorCodeEnum errorCode) {
        throw new BizException(errorCode);
    }

    /**
     * 抛出带自定义消息的业务异常
     */
    public static void throwBusinessException(ErrorCodeEnum errorCode, String customMessage) {
        throw new BizException(errorCode.getCode(), customMessage);
    }

    /**
     * 抛出带自定义错误码和消息的业务异常
     */
    public static void throwBusinessException(String code, String message) {
        throw new BizException(code, message);
    }

    /**
     * 抛出带异常原因的业务异常
     */
    public static void throwBusinessException(ErrorCodeEnum errorCode, Throwable cause) {
        throw new BizException(errorCode, cause);
    }

    /**
     * 根据条件抛出业务异常
     */
    public static void throwBusinessExceptionIf(boolean condition, ErrorCodeEnum errorCode) {
        if (condition) {
            throwBusinessException(errorCode);
        }
    }

    /**
     * 根据条件抛出带自定义消息的业务异常
     */
    public static void throwBusinessExceptionIf(boolean condition, ErrorCodeEnum errorCode, String customMessage) {
        if (condition) {
            throwBusinessException(errorCode, customMessage);
        }
    }

    /**
     * 根据条件抛出带自定义错误码和消息的业务异常
     */
    public static void throwBusinessExceptionIf(boolean condition, String code, String message) {
        if (condition) {
            throwBusinessException(code, message);
        }
    }

    /**
     * 获取业务异常实例但不抛出
     */
    public static BizException getBusinessException(ErrorCodeEnum errorCode) {
        return new BizException(errorCode);
    }

    /**
     * 获取带自定义消息的业务异常实例但不抛出
     */
    public static BizException getBusinessException(ErrorCodeEnum errorCode, String customMessage) {
        return new BizException(errorCode.getCode(), customMessage);
    }
}