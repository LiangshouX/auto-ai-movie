package com.liangshou.movie.scripts.common.config.aimodelconfig.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Qwen模型配置属性类
 * 用于读取application.yaml中custom-model.qwen下的配置
 */
@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "custom-model.qwen")
public class QwenProperties {

    private String apiKey;
    private String model;
    private String baseUrl;
    private Double temperature;
}