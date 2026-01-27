package com.liangshou.movie.scripts.common.config.aimodelconfig.modelclientconfig;

import com.liangshou.movie.scripts.common.config.aimodelconfig.properties.QwenProperties;
import jakarta.annotation.Resource;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QwenChatClientBean {

    @Resource
    private QwenProperties qwenProperties;

    @Bean
    public ChatClient qwenChatClient() {
        OpenAiApi api = OpenAiApi.builder()
                .apiKey(qwenProperties.getApiKey())
                .baseUrl(qwenProperties.getBaseUrl())
                .build();

        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .model(qwenProperties.getModel())
                .temperature(qwenProperties.getTemperature())
                .build();

        OpenAiChatModel openAiChatModel = OpenAiChatModel.builder()
                .openAiApi(api)
                .defaultOptions(options)
                .build();

        return ChatClient.builder(openAiChatModel).build();
    }
}