package com.liangshou.movie.scripts.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import java.util.Map;

/**
 * AI剧本创作代理类
 */
@Component
public class AIScriptWritingAgent {

    @Autowired
    private ChatClient chatClient; // 直接注入ChatClient

    @Autowired
    @Qualifier("openAiChatModel")
    private ChatModel openAiChatModel;

    // 移除Azure OpenAI的引用
    /*
    @Autowired
    @Qualifier("azureOpenAiChatModel")
    private ChatModel azureOpenAiChatModel;
    */

    @Autowired
    @Qualifier("anthropicChatModel")
    private ChatModel anthropicChatModel;

    /**
     * 生成创意
     */
    public String generateCreative(String creativeRequest) {
        String prompt = "请根据以下请求生成创意：" + creativeRequest;
        return chatClient.prompt(prompt)
            .call()
            .content();
    }

    /**
     * 生成主题背景
     */
    public String generateTheme(String themeRequest) {
        String prompt = "请根据以下请求生成故事主题背景：" + themeRequest + 
                       "。输出格式应包含：主题名称、主题描述、核心概念、目标受众等信息。";
        return chatClient.prompt(prompt)
            .call()
            .content();
    }

    /**
     * 生成剧情梗概
     */
    public String generateSummary(String summaryRequest) {
        String prompt = "请根据以下信息生成剧情梗概：" + summaryRequest +
                       "。梗概应包括：故事主线、核心冲突、关键转折点、预期结局等要素。";
        return chatClient.prompt(prompt)
            .call()
            .content();
    }

    /**
     * 生成角色设计
     */
    public String generateCharacters(String characterRequest) {
        String prompt = "请根据以下要求设计角色：" + characterRequest +
                       "。角色信息应包括：姓名、年龄、性别、性格特点、技能、在故事中的作用、与其他角色的关系等。";
        return chatClient.prompt(prompt)
            .call()
            .content();
    }

    /**
     * 生成故事大纲
     */
    public String generateOutline(String outlineRequest) {
        String prompt = "请根据以下要求生成故事大纲：" + outlineRequest +
                       "。大纲应包括：故事结构（开端-发展-高潮-结尾 或 其他结构）、主要情节点、各章节简要内容、人物成长弧线等。";
        return chatClient.prompt(prompt)
            .call()
            .content();
    }

    /**
     * 生成章节内容
     */
    public String generateChapter(String chapterRequest) {
        String prompt = "请根据以下要求生成章节内容：" + chapterRequest +
                       "。内容应包括：章节标题、具体内容、人物对话、场景描写等。确保内容连贯且符合之前的故事发展。";
        return chatClient.prompt(prompt)
            .call()
            .content();
    }
    
    /**
     * 使用指定模型生成内容
     */
    public String generateWithSpecificModel(String prompt, String modelName) {
        ChatClient specificChatClient;
        ChatModel modelToUse = null;
        
        if ("openai".equalsIgnoreCase(modelName) && openAiChatModel != null) {
            modelToUse = openAiChatModel;
        } else if ("anthropic".equalsIgnoreCase(modelName) && anthropicChatModel != null) {
            modelToUse = anthropicChatModel;
        }
        
        if (modelToUse != null) {
            specificChatClient = ChatClient.create(modelToUse);
            return specificChatClient.prompt(prompt)
                .call()
                .content();
        } else {
            // 使用默认客户端
            return chatClient.prompt(prompt)
                .call()
                .content();
        }
    }
}