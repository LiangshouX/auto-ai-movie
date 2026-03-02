package com.liangshou.movie.scripts.infrastructure.mongo.conversation;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document("conversations")
public class ConversationMetaDocument {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String projectId;

    @Indexed
    private String title;

    @Indexed
    private Instant lastMessageAt;

    @Indexed
    private Instant updatedAt;

    private Instant createdAt;

    private long unreadCount;

    private long messageCount;

    @Version
    private Long version;
}

