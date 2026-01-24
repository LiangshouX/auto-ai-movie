package com.liangshou.movie.scripts.common.exceptions;

import com.liangshou.movie.scripts.common.enums.ErrorCodeEnum;
import lombok.Getter;

/**
 * 自定义业务异常类
 */
public class BizException extends RuntimeException {

    @Getter
    private final String code;
    private final String message;

    public BizException(ErrorCodeEnum errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    public BizException(ErrorCodeEnum errorCode, Throwable cause) {
        super(errorCode.getMessage(), cause);
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    public BizException(String code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public BizException(String message) {
        super(message);
        this.code = ErrorCodeEnum.BUSINESS_ERROR.getCode();
        this.message = message;
    }

    public BizException(String message, Throwable cause) {
        super(message, cause);
        this.code = ErrorCodeEnum.BUSINESS_ERROR.getCode();
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}