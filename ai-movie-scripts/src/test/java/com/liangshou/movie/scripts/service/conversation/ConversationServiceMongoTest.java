package com.liangshou.movie.scripts.service.conversation;

import com.liangshou.movie.scripts.infrastructure.mongo.conversation.ConversationMemoryDocument;
import com.liangshou.movie.scripts.infrastructure.mongo.conversation.ConversationMetaDocument;
import com.liangshou.movie.scripts.infrastructure.mongo.conversation.ConversationMongoDao;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Import;

import java.time.Instant;
import java.util.UUID;

@DataMongoTest
@Import({ConversationService.class, ConversationMongoDao.class})
class ConversationServiceMongoTest {

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private ConversationMongoDao mongoDao;

    @Test
    void shouldPersistEveryRoundAndIncrementFields() {
        String conversationId = "test-conv-" + java.util.UUID.randomUUID();
        Instant base = Instant.parse("2026-01-01T00:00:00Z");

        for (int i = 1; i <= 10; i += 1) {
            Instant ts = base.plusSeconds(i);
            conversationService.appendRound(
                    ConversationService.DEFAULT_USER_ID,
                    conversationId,
                    "p1",
                    "测试会话",
                    "u" + i,
                    "a" + i,
                    ts,
                    false
            );

            ConversationMemoryDocument memory = mongoDao.findMemoryById(conversationId);
            Assertions.assertNotNull(memory);
            Assertions.assertEquals(i, memory.getRoundCount());
            Assertions.assertEquals(i * 2, memory.getMessages().size());
            Assertions.assertEquals(ts, memory.getUpdatedAt());

            ConversationMetaDocument meta = mongoDao.findMetaById(conversationId);
            Assertions.assertNotNull(meta);
            Assertions.assertEquals("测试会话", meta.getTitle());
            Assertions.assertEquals(ConversationService.DEFAULT_USER_ID, meta.getUserId());
            Assertions.assertEquals("p1", meta.getProjectId());
            Assertions.assertEquals(ts, meta.getUpdatedAt());
            Assertions.assertEquals(ts, meta.getLastMessageAt());
            Assertions.assertEquals(i * 2, meta.getMessageCount());
        }
    }

    @Test
    void shouldNotPersistOrListEmptyConversation() {
        String createdId = conversationService.create(ConversationService.DEFAULT_USER_ID, "空对话", "p1");
        Assertions.assertNull(mongoDao.findMetaById(createdId));
        Assertions.assertNull(mongoDao.findMemoryById(createdId));

        String emptyId = "empty-" + UUID.randomUUID();
        ConversationMetaDocument meta = new ConversationMetaDocument();
        meta.setId(emptyId);
        meta.setUserId(ConversationService.DEFAULT_USER_ID);
        meta.setTitle("空对话");
        meta.setCreatedAt(Instant.now());
        meta.setUpdatedAt(Instant.now());
        meta.setLastMessageAt(null);
        meta.setUnreadCount(0);
        meta.setMessageCount(0);
        mongoDao.saveMeta(meta);

        boolean listed = mongoDao.findMetas(ConversationService.DEFAULT_USER_ID, 1, 200, null)
                .stream()
                .anyMatch((m) -> emptyId.equals(m.getId()));
        Assertions.assertFalse(listed);
    }
}
