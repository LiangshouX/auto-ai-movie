package com.liangshou.movie.scripts.service.dto.conversation;

import lombok.Data;

@Data
public class ConversationSummaryDto {
    private String id;
    private String title;
    private String lastMessageAt;
    private long unreadCount;
}

