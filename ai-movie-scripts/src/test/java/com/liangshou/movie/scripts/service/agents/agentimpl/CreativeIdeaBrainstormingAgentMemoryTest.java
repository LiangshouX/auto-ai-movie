package com.liangshou.movie.scripts.service.agents.agentimpl;

import com.liangshou.movie.scripts.infrastructure.agentsupport.tools.tavily.TavilySearchTool;
import com.liangshou.movie.scripts.infrastructure.mongo.conversation.ConversationMongoDao;
import com.liangshou.movie.scripts.service.conversation.ConversationService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.when;

@DataMongoTest
@Import({ConversationService.class, ConversationMongoDao.class})
class CreativeIdeaBrainstormingAgentMemoryTest {

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private ConversationMongoDao mongoDao;

    @Test
    void shouldPersistMemoryEveryChatRound() {
        ChatClient chatClient = Mockito.mock(ChatClient.class, RETURNS_DEEP_STUBS);
        ChatMemory chatMemory = Mockito.mock(ChatMemory.class);
        TavilySearchTool tavilySearchTool = Mockito.mock(TavilySearchTool.class);

        when(chatMemory.get(anyString())).thenReturn(List.of());
        when(chatClient.prompt().system(anyString()).messages(anyList()).user(anyString()).call().content())
                .thenReturn("a1", "a2", "a3", "a4", "a5");

        CreativeIdeaBrainstormingAgent agent =
                new CreativeIdeaBrainstormingAgent(chatClient, chatMemory, tavilySearchTool, conversationService);

        String conversationId = "agent-test-conv-" + java.util.UUID.randomUUID();
        for (int i = 1; i <= 5; i += 1) {
            String result = agent.chat(conversationId, "u" + i, false, "p1", "测试会话");
            Assertions.assertEquals("a" + i, result);
            Assertions.assertNotNull(mongoDao.findMemoryById(conversationId));
            Assertions.assertEquals(i, mongoDao.findMemoryById(conversationId).getRoundCount());
            Assertions.assertEquals(i * 2, mongoDao.findMemoryById(conversationId).getMessages().size());
        }
    }
}
