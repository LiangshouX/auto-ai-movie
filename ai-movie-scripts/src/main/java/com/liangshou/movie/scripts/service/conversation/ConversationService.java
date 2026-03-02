package com.liangshou.movie.scripts.service.conversation;

import com.liangshou.movie.scripts.infrastructure.mongo.conversation.ConversationMemoryDocument;
import com.liangshou.movie.scripts.infrastructure.mongo.conversation.ConversationMetaDocument;
import com.liangshou.movie.scripts.infrastructure.mongo.conversation.ConversationMongoDao;
import com.liangshou.movie.scripts.service.dto.conversation.ConversationMessageDto;
import com.liangshou.movie.scripts.service.dto.conversation.ConversationSummaryDto;
import com.liangshou.movie.scripts.service.dto.conversation.PageResponse;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ConversationService {

    public static final String DEFAULT_USER_ID = "anonymous";

    private final ConversationMongoDao mongoDao;

    public ConversationService(ConversationMongoDao mongoDao) {
        this.mongoDao = mongoDao;
    }

    public PageResponse<ConversationSummaryDto> list(String userId, int page, int size, String keyword) {
        String uid = StringUtils.hasText(userId) ? userId : DEFAULT_USER_ID;
        long total = mongoDao.countMetas(uid, keyword);
        List<ConversationMetaDocument> metas = mongoDao.findMetas(uid, page, size, keyword);
        List<ConversationSummaryDto> items = new ArrayList<>();
        for (ConversationMetaDocument meta : metas) {
            ConversationSummaryDto dto = new ConversationSummaryDto();
            dto.setId(meta.getId());
            dto.setTitle(StringUtils.hasText(meta.getTitle()) ? meta.getTitle() : "未命名对话");
            dto.setLastMessageAt(meta.getLastMessageAt() != null ? meta.getLastMessageAt().toString() : null);
            dto.setUnreadCount(meta.getUnreadCount());
            items.add(dto);
        }
        PageResponse<ConversationSummaryDto> resp = new PageResponse<>();
        resp.setItems(items);
        resp.setTotal(total);
        resp.setPage(Math.max(1, page));
        resp.setSize(Math.min(200, Math.max(1, size)));
        return resp;
    }

    public String create(String userId, String title, String projectId) {
        return UUID.randomUUID().toString();
    }

    public void rename(String userId, String conversationId, String title) {
        String uid = StringUtils.hasText(userId) ? userId : DEFAULT_USER_ID;
        if (!StringUtils.hasText(conversationId)) {
            throw new IllegalArgumentException("conversationId 不能为空");
        }
        if (!StringUtils.hasText(title)) {
            throw new IllegalArgumentException("title 不能为空");
        }
        ConversationMetaDocument meta = mongoDao.findMetaById(conversationId);
        if (meta == null || !uid.equals(meta.getUserId())) return;
        meta.setTitle(title.trim());
        meta.setUpdatedAt(Instant.now());
        mongoDao.saveMeta(meta);
    }

    public void delete(String userId, String conversationId) {
        String uid = StringUtils.hasText(userId) ? userId : DEFAULT_USER_ID;
        if (!StringUtils.hasText(conversationId)) {
            throw new IllegalArgumentException("conversationId 不能为空");
        }
        ConversationMetaDocument meta = mongoDao.findMetaById(conversationId);
        if (meta != null && uid.equals(meta.getUserId())) {
            mongoDao.deleteMetaById(conversationId);
            mongoDao.deleteMemoryById(conversationId);
        }
    }

    public List<ConversationMessageDto> getMessages(String userId, String conversationId) {
        String uid = StringUtils.hasText(userId) ? userId : DEFAULT_USER_ID;
        if (!StringUtils.hasText(conversationId)) {
            throw new IllegalArgumentException("conversationId 不能为空");
        }
        ConversationMemoryDocument memory = mongoDao.findMemoryById(conversationId);
        if (memory == null || !uid.equals(memory.getUserId())) {
            return List.of();
        }
        List<ConversationMessageDto> items = new ArrayList<>();
        if (memory.getMessages() == null) return items;
        for (ConversationMemoryDocument.ConversationStoredMessage msg : memory.getMessages()) {
            ConversationMessageDto dto = new ConversationMessageDto();
            dto.setRole(msg.getRole());
            dto.setContent(msg.getContent());
            dto.setTimestamp(msg.getAt() != null ? msg.getAt().toEpochMilli() : 0L);
            items.add(dto);
        }
        return items;
    }

    public ConversationMemoryDocument appendRound(
            String userId,
            String conversationId,
            String projectId,
            String defaultTitle,
            String userText,
            String assistantText,
            Instant timestamp,
            boolean incrementUnread
    ) {
        String uid = StringUtils.hasText(userId) ? userId : DEFAULT_USER_ID;
        if (!StringUtils.hasText(conversationId)) {
            throw new IllegalArgumentException("conversationId 不能为空");
        }
        Instant at = timestamp != null ? timestamp : Instant.now();

        for (int attempt = 0; attempt < 3; attempt += 1) {
            try {
                ConversationMemoryDocument memory = mongoDao.findMemoryById(conversationId);
                if (memory == null) {
                    memory = new ConversationMemoryDocument();
                    memory.setId(conversationId);
                    memory.setUserId(uid);
                    memory.setCreatedAt(at);
                    memory.setUpdatedAt(at);
                    memory.setRoundCount(0);
                }
                if (memory.getMessages() == null) {
                    memory.setMessages(new ArrayList<>());
                }
                if (StringUtils.hasText(userText)) {
                    ConversationMemoryDocument.ConversationStoredMessage msg = new ConversationMemoryDocument.ConversationStoredMessage();
                    msg.setRole("user");
                    msg.setContent(userText);
                    msg.setAt(at);
                    memory.getMessages().add(msg);
                }
                if (StringUtils.hasText(assistantText)) {
                    ConversationMemoryDocument.ConversationStoredMessage msg = new ConversationMemoryDocument.ConversationStoredMessage();
                    msg.setRole("assistant");
                    msg.setContent(assistantText);
                    msg.setAt(at);
                    memory.getMessages().add(msg);
                }
                memory.setRoundCount(memory.getRoundCount() + 1);
                memory.setUpdatedAt(at);
                ConversationMemoryDocument saved = mongoDao.saveMemory(memory);

                ConversationMetaDocument meta = mongoDao.findMetaById(conversationId);
                if (meta == null) {
                    meta = new ConversationMetaDocument();
                    meta.setId(conversationId);
                    meta.setUserId(uid);
                    meta.setProjectId(projectId);
                    meta.setTitle(StringUtils.hasText(defaultTitle) ? defaultTitle : "未命名对话");
                    meta.setCreatedAt(at);
                    meta.setUnreadCount(0);
                    meta.setMessageCount(0);
                }
                meta.setProjectId(StringUtils.hasText(projectId) ? projectId : meta.getProjectId());
                meta.setTitle(StringUtils.hasText(meta.getTitle()) ? meta.getTitle() : "未命名对话");
                meta.setLastMessageAt(at);
                meta.setUpdatedAt(at);
                long delta = 0;
                if (StringUtils.hasText(userText)) delta += 1;
                if (StringUtils.hasText(assistantText)) delta += 1;
                meta.setMessageCount(meta.getMessageCount() + delta);
                if (incrementUnread && StringUtils.hasText(assistantText)) {
                    meta.setUnreadCount(meta.getUnreadCount() + 1);
                }
                mongoDao.saveMeta(meta);

                return saved;
            } catch (OptimisticLockingFailureException e) {
                if (attempt == 2) {
                    throw e;
                }
            }
        }
        throw new IllegalStateException("appendRound failed");
    }

    public void markRead(String userId, String conversationId) {
        String uid = StringUtils.hasText(userId) ? userId : DEFAULT_USER_ID;
        ConversationMetaDocument meta = mongoDao.findMetaById(conversationId);
        if (meta == null || !uid.equals(meta.getUserId())) return;
        meta.setUnreadCount(0);
        meta.setUpdatedAt(Instant.now());
        mongoDao.saveMeta(meta);
    }
}

