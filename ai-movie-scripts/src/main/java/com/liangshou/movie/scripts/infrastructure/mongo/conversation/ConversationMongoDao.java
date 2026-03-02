package com.liangshou.movie.scripts.infrastructure.mongo.conversation;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;

@Component
public class ConversationMongoDao {

    private final MongoTemplate mongoTemplate;

    public ConversationMongoDao(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public long countMetas(String userId, String keyword) {
        Query query = new Query();
        query.addCriteria(
                Criteria.where("userId").is(userId)
                        .and("lastMessageAt").ne(null)
                        .and("messageCount").gt(0)
        );
        if (StringUtils.hasText(keyword)) {
            query.addCriteria(Criteria.where("title").regex(keyword, "i"));
        }
        return mongoTemplate.count(query, ConversationMetaDocument.class);
    }

    public List<ConversationMetaDocument> findMetas(String userId, int page, int size, String keyword) {
        int safePage = Math.max(1, page);
        int safeSize = Math.min(200, Math.max(1, size));
        Query query = new Query();
        query.addCriteria(
                Criteria.where("userId").is(userId)
                        .and("lastMessageAt").ne(null)
                        .and("messageCount").gt(0)
        );
        if (StringUtils.hasText(keyword)) {
            query.addCriteria(Criteria.where("title").regex(keyword, "i"));
        }
        query.with(Sort.by(Sort.Direction.DESC, "updatedAt"));
        query.skip((long) (safePage - 1) * safeSize);
        query.limit(safeSize);
        return mongoTemplate.find(query, ConversationMetaDocument.class);
    }

    public ConversationMetaDocument findMetaById(String conversationId) {
        return mongoTemplate.findById(conversationId, ConversationMetaDocument.class);
    }

    public ConversationMemoryDocument findMemoryById(String conversationId) {
        return mongoTemplate.findById(conversationId, ConversationMemoryDocument.class);
    }

    public ConversationMetaDocument saveMeta(ConversationMetaDocument doc) {
        return mongoTemplate.save(doc);
    }

    public ConversationMemoryDocument saveMemory(ConversationMemoryDocument doc) {
        return mongoTemplate.save(doc);
    }

    public void deleteMetaById(String conversationId) {
        Query query = new Query(Criteria.where("_id").is(conversationId));
        mongoTemplate.remove(query, ConversationMetaDocument.class);
    }

    public void deleteMemoryById(String conversationId) {
        Query query = new Query(Criteria.where("_id").is(conversationId));
        mongoTemplate.remove(query, ConversationMemoryDocument.class);
    }
}

