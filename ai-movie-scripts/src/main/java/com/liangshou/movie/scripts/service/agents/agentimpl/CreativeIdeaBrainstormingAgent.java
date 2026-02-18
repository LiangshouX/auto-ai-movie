package com.liangshou.movie.scripts.service.agents.agentimpl;

import com.liangshou.movie.scripts.common.constants.PromptConstant;
import com.liangshou.movie.scripts.infrastructure.agentsupport.tools.tavily.TavilySearchTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Flux;

import java.util.List;

@Component
public class CreativeIdeaBrainstormingAgent {

    private final ChatClient chatClient;
    private final ChatMemory chatMemory;
    private final TavilySearchTool tavilySearchTool;

    public CreativeIdeaBrainstormingAgent(
            @Qualifier("qwenChatClient") ChatClient chatClient,
            ChatMemory chatMemory,
            TavilySearchTool tavilySearchTool) {
        this.chatClient = chatClient;
        this.chatMemory = chatMemory;
        this.tavilySearchTool = tavilySearchTool;
    }

    public String chat(String conversationId, String userMessage, boolean enableSearch) {
        if (!StringUtils.hasText(conversationId)) {
            throw new IllegalArgumentException("conversationId 不能为空");
        }
        if (!StringUtils.hasText(userMessage)) {
            throw new IllegalArgumentException("userMessage 不能为空");
        }

        String systemPrompt = PromptConstant.getCreativePrompt().render();
        List<Message> history = chatMemory.get(conversationId);

        ChatClient.ChatClientRequestSpec request = chatClient.prompt()
                .system(systemPrompt)
                .messages(history)
                .user(userMessage);
        if (enableSearch) {
            request = request.tools(tavilySearchTool);
        }

        String content = request.call().content();

        chatMemory.add(conversationId, List.of(
                new UserMessage(userMessage),
                new AssistantMessage(content)
        ));

        return content;
    }

    public Flux<String> chatStream(String conversationId, String userMessage, boolean enableSearch) {
        if (!StringUtils.hasText(conversationId)) {
            return Flux.error(new IllegalArgumentException("conversationId 不能为空"));
        }
        if (!StringUtils.hasText(userMessage)) {
            return Flux.error(new IllegalArgumentException("userMessage 不能为空"));
        }

        String systemPrompt = PromptConstant.getCreativePrompt().render();
        List<Message> history = chatMemory.get(conversationId);

        ChatClient.ChatClientRequestSpec request = chatClient.prompt()
                .system(systemPrompt)
                .messages(history)
                .user(userMessage);
        if (enableSearch) {
            request = request.tools(tavilySearchTool);
        }

        StringBuilder full = new StringBuilder();
        return request.stream()
                .content()
                .doOnNext(full::append)
                .doOnComplete(() -> chatMemory.add(conversationId, List.of(
                        new UserMessage(userMessage),
                        new AssistantMessage(full.toString())
                )));
    }

    public void clear(String conversationId) {
        if (!StringUtils.hasText(conversationId)) {
            throw new IllegalArgumentException("conversationId 不能为空");
        }
        chatMemory.clear(conversationId);
    }
}
