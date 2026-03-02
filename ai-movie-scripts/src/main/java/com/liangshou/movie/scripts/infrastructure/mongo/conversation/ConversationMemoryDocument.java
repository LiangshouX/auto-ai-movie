package com.liangshou.movie.scripts.infrastructure.mongo.conversation;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Document("conversation_memory")
public class ConversationMemoryDocument {

    @Id
    private String id;

    @Indexed
    private String userId;

    private List<ConversationStoredMessage> messages = new ArrayList<>();

    private long roundCount;

    @Indexed
    private Instant updatedAt;

    private Instant createdAt;

    @Version
    private Long version;

    @Data
    public static class ConversationStoredMessage {
        private String role;
        private String content;
        private Instant at;
    }
}

