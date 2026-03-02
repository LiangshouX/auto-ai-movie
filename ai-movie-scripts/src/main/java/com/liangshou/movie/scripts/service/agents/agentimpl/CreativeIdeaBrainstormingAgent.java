package com.liangshou.movie.scripts.service.agents.agentimpl;

import com.liangshou.movie.scripts.common.constants.PromptConstant;
import com.liangshou.movie.scripts.infrastructure.mongo.conversation.ConversationMemoryDocument;
import com.liangshou.movie.scripts.service.conversation.ConversationService;
import com.liangshou.movie.scripts.infrastructure.agentsupport.tools.tavily.TavilySearchTool;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Flux;

import java.time.Instant;
import java.util.List;

@Slf4j
@Component
public class CreativeIdeaBrainstormingAgent {

    private final ChatClient chatClient;
    private final ChatMemory chatMemory;
    private final TavilySearchTool tavilySearchTool;
    private final ConversationService conversationService;

    public CreativeIdeaBrainstormingAgent(
            @Qualifier("qwenChatClient") ChatClient chatClient,
            ChatMemory chatMemory,
            TavilySearchTool tavilySearchTool,
            ConversationService conversationService) {
        this.chatClient = chatClient;
        this.chatMemory = chatMemory;
        this.tavilySearchTool = tavilySearchTool;
        this.conversationService = conversationService;
    }

    public String chat(
            String conversationId,
            String userMessage,
            boolean enableSearch,
            String projectId,
            String conversationTitle
    ) {
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

        Instant now = Instant.now();
        String content = request.call().content();

        chatMemory.add(conversationId, List.of(
                new UserMessage(userMessage),
                new AssistantMessage(content)
        ));

        String title = StringUtils.hasText(conversationTitle) ? conversationTitle.trim() : "未命名对话";
        ConversationMemoryDocument saved = conversationService.appendRound(
                ConversationService.DEFAULT_USER_ID,
                conversationId,
                projectId,
                title,
                userMessage,
                content,
                now,
                false
        );
        log.info("memory_write conversationId={} roundIndex={} timestamp={}", conversationId, saved.getRoundCount(), now);
        conversationService.markRead(ConversationService.DEFAULT_USER_ID, conversationId);

        return content;
    }

    public Flux<String> chatStream(
            String conversationId,
            String userMessage,
            boolean enableSearch,
            String projectId,
            String conversationTitle
    ) {
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
                )))
                .doOnComplete(() -> {
                    Instant now = Instant.now();
                    String title = StringUtils.hasText(conversationTitle) ? conversationTitle.trim() : "未命名对话";
                    ConversationMemoryDocument saved = conversationService.appendRound(
                            ConversationService.DEFAULT_USER_ID,
                            conversationId,
                            projectId,
                            title,
                            userMessage,
                            full.toString(),
                            now,
                            false
                    );
                    log.info("memory_write conversationId={} roundIndex={} timestamp={}", conversationId, saved.getRoundCount(), now);
                    conversationService.markRead(ConversationService.DEFAULT_USER_ID, conversationId);
                });
    }

    public void clear(String conversationId) {
        if (!StringUtils.hasText(conversationId)) {
            throw new IllegalArgumentException("conversationId 不能为空");
        }
        chatMemory.clear(conversationId);
    }
}
