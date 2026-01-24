package com.liangshou.movie.scripts.common.config.aimodelconfig.modelclientconfig;

import org.springframework.context.annotation.Configuration;

/**
 * AI配置类 - 配置多源AI供应商
 * 
 * 注意：由于Spring AI 1.0.0-M6与Spring Boot 3.2.0可能存在兼容性问题，
 * 相关Bean配置暂时注释掉以避免factoryBeanObjectType错误
 */
@Configuration
public class AiConfig {

    // 暂时注释掉所有AI相关的Bean配置以避免factoryBeanObjectType错误
    // 等待Spring AI正式版发布后再启用
    
    /*
    @Value("${spring.ai.openai.api-key:#{null}}")
    private String openaiApiKey;

    @Value("${spring.ai.openai.base-url:https://api.openai.com}")
    private String openaiBaseUrl;

    @Value("${spring.ai.openai.chat.options.model:gpt-3.5-turbo}")
    private String openaiModel;

    // 注释掉Azure OpenAI相关配置
    /*
    @Value("${spring.ai.azure.openai.api-key:#{null}}")
    private String azureOpenaiApiKey;

    @Value("${spring.ai.azure.openai.endpoint:#{null}}")
    private String azureOpenaiEndpoint;

    // 注释掉所有Bean定义方法以解决factoryBeanObjectType错误
    */
}